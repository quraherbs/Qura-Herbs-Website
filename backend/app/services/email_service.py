import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.app.models import models

class EmailService:
    @staticmethod
    def get_smtp_config():
        host = getattr(settings, "EMAIL_HOST", "smtp.gmail.com")
        port = int(getattr(settings, "EMAIL_PORT", 587))
        username = getattr(settings, "EMAIL_USERNAME", "")
        password = getattr(settings, "EMAIL_PASSWORD", "")
        from_email = getattr(settings, "EMAIL_FROM_EMAIL", username or "info@quraherbs.in")
        from_name = getattr(settings, "EMAIL_FROM_NAME", "Qura Herbs")
        return host, port, username, password, from_email, from_name

    @staticmethod
    def log_email(
        db: Session,
        order_id: int,
        recipient_email: str,
        email_type: str,
        subject: str,
        status: str,
        error_message: str = None
    ):
        try:
            log_entry = models.EmailLog(
                order_id=order_id,
                recipient_email=recipient_email,
                email_type=email_type,
                subject=subject,
                status=status,
                error_message=error_message,
                sent_at=datetime.now(timezone.utc).replace(tzinfo=None) if status == "SUCCESS" else None
            )
            db.add(log_entry)
            db.commit()
            db.refresh(log_entry)
            return log_entry
        except Exception as e:
            print(f"Failed to save email log to DB: {e}")
            db.rollback()
            return None

    @staticmethod
    def _send_email_smtp(to_email: str, subject: str, html_content: str) -> tuple[bool, str]:
        host, port, username, password, from_email, from_name = EmailService.get_smtp_config()

        if not username or not password or password == "your-email-password":
            print(f"[EmailService Simulation] SMTP credentials not set or using placeholder. Email to {to_email} with subject '{subject}' marked as simulated success.")
            return True, "simulated_success"

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{from_name} <{from_email}>"
            msg["To"] = to_email

            part = MIMEText(html_content, "html")
            msg.attach(part)

            server = smtplib.SMTP(host, port)
            server.starttls()
            server.login(username, password)
            server.sendmail(from_email, to_email, msg.as_string())
            server.quit()
            return True, "sent"
        except Exception as e:
            error_str = str(e)
            print(f"[EmailService Error] Failed to send email to {to_email}: {error_str}")
            return False, error_str

    @staticmethod
    def send_admin_new_order_email(db: Session, order: models.Order, customer: models.Customer, items: list):
        admin_emails = getattr(settings, "admin_emails_list", ["admin@quraherbs.in"])
        recipient = admin_emails[0] if admin_emails else "admin@quraherbs.in"
        subject = f"NEW ORDER RECEIVED — #{order.order_number}"

        items_html = ""
        for item in items:
            prod_name = item.get("name") if isinstance(item, dict) else (item.product.name if hasattr(item, "product") and item.product else f"Product #{item.product_id}")
            qty = item.get("quantity") if isinstance(item, dict) else item.quantity
            price = item.get("price") if isinstance(item, dict) else item.price
            items_html += f"""
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #EFE8D8; color: #2C1A14; font-size: 13px;">
                <strong>{prod_name}</strong>
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #EFE8D8; color: #3D261D; font-size: 13px; text-align: center;">
                {qty}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #EFE8D8; color: #2C1A14; font-size: 13px; text-align: right;">
                ₹{(price * qty):,.2f}
              </td>
            </tr>
            """

        admin_url = f"{getattr(settings, 'NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')}/admin"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FDFBF7; margin: 0; padding: 20px; color: #2C1A14; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EFE8D8; padding: 30px; }}
            .header {{ text-align: center; border-bottom: 2px solid #C5A059; padding-bottom: 15px; margin-bottom: 20px; }}
            .title {{ font-size: 20px; font-weight: bold; color: #2C1A14; letter-spacing: 2px; text-transform: uppercase; }}
            .subtitle {{ color: #C5A059; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }}
            .card {{ background-color: #F7F3E9; border: 1px solid #EFE8D8; padding: 15px; margin-bottom: 20px; font-size: 13px; line-height: 1.6; }}
            .btn {{ display: inline-block; background-color: #2C1A14; color: #FDFBF7; padding: 12px 25px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 15px; }}
            .footer {{ text-align: center; font-size: 11px; color: #3D261D; margin-top: 30px; border-top: 1px solid #EFE8D8; padding-top: 15px; opacity: 0.7; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="title">QURA HERBS</div>
              <div class="subtitle">New Order Notification</div>
            </div>

            <p style="font-size: 14px; margin-bottom: 20px;">A new order has been placed on your website and is awaiting payment verification.</p>

            <div class="card">
              <strong style="font-size: 15px; color: #2C1A14;">Order #{order.order_number}</strong><br/>
              <strong>Customer:</strong> {customer.name}<br/>
              <strong>Phone:</strong> {customer.phone}<br/>
              <strong>Email:</strong> {customer.email}<br/>
              <strong>Order Total:</strong> ₹{order.total:,.2f}<br/>
              <strong>Payment Method:</strong> UPI (Manual Verification)<br/>
              <strong>Payment Status:</strong> <span style="color: #C5A059; font-weight: bold;">PENDING VERIFICATION</span>
            </div>

            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2C1A14; border-bottom: 1px solid #EFE8D8; padding-bottom: 5px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #F7F3E9; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #3D261D;">
                  <th style="padding: 8px;">Product</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items_html}
              </tbody>
            </table>

            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2C1A14; border-bottom: 1px solid #EFE8D8; padding-bottom: 5px;">Delivery Address</h3>
            <p style="font-size: 13px; color: #3D261D; line-height: 1.5;">
              {customer.name}<br/>
              {customer.address}<br/>
              {customer.city}, {customer.state} - {customer.pincode}
            </p>

            <div style="text-align: center; margin-top: 25px;">
              <a href="{admin_url}" class="btn">OPEN ORDER IN ADMIN</a>
            </div>

            <div class="footer">
              QURA HERBS — Rooted in nature. Created for your skin.<br/>
              https://www.quraherbs.in
            </div>
          </div>
        </body>
        </html>
        """

        success, msg_or_err = EmailService._send_email_smtp(recipient, subject, html_content)
        EmailService.log_email(
            db=db,
            order_id=order.id,
            recipient_email=recipient,
            email_type="ADMIN_NEW_ORDER",
            subject=subject,
            status="SUCCESS" if success else "FAILED",
            error_message=None if success else msg_or_err
        )
        return success

    @staticmethod
    def send_customer_confirmation_email(db: Session, order: models.Order, customer: models.Customer, items: list):
        recipient = customer.email
        subject = f"Your Qura Herbs Order #{order.order_number} is Confirmed ✨"

        site_url = getattr(settings, "NEXT_PUBLIC_SITE_URL", "http://localhost:3000")
        order_url = f"{site_url}/order-success/{order.order_number}"
        shop_url = f"{site_url}/shop"

        items_html = ""
        for item in items:
            prod_name = item.get("name") if isinstance(item, dict) else (item.product.name if hasattr(item, "product") and item.product else f"Product #{item.product_id}")
            qty = item.get("quantity") if isinstance(item, dict) else item.quantity
            price = item.get("price") if isinstance(item, dict) else item.price
            thumb = item.get("thumbnail") if isinstance(item, dict) else (item.product.thumbnail if hasattr(item, "product") and item.product else None)
            
            img_html = ""
            if thumb:
                img_url = thumb if thumb.startswith("http") else f"{site_url}{thumb}"
                img_html = f'<img src="{img_url}" width="48" height="48" style="object-fit: cover; border-radius: 4px; border: 1px solid #EFE8D8; margin-right: 12px; vertical-align: middle;" />'

            items_html += f"""
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #F7F3E9; color: #2C1A14; font-size: 13px;">
                <div style="display: flex; align-items: center;">
                  {img_html}
                  <span style="font-weight: bold;">{prod_name}</span>
                </div>
              </td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #F7F3E9; color: #3D261D; font-size: 13px; text-align: center;">
                {qty}
              </td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #F7F3E9; color: #2C1A14; font-size: 13px; text-align: right; font-weight: bold;">
                ₹{(price * qty):,.2f}
              </td>
            </tr>
            """

        date_str = order.created_at.strftime("%b %d, %Y") if order.created_at else datetime.now().strftime("%b %d, %Y")

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: 'Georgia', Garamond, 'Times New Roman', serif; background-color: #FDFBF7; margin: 0; padding: 20px; color: #2C1A14; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EFE8D8; padding: 35px 30px; box-shadow: 0 4px 12px rgba(44, 26, 20, 0.03); }}
            .header {{ text-align: center; border-bottom: 1px solid #EFE8D8; padding-bottom: 20px; margin-bottom: 25px; }}
            .brand-name {{ font-size: 24px; font-weight: normal; letter-spacing: 3px; color: #2C1A14; margin-bottom: 4px; }}
            .brand-tagline {{ font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #C5A059; font-weight: 600; }}
            .badge-box {{ text-align: center; background-color: #F7F3E9; border: 1px solid #EFE8D8; padding: 20px; margin-bottom: 25px; }}
            .check-icon {{ font-size: 32px; color: #C5A059; line-height: 1; }}
            .status-title {{ font-size: 18px; color: #2C1A14; font-weight: normal; margin-top: 8px; margin-bottom: 4px; }}
            .status-desc {{ font-family: sans-serif; font-size: 12px; color: #3D261D; opacity: 0.8; margin: 0; }}
            .section-header {{ font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #C5A059; font-weight: bold; border-bottom: 1px solid #EFE8D8; padding-bottom: 6px; margin-top: 25px; margin-bottom: 12px; }}
            .info-grid {{ display: table; width: 100%; font-family: sans-serif; font-size: 12px; margin-bottom: 20px; }}
            .info-row {{ display: table-row; }}
            .info-cell-label {{ display: table-cell; padding: 4px 0; color: #3D261D; opacity: 0.7; }}
            .info-cell-val {{ display: table-cell; padding: 4px 0; font-weight: bold; text-align: right; color: #2C1A14; }}
            .btn-primary {{ display: inline-block; background-color: #2C1A14; color: #FDFBF7 !important; padding: 14px 28px; text-decoration: none; font-family: sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 5px; border-radius: 2px; }}
            .btn-secondary {{ display: inline-block; background-color: #FFFFFF; color: #2C1A14 !important; border: 1px solid #2C1A14; padding: 13px 26px; text-decoration: none; font-family: sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 5px; border-radius: 2px; }}
            .footer {{ text-align: center; font-family: sans-serif; font-size: 11px; color: #3D261D; margin-top: 35px; border-top: 1px solid #EFE8D8; padding-top: 20px; opacity: 0.8; line-height: 1.6; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="brand-name">QURA HERBS</div>
              <div class="brand-tagline">Skincare Rooted in Nature</div>
            </div>

            <div class="badge-box">
              <div class="check-icon">✓</div>
              <div class="status-title">Order Confirmed</div>
              <p class="status-desc">Thank you, <strong>{customer.name}</strong>! Your Qura Herbs order has been successfully verified & confirmed.</p>
            </div>

            <div style="font-size: 13px; color: #3D261D; font-style: italic; text-align: center; margin-bottom: 25px;">
              "Your skincare ritual is officially on its way."
            </div>

            <div class="section-header">Order Details</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-cell-label">Order Number</div>
                <div class="info-cell-val">#{order.order_number}</div>
              </div>
              <div class="info-row">
                <div class="info-cell-label">Order Date</div>
                <div class="info-cell-val">{date_str}</div>
              </div>
              <div class="info-row">
                <div class="info-cell-label">Payment Method</div>
                <div class="info-cell-val">UPI Transfer</div>
              </div>
              <div class="info-row">
                <div class="info-cell-label">Payment Status</div>
                <div class="info-cell-val" style="color: #C5A059;">PAID (Verified)</div>
              </div>
            </div>

            <div class="section-header">Your Skincare Order</div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
              <thead>
                <tr style="background-color: #F7F3E9; font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #3D261D; text-align: left;">
                  <th style="padding: 8px;">Product</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items_html}
              </tbody>
            </table>

            <!-- Summary Table -->
            <div style="background-color: #F7F3E9; border: 1px solid #EFE8D8; padding: 12px 15px; font-family: sans-serif; font-size: 12px; margin-bottom: 25px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #3D261D; opacity: 0.8;">Subtotal</span>
                <span>₹{order.subtotal:,.2f}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #3D261D; opacity: 0.8;">Shipping</span>
                <span style="color: #C5A059; font-weight: bold;">FREE</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; border-top: 1px solid #EFE8D8; padding-top: 8px; margin-top: 6px; color: #2C1A14;">
                <span>Total Paid</span>
                <span>₹{order.total:,.2f}</span>
              </div>
            </div>

            <div class="section-header">Delivery Address</div>
            <p style="font-family: sans-serif; font-size: 12px; color: #3D261D; line-height: 1.6; margin-bottom: 25px;">
              <strong style="color: #2C1A14;">{customer.name}</strong><br/>
              {customer.address}<br/>
              {customer.city}, {customer.state} - {customer.pincode}<br/>
              Phone: {customer.phone}
            </p>

            <div class="section-header">What Happens Next?</div>
            <p style="font-family: sans-serif; font-size: 12px; color: #3D261D; line-height: 1.5; margin-bottom: 25px;">
              Your order is now confirmed and is being hand-packed at our laboratory. You will receive another notification with your shipping tracking ID once your order has been dispatched.
            </p>

            <div style="text-align: center; margin-top: 25px;">
              <a href="{order_url}" class="btn-primary">VIEW YOUR ORDER</a>
              <a href="{shop_url}" class="btn-secondary">CONTINUE SHOPPING</a>
            </div>

            <div class="footer">
              "Thank you for choosing Qura Herbs. Your skin deserves a ritual rooted in nature."<br/><br/>
              <strong>QURA HERBS</strong> • https://www.quraherbs.in
            </div>
          </div>
        </body>
        </html>
        """

        success, msg_or_err = EmailService._send_email_smtp(recipient, subject, html_content)
        EmailService.log_email(
            db=db,
            order_id=order.id,
            recipient_email=recipient,
            email_type="CUSTOMER_ORDER_CONFIRMED",
            subject=subject,
            status="SUCCESS" if success else "FAILED",
            error_message=None if success else msg_or_err
        )
        return success
