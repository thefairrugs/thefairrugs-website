import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function readOrders(): Record<string, unknown>[] {
  if (!fs.existsSync(ORDERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

// Fields safe to expose to the customer publicly (no admin notes, no internal data)
const PUBLIC_FIELDS = [
  "orderId", "status", "createdAt", "updatedAt",
  "courierCompany", "trackingNumber", "dispatchDate", "estimatedDelivery", "deliveredDate",
  "totalAmount", "paymentMethod", "items", "customer", "shippingAddress",
];

function sanitizeOrder(order: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  for (const field of PUBLIC_FIELDS) {
    if (field in order) {
      // Redact sensitive customer fields: only keep first name, last name, and email (partial)
      if (field === "customer") {
        const c = order.customer as Record<string, string> | undefined;
        if (c) {
          safe.customer = {
            firstName: c.firstName || "",
            lastName: c.lastName || "",
            // Partially mask email for privacy
            email: c.email ? c.email.replace(/^(.{2})(.+)(@.+)$/, (_, a, _b, d) => `${a}***${d}`) : "",
            phone: c.phone || "",
          };
        }
      } else if (field === "shippingAddress") {
        const s = order.shippingAddress as Record<string, string> | undefined;
        if (s) {
          safe.shippingAddress = {
            city: s.city || "",
            country: s.country || "",
            postalCode: s.postalCode || "",
            // Don't expose full street address publicly
          };
        }
      } else {
        safe[field] = order[field];
      }
    }
  }
  return safe;
}

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const orderId = params.get("orderId")?.trim();
  const email = params.get("email")?.trim().toLowerCase();

  if (!orderId && !email) {
    return NextResponse.json({ error: "Please provide an order ID or email" }, { status: 400 });
  }

  const orders = readOrders();

  let found: Record<string, unknown> | undefined;

  if (orderId) {
    // Search by order ID (case-insensitive)
    found = orders.find((o) =>
      (o.orderId as string || "").toLowerCase() === orderId.toLowerCase()
    );

    // If also provided email, verify it matches
    if (found && email) {
      const orderEmail = ((found.customer as Record<string, string>)?.email || "").toLowerCase();
      if (orderEmail !== email) {
        return NextResponse.json({ error: "Order ID and email do not match" }, { status: 404 });
      }
    }
  } else if (email) {
    // Search by email — return the most recent order for that email
    const matching = orders.filter((o) => {
      const orderEmail = ((o.customer as Record<string, string>)?.email || "").toLowerCase();
      return orderEmail === email;
    });
    // Sort by createdAt descending
    matching.sort((a, b) => {
      const dateA = new Date(a.createdAt as string || 0).getTime();
      const dateB = new Date(b.createdAt as string || 0).getTime();
      return dateB - dateA;
    });
    found = matching[0];
  }

  if (!found) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(sanitizeOrder(found));
}
