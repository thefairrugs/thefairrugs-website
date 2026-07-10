/**
 * POST /api/paypal/create-order
 *
 * Server-side: creates a PayPal Order via the Orders API v2.
 * PAYPAL_CLIENT_SECRET is never sent to the browser.
 *
 * Fixed:
 *  - country_code: full country name → proper ISO 3166-1 alpha-2 lookup
 *  - Removed `payer` object (causes 422 UNPROCESSABLE_ENTITY for card payments)
 *  - Changed landing_page from BILLING to LOGIN (compatible with both PayPal + card)
 *  - Returns exact PayPal API error body so the client can show it
 *  - Shipping address only sent when values are present and country is resolvable
 */

import { NextRequest, NextResponse } from "next/server";

// ── PayPal API base URL ────────────────────────────────────────────────────────
const PAYPAL_MODE   = process.env.PAYPAL_MODE || "live";
const PAYPAL_BASE   =
  PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

const PAYPAL_CLIENT_ID     = process.env.PAYPAL_CLIENT_ID     || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";

// ── ISO 3166-1 alpha-2 country lookup ─────────────────────────────────────────
// Maps common customer-entered country names/codes → 2-letter ISO code.
// If user already typed a 2-letter code (US, GB, DE…) it passes through directly.
const COUNTRY_MAP: Record<string, string> = {
  // Full names → ISO
  "united states":              "US",
  "united states of america":   "US",
  "usa":                        "US",
  "u.s.a.":                     "US",
  "u.s.":                       "US",
  "united kingdom":             "GB",
  "uk":                         "GB",
  "great britain":              "GB",
  "england":                    "GB",
  "scotland":                   "GB",
  "wales":                      "GB",
  "canada":                     "CA",
  "australia":                  "AU",
  "germany":                    "DE",
  "deutschland":                "DE",
  "france":                     "FR",
  "netherlands":                "NL",
  "holland":                    "NL",
  "italy":                      "IT",
  "spain":                      "ES",
  "portugal":                   "PT",
  "sweden":                     "SE",
  "norway":                     "NO",
  "denmark":                    "DK",
  "finland":                    "FI",
  "switzerland":                "CH",
  "austria":                    "AT",
  "belgium":                    "BE",
  "ireland":                    "IE",
  "new zealand":                "NZ",
  "singapore":                  "SG",
  "india":                      "IN",
  "japan":                      "JP",
  "china":                      "CN",
  "south korea":                "KR",
  "korea":                      "KR",
  "uae":                        "AE",
  "united arab emirates":       "AE",
  "saudi arabia":               "SA",
  "brazil":                     "BR",
  "mexico":                     "MX",
  "south africa":               "ZA",
  "israel":                     "IL",
  "poland":                     "PL",
  "czech republic":             "CZ",
  "czechia":                    "CZ",
  "hungary":                    "HU",
  "greece":                     "GR",
  "turkey":                     "TR",
  "russia":                     "RU",
  "ukraine":                    "UA",
  "indonesia":                  "ID",
  "malaysia":                   "MY",
  "thailand":                   "TH",
  "philippines":                "PH",
  "pakistan":                   "PK",
  "bangladesh":                 "BD",
  "sri lanka":                  "LK",
  "nepal":                      "NP",
  "qatar":                      "QA",
  "kuwait":                     "KW",
  "bahrain":                    "BH",
  "oman":                       "OM",
  "jordan":                     "JO",
  "egypt":                      "EG",
  "nigeria":                    "NG",
  "ghana":                      "GH",
  "kenya":                      "KE",
  "argentina":                  "AR",
  "chile":                      "CL",
  "colombia":                   "CO",
  "peru":                       "PE",
  "venezuela":                  "VE",
  "romania":                    "RO",
  "bulgaria":                   "BG",
  "croatia":                    "HR",
  "serbia":                     "RS",
  "slovakia":                   "SK",
  "slovenia":                   "SI",
  "estonia":                    "EE",
  "latvia":                     "LV",
  "lithuania":                  "LT",
  "luxembourg":                 "LU",
  "malta":                      "MT",
  "cyprus":                     "CY",
  "iceland":                    "IS",
  "hong kong":                  "HK",
  "taiwan":                     "TW",
  "vietnam":                    "VN",
  "myanmar":                    "MM",
  "cambodia":                   "KH",
  "morocco":                    "MA",
  "tunisia":                    "TN",
  "algeria":                    "DZ",
};

/** Resolve any country input to a 2-letter ISO 3166-1 alpha-2 code, or null. */
function resolveCountryCode(input: string): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  // Already a valid 2-letter code?
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();
  // 3-letter code or abbreviation — try the map
  const lower = trimmed.toLowerCase();
  return COUNTRY_MAP[lower] ?? null;
}

