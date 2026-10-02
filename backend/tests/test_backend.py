try:
    import pytest
except ImportError:
    pytest = None

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.main import app
from backend.app.core.database import Base, get_db
from backend.app.models import models

# Use an isolated, in-memory SQLite database so tests never touch qura_herbs.db
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

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def _fixture_dec(*args, **kwargs):
    if pytest:
        return pytest.fixture(*args, **kwargs)
    return lambda f: f

@_fixture_dec(scope="module", autouse=True)

def setup_db():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()

    # Seed isolated Category
    cat = models.Category(name="Test Cat", slug="test-cat", description="Test category")
    db.add(cat)
    db.commit()
    db.refresh(cat)

    # Seed Product A (₹699) & Product B (₹349)
    prod_a = models.Product(
        name="Product A", slug="product-a", short_description="Test", full_description="Test",
        price=699.0, SKU="PROD-A-699", stock=100, category_id=cat.id
    )
    db.add(prod_a)

    prod_b = models.Product(
        name="Product B", slug="product-b", short_description="Test", full_description="Test",
        price=349.0, SKU="PROD-B-349", stock=100, category_id=cat.id
    )
    db.add(prod_b)

    # Seed Offers: TEST100 (₹100 flat) & TEST50 (₹50 flat)
    off_100 = models.Offer(
        name="Test 100 Off", code="TEST100", offer_type="flat",
        discount_value=100.0, minimum_order_value=0.0, active=True
    )
    db.add(off_100)

    off_50 = models.Offer(
        name="Test 50 Off", code="TEST50", offer_type="flat",
        discount_value=50.0, minimum_order_value=0.0, active=True
    )
    db.add(off_50)

    # Seed Customers: Tamil Nadu, Kerala, Karnataka
    c_tn = models.Customer(
        name="TN Customer", email="tn@test.com", phone="9999999999",
        address="Street 1", city="Chennai", state="Tamil Nadu", pincode="600001"
    )
    db.add(c_tn)

    c_kl = models.Customer(
        name="Kerala Customer", email="kl@test.com", phone="9999999998",
        address="Street 2", city="Kochi", state="Kerala", pincode="682001"
    )
    db.add(c_kl)

    c_ka = models.Customer(
        name="Karnataka Customer", email="ka@test.com", phone="9999999997",
        address="Street 3", city="Bengaluru", state="Karnataka", pincode="560001"
    )
    db.add(c_ka)

    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["brand"] == "Qura Herbs"

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

# --- MANDATORY CALCULATION TEST CASES ---

def test_order_calculation_test_1():
    """
    Test 1:
    Subtotal ₹1,048 (Prod A ₹699 + Prod B ₹349)
    Discount ₹0
    State: Tamil Nadu
    Shipping ₹80
    Total ₹1,128
    """
    db = TestingSessionLocal()
    c_tn = db.query(models.Customer).filter(models.Customer.email == "tn@test.com").first()
    prod_a = db.query(models.Product).filter(models.Product.SKU == "PROD-A-699").first()
    prod_b = db.query(models.Product).filter(models.Product.SKU == "PROD-B-349").first()
    db.close()

    order_payload = {
        "customer_id": c_tn.id,
        "subtotal": 1048.0,
        "discount": 0.0,
        "shipping": 80.0,
        "tax": 0.0,
        "total": 1128.0,
        "state": "Tamil Nadu",
        "items": [
            {"product_id": prod_a.id, "quantity": 1, "price": 699.0},
            {"product_id": prod_b.id, "quantity": 1, "price": 349.0}
        ]
    }

    res = client.post("/api/v1/orders/", json=order_payload)
    assert res.status_code == 201
    data = res.json()

    assert data["subtotal"] == 1048.0
    assert data["discount"] == 0.0
    assert data["shipping"] == 80.0
    assert data["total"] == 1128.0

