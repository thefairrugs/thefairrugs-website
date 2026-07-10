/**
 * POST /api/paypal/create-order
 *
 * Server-side route — creates a PayPal Order via the PayPal Orders API v2.
 * The PayPal Client Secret is NEVER sent to the browser.
 *
 * Request body:
 *   {
 *     items:    CartItem[]   (from CartContext)
 *     subtotal: number       (total in USD, matches sum of item prices)
 *     customerInfo: {        (form data from checkout)
 *       firstName, lastName, email, phone,
 *       address, city, country, postalCode, notes
 *     }
 *   }
 *
 * Response:
 *   { orderID: string }   — the PayPal order ID used by the frontend SDK
 */

import { NextRequest, NextResponse } from "next/server";

// ── PayPal API base URL ────────────────────────────────────────────────────────
const PAYPAL_MODE = process.env.PAYPAL_MODE || "live";
const PAYPAL_BASE =
  PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

const PAYPAL_CLIENT_ID     = process.env.PAYPAL_CLIENT_ID     || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";

// ── Get OAuth2 access token ────────────────────────────────────────────────────
async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.local");
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

  if (!res.ok) {
    const err = await res.text();
    console.error("[PayPal] Token error:", res.status, err);
    throw new Error(`PayPal auth failed: ${res.status}`);
  }

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

// ── CartItem type (matches CartContext) ────────────────────────────────────────
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

// ── POST handler ───────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      items: CartItem[];
      subtotal: number;
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
    };

    const { items, subtotal, customerInfo } = body;

    // ── Validate input ─────────────────────────────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!subtotal || subtotal <= 0) {
      return NextResponse.json({ error: "Invalid subtotal" }, { status: 400 });
    }
    if (!customerInfo?.email || !customerInfo?.firstName) {
      return NextResponse.json({ error: "Customer information required" }, { status: 400 });
    }

    // ── Server-side total recalculation (security: never trust client total) ──
    const serverTotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const serverTotalRounded = Math.round(serverTotal * 100) / 100;

    // Sanity-check: allow up to $1 rounding difference
    if (Math.abs(serverTotalRounded - subtotal) > 1) {
      console.error("[PayPal] Total mismatch — client:", subtotal, "server:", serverTotalRounded);
      return NextResponse.json({ error: "Price mismatch. Please refresh your cart and try again." }, { status: 400 });
    }

    // Use server-calculated total (not client-provided) for security
    const totalUSD = serverTotalRounded.toFixed(2);

    // ── Build PayPal line items ────────────────────────────────────────────────
    const lineItems = items.map((item) => ({
      name: `${item.productTitle} — ${item.sizeLabel}`.slice(0, 127),
      description: `${item.construction} · ${item.material}`.slice(0, 127),
      unit_amount: {
        currency_code: "USD",
        value: item.unitPrice.toFixed(2),
      },
      quantity: String(item.quantity),
      category: "PHYSICAL_GOODS",
    }));

    // PayPal requires item_total to exactly match sum of line items
    const itemTotal = items
      .reduce((s, i) => s + i.unitPrice * i.quantity, 0)
      .toFixed(2);

    // ── Get access token ───────────────────────────────────────────────────────
    const accessToken = await getPayPalAccessToken();

    // ── Create PayPal Order via Orders API v2 ─────────────────────────────────
    const orderPayload = {
      intent: "CAPTURE",
      payer: {
        name: {
          given_name: customerInfo.firstName,
          surname: customerInfo.lastName,
        },
        email_address: customerInfo.email,
      },
      purchase_units: [
        {
          reference_id: `FAIRRUGS-${Date.now()}`,
          description: "Luxury Handmade Rugs — The Fair Rugs",
          amount: {
            currency_code: "USD",
            value: totalUSD,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: itemTotal,
              },
              shipping: {
                currency_code: "USD",
                value: "0.00",
              },
            },
          },
          items: lineItems,
          shipping: {
            name: {
              full_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            },
            address: {
              address_line_1: customerInfo.address,
              admin_area_2: customerInfo.city,
              postal_code: customerInfo.postalCode,
              country_code: customerInfo.country.slice(0, 2).toUpperCase(),
            },
          },
        },
      ],
      application_context: {
        brand_name: "The Fair Rugs",
        landing_page: "BILLING",         // Show credit card option by default
        shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://thefairrugs.com"}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://thefairrugs.com"}/checkout/cancel`,
      },
    };

    const createRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `create-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(orderPayload),
      cache: "no-store",
    });

    if (!createRes.ok) {
      const errBody = await createRes.text();
      console.error("[PayPal] Create order error:", createRes.status, errBody);
      return NextResponse.json(
        { error: "Failed to create PayPal order. Please try again." },
        { status: 502 }
      );
    }

    const order = await createRes.json() as { id: string };
    console.log("[PayPal] Order created:", order.id, "amount:", totalUSD);

    return NextResponse.json({ orderID: order.id });
  } catch (err) {
    console.error("[PayPal] create-order error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
