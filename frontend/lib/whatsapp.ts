export interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: string | null;
}

export interface WhatsAppOrderDetails {
  orderNumber: string;
  orderDate?: string | Date | null;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: WhatsAppOrderItem[];
  paymentMethod?: string | null;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  orderTotal: number;
  paymentStatus: string;
}

export const QURA_WHATSAPP_PHONE = "919363739675";

export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "0";
  const num = typeof amount === "number" ? amount : Number(amount);
  if (isNaN(num)) return "0";
  return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
}

export function formatOrderDate(dateVal?: string | Date | null): string {
  const d = dateVal ? new Date(dateVal) : new Date();
  const valid = isNaN(d.getTime()) ? new Date() : d;

  const datePart = valid.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timePart = valid.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

export function buildWhatsAppOrderMessage(data: WhatsAppOrderDetails): string {
  const dateStr = formatOrderDate(data.orderDate);
  const paymentMethod =
    data.paymentMethod && data.paymentMethod.trim()
      ? data.paymentMethod.trim()
      : "UPI";

  // Build product details blocks
  const productBlocks =
    data.items && data.items.length > 0
      ? data.items
          .map((item) => {
            const itemTotal = Number(item.price) * Number(item.quantity);
            const itemName = item.variant
              ? `${item.name} (${item.variant})`
              : item.name;
            return `${itemName}\nQuantity: ${item.quantity}\nUnit Price: ₹${formatPrice(item.price)}\nItem Total: ₹${formatPrice(itemTotal)}`;
          })
          .join("\n\n")
      : "No items listed";

  return [
    "Hi Qura Herbs Team,",
    "",
    "A new order has been placed through the Qura Herbs website.",
    "",
    "ORDER DETAILS",
    "",
    `Order Number: ${data.orderNumber}`,
    `Order Date: ${dateStr}`,
    `Customer Name: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
    `Shipping Address: ${data.shippingAddress}`,
    "",
    "PRODUCT DETAILS",
    "",
    productBlocks,
    "",
    "PAYMENT DETAILS",
    "",
    `Payment Method: ${paymentMethod}`,
    `Subtotal: ₹${formatPrice(data.subtotal)}`,
    `Discount: ₹${formatPrice(data.discount)}`,
    `Shipping Charge: ₹${formatPrice(data.shippingCharge)}`,
    `Order Total: ₹${formatPrice(data.orderTotal)}`,
    `Payment Status: ${data.paymentStatus}`,
    "",
    "ORDER PROCESSING",
    "",
    "Please review the order details and proceed with processing according to the verified payment status.",
    "",
    "Thank you,",
    "Qura Herbs Website Orders",
  ].join("\n");
}

export function getWhatsAppOrderUrl(data: WhatsAppOrderDetails): string {
  const message = buildWhatsAppOrderMessage(data);
  return `https://wa.me/${QURA_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