def test_order_calculation_test_2():
    """
    Test 2:
    Subtotal ₹1,048 (Prod A ₹699 + Prod B ₹349)
    Discount ₹100 (Voucher TEST100)
    State: Tamil Nadu
    Shipping ₹80
    Total ₹1,028
    """
    db = TestingSessionLocal()
    c_tn = db.query(models.Customer).filter(models.Customer.email == "tn@test.com").first()
    prod_a = db.query(models.Product).filter(models.Product.SKU == "PROD-A-699").first()
    prod_b = db.query(models.Product).filter(models.Product.SKU == "PROD-B-349").first()
    db.close()

    order_payload = {
        "customer_id": c_tn.id,
        "subtotal": 1048.0,
        "discount": 100.0,
        "shipping": 80.0,
        "tax": 0.0,
        "total": 1028.0,
        "voucher_code": "TEST100",
        "state": "Tamil Nadu",
        "items": [
            {"product_id": prod_a.id, "quantity": 1, "price": 699.0},
            {"product_id": prod_b.id, "quantity": 1, "price": 349.0}
        ]
    }

    res = client.post("/api/v1/orders/", json=order_payload)
    assert res.status_code == 201
    data = res.json()

    assert data["subtotal"] == 1048.0
    assert data["discount"] == 100.0
    assert data["shipping"] == 80.0
    assert data["total"] == 1028.0

def test_order_calculation_test_3():
    """
    Test 3:
    Subtotal ₹1,048 (Prod A ₹699 + Prod B ₹349)
    Discount ₹100 (Voucher TEST100)
    State: Kerala (Outside Tamil Nadu)
    Shipping ₹150
    Total ₹1,098
    """
    db = TestingSessionLocal()
    c_kl = db.query(models.Customer).filter(models.Customer.email == "kl@test.com").first()
    prod_a = db.query(models.Product).filter(models.Product.SKU == "PROD-A-699").first()
    prod_b = db.query(models.Product).filter(models.Product.SKU == "PROD-B-349").first()
    db.close()

    order_payload = {
        "customer_id": c_kl.id,
        "subtotal": 1048.0,
        "discount": 100.0,
        "shipping": 150.0,
        "tax": 0.0,
        "total": 1098.0,
        "voucher_code": "TEST100",
        "state": "Kerala",
        "items": [
            {"product_id": prod_a.id, "quantity": 1, "price": 699.0},
            {"product_id": prod_b.id, "quantity": 1, "price": 349.0}
        ]
    }

    res = client.post("/api/v1/orders/", json=order_payload)
    assert res.status_code == 201
    data = res.json()

    assert data["subtotal"] == 1048.0
    assert data["discount"] == 100.0
    assert data["shipping"] == 150.0
    assert data["total"] == 1098.0

def test_order_calculation_test_4():
    """
    Test 4:
    Subtotal ₹699 (Prod A ₹699)
    Discount ₹50 (Voucher TEST50)
    State: Karnataka (Outside Tamil Nadu)
    Shipping ₹150
    Total ₹799
    """
    db = TestingSessionLocal()
    c_ka = db.query(models.Customer).filter(models.Customer.email == "ka@test.com").first()
    prod_a = db.query(models.Product).filter(models.Product.SKU == "PROD-A-699").first()
    db.close()

    order_payload = {
        "customer_id": c_ka.id,
        "subtotal": 699.0,
        "discount": 50.0,
        "shipping": 150.0,
        "tax": 0.0,
        "total": 799.0,
        "voucher_code": "TEST50",
        "state": "Karnataka",
        "items": [
            {"product_id": prod_a.id, "quantity": 1, "price": 699.0}
        ]
    }

    res = client.post("/api/v1/orders/", json=order_payload)
    assert res.status_code == 201
    data = res.json()

    assert data["subtotal"] == 699.0
    assert data["discount"] == 50.0
    assert data["shipping"] == 150.0
    assert data["total"] == 799.0

def test_shipping_analytics_endpoint():
    res = client.get("/api/v1/orders/analytics/shipping")
    assert res.status_code == 200
    data = res.json()

    assert data["total_orders"] == 4
    assert data["tn_orders"] == 2
    assert data["outside_tn_orders"] == 2
    assert data["shipping_80_orders"] == 2
    assert data["shipping_150_orders"] == 2
    assert data["total_shipping_revenue"] == 460.0


