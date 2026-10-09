import logging
import time
import requests
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.app.models import models

logger = logging.getLogger("qura_herbs.google_sheets")

# IST timezone (UTC+5:30) for Indian e-commerce order timestamps
IST = timezone(timedelta(hours=5, minutes=30))

class GoogleSheetsService:
    @staticmethod
    def format_datetime_ist(dt: Optional[datetime]) -> str:
        if not dt:
            dt = datetime.now(timezone.utc)
        elif dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        ist_dt = dt.astimezone(IST)
        return ist_dt.strftime("%Y-%m-%d %H:%M:%S IST")

    @classmethod
    def get_webhook_url(cls) -> str:
        return (settings.GOOGLE_SHEETS_WEBHOOK_URL or "").strip()

    @classmethod
    def get_webhook_secret(cls) -> str:
        return (settings.GOOGLE_SHEETS_WEBHOOK_SECRET or "qura_sheets_sync_secret_2026").strip()

    @classmethod
    def build_order_payload(cls, db: Session, order: models.Order, customer: Optional[models.Customer] = None, items_list: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        if not customer and order.customer:
            customer = order.customer
        elif not customer and order.customer_id:
            customer = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()

        # Format items
        formatted_items = []
        if items_list:
            for itm in items_list:
                sku = itm.get("sku") or f"SKU-{itm.get('product_id', 'QH')}"
                formatted_items.append({
                    "product_name": itm.get("name") or f"Product #{itm.get('product_id')}",
                    "product_sku": sku,
                    "product_id_sku": sku,
                    "quantity": int(itm.get("quantity", 1)),
                    "price": float(itm.get("price", 0.0))
                })
        elif order.items:
            for item_row in order.items:
                prod = item_row.product or db.query(models.Product).filter(models.Product.id == item_row.product_id).first()
                prod_name = prod.name if prod else f"Product #{item_row.product_id}"
                if item_row.variant:
                    prod_name = f"{prod_name} ({item_row.variant})"
                sku = (prod.SKU if prod and prod.SKU else None) or f"SKU-{item_row.product_id}"
                formatted_items.append({
                    "product_name": prod_name,
                    "product_sku": sku,
                    "product_id_sku": sku,
                    "quantity": int(item_row.quantity),
                    "price": float(item_row.price)
                })

        return {
            "order_id": order.order_number,
            "order_date": cls.format_datetime_ist(order.created_at),
            "customer_name": (customer.name if customer else "").strip(),
            "customer_email": (customer.email if customer else "").strip(),
            "customer_phone": (customer.phone if customer else "").strip(),
            "shipping_address": (order.shipping_address or (customer.address if customer else "") or "").strip(),
            "city": (order.city or (customer.city if customer else "") or "").strip(),
            "state": (order.state or (customer.state if customer else "") or "").strip(),
            "pincode": (order.pincode or (customer.pincode if customer else "") or "").strip(),
            "subtotal": round(float(order.subtotal or 0.0), 2),
            "discount_amount": round(float(order.discount or order.discount_amount or 0.0), 2),
            "voucher_code": (order.voucher_code or "").strip(),
            "shipping_charges": round(float(order.shipping or 0.0), 2),
            "final_total": round(float(order.total or 0.0), 2),
            "payment_method": (order.payment_id or "UPI").strip(),
            "payment_status": (order.payment_status or "PAYMENT_PENDING").strip(),
            "order_status": (order.order_status or "PAYMENT_PENDING").strip(),
            "transaction_id": (order.razorpay_order_id or "").strip(),
            "customer_notes": "",
            "order_source": "Website",
            "items": formatted_items
        }

    @classmethod
    def sync_order(cls, db: Session, order: models.Order, customer: Optional[models.Customer] = None, items_list: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Synchronizes an order and its items to Google Sheets.
        Safely catches all errors to guarantee that order placement is never blocked.
        """
        webhook_url = cls.get_webhook_url()
        secret = cls.get_webhook_secret()

        if not webhook_url:
            logger.warning(f"Google Sheets webhook URL not configured. Order {order.order_number} marked PENDING sync.")
            try:
                order.google_sheets_sync_status = "PENDING"
                order.google_sheets_sync_error = "GOOGLE_SHEETS_WEBHOOK_URL not configured in environment"
                db.commit()
            except Exception as dbe:
                db.rollback()
                logger.error(f"Failed to record pending sync status: {dbe}")
            return {"success": False, "status": "PENDING", "reason": "Webhook URL not configured"}

        payload_order = cls.build_order_payload(db, order, customer, items_list)
        request_body = {
            "secret": secret,
            "action": "sync_order",
            "order": payload_order
        }

        # Retry with backoff (up to 3 attempts)
        max_attempts = 3
        last_error = ""

        for attempt in range(1, max_attempts + 1):
            try:
                logger.info(f"Syncing order {order.order_number} to Google Sheets (Attempt {attempt}/{max_attempts})...")
                res = requests.post(
                    webhook_url,
                    json=request_body,
                    headers={"Content-Type": "application/json"},
                    timeout=12,
                    allow_redirects=True  # Google Apps Script redirects with 302 on POST
                )

                if res.status_code == 200:
                    try:
                        data = res.json()
                    except Exception:
                        data = {"success": True, "raw": res.text[:200]}

                    if data.get("success") is True:
                        logger.info(f"Successfully synced order {order.order_number} to Google Sheets.")
                        try:
                            order.google_sheets_sync_status = "SYNCED"
                            order.google_sheets_synced_at = datetime.now(timezone.utc).replace(tzinfo=None)
                            order.google_sheets_sync_error = None
                            
                            # Add timeline audit entry
                            timeline_event = models.OrderTimelineEvent(
                                order_id=order.id,
                                status="SHEETS_SYNCED",
                                notes=f"Google Sheets synchronized ({data.get('action', 'synced')})",
                                created_by="System"
                            )
                            db.add(timeline_event)
                            db.commit()
                        except Exception as dbe:
                            db.rollback()
                            logger.error(f"Error updating order sync status in db: {dbe}")

                        return {"success": True, "status": "SYNCED", "data": data}
                    else:
                        last_error = data.get("error") or data.get("message") or "Unknown error returned by Apps Script"
                else:
                    last_error = f"HTTP {res.status_code}: {res.text[:200]}"

            except requests.RequestException as req_err:
                last_error = str(req_err)
                logger.warning(f"Network error on Google Sheets sync attempt {attempt}: {req_err}")

            if attempt < max_attempts:
                time.sleep(1.0 * attempt)

        # All attempts failed: record failure without breaking customer checkout
        logger.error(f"Failed to sync order {order.order_number} to Google Sheets after {max_attempts} attempts: {last_error}")
        try:
            order.google_sheets_sync_status = "FAILED"
            order.google_sheets_sync_error = (last_error or "Sync failed")[:500]
            timeline_event = models.OrderTimelineEvent(
                order_id=order.id,
                status="SHEETS_SYNC_FAILED",
                notes=f"Google Sheets sync failed: {last_error[:200]}",
                created_by="System"
            )
            db.add(timeline_event)
            db.commit()
        except Exception as dbe:
            db.rollback()
            logger.error(f"Error recording sync failure in db: {dbe}")

        return {"success": False, "status": "FAILED", "error": last_error}

    @classmethod
    def update_order_status(cls, db: Session, order: models.Order) -> Dict[str, Any]:
        """
        Updates status fields (payment_status, order_status, transaction_id) in Google Sheets
        without duplicating rows.
        """
        webhook_url = cls.get_webhook_url()
        secret = cls.get_webhook_secret()

        if not webhook_url:
            return {"success": False, "reason": "Webhook URL not configured"}

        request_body = {
            "secret": secret,
            "action": "update_status",
            "order_id": order.order_number,
            "payment_status": order.payment_status,
            "order_status": order.order_status,
            "transaction_id": order.razorpay_order_id or ""
        }

        try:
            res = requests.post(
                webhook_url,
                json=request_body,
                headers={"Content-Type": "application/json"},
                timeout=12,
                allow_redirects=True
            )
            if res.status_code == 200:
                try:
                    data = res.json()
                except Exception:
                    data = {"success": True}
                logger.info(f"Google Sheets status updated for order {order.order_number}")
                return {"success": True, "data": data}
            else:
                logger.warning(f"Google Sheets status update returned HTTP {res.status_code}")
                return {"success": False, "status_code": res.status_code}
        except Exception as e:
            logger.error(f"Failed to update order status in Google Sheets: {e}")
            return {"success": False, "error": str(e)}

    @classmethod
    def retry_failed_syncs(cls, db: Session, limit: int = 50) -> Dict[str, Any]:
        """
        Finds orders with status != 'SYNCED' and re-attempts synchronization.
        """
        pending_orders = db.query(models.Order).filter(
            models.Order.google_sheets_sync_status != "SYNCED"
        ).order_by(models.Order.id.asc()).limit(limit).all()

        synced_count = 0
        failed_count = 0
        results = []

        for ord in pending_orders:
            res = cls.sync_order(db, ord)
            if res.get("success"):
                synced_count += 1
            else:
                failed_count += 1
            results.append({"order_number": ord.order_number, "result": res})

        return {
            "total_attempted": len(pending_orders),
            "synced_count": synced_count,
            "failed_count": failed_count,
            "details": results
        }

    @classmethod
    def backfill_historical_orders(cls, db: Session, limit: int = 100) -> Dict[str, Any]:
        """
        Controlled backfill for existing historical orders. Checks Order ID on sheet to prevent duplicates.
        """
        all_orders = db.query(models.Order).order_by(models.Order.id.asc()).limit(limit).all()
        synced_count = 0
        failed_count = 0
        results = []

        for ord in all_orders:
            res = cls.sync_order(db, ord)
            if res.get("success"):
                synced_count += 1
            else:
                failed_count += 1
            results.append({"order_number": ord.order_number, "result": res})

        return {
            "total_processed": len(all_orders),
            "synced_count": synced_count,
            "failed_count": failed_count,
            "details": results
        }
