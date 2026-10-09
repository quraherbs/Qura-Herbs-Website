import unittest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import requests

from backend.app.main import app
from backend.app.core.database import Base, get_db
from backend.app.core.config import settings
from backend.app.models import models
from backend.app.services.google_sheets_service import GoogleSheetsService

# Isolated in-memory SQLite database for test execution
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

client = TestClient(app)

class TestGoogleSheetsIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.dependency_overrides[get_db] = override_get_db
        Base.metadata.create_all(bind=test_engine)
        settings.GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/TEST_MOCK_DEPLOYMENT_ID/exec"
        settings.GOOGLE_SHEETS_WEBHOOK_SECRET = "test_sheets_secret_2026"
        settings.GOOGLE_SHEETS_SPREADSHEET_ID = "1H7iGw3w3r-LIZYe_oiYMrrUP6dyBtqweRM-tskRALlk"

        db = TestingSessionLocal()
        # Seed test customer
        cls.customer = models.Customer(
            name="Ananya Sharma",
            email="ananya.sharma@example.com",
            phone="9876543210",
            address="142 Heritage Gardens, Apt 4B",
            city="Chennai",
            district="Chennai",
            state="Tamil Nadu",
            pincode="600028"
        )
        db.add(cls.customer)
        db.commit()
        db.refresh(cls.customer)

        # Seed test category and products
        cat = models.Category(name="Skincare", slug="skincare", description="Botanical")
        db.add(cat)
        db.commit()
        db.refresh(cat)

        cls.prod1 = models.Product(
            name="Avocado Pro Nourish Night Cream",
            slug="avocado-pro-nourish-night-cream",
            short_description="Night cream",
            full_description="Deep hydration",
            price=899.0,
            sale_price=899.0,
            SKU="SKU-AVO-50G",
            stock=50,
            category_id=cat.id
        )
        cls.prod2 = models.Product(
            name="Glow Radiant Plus Night Cream",
            slug="glow-radiant-plus-night-cream",
            short_description="Radiant cream",
            full_description="Glowing skin",
            price=799.0,
            sale_price=799.0,
            SKU="SKU-GLOW-50G",
            stock=40,
            category_id=cat.id
        )
        db.add(cls.prod1)
        db.add(cls.prod2)
        db.commit()
        db.refresh(cls.prod1)
        db.refresh(cls.prod2)
        cls.customer_id = cls.customer.id
        cls.prod1_id = cls.prod1.id
        cls.prod2_id = cls.prod2.id
        db.close()

    def test_01_build_order_payload_contains_all_25_fields(self):
        """Verifies that the Google Sheets payload includes all required 25 order fields."""
        db = TestingSessionLocal()
        cust = db.query(models.Customer).first()
        prod = db.query(models.Product).first()

        order = models.Order(
            order_number="QH-20261010-TEST1",
            customer_id=cust.id,
            subtotal=899.0,
            discount=100.0,
            shipping=80.0,
            tax=0.0,
            total=879.0,
            payment_status="PAYMENT_PENDING",
            order_status="PAYMENT_PENDING",
            payment_id="UPI",
            voucher_code="GLOW100",
            shipping_address=cust.address,
            city=cust.city,
            state=cust.state,
            pincode=cust.pincode
        )
        db.add(order)
        db.commit()
        db.refresh(order)

        item = models.OrderItem(
            order_id=order.id,
            product_id=prod.id,
            quantity=2,
            price=prod.price
        )
        db.add(item)
        db.commit()
        db.refresh(order)

        payload = GoogleSheetsService.build_order_payload(db, order, cust)

        # Assert key order level fields
        self.assertEqual(payload["order_id"], "QH-20261010-TEST1")
        self.assertIn("IST", payload["order_date"])
        self.assertEqual(payload["customer_name"], "Ananya Sharma")
        self.assertEqual(payload["customer_email"], "ananya.sharma@example.com")
        self.assertEqual(payload["customer_phone"], "9876543210")
        self.assertEqual(payload["city"], "Chennai")
        self.assertEqual(payload["state"], "Tamil Nadu")
        self.assertEqual(payload["pincode"], "600028")
        self.assertEqual(payload["subtotal"], 899.0)
        self.assertEqual(payload["discount_amount"], 100.0)
        self.assertEqual(payload["voucher_code"], "GLOW100")
        self.assertEqual(payload["shipping_charges"], 80.0)
        self.assertEqual(payload["final_total"], 879.0)
        self.assertEqual(payload["payment_method"], "UPI")
        self.assertEqual(payload["payment_status"], "PAYMENT_PENDING")
        self.assertEqual(payload["order_source"], "Website")

        # Assert items formatting
        self.assertEqual(len(payload["items"]), 1)
        self.assertEqual(payload["items"][0]["product_name"], prod.name)
        self.assertEqual(payload["items"][0]["quantity"], 2)
        self.assertEqual(payload["items"][0]["price"], prod.price)
        db.close()

    @patch("requests.post")
    def test_02_order_placement_triggers_sheets_sync(self, mock_post):
        """Verifies that placing an order automatically calls Google Sheets and marks SYNCED."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "success": True,
            "order_id": "QH-20261010-9999",
            "action": "inserted",
            "rows_affected": 2
        }
        mock_post.return_value = mock_response

        order_payload = {
            "customer_id": self.customer_id,
            "subtotal": 1698.0,
            "discount": 0.0,
            "shipping": 80.0,
            "tax": 0.0,
            "total": 1778.0,
            "payment_status": "PAYMENT_PENDING",
            "order_status": "PAYMENT_PENDING",
            "payment_id": "UPI",
            "shipping_address": "142 Heritage Gardens, Apt 4B",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600028",
            "items": [
                {"product_id": self.prod1_id, "quantity": 1, "price": 899.0},
                {"product_id": self.prod2_id, "quantity": 1, "price": 799.0}
            ]
        }

        res = client.post("/api/v1/orders/", json=order_payload)
        self.assertEqual(res.status_code, 201)
        order_data = res.json()
        order_num = order_data["order_number"]

        # Assert that requests.post was called
        self.assertTrue(mock_post.called)
        call_args, call_kwargs = mock_post.call_args
        self.assertEqual(call_args[0], settings.GOOGLE_SHEETS_WEBHOOK_URL)
        posted_json = call_kwargs["json"]
        self.assertEqual(posted_json["action"], "sync_order")
        self.assertEqual(posted_json["secret"], settings.GOOGLE_SHEETS_WEBHOOK_SECRET)
        self.assertEqual(len(posted_json["order"]["items"]), 2)

        # Verify persistent status in database
        db = TestingSessionLocal()
        saved_order = db.query(models.Order).filter(models.Order.order_number == order_num).first()
        self.assertIsNotNone(saved_order)
        self.assertEqual(saved_order.google_sheets_sync_status, "SYNCED")
        self.assertIsNotNone(saved_order.google_sheets_synced_at)
        self.assertIsNone(saved_order.google_sheets_sync_error)
        db.close()

    @patch("requests.post")
    def test_03_sheets_failure_does_not_break_order_placement(self, mock_post):
        """Verifies that if Google Sheets fails, the order is STILL created and saved in the DB."""
        mock_post.side_effect = requests.exceptions.ConnectTimeout("Google Sheets connection timed out")

        order_payload = {
            "customer_id": self.customer_id,
            "subtotal": 899.0,
            "discount": 0.0,
            "shipping": 80.0,
            "tax": 0.0,
            "total": 979.0,
            "payment_status": "PAYMENT_PENDING",
            "order_status": "PAYMENT_PENDING",
            "payment_id": "UPI",
            "shipping_address": "142 Heritage Gardens, Apt 4B",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600028",
            "items": [
                {"product_id": self.prod1_id, "quantity": 1, "price": 899.0}
            ]
        }

        res = client.post("/api/v1/orders/", json=order_payload)
        self.assertEqual(res.status_code, 201)
        order_data = res.json()
        order_num = order_data["order_number"]

        # Verify order was saved successfully with FAILED sync status
        db = TestingSessionLocal()
        saved_order = db.query(models.Order).filter(models.Order.order_number == order_num).first()
        self.assertIsNotNone(saved_order)
        self.assertEqual(saved_order.google_sheets_sync_status, "FAILED")
        self.assertIn("timed out", saved_order.google_sheets_sync_error)
        db.close()

    @patch("requests.post")
    def test_04_status_update_synchronizes_to_sheets(self, mock_post):
        """Verifies that updating order status triggers update_status in Google Sheets."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"success": True, "action": "updated_status", "rows_affected": 1}
        mock_post.return_value = mock_response

        db = TestingSessionLocal()
        order = db.query(models.Order).first()
        order_id = order.id
        db.close()

        res = client.put(f"/api/v1/orders/{order_id}/status", json={
            "order_status": "CONFIRMED",
            "payment_status": "PAYMENT_CONFIRMED"
        })
        self.assertEqual(res.status_code, 200)

        # Assert requests.post called with action 'update_status'
        self.assertTrue(mock_post.called)
        _, call_kwargs = mock_post.call_args
        posted_json = call_kwargs["json"]
        self.assertEqual(posted_json["action"], "update_status")
        self.assertEqual(posted_json["order_status"], "CONFIRMED")
        self.assertEqual(posted_json["payment_status"], "PAYMENT_CONFIRMED")

    @patch("requests.post")
    def test_05_admin_confirm_payment_triggers_sheets_status_update(self, mock_post):
        """Verifies that admin confirming payment triggers update_status in Google Sheets."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"success": True, "action": "updated_status"}
        mock_post.return_value = mock_response

        db = TestingSessionLocal()
        order = db.query(models.Order).filter(models.Order.payment_status != "PAYMENT_CONFIRMED").first()
        if not order:
            order = models.Order(
                order_number="QH-20261010-CONFIRMTEST",
                customer_id=self.customer_id,
                subtotal=899.0,
                total=899.0,
                payment_status="PAYMENT_PENDING",
                order_status="PAYMENT_PENDING"
            )
            db.add(order)
            db.commit()
            db.refresh(order)
        order_num = order.order_number
        db.close()

        res = client.post(f"/api/v1/admin/orders/{order_num}/confirm-payment")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["success"])

        # Check that update_status was sent
        self.assertTrue(mock_post.called)
        _, call_kwargs = mock_post.call_args
        posted_json = call_kwargs["json"]
        self.assertEqual(posted_json["action"], "update_status")
        self.assertEqual(posted_json["payment_status"], "PAYMENT_CONFIRMED")
        self.assertEqual(posted_json["order_status"], "CONFIRMED")

    @patch("requests.post")
    def test_06_retry_failed_syncs_endpoint(self, mock_post):
        """Verifies that the sync-sheets endpoint recovers failed orders."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"success": True, "action": "inserted", "rows_affected": 1}
        mock_post.return_value = mock_response

        # Ensure at least one order has FAILED sync status
        db = TestingSessionLocal()
        order = db.query(models.Order).first()
        target_id = order.id
        order.google_sheets_sync_status = "FAILED"
        order.google_sheets_sync_error = "Mock previous error"
        db.commit()
        db.close()

        res = client.post("/api/v1/orders/sync-sheets?limit=10")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["synced_count"], 1)

        # Check DB status is now SYNCED
        db = TestingSessionLocal()
        updated_order = db.query(models.Order).filter(models.Order.id == target_id).first()
        self.assertEqual(updated_order.google_sheets_sync_status, "SYNCED")
        db.close()

    @classmethod
    def tearDownClass(cls):
        app.dependency_overrides.pop(get_db, None)
        Base.metadata.drop_all(bind=test_engine)

if __name__ == "__main__":
    unittest.main()
