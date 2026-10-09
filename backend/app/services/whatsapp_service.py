from datetime import datetime
from typing import List, Dict, Any, Optional
import urllib.parse
from backend.app.models import models

DEFAULT_WHATSAPP_PHONE = "919363739675"


def format_price(amount: Optional[float]) -> str:
    if amount is None:
        return "0"
    num = float(amount)
    if num.is_integer():
        return str(int(num))
    return f"{num:.2f}"


def format_order_datetime(dt: Optional[datetime]) -> str:
    if not dt:
        dt = datetime.now()
    # Format e.g., 10 October 2026, 12:45 AM
    # %-d on Linux/Mac, %d with lstrip on other platforms
    day_str = dt.strftime("%d").lstrip("0")
    month_year = dt.strftime("%B %Y")
    time_str = dt.strftime("%I:%M %p").lstrip("0")
    return f"{day_str} {month_year}, {time_str}"


class WhatsAppService:
    """
    Constructs standardized WhatsApp notification messages for orders.
    Preserves recipient configuration (919363739675) and delivery format.
    """

    @classmethod
    def build_order_notification_message(
        cls,
        order: models.Order,
        customer: Optional[models.Customer] = None,
        items: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        order_date_str = format_order_datetime(order.created_at)
        cust_name = (customer.name if customer else "") or "Customer"
        cust_phone = (customer.phone if customer else "") or ""
        
        # Assemble complete shipping address
        addr_parts = []
        if order.shipping_address:
            addr_parts.append(order.shipping_address.strip())
        elif customer and customer.address:
            addr_parts.append(customer.address.strip())

        city = (order.city or (customer.city if customer else "") or "").strip()
        district = (order.district or (customer.district if customer else "") or "").strip()
        state = (order.state or (customer.state if customer else "") or "").strip()
        pincode = (order.pincode or (customer.pincode if customer else "") or "").strip()

        city_part = []
        if city:
            city_part.append(city)
        if district and district != city:
            city_part.append(district)
        
        loc_str = ", ".join(city_part)
        if loc_str:
            addr_parts.append(loc_str)
        if state:
            if pincode:
                addr_parts.append(f"{state} - {pincode}")
            else:
                addr_parts.append(state)
        elif pincode:
            addr_parts.append(pincode)

        full_address = ", ".join(addr_parts) if addr_parts else "Not provided"

        # Resolve items
        product_blocks = []
        resolved_items = items or []
        if not resolved_items and hasattr(order, "items") and order.items:
            for itm in order.items:
                product_blocks.append(
                    f"{itm.product_name or f'Product #{itm.product_id}'}\n"
                    f"Quantity: {itm.quantity}\n"
                    f"Unit Price: ₹{format_price(itm.price)}\n"
                    f"Item Total: ₹{format_price(itm.quantity * itm.price)}"
                )
        else:
            for itm in resolved_items:
                qty = itm.get("quantity", 1)
                price = itm.get("price", 0.0)
                name = itm.get("name") or itm.get("product_name") or f"Product #{itm.get('product_id', '')}"
                variant = itm.get("variant")
                display_name = f"{name} ({variant})" if variant else name
                item_total = itm.get("item_total", qty * price)
                product_blocks.append(
                    f"{display_name}\n"
                    f"Quantity: {qty}\n"
                    f"Unit Price: ₹{format_price(price)}\n"
                    f"Item Total: ₹{format_price(item_total)}"
                )

        product_details_str = "\n\n".join(product_blocks) if product_blocks else "No items listed"

        payment_method = (order.payment_id or "UPI").strip()
        subtotal_str = format_price(order.subtotal)
        discount_str = format_price(order.discount or 0.0)
        shipping_str = format_price(order.shipping or 0.0)
        total_str = format_price(order.total)
        payment_status = order.payment_status or "PAYMENT_PENDING"

        lines = [
            "Hi Qura Herbs Team,",
            "",
            "A new order has been placed through the Qura Herbs website.",
            "",
            "ORDER DETAILS",
            "",
            f"Order Number: {order.order_number}",
            f"Order Date: {order_date_str}",
            f"Customer Name: {cust_name}",
            f"Phone: {cust_phone}",
            f"Shipping Address: {full_address}",
            "",
            "PRODUCT DETAILS",
            "",
            product_details_str,
            "",
            "PAYMENT DETAILS",
            "",
            f"Payment Method: {payment_method}",
            f"Subtotal: ₹{subtotal_str}",
            f"Discount: ₹{discount_str}",
            f"Shipping Charge: ₹{shipping_str}",
            f"Order Total: ₹{total_str}",
            f"Payment Status: {payment_status}",
            "",
            "ORDER PROCESSING",
            "",
            "Please review the order details and proceed with processing according to the verified payment status.",
            "",
            "Thank you,",
            "Qura Herbs Website Orders"
        ]

        return "\n".join(lines)

    @classmethod
    def get_whatsapp_url(
        cls,
        order: models.Order,
        customer: Optional[models.Customer] = None,
        items: Optional[List[Dict[str, Any]]] = None,
        recipient_phone: str = DEFAULT_WHATSAPP_PHONE
    ) -> str:
        message = cls.build_order_notification_message(order, customer, items)
        return f"https://wa.me/{recipient_phone}?text={urllib.parse.quote(message)}"
