import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    profile_image = Column(Text, nullable=True)
    role = Column(String(20), default="customer")  # admin, customer
    google_id = Column(String(100), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    customers = relationship("Customer", back_populates="user")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="customers")
    orders = relationship("Order", back_populates="customer")
    reviews = relationship("Review", back_populates="customer")


from sqlalchemy import Table

product_categories = Table(
    "product_categories",
    Base.metadata,
    Column("product_id", Integer, ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True)
)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(Text, nullable=True)
    active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)

    products = relationship("Product", secondary=product_categories, back_populates="categories")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    short_description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    sale_price = Column(Float, nullable=True)
    SKU = Column(String(50), unique=True, index=True, nullable=False)
    stock = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    ingredients = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    how_to_use = Column(Text, nullable=True)
    skin_type = Column(String(100), nullable=True)
    product_images = Column(JSON, nullable=True)  # List of strings
    thumbnail = Column(Text, nullable=True)
    featured = Column(Boolean, default=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category = relationship("Category", foreign_keys=[category_id])
    categories = relationship("Category", secondary=product_categories, back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    name = Column(String(50), nullable=False)  # size, volume, combo name
    sku_suffix = Column(String(20), nullable=False)
    price_override = Column(Float, nullable=True)
    stock = Column(Integer, default=0)

    product = relationship("Product", back_populates="variants")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    subtotal = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    shipping = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    payment_status = Column(String(20), default="pending")  # pending, paid, failed
    order_status = Column(String(20), default="pending")  # pending, confirmed, processing, packed, shipped, delivered, cancelled, refunded
    payment_id = Column(String(100), nullable=True)
    razorpay_order_id = Column(String(100), nullable=True)
    tracking_number = Column(String(100), nullable=True)
    payment_confirmed_at = Column(DateTime, nullable=True)
    payment_confirmed_by = Column(String(100), nullable=True)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=True)
    voucher_code = Column(String(50), nullable=True)
    discount_amount = Column(Float, default=0.0)
    shipping_discount = Column(Float, default=0.0)
    shipping_address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)
    google_sheets_sync_status = Column(String(20), default="PENDING")  # PENDING, SYNCED, FAILED
    google_sheets_synced_at = Column(DateTime, nullable=True)
    google_sheets_sync_error = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    email_logs = relationship("EmailLog", back_populates="order", cascade="all, delete-orphan")
    timeline_events = relationship("OrderTimelineEvent", back_populates="order", cascade="all, delete-orphan")
    admin_notes = relationship("AdminNote", back_populates="order", cascade="all, delete-orphan")
    offer = relationship("Offer", back_populates="orders")


class OrderTimelineEvent(Base):
    __tablename__ = "order_timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    status = Column(String(50), nullable=False)
    notes = Column(Text, nullable=True)
    created_by = Column(String(100), default="System")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="timeline_events")


class AdminNote(Base):
    __tablename__ = "admin_notes"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    note = Column(Text, nullable=False)
    admin_name = Column(String(100), default="Admin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="admin_notes")


class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    recipient_email = Column(String(150), nullable=False)
    email_type = Column(String(50), nullable=False)  # ADMIN_NEW_ORDER, CUSTOMER_ORDER_CONFIRMED, ORDER_SHIPPED, etc.
    subject = Column(String(255), nullable=False)
    status = Column(String(20), nullable=False)  # SUCCESS, FAILED, QUEUED
    provider_message_id = Column(String(100), nullable=True)
    error_message = Column(Text, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="email_logs")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    variant = Column(String(100), nullable=True)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount_type = Column(String(20), nullable=False)  # percentage, flat
    discount_value = Column(Float, nullable=False)
    minimum_order = Column(Float, default=0.0)
    maximum_discount = Column(Float, nullable=True)
    expiry = Column(DateTime, nullable=True)
    usage_limit = Column(Integer, nullable=True)
    active = Column(Boolean, default=True)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    review = Column(Text, nullable=False)
    image = Column(Text, nullable=True)
    verified_purchase = Column(Boolean, default=True)
    approved = Column(Boolean, default=False)
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="reviews")
    customer = relationship("Customer", back_populates="reviews")

    @property
    def customer_name(self) -> str:
        return self.customer.name if self.customer else "Unknown Customer"

    @property
    def product_name(self) -> str:
        return self.product.name if self.product else "Unknown Product"


class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    featured_image = Column(Text, nullable=True)
    author = Column(String(100), nullable=False)
    published = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    meta_description = Column(Text, nullable=True)


class Setting(Base):
    __tablename__ = "settings"

    key = Column(String(100), primary_key=True, index=True)
    value = Column(JSON, nullable=False)


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    offer_type = Column(String(30), nullable=False, default="percentage")  # percentage, flat, free_shipping
    discount_value = Column(Float, nullable=False, default=0.0)
    minimum_order_value = Column(Float, default=0.0)
    maximum_discount = Column(Float, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    usage_limit = Column(Integer, nullable=True)
    used_count = Column(Integer, default=0)
    per_customer_limit = Column(Integer, default=1)
    first_order_only = Column(Boolean, default=False)
    exclude_sale_products = Column(Boolean, default=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    orders = relationship("Order", back_populates="offer")
    usages = relationship("OfferUsage", back_populates="offer", cascade="all, delete-orphan")


class OfferUsage(Base):
    __tablename__ = "offer_usages"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    discount_amount = Column(Float, default=0.0)
    used_at = Column(DateTime(timezone=True), server_default=func.now())

    offer = relationship("Offer", back_populates="usages")
    customer = relationship("Customer")
    order = relationship("Order")


class HeroBanner(Base):
    __tablename__ = "hero_banners"

    id = Column(Integer, primary_key=True, index=True)
    desktop_image = Column(Text, nullable=False)
    mobile_image = Column(Text, nullable=True)
    heading = Column(String(200), nullable=False)
    subheading = Column(Text, nullable=True)
    cta_text = Column(String(100), default="SHOP THE RITUAL")
    cta_link = Column(String(255), default="/shop")
    display_order = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ResultGalleryItem(Base):
    __tablename__ = "results_gallery"

    id = Column(Integer, primary_key=True, index=True)
    image = Column(Text, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    product_used = Column(String(150), nullable=True)
    customer_name = Column(String(100), nullable=True)
    duration = Column(String(100), nullable=True)
    display_order = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RealResult(Base):
    __tablename__ = "real_results"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_location = Column(String(100), nullable=True)
    before_image = Column(Text, nullable=False)
    after_image = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    product_used = Column(String(150), nullable=True)
    duration = Column(String(100), nullable=True)
    skin_concern = Column(String(100), nullable=True)
    display_order = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BotanicalJourney(Base):
    __tablename__ = "botanical_routine_journeys"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    customer_name = Column(String(100), nullable=False)
    skin_type = Column(String(100), nullable=True)
    skin_concern = Column(String(100), nullable=True)
    products_used = Column(String(200), nullable=True)
    routine_description = Column(Text, nullable=True)
    morning_routine = Column(Text, nullable=True)
    night_routine = Column(Text, nullable=True)
    duration = Column(String(100), nullable=True)
    result_description = Column(Text, nullable=True)
    before_image = Column(Text, nullable=True)
    progress_images = Column(JSON, nullable=True)
    final_image = Column(Text, nullable=False)
    display_order = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


