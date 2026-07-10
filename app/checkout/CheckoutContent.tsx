"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  FUNDING,
} from "@paypal/react-paypal-js";

// ── Types ──────────────────────────────────────────────────────────────────────
interface CustomerForm {
  firstName:  string;
  lastName:   string;
  email:      string;
  phone:      string;
  address:    string;
  city:       string;
  country:    string;
  postalCode: string;
  notes:      string;
}

const EMPTY_FORM: CustomerForm = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", city: "", country: "", postalCode: "", notes: "",
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const inputSt: React.CSSProperties = {
  width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)",
  borderRadius: "8px", fontSize: "14px", outline: "none",
  color: "var(--foreground)", background: "#fff", boxSizing: "border-box",
};
const labelSt: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  color: "var(--foreground-muted)", marginBottom: "6px",
};

// ── PayPal SDK loading indicator ───────────────────────────────────────────────
function PayPalLoadingBar() {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  if (isRejected) return (
    <div style={{ padding: "12px 16px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px", fontSize: "13px", color: "#dc2626" }}>
      ⚠️ Failed to load PayPal. Check your internet connection and reload the page.
    </div>
  );
  if (isPending) return (
    <div style={{ textAlign: "center", padding: "18px", color: "var(--foreground-muted)", fontSize: "14px" }}>
      Loading secure payment…
    </div>
  );
  return null;
}

