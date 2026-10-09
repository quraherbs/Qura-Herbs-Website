import unittest
from datetime import datetime
from backend.app.models import models
from backend.app.schemas import schemas
from backend.app.core.config import settings
from backend.app.services.whatsapp_service import WhatsAppService, DEFAULT_WHATSAPP_PHONE


class TestWhatsAppOrderNotification(unittest.TestCase):
    def test_single_product_whatsapp_notification(self):
        """Verifies WhatsApp message format with a single product order."""
        order = models.Order(
            order_number="QH-20261010-1001",
            subtotal=499.0,
            discount=0.0,
            shipping=80.0,
            tax=0.0,
            total=579.0,
            payment_status="PAYMENT_PENDING",
            order_status="PAYMENT_PENDING",
            payment_id="UPI",
            shipping_address="124 Anna Salai, T. Nagar",
            city="Chennai",
            district="Chennai",
            state="Tamil Nadu",
            pincode="600017",
            created_at=datetime(2026, 10, 10, 14, 30)
        )
        customer = models.Customer(
            name="Priya Sharma",
            email="priya.sharma@example.com",
            phone="+91 9876543210"
        )
        items = [
            {
                "product_id": 1,
                "name": "Avocado Pro Nourish Night Cream",
                "quantity": 1,
                "price": 499.0,
                "item_total": 499.0,
                "variant": None
            }
        ]

        msg = WhatsAppService.build_order_notification_message(order, customer, items)

        # Header check
        self.assertIn("Hi Qura Herbs Team,", msg)
        self.assertIn("A new order has been placed through the Qura Herbs website.", msg)

        # Order Details check
        self.assertIn("ORDER DETAILS", msg)
        self.assertIn("Order Number: QH-20261010-1001", msg)
        self.assertIn("Customer Name: Priya Sharma", msg)
        self.assertIn("Phone: +91 9876543210", msg)
        self.assertIn("Shipping Address: 124 Anna Salai, T. Nagar, Chennai, Tamil Nadu - 600017", msg)

        # Product Details check
        self.assertIn("PRODUCT DETAILS", msg)
        self.assertIn("Avocado Pro Nourish Night Cream", msg)
        self.assertIn("Quantity: 1", msg)
        self.assertIn("Unit Price: ₹499", msg)
        self.assertIn("Item Total: ₹499", msg)

        # Payment Details check
        self.assertIn("PAYMENT DETAILS", msg)
        self.assertIn("Payment Method: UPI", msg)
        self.assertIn("Subtotal: ₹499", msg)
        self.assertIn("Discount: ₹0", msg)
        self.assertIn("Shipping Charge: ₹80", msg)
        self.assertIn("Order Total: ₹579", msg)
        self.assertIn("Payment Status: PAYMENT_PENDING", msg)

        # Order Processing & Footer check
        self.assertIn("ORDER PROCESSING", msg)
        self.assertIn("Please review the order details and proceed with processing according to the verified payment status.", msg)
        self.assertIn("Thank you,\nQura Herbs Website Orders", msg)

        # URL check
        url = WhatsAppService.get_whatsapp_url(order, customer, items)
        self.assertTrue(url.startswith(f"https://wa.me/{DEFAULT_WHATSAPP_PHONE}?text="))
        self.assertIn("QH-20261010-1001", url)

    def test_multi_product_whatsapp_notification(self):
        """Verifies WhatsApp message format with multiple different products."""
        order = models.Order(
            order_number="QH-20261010-2002",
            subtotal=1697.0,
            discount=100.0,
            shipping=80.0,
            tax=0.0,
            total=1677.0,
            payment_status="PAYMENT_PENDING",
            order_status="PAYMENT_PENDING",
            payment_id="UPI",
            shipping_address="Flat 4B, Lotus Tower",
            city="Chennai",
            district="Chennai",
            state="Tamil Nadu",
            pincode="600028",
            created_at=datetime(2026, 10, 10, 16, 45)
        )
        customer = models.Customer(
            name="Rahul Varma",
            email="rahul.varma@example.com",
            phone="+91 9123456780"
        )
        items = [
            {
                "product_id": 1,
                "name": "Avocado Pro Nourish Night Cream",
                "quantity": 2,
                "price": 499.0,
                "item_total": 998.0,
                "variant": None
            },
            {
                "product_id": 2,
                "name": "Kumkumadi Miraculous Beauty Ayurvedic Night Serum",
                "quantity": 1,
                "price": 699.0,
                "item_total": 699.0,
                "variant": None
            }
        ]

        msg = WhatsAppService.build_order_notification_message(order, customer, items)

        # Verify both products are present with quantities, prices, and totals
        self.assertIn("Avocado Pro Nourish Night Cream\nQuantity: 2\nUnit Price: ₹499\nItem Total: ₹998", msg)
        self.assertIn("Kumkumadi Miraculous Beauty Ayurvedic Night Serum\nQuantity: 1\nUnit Price: ₹699\nItem Total: ₹699", msg)

        # Verify payment totals
        self.assertIn("Subtotal: ₹1697", msg)
        self.assertIn("Discount: ₹100", msg)
        self.assertIn("Shipping Charge: ₹80", msg)
        self.assertIn("Order Total: ₹1677", msg)
        self.assertIn("Payment Status: PAYMENT_PENDING", msg)

    def test_whatsapp_url_encoding_and_recipient(self):
        """Verifies recipient number 919363739675 is preserved and URL is encoded."""
        order = models.Order(
            order_number="QH-20261010-3003",
            subtotal=499.0,
            discount=0.0,
            shipping=80.0,
            tax=0.0,
            total=579.0,
            payment_status="PAYMENT_PENDING",
            created_at=datetime(2026, 10, 10, 10, 0)
        )
        url = WhatsAppService.get_whatsapp_url(order, items=[{"name": "Night Cream", "quantity": 1, "price": 499.0}])
        self.assertTrue(url.startswith("https://wa.me/919363739675?text="))
        self.assertIn("QH-20261010-3003", url)

    def test_google_sheets_completely_removed(self):
        """Verifies that Google Sheets fields and settings do not exist anywhere in backend models/schemas/settings."""
        # 1. Config
        self.assertFalse(hasattr(settings, "GOOGLE_SHEETS_SPREADSHEET_ID"))
        self.assertFalse(hasattr(settings, "GOOGLE_SHEETS_WEBHOOK_URL"))
        self.assertFalse(hasattr(settings, "GOOGLE_SHEETS_WEBHOOK_SECRET"))

        # 2. Models
        order_cols = [c.name for c in models.Order.__table__.columns]
        self.assertNotIn("google_sheets_sync_status", order_cols)
        self.assertNotIn("google_sheets_synced_at", order_cols)
        self.assertNotIn("google_sheets_sync_error", order_cols)

        # 3. Schemas
        schema_fields = schemas.OrderBase.model_fields.keys()
        self.assertNotIn("google_sheets_sync_status", schema_fields)
        self.assertNotIn("google_sheets_synced_at", schema_fields)
        self.assertNotIn("google_sheets_sync_error", schema_fields)


if __name__ == "__main__":
    unittest.main()