// ── OAuth2 access token ────────────────────────────────────────────────────────
async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured — check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.local");
  }
  const creds = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:  "POST",
    headers: { Authorization: `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
    body:    "grant_type=client_credentials",
    cache:   "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("[PayPal] Token error:", res.status, body);
    throw new Error(`PayPal OAuth failed (${res.status}): ${body}`);
  }
  return ((await res.json()) as { access_token: string }).access_token;
}

// ── CartItem type ──────────────────────────────────────────────────────────────
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

// ── POST ───────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      items: CartItem[];
      subtotal: number;
      customerInfo: {
        firstName:  string;
        lastName:   string;
        email:      string;
        phone:      string;
        address:    string;
        city:       string;
        country:    string;
        postalCode: string;
        notes:      string;
      };
    };

    const { items, subtotal, customerInfo } = body;

    // ── Validate ───────────────────────────────────────────────────────────────
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!subtotal || subtotal <= 0) {
      return NextResponse.json({ error: "Invalid subtotal" }, { status: 400 });
    }
    if (!customerInfo?.email || !customerInfo?.firstName) {
      return NextResponse.json({ error: "Customer information required" }, { status: 400 });
    }

    // ── Server-side total recalculation ───────────────────────────────────────
    const serverTotal   = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const serverRounded = Math.round(serverTotal * 100) / 100;
    if (Math.abs(serverRounded - subtotal) > 1) {
      console.error("[PayPal] Total mismatch — client:", subtotal, "server:", serverRounded);
      return NextResponse.json({ error: "Price mismatch. Refresh your cart and try again." }, { status: 400 });
    }
    const totalUSD = serverRounded.toFixed(2);

    // ── Line items ─────────────────────────────────────────────────────────────
    // PayPal requires each unit_amount to be exactly N decimal places with no
    // floating-point drift. Round to 2dp per item, then compute item_total from
    // the same rounded values so the breakdown sum matches exactly.
    const lineItems = items.map((item) => {
      const unitRounded = Math.round(item.unitPrice * 100) / 100;
      return {
        name:        `${item.productTitle} — ${item.sizeLabel}`.slice(0, 127),
        description: `${item.construction} · ${item.material}`.slice(0, 127),
        unit_amount: { currency_code: "USD", value: unitRounded.toFixed(2) },
        quantity:    String(item.quantity),
        category:    "PHYSICAL_GOODS" as const,
      };
    });

    // Recompute item_total from the same rounded unit prices to avoid off-by-1
    const itemTotalCents = items.reduce(
      (s, i) => s + Math.round(i.unitPrice * 100) * i.quantity,
      0
    );
    const itemTotal = (itemTotalCents / 100).toFixed(2);

    // ── Resolve country code ───────────────────────────────────────────────────
    const countryCode = resolveCountryCode(customerInfo.country);

    // ── Get access token ───────────────────────────────────────────────────────
    const accessToken = await getPayPalAccessToken();

    // ── Build purchase unit ────────────────────────────────────────────────────
    // IMPORTANT: Do NOT include a `payer` object at order creation time.
    // Providing `payer` causes PayPal to return 422 UNPROCESSABLE_ENTITY for
    // card payment flows because the card holder info conflicts with the pre-filled payer.
    //
    // IMPORTANT: shipping address is only included when we have a valid country_code.
    // An invalid country_code (e.g. "UN" from slicing "United States") causes
    // INVALID_REQUEST and is the primary reason card payments fail.
    const purchaseUnit: Record<string, unknown> = {
      reference_id: `FAIRRUGS-${Date.now()}`,
      description:  "Luxury Handmade Rugs — The Fair Rugs",
      amount: {
        currency_code: "USD",
        value: totalUSD,
        breakdown: {
          item_total: { currency_code: "USD", value: itemTotal },
          shipping:   { currency_code: "USD", value: "0.00" },
        },
      },
      items: lineItems,
    };

    // Only attach shipping when we have a valid 2-letter country code
    if (countryCode && customerInfo.address?.trim() && customerInfo.city?.trim()) {
      const shippingAddress: Record<string, string> = {
        address_line_1: customerInfo.address.trim(),
        admin_area_2:   customerInfo.city.trim(),
        country_code:   countryCode,
      };
      if (customerInfo.postalCode?.trim()) {
        shippingAddress.postal_code = customerInfo.postalCode.trim();
      }
      purchaseUnit.shipping = {
        name:    { full_name: `${customerInfo.firstName} ${customerInfo.lastName}` },
        address: shippingAddress,
      };
    } else if (!countryCode) {
      // Log so it's visible in server logs — but don't fail the order
      console.warn(
        "[PayPal] Could not resolve country code for:",
        JSON.stringify(customerInfo.country),
        "— shipping address omitted from order payload"
      );
    }

    const orderPayload = {
      intent:         "CAPTURE",
      purchase_units: [purchaseUnit],
      // application_context controls the PayPal redirect experience.
      // landing_page: "NO_PREFERENCE" works for both PayPal wallet and card buttons.
      // DO NOT use "BILLING" — it conflicts with the card payment redirect.
      application_context: {
        brand_name:          "The Fair Rugs",
        landing_page:        "NO_PREFERENCE",
        shipping_preference: countryCode ? "SET_PROVIDED_ADDRESS" : "GET_FROM_FILE",
        user_action:         "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://thefairrugs.com"}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://thefairrugs.com"}/checkout/cancel`,
      },
    };

    // ── Call PayPal Orders API v2 ──────────────────────────────────────────────
    const createRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method:  "POST",
      headers: {
        Authorization:     `Bearer ${accessToken}`,
        "Content-Type":    "application/json",
        "PayPal-Request-Id": `create-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        Prefer:            "return=representation",
      },
      body:  JSON.stringify(orderPayload),
      cache: "no-store",
    });

    // ── Always log the full PayPal response for debugging ─────────────────────
    const responseText = await createRes.text();
    if (!createRes.ok) {
      console.error(
        "[PayPal] Create order FAILED",
        "\n  status :", createRes.status,
        "\n  payload:", JSON.stringify(orderPayload, null, 2),
        "\n  response:", responseText
      );
      // Return the exact PayPal error details to the client
      let paypalError: unknown;
      try { paypalError = JSON.parse(responseText); } catch { paypalError = responseText; }
      return NextResponse.json(
        {
          error:   "PayPal order creation failed — see details",
          status:  createRes.status,
          details: paypalError,
        },
        { status: 502 }
      );
    }

    const order = JSON.parse(responseText) as { id: string };
    console.log("[PayPal] Order created:", order.id, "total:", totalUSD, "countryCode:", countryCode ?? "omitted");
    return NextResponse.json({ orderID: order.id });

  } catch (err) {
    console.error("[PayPal] create-order exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
