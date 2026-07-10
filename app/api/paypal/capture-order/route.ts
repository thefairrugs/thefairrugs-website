/**
 * POST /api/paypal/capture-order
 *
 * Server-side route — captures a PayPal payment after the buyer approves it.
 * On success:
 *   1. Captures the PayPal payment
 *   2. Generates a unique Order ID
 *   3. Saves full order details to data/orders.json
 *   4. Sends order confirmation email to customer
 *   5. Sends order notification email to admin
 *
 * Request body:
 *   {
 *     orderID:      string        (PayPal order ID returned from create-order)
 *     customerInfo: { firstName, lastName, email, phone, address, city, country, postalCode, notes }
 *     items:        CartItem[]
 *     subtotal:     number
 *   }
 *
 * Response on success:
 *   { success: true, orderId: string, transactionId: string }
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// ── PayPal config ──────────────────────────────────────────────────────────────
const PAYPAL_MODE = process.env.PAYPAL_MODE || "live";
const PAYPAL_BASE =
  PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

const PAYPAL_CLIENT_ID     = process.env.PAYPAL_CLIENT_ID     || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";

// ── File-based DB ──────────────────────────────────────────────────────────────
const DATA_DIR    = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// ── Email config ───────────────────────────────────────────────────────────────
const SITE_URL        = process.env.NEXT_PUBLIC_SITE_URL || "https://thefairrugs.com";
const NOTIFY_EMAIL    = process.env.NOTIFY_EMAIL || "thefairrugs@gmail.com";
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// ── Types ──────────────────────────────────────────────────────────────────────
interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productTitle: string;
  productImage: string;
  construction: string;
  material: string;
  sizeLabel: string;
  sqft: number;
  unitPrice: number;
  quantity: number;
}

interface OrderRecord {
  orderId: string;
  paypalOrderId: string;
  paypalTransactionId: string;
  paymentStatus: string;
  paymentMethod: string;
  currency: string;
  totalAmount: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  items: Array<{
    productId: string;
    productTitle: string;
    sizeLabel: string;
    construction: string;
    material: string;
    sqft: number;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  notes: string;
  createdAt: string;
  status: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured");
  }
  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

function generateOrderId(): string {
  // Format: TFR-YYYYMMDD-XXXXXXXX (e.g. TFR-20260710-A3F8C2D1)
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `TFR-${date}-${random}`;
}

function loadOrders(): OrderRecord[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(ORDERS_FILE, "[]", "utf-8");
    }
    return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8")) as OrderRecord[];
  } catch {
    return [];
  }
}

function saveOrders(orders: OrderRecord[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!SENDGRID_API_KEY) {
    console.log(`[Email] No SENDGRID_API_KEY set. Would send to ${to}: ${subject}`);
    return;
  }
  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "noreply@thefairrugs.com", name: "The Fair Rugs" },
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    });
    if (!res.ok) console.error("[SendGrid] Error:", res.status, await res.text());
    else console.log("[Email] Sent successfully to:", to);
  } catch (e) {
    console.error("[Email] Send failed:", e);
  }
}

// ── Email templates ────────────────────────────────────────────────────────────

function buildCustomerEmail(order: OrderRecord): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #e8e4dc">
          <strong style="color:#1c1c1a">${item.productTitle}</strong><br/>
          <span style="font-size:13px;color:#8a8878">${item.sizeLabel} · ${item.construction}</span>
        </td>
        <td style="padding:10px;border-bottom:1px solid #e8e4dc;text-align:center;color:#5c5a52">${item.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #e8e4dc;text-align:right;font-weight:bold;color:#4a5c3a">
          $${item.lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family:Georgia,serif;max-width:620px;margin:0 auto;background:#fff;border:1px solid #e8e4dc;border-radius:8px;overflow:hidden">
      <!-- Header -->
      <div style="background:#4a5c3a;padding:36px 40px;text-align:center">
        <h1 style="color:#fff;font-size:28px;font-weight:300;margin:0;letter-spacing:0.05em">The Fair Rugs</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:8px 0 0;letter-spacing:0.15em">HANDMADE IN JAIPUR</p>
      </div>

      <!-- Body -->
      <div style="padding:40px">
        <h2 style="color:#4a5c3a;font-size:24px;font-weight:400;margin:0 0 8px">Order Confirmed! 🎉</h2>
        <p style="color:#5c5a52;font-size:15px;line-height:1.7;margin:0 0 28px">
          Thank you, <strong>${order.customer.firstName}</strong>! Your payment was successful and your order has been placed.
          Our master artisans in Jaipur will begin crafting your handmade rug soon.
        </p>

        <!-- Order summary box -->
        <div style="background:#f8f6f0;border-radius:8px;padding:20px 24px;margin-bottom:28px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:12px;color:#8a8878;letter-spacing:0.1em;text-transform:uppercase">Order ID</span>
            <strong style="color:#1c1c1a;font-family:monospace;font-size:15px">${order.orderId}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:12px;color:#8a8878;letter-spacing:0.1em;text-transform:uppercase">Payment</span>
            <span style="color:#16a34a;font-weight:bold">✓ Paid via PayPal</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="font-size:12px;color:#8a8878;letter-spacing:0.1em;text-transform:uppercase">Transaction ID</span>
            <span style="color:#5c5a52;font-family:monospace;font-size:13px">${order.paypalTransactionId}</span>
          </div>
        </div>

        <!-- Items table -->
        <h3 style="color:#1c1c1a;font-size:15px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.08em">Your Items</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <thead>
            <tr style="background:#f8f6f0">
              <th style="padding:10px;text-align:left;font-size:11px;color:#8a8878;letter-spacing:0.08em;text-transform:uppercase">Product</th>
              <th style="padding:10px;text-align:center;font-size:11px;color:#8a8878;letter-spacing:0.08em;text-transform:uppercase">Qty</th>
              <th style="padding:10px;text-align:right;font-size:11px;color:#8a8878;letter-spacing:0.08em;text-transform:uppercase">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align:right;padding:12px 0;border-top:2px solid #1c1c1a">
          <span style="font-size:18px;font-weight:bold;color:#1c1c1a">
            Total: $${order.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </span>
        </div>

        <!-- Shipping address -->
        <div style="margin-top:28px;padding:20px 24px;background:#f8f6f0;border-radius:8px">
          <h3 style="color:#1c1c1a;font-size:13px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.08em">Shipping To</h3>
          <p style="color:#5c5a52;font-size:14px;line-height:1.7;margin:0">
            ${order.customer.firstName} ${order.customer.lastName}<br/>
            ${order.shippingAddress.address}<br/>
            ${order.shippingAddress.city}${order.shippingAddress.postalCode ? ", " + order.shippingAddress.postalCode : ""}<br/>
            ${order.shippingAddress.country}
          </p>
        </div>

        ${order.notes ? `
        <div style="margin-top:20px;padding:16px 20px;border-left:4px solid #4a5c3a;background:#f8f6f0;border-radius:0 8px 8px 0">
          <p style="margin:0;font-size:13px;color:#5c5a52"><strong>Order Notes:</strong> ${order.notes}</p>
        </div>` : ""}

        <!-- What happens next -->
        <div style="margin-top:32px;padding:24px;border:1px solid #e8e4dc;border-radius:8px">
          <h3 style="color:#4a5c3a;font-size:15px;font-weight:700;margin:0 0 16px">What happens next?</h3>
          <ol style="color:#5c5a52;font-size:14px;line-height:2;padding-left:20px;margin:0">
            <li>Our team reviews your order within 24 hours</li>
            <li>Master artisans begin handcrafting your rug in Jaipur</li>
            <li>Quality inspection and professional packaging</li>
            <li>Worldwide shipping with tracking (3–5 weeks production)</li>
          </ol>
        </div>

        <div style="text-align:center;margin-top:32px">
          <a href="${SITE_URL}/shop"
             style="background:#4a5c3a;color:#fff;padding:16px 40px;border-radius:9999px;text-decoration:none;font-size:14px;font-weight:bold;display:inline-block;letter-spacing:0.06em">
            Continue Shopping →
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f8f6f0;padding:24px;text-align:center;border-top:1px solid #e8e4dc">
        <p style="color:#8a8878;font-size:12px;margin:0;line-height:1.8">
          Questions? WhatsApp us at <a href="https://wa.me/918416919470" style="color:#4a5c3a">+91 8416 919470</a><br/>
          or reply to this email. We're happy to help!<br/>
          <strong style="color:#4a5c3a">The Fair Rugs · Handmade in Jaipur, India</strong>
        </p>
      </div>
    </div>
  `;
}

function buildAdminEmail(order: OrderRecord): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd">${item.productTitle}</td>
        <td style="padding:8px;border:1px solid #ddd">${item.sizeLabel}</td>
        <td style="padding:8px;border:1px solid #ddd">${item.construction}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:center">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">$${item.lineTotal.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px">
      <h2 style="color:#4a5c3a;margin:0 0 4px">🎉 New Order Received — The Fair Rugs</h2>
      <p style="color:#666;margin:0 0 24px;font-size:13px">A PayPal payment has been successfully captured.</p>

      <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd;width:35%">Order ID</td><td style="padding:8px;border:1px solid #ddd;font-family:monospace;font-size:15px;color:#4a5c3a"><strong>${order.orderId}</strong></td></tr>
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd">PayPal Order ID</td><td style="padding:8px;border:1px solid #ddd;font-family:monospace">${order.paypalOrderId}</td></tr>
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd">Transaction ID</td><td style="padding:8px;border:1px solid #ddd;font-family:monospace">${order.paypalTransactionId}</td></tr>
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd">Payment Status</td><td style="padding:8px;border:1px solid #ddd;color:#16a34a;font-weight:bold">✓ ${order.paymentStatus}</td></tr>
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd">Total Amount</td><td style="padding:8px;border:1px solid #ddd;font-weight:bold;font-size:16px">$${order.totalAmount.toFixed(2)} ${order.currency}</td></tr>
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd">Order Date</td><td style="padding:8px;border:1px solid #ddd">${new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</td></tr>
      </table>

      <h3 style="color:#4a5c3a;margin:0 0 12px">Customer Details</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd;width:35%">Name</td><td style="padding:8px;border:1px solid #ddd">${order.customer.firstName} ${order.customer.lastName}</td></tr>
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd">Email</td><td style="padding:8px;border:1px solid #ddd"><a href="mailto:${order.customer.email}">${order.customer.email}</a></td></tr>
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd">Phone</td><td style="padding:8px;border:1px solid #ddd">${order.customer.phone || "—"}</td></tr>
        <tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd">Shipping Address</td><td style="padding:8px;border:1px solid #ddd">${order.shippingAddress.address}, ${order.shippingAddress.city}${order.shippingAddress.postalCode ? " " + order.shippingAddress.postalCode : ""}, ${order.shippingAddress.country}</td></tr>
        ${order.notes ? `<tr><td style="background:#f5f5f5;font-weight:bold;padding:8px;border:1px solid #ddd">Order Notes</td><td style="padding:8px;border:1px solid #ddd">${order.notes}</td></tr>` : ""}
      </table>

      <h3 style="color:#4a5c3a;margin:0 0 12px">Items Ordered</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
        <thead>
          <tr style="background:#4a5c3a;color:#fff">
            <th style="padding:10px;border:1px solid #ddd;text-align:left">Product</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left">Size</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left">Construction</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:center">Qty</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr style="background:#f5f5f5">
            <td colspan="4" style="padding:10px;border:1px solid #ddd;font-weight:bold;text-align:right">Order Total:</td>
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;font-size:16px;text-align:right">$${order.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="text-align:center">
        <a href="${SITE_URL}/admin/dashboard"
           style="background:#4a5c3a;color:#fff;padding:14px 32px;border-radius:9999px;text-decoration:none;font-weight:bold;display:inline-block">
          Open Admin Dashboard →
        </a>
      </div>
    </div>
  `;
}

// ── POST handler ───────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      orderID: string;
      customerInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        postalCode: string;
        notes: string;
      };
      items: CartItem[];
      subtotal: number;
    };

    const { orderID, customerInfo, items, subtotal } = body;

    // ── Validate ───────────────────────────────────────────────────────────────
    if (!orderID) {
      return NextResponse.json({ error: "PayPal orderID is required" }, { status: 400 });
    }
    if (!customerInfo?.email || !customerInfo?.firstName) {
      return NextResponse.json({ error: "Customer information required" }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ── Get PayPal access token ────────────────────────────────────────────────
    const accessToken = await getPayPalAccessToken();

    // ── Capture the PayPal payment ─────────────────────────────────────────────
    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `capture-${orderID}-${Date.now()}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    const captureData = await captureRes.json() as {
      id: string;
      status: string;
      purchase_units?: Array<{
        payments?: {
          captures?: Array<{
            id: string;
            status: string;
            amount?: { value: string; currency_code: string };
          }>;
        };
      }>;
    };

    if (!captureRes.ok || captureData.status !== "COMPLETED") {
      console.error("[PayPal] Capture failed:", captureRes.status, JSON.stringify(captureData));
      return NextResponse.json(
        { error: "Payment capture failed. Your card was not charged.", details: captureData },
        { status: 402 }
      );
    }

    // Extract transaction details from capture response
    const captureUnit = captureData.purchase_units?.[0];
    const capture = captureUnit?.payments?.captures?.[0];
    const transactionId = capture?.id || captureData.id;
    const capturedAmount = parseFloat(capture?.amount?.value || String(subtotal));
    const currency = capture?.amount?.currency_code || "USD";

    console.log("[PayPal] Payment captured:", transactionId, "amount:", capturedAmount, currency);

    // ── Generate unique order ID ───────────────────────────────────────────────
    const orderId = generateOrderId();

    // ── Build order record ─────────────────────────────────────────────────────
    const orderRecord: OrderRecord = {
      orderId,
      paypalOrderId: orderID,
      paypalTransactionId: transactionId,
      paymentStatus: "COMPLETED",
      paymentMethod: "PayPal",
      currency,
      totalAmount: capturedAmount,
      customer: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone || "",
      },
      shippingAddress: {
        address: customerInfo.address,
        city: customerInfo.city,
        country: customerInfo.country,
        postalCode: customerInfo.postalCode || "",
      },
      items: items.map((item) => ({
        productId: item.productId,
        productTitle: item.productTitle,
        sizeLabel: item.sizeLabel,
        construction: item.construction,
        material: item.material,
        sqft: item.sqft,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: Math.round(item.unitPrice * item.quantity * 100) / 100,
      })),
      notes: customerInfo.notes || "",
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };

    // ── Save to orders.json ────────────────────────────────────────────────────
    try {
      const orders = loadOrders();
      orders.unshift(orderRecord);
      saveOrders(orders);
      console.log("[Orders] Saved order:", orderId);
    } catch (dbErr) {
      // Log but don't fail — payment was already captured, we must respond success
      console.error("[Orders] Failed to save order to DB:", dbErr);
    }

    // ── Send confirmation email to customer ────────────────────────────────────
    sendEmail({
      to: customerInfo.email,
      subject: `Order Confirmed — ${orderId} | The Fair Rugs`,
      html: buildCustomerEmail(orderRecord),
    }).catch((e) => console.error("[Email] Customer email failed:", e));

    // ── Send notification email to admin ───────────────────────────────────────
    sendEmail({
      to: NOTIFY_EMAIL,
      subject: `🎉 New Order ${orderId} — $${capturedAmount.toFixed(2)} USD — The Fair Rugs`,
      html: buildAdminEmail(orderRecord),
    }).catch((e) => console.error("[Email] Admin email failed:", e));

    // ── Return success ─────────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      orderId,
      transactionId,
      amount: capturedAmount,
      currency,
    });
  } catch (err) {
    console.error("[PayPal] capture-order error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
