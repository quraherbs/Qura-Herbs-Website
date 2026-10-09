from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# User
class UserBase(BaseModel):
    name: str
    email: EmailStr
    profile_image: Optional[str] = None
    role: str = "customer"

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    google_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Customer
class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    district: Optional[str] = None
    state: str
    pincode: str

class CustomerCreate(CustomerBase):
    user_id: Optional[int] = None

class CustomerResponse(CustomerBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Category
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    active: bool = True
    display_order: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Product Variant
class ProductVariantBase(BaseModel):
    name: str
    sku_suffix: str
    price_override: Optional[float] = None
    stock: int = 0

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantResponse(ProductVariantBase):
    id: int
    product_id: int

    model_config = ConfigDict(from_attributes=True)

# Product
class ProductBase(BaseModel):
    name: str
    slug: str
    short_description: str
    full_description: str
    price: float
    sale_price: Optional[float] = None
    SKU: str
    stock: int = 0
    category_id: Optional[int] = None
    category_ids: Optional[List[int]] = []
    ingredients: Optional[str] = None
    benefits: Optional[str] = None
    how_to_use: Optional[str] = None
    skin_type: Optional[str] = None
    product_images: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    featured: bool = False
    active: bool = True

class ProductCreate(ProductBase):
    variants: Optional[List[ProductVariantCreate]] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category_ids: List[int] = []
    categories: List[CategoryResponse] = []
    variants: List[ProductVariantResponse] = []

    model_config = ConfigDict(from_attributes=True)

# Order Item
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float
    variant: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    product_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Email Log
class EmailLogResponse(BaseModel):
    id: int
    order_id: int
    recipient_email: str
    email_type: str
    subject: str
    status: str
    provider_message_id: Optional[str] = None
    error_message: Optional[str] = None
    sent_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Order Timeline Event
class OrderTimelineEventResponse(BaseModel):
    id: int
    order_id: int
    status: str
    notes: Optional[str] = None
    created_by: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Admin Note
class AdminNoteCreate(BaseModel):
    note: str
    admin_name: Optional[str] = "Admin"

class AdminNoteResponse(BaseModel):
    id: int
    order_id: int
    note: str
    admin_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Order
class OrderBase(BaseModel):
    customer_id: int
    subtotal: float
    discount: float = 0.0
    shipping: float = 0.0
    tax: float = 0.0
    total: float
    payment_status: str = "pending"
    order_status: str = "pending"
    payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    tracking_number: Optional[str] = None
    payment_confirmed_at: Optional[datetime] = None
    payment_confirmed_by: Optional[str] = None
    offer_id: Optional[int] = None
    voucher_code: Optional[str] = None
    discount_amount: float = 0.0
    shipping_discount: float = 0.0
    shipping_address: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderResponse(OrderBase):
    id: int
    order_number: str
    created_at: datetime
    items: List[OrderItemResponse] = []
    email_logs: List[EmailLogResponse] = []
    timeline_events: List[OrderTimelineEventResponse] = []
    admin_notes: List[AdminNoteResponse] = []
    customer: Optional[CustomerResponse] = None

    model_config = ConfigDict(from_attributes=True)

class ShippingAnalyticsResponse(BaseModel):
    total_orders: int
    tn_orders: int
    outside_tn_orders: int
    shipping_80_orders: int
    shipping_150_orders: int
    total_shipping_revenue: float
    avg_shipping_charge: float
    revenue_by_date: List[dict]
    revenue_by_state: List[dict]

# Coupon
class CouponBase(BaseModel):
    code: str
    discount_type: str  # percentage, flat
    discount_value: float
    minimum_order: float = 0.0
    maximum_discount: Optional[float] = None
    expiry: Optional[datetime] = None
    usage_limit: Optional[int] = None
    active: bool = True

class CouponCreate(CouponBase):
    pass

class CouponResponse(CouponBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Review
class ReviewBase(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    review: str
    image: Optional[str] = None
    featured: bool = False

class ReviewCreate(ReviewBase):
    customer_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None

class ReviewResponse(ReviewBase):
    id: int
    customer_id: int
    verified_purchase: bool
    approved: bool
    created_at: datetime
    customer_name: Optional[str] = None
    product_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Blog
class BlogBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    featured_image: Optional[str] = None
    author: str
    published: bool = False
    published_at: Optional[datetime] = None
    meta_description: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogResponse(BlogBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Setting
class SettingBase(BaseModel):
    key: str
    value: dict

class SettingResponse(SettingBase):
    model_config = ConfigDict(from_attributes=True)

# Offer
class OfferBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    offer_type: str = "percentage"  # percentage, flat, free_shipping
    discount_value: float = 0.0
    minimum_order_value: float = 0.0
    maximum_discount: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    usage_limit: Optional[int] = None
    used_count: int = 0
    per_customer_limit: int = 1
    first_order_only: bool = False
    exclude_sale_products: bool = False
    active: bool = True

class OfferCreate(OfferBase):
    pass

class OfferResponse(OfferBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class OfferValidateRequest(BaseModel):
    voucher_code: str
    cart_subtotal: float
    customer_id: Optional[int] = None
    customer_email: Optional[str] = None
    product_ids: Optional[List[int]] = []

class OfferValidateResponse(BaseModel):
    valid: bool
    voucher_code: str
    offer_name: str
    offer_type: str
    discount_amount: float
    shipping_discount: float
    final_subtotal: float
    final_total: float
    message: str
    offer_id: Optional[int] = None

# Hero Banner
class HeroBannerBase(BaseModel):
    desktop_image: str
    mobile_image: Optional[str] = None
    heading: str
    subheading: Optional[str] = None
    cta_text: str = "SHOP THE RITUAL"
    cta_link: str = "/shop"
    display_order: int = 0
    active: bool = True

class HeroBannerCreate(HeroBannerBase):
    pass

class HeroBannerResponse(HeroBannerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Result Gallery Item
class ResultGalleryBase(BaseModel):
    image: str
    title: str
    description: Optional[str] = None
    product_used: Optional[str] = None
    customer_name: Optional[str] = None
    duration: Optional[str] = None
    display_order: int = 0
    active: bool = True

class ResultGalleryCreate(ResultGalleryBase):
    pass

class ResultGalleryResponse(ResultGalleryBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Real Result
class RealResultBase(BaseModel):
    customer_name: str
    customer_location: Optional[str] = None
    before_image: str
    after_image: str
    description: str
    product_used: Optional[str] = None
    duration: Optional[str] = None
    skin_concern: Optional[str] = None
    display_order: int = 0
    active: bool = True

class RealResultCreate(RealResultBase):
    pass

class RealResultResponse(RealResultBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Botanical Journey
class BotanicalJourneyBase(BaseModel):
    title: str
    customer_name: str
    skin_type: Optional[str] = None
    skin_concern: Optional[str] = None
    products_used: Optional[str] = None
    routine_description: Optional[str] = None
    morning_routine: Optional[str] = None
    night_routine: Optional[str] = None
    duration: Optional[str] = None
    result_description: Optional[str] = None
    before_image: Optional[str] = None
    progress_images: Optional[List[str]] = []
    final_image: str
    display_order: int = 0
    active: bool = True

class BotanicalJourneyCreate(BotanicalJourneyBase):
    pass

class BotanicalJourneyResponse(BotanicalJourneyBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