// ── Inner form — must be inside PayPalScriptProvider ──────────────────────────
function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [{ isResolved }] = usePayPalScriptReducer();

  const [form,        setForm]        = useState<CustomerForm>(EMPTY_FORM);
  const [formValid,   setFormValid]   = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [error,       setError]       = useState("");
  const [processing,  setProcessing]  = useState(false);

  // Track whether the card button is eligible for this account/region.
  // null = not yet checked | true = show card button | false = hide it
  const [cardEligible, setCardEligible] = useState<boolean | null>(null);

  // Use a ref to always have the latest form inside PayPal callbacks
  // (avoids stale-closure bug where callbacks capture old form state)
  const formRef = useRef<CustomerForm>(EMPTY_FORM);
  useEffect(() => { formRef.current = form; }, [form]);

  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  const subtotalRef = useRef(subtotal);
  useEffect(() => { subtotalRef.current = subtotal; }, [subtotal]);

  // ── Validate ──────────────────────────────────────────────────────────────
  const validateForm = useCallback((f: CustomerForm): boolean =>
    !!(f.firstName.trim() && f.lastName.trim() &&
       f.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) &&
       f.address.trim() && f.city.trim() && f.country.trim()),
  []);

  const handleField = (field: keyof CustomerForm, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    setFormValid(validateForm(updated));
  };

  // ── Check card funding eligibility after SDK loads ─────────────────────────
  // IMPORTANT: Do NOT call isFundingEligible("card") as a string — use the
  // same constant the SDK uses internally ("card") after SDK resolves.
  useEffect(() => {
    if (!isResolved || cardEligible !== null) return;
    try {
      type PayPalWindow = { paypal?: { isFundingEligible?: (s: string) => boolean } };
      const pp = (window as unknown as PayPalWindow).paypal;
      if (typeof pp?.isFundingEligible === "function") {
        const eligible = pp.isFundingEligible("card");
        console.log("[PayPal] FUNDING.CARD eligible:", eligible);
        setCardEligible(eligible);
      } else {
        setCardEligible(true); // assume available if check not possible
      }
    } catch (e) {
      console.warn("[PayPal] eligibility check error:", e);
      setCardEligible(true);
    }
  }, [isResolved, cardEligible]);

  // ── createOrder — called by SDK when any PayPal button is clicked ──────────
  // CRITICAL: must return a Promise<string> (the orderID).
  // Any throw here is caught by the SDK and re-thrown as paypal_js_sdk_v5_unhandled_exception.
  // We must NOT throw validation errors here — validate before the button is clickable.
  const createOrder = useCallback(async (): Promise<string> => {
    const currentForm  = formRef.current;
    const currentItems = itemsRef.current;
    const currentTotal = subtotalRef.current;

    setError("");

    const res = await fetch("/api/paypal/create-order", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        items:        currentItems,
        subtotal:     currentTotal,
        customerInfo: currentForm,
      }),
    });

    const data = await res.json() as {
      orderID?: string;
      error?:   string;
      status?:  number;
      details?: unknown;
    };

    if (!res.ok || !data.orderID) {
      const detail = JSON.stringify(data.details ?? data.error ?? "unknown");
      const msg    = `PayPal order creation failed (${data.status ?? res.status}): ${detail}`;
      console.error("[PayPal] create-order failed:", msg);
      // Set error in state so the user sees it on the page
      setError(`Order creation failed. ${data.error ?? detail}`);
      // Throw so SDK knows it failed — SDK will call onError
      throw new Error(msg);
    }

    console.log("[PayPal] Order created:", data.orderID);
    return data.orderID;
  }, []); // no deps — reads from refs

  // ── onApprove — called by SDK after buyer approves payment ────────────────
  // CRITICAL: must NOT throw. Any unhandled throw here becomes paypal_js_sdk_v5_unhandled_exception.
  // Must return Promise<void>.
  const onApprove = useCallback(async (data: { orderID: string }): Promise<void> => {
    const currentForm  = formRef.current;
    const currentItems = itemsRef.current;
    const currentTotal = subtotalRef.current;

    setError("");
    setProcessing(true);

    try {
      const res    = await fetch("/api/paypal/capture-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          orderID:      data.orderID,
          customerInfo: currentForm,
          items:        currentItems,
          subtotal:     currentTotal,
        }),
      });

      const result = await res.json() as {
        success?:        boolean;
        orderId?:        string;
        transactionId?:  string;
        amount?:         number;
        currency?:       string;
        paymentMethod?:  string;
        error?:          string;
      };

      if (!res.ok || !result.success) {
        const msg = result.error || "Payment capture failed. Please contact support.";
        console.error("[PayPal] Capture failed:", res.status, msg);
        setError(msg);
        setProcessing(false);
        router.push(`/checkout/error?reason=${encodeURIComponent(msg)}`);
        return;
      }

      // Success — clear cart first, then navigate
      clearCart();
      const params = new URLSearchParams({
        orderId:        result.orderId        ?? "",
        transactionId:  result.transactionId  ?? "",
        amount:         String(result.amount  ?? currentTotal),
        currency:       result.currency       ?? "USD",
        paymentMethod:  result.paymentMethod  ?? "PayPal",
        email:          currentForm.email,
        name:           `${currentForm.firstName} ${currentForm.lastName}`,
      });
      router.push(`/checkout/success?${params.toString()}`);

    } catch (err) {
      // Catch EVERYTHING — no unhandled rejection must escape onApprove
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("[PayPal] onApprove exception:", err);
      setError(msg);
      setProcessing(false);
      router.push(`/checkout/error?reason=${encodeURIComponent(msg)}`);
    }
  }, [clearCart, router]); // reads form/items/subtotal from refs

  // ── onCancel ──────────────────────────────────────────────────────────────
  const onCancel = useCallback((): void => {
    console.log("[PayPal] Payment cancelled by user");
    setProcessing(false);
    router.push("/checkout/cancel");
  }, [router]);

  // ── onError — SDK-level errors (network, SDK init, etc.) ─────────────────
  // CRITICAL: must NOT throw. Return void.
  const onError = useCallback((err: Record<string, unknown>): void => {
    console.error("[PayPal] SDK onError event:", JSON.stringify(err));
    setProcessing(false);
    // Only redirect if the error is not already shown
    const msg = "A PayPal error occurred. Please try again or contact us via WhatsApp.";
    setError(msg);
    // Don't redirect on SDK errors — let the user retry on the same page
  }, []);

  // ── Shared props for both buttons ─────────────────────────────────────────
  const sharedButtonProps = {
    createOrder,
    onApprove,
    onCancel,
    onError,
    // forceReRender ensures callbacks re-bind if key deps change
    forceReRender: [formValid] as unknown[],
    // Disable the button while a payment is processing
    disabled: processing,
  };

  // ── Empty cart guard ──────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "60px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>🧶</div>
        <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "36px", fontWeight: 300, color: "var(--foreground)", marginBottom: "16px" }}>
          Your cart is empty
        </h1>
        <Link href="/shop" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary" style={{ padding: "16px 48px" }}>Browse Collection</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--background)", padding: "60px 0 100px" }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--foreground-muted)", marginBottom: "36px" }}>
          <Link href="/cart" style={{ color: "var(--foreground-muted)" }}>Cart</Link>
          <span>›</span>
          <span style={{ color: "var(--foreground)", fontWeight: 600 }}>Checkout</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }}>

          {/* ── Left column ──────────────────────────────────────────────── */}
          <div>
            <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "40px", fontWeight: 300, color: "var(--foreground)", marginBottom: "36px" }}>
              Checkout
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

              {/* Contact */}
              <section>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                  Contact Information
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {([
                    { key: "firstName" as const, label: "First Name *",     required: true,  type: "text"  },
                    { key: "lastName"  as const, label: "Last Name *",      required: true,  type: "text"  },
                    { key: "email"     as const, label: "Email *",          required: true,  type: "email" },
                    { key: "phone"     as const, label: "Phone / WhatsApp", required: false, type: "tel"   },
                  ] as const).map(({ key, label, required, type }) => (
                    <div key={key}>
                      <label style={labelSt}>{label}</label>
                      <input
                        type={type}
                        required={required}
                        value={form[key]}
                        onChange={(e) => handleField(key, e.target.value)}
                        placeholder={key === "phone" ? "+1 234 567 8900" : undefined}
                        style={{
                          ...inputSt,
                          borderColor: formTouched && required && !form[key].trim() ? "#dc2626" : undefined,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Shipping */}
              <section>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                  Shipping Address
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={labelSt}>Street Address *</label>
                    <input
                      required
                      value={form.address}
                      onChange={(e) => handleField("address", e.target.value)}
                      placeholder="123 Main Street, Apt 4B"
                      style={{ ...inputSt, borderColor: formTouched && !form.address.trim() ? "#dc2626" : undefined }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={labelSt}>City *</label>
                      <input
                        required
                        value={form.city}
                        onChange={(e) => handleField("city", e.target.value)}
                        style={{ ...inputSt, borderColor: formTouched && !form.city.trim() ? "#dc2626" : undefined }}
                      />
                    </div>
                    <div>
                      <label style={labelSt}>Postal Code</label>
                      <input
                        value={form.postalCode}
                        onChange={(e) => handleField("postalCode", e.target.value)}
                        style={inputSt}
                      />
                    </div>
                    <div>
                      <label style={labelSt}>Country *</label>
                      <input
                        required
                        value={form.country}
                        onChange={(e) => handleField("country", e.target.value)}
                        placeholder="United States"
                        style={{ ...inputSt, borderColor: formTouched && !form.country.trim() ? "#dc2626" : undefined }}
                      />
                      <p style={{ fontSize: "11px", color: "var(--foreground-muted)", marginTop: "4px", marginBottom: 0 }}>
                        Full name or 2-letter code (US, GB, AU…)
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Notes */}
              <div>
                <label style={labelSt}>Order Notes (optional)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => handleField("notes", e.target.value)}
                  placeholder="Special requests, colour preferences, installation notes…"
                  style={{ ...inputSt, resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              {/* Payment */}
              <section>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                  Payment
                </h2>

                {/* Secure badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#f0f7ff", border: "1px solid #bfdbfe", borderRadius: "8px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "20px" }}>🔒</span>
                  <p style={{ margin: 0, fontSize: "13px", color: "#1e40af" }}>
                    <strong>Secure Checkout via PayPal</strong> — Pay with your PayPal account
                    {cardEligible !== false && ", credit card, or debit card"}.
                    All transactions are encrypted.
                  </p>
                </div>

                {/* Form incomplete warning */}
                {!formValid && (
                  <div style={{ padding: "12px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", color: "#92400e" }}>
                    ⚠️ Please complete all required fields above (*) to enable payment.
                  </div>
                )}

                {/* Processing overlay */}
                {processing && (
                  <div style={{ padding: "14px 16px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", color: "#0369a1", fontWeight: 600 }}>
                    ⏳ Processing your payment — please wait…
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{ padding: "12px 16px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px", marginBottom: "16px", color: "#dc2626", fontSize: "14px", fontWeight: 600 }}>
                    ⚠️ {error}
                  </div>
                )}

                {/*
                  ─── PayPal Buttons ────────────────────────────────────────
                  IMPORTANT: components="buttons" ONLY — no "card-fields".

                  When "card-fields" is added to the components URL param, the
                  PayPal JS SDK changes the behaviour of FUNDING.CARD:
                    - It tries to render inline card fields (CardFields mode)
                    - It expects a <PayPalCardFieldsProvider> to be mounted
                    - When no provider is found, it throws:
                        paypal_js_sdk_v5_unhandled_exception {}

                  With components="buttons" only, FUNDING.CARD opens the
                  standard PayPal-hosted card entry popup — no inline fields,
                  no CardFieldsProvider needed, no crash. Works on all accounts.
                */}
                <div
                  style={{ opacity: formValid && !processing ? 1 : 0.45, pointerEvents: formValid && !processing ? "auto" : "none", transition: "opacity 0.2s" }}
                  onClick={() => { if (!formValid) setFormTouched(true); }}
                >
                  <PayPalLoadingBar />

                  {/* PayPal Wallet button */}
                  <PayPalButtons
                    fundingSource={FUNDING.PAYPAL}
                    style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 48 }}
                    {...sharedButtonProps}
                  />

                  {/* Credit / Debit Card button (shown when eligible) */}
                  {cardEligible !== false && (
                    <div style={{ marginTop: "10px" }}>
                      <PayPalButtons
                        fundingSource={FUNDING.CARD}
                        style={{ layout: "vertical", color: "black", shape: "rect", label: "pay", height: 48 }}
                        {...sharedButtonProps}
                      />
                    </div>
                  )}

                  {cardEligible === false && (
                    <div style={{ marginTop: "12px", padding: "12px 16px", background: "#f8f6f0", border: "1px solid var(--border-light)", borderRadius: "8px", fontSize: "13px", color: "var(--foreground-muted)" }}>
                      Credit/Debit Card is not available for your account or region. Please use the PayPal button above or contact us via WhatsApp.
                    </div>
                  )}
                </div>

                {/* WhatsApp fallback */}
                <div style={{ padding: "14px 20px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "12px", marginTop: "16px" }}>
                  <p style={{ fontSize: "13px", color: "#166534", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                    <span>💬</span>
                    <span>
                      Prefer WhatsApp?{" "}
                      <a href="https://wa.me/918416919470" target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", fontWeight: 700 }}>
                        Chat with us
                      </a>{" "}
                      to place your order directly.
                    </span>
                  </p>
                </div>
              </section>

              <p style={{ fontSize: "11px", color: "var(--foreground-muted)", textAlign: "center", lineHeight: 1.6 }}>
                By placing an order you agree to our{" "}
                <Link href="/terms" style={{ color: "var(--primary)" }}>Terms & Conditions</Link>.
                All rugs are custom-made to order. No refunds on custom items.
              </p>
            </div>
          </div>

          {/* ── Right column: Order Summary ───────────────────────────────── */}
          <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", padding: "28px", position: "sticky", top: "100px" }}>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "24px", fontWeight: 500, color: "var(--foreground)", marginBottom: "20px" }}>
              Your Order
            </h2>

            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "6px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                  <Image src={item.productImage} alt={item.productTitle} fill sizes="60px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3, margin: 0 }}>
                    {item.productTitle}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--foreground-muted)", marginTop: "3px", marginBottom: 0 }}>
                    {item.sizeLabel} · Qty {item.quantity}
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", marginTop: "4px", marginBottom: 0 }}>
                    ${Math.round(item.unitPrice * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--foreground-muted)", marginBottom: "8px" }}>
                <span>Shipping</span>
                <span style={{ color: "#16a34a", fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: 800, color: "var(--foreground)", marginTop: "12px" }}>
                <span>Total</span>
                <span>${Math.round(subtotal).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                {["🔒 SSL Secure", "✓ PayPal Protected", "🌍 Free Shipping"].map((b) => (
                  <span key={b} style={{ fontSize: "11px", color: "var(--foreground-muted)", background: "var(--background)", padding: "4px 10px", borderRadius: "20px", border: "1px solid var(--border-light)" }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────────
export default function CheckoutContent() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent:   "capture",
        // ── CRITICAL: components="buttons" ONLY ────────────────────────────
        // Do NOT add "card-fields" here.
        //
        // With "card-fields" in components, the SDK changes FUNDING.CARD
        // from a popup-based checkout into an inline CardFields renderer.
        // Since we do not mount <PayPalCardFieldsProvider>, the SDK throws:
        //   paypal_js_sdk_v5_unhandled_exception {}
        //
        // With "buttons" only, FUNDING.CARD opens a PayPal-hosted popup for
        // card entry — works on all merchant accounts, zero crash.
        components: "buttons",
      }}
    >
      <CheckoutForm />
    </PayPalScriptProvider>
  );
}
