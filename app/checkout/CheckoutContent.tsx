"use client";

import { useState, useCallback, useEffect } from "react";
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
  // null = not yet probed; true = card funding available; false = not available
  const [cardAvailable, setCardAvailable] = useState<boolean | null>(null);

  // ── Validate required fields ──────────────────────────────────────────────
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

  // ── After SDK loads, probe whether CARD funding is eligible ───────────────
  // PayPal exposes window.paypal.isFundingEligible() once the SDK is ready.
  useEffect(() => {
    if (!isResolved || cardAvailable !== null) return;
    try {
      const pp = (window as unknown as { paypal?: { isFundingEligible?: (f: string) => boolean } }).paypal;
      if (pp?.isFundingEligible) {
        const eligible = pp.isFundingEligible("card");
        console.log("[PayPal] card funding eligible:", eligible);
        setCardAvailable(eligible);
      } else {
        // isFundingEligible not exposed — assume available, let SDK decide
        setCardAvailable(true);
      }
    } catch (e) {
      console.warn("[PayPal] isFundingEligible check failed:", e);
      setCardAvailable(true);
    }
  }, [isResolved, cardAvailable]);

  // ── createOrder — shared by both PayPal wallet and Card buttons ───────────
  const createOrder = useCallback(async (): Promise<string> => {
    setError("");
    if (!validateForm(form)) {
      setFormTouched(true);
      throw new Error("Please fill in all required fields first.");
    }
    if (items.length === 0) throw new Error("Your cart is empty.");

    const res  = await fetch("/api/paypal/create-order", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ items, subtotal, customerInfo: form }),
    });
    const data = await res.json() as {
      orderID?: string;
      error?:   string;
      status?:  number;
      details?: unknown;
    };

    if (!res.ok || !data.orderID) {
      // Log full details — visible in browser console AND server logs
      const detail = JSON.stringify(data.details ?? data.error ?? "unknown");
      console.error("[PayPal] create-order failed:", res.status, detail);
      throw new Error(
        `PayPal order creation failed (HTTP ${data.status ?? res.status}): ${detail}`
      );
    }
    return data.orderID;
  }, [form, items, subtotal, validateForm]);

  // ── onApprove — shared capture flow ──────────────────────────────────────
  const onApprove = useCallback(async (data: { orderID: string }) => {
    setError("");
    try {
      const res    = await fetch("/api/paypal/capture-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ orderID: data.orderID, customerInfo: form, items, subtotal }),
      });
      const result = await res.json() as {
        success?: boolean; orderId?: string; transactionId?: string;
        amount?: number; currency?: string; error?: string;
      };
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Payment capture failed. Please contact support.");
      }
      clearCart();
      const params = new URLSearchParams({
        orderId:       result.orderId       || "",
        transactionId: result.transactionId || "",
        amount:        String(result.amount ?? subtotal),
        currency:      result.currency      || "USD",
        email:         form.email,
        name:          `${form.firstName} ${form.lastName}`,
      });
      router.push(`/checkout/success?${params.toString()}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setError(msg);
      router.push(`/checkout/error?reason=${encodeURIComponent(msg)}`);
    }
  }, [form, items, subtotal, clearCart, router]);

  const onCancel = useCallback(() => router.push("/checkout/cancel"), [router]);

  const onError = useCallback((err: Record<string, unknown>) => {
    const detail = JSON.stringify(err);
    console.error("[PayPal] SDK onError:", detail);
    const msg = "A PayPal error occurred. Please try again or use a different payment method.";
    setError(msg);
    router.push(`/checkout/error?reason=${encodeURIComponent(msg)}`);
  }, [router]);

  // ── Shared button props ───────────────────────────────────────────────────
  const buttonProps = {
    createOrder,
    onApprove,
    onCancel,
    onError,
    forceReRender: [subtotal, form.email] as unknown[],
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

          {/* ── Left: Form ─────────────────────────────────────────────────── */}
          <div>
            <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "40px", fontWeight: 300, color: "var(--foreground)", marginBottom: "36px" }}>
              Checkout
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

              {/* Contact Information */}
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                  Contact Information
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { key: "firstName" as const, label: "First Name *",      required: true,  type: "text" },
                    { key: "lastName"  as const, label: "Last Name *",       required: true,  type: "text" },
                    { key: "email"     as const, label: "Email *",           required: true,  type: "email" },
                    { key: "phone"     as const, label: "Phone / WhatsApp",  required: false, type: "tel" },
                  ].map(({ key, label, required, type }) => (
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
              </div>

              {/* Shipping Address */}
              <div>
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
                      <p style={{ fontSize: "11px", color: "var(--foreground-muted)", marginTop: "4px" }}>
                        Enter full name or 2-letter code (US, GB, AU…)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
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
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                  Payment
                </h2>

                {/* Security badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#f0f7ff", border: "1px solid #bfdbfe", borderRadius: "8px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "20px" }}>🔒</span>
                  <p style={{ margin: 0, fontSize: "13px", color: "#1e40af" }}>
                    <strong>Secure Checkout</strong> — Pay with PayPal
                    {cardAvailable !== false && " or Credit / Debit Card"}.
                    All transactions are encrypted.
                  </p>
                </div>

                {/* Form incomplete warning */}
                {!formValid && (
                  <div style={{ padding: "12px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", color: "#92400e" }}>
                    ⚠️ Complete all required fields above (*) to enable payment.
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{ padding: "12px 16px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px", marginBottom: "16px", color: "#dc2626", fontSize: "14px", fontWeight: 600 }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* Payment buttons — dimmed until form valid */}
                <div style={{ opacity: formValid ? 1 : 0.45, pointerEvents: formValid ? "auto" : "none", transition: "opacity 0.2s" }}>
                  <PayPalLoadingBar />

                  {/* ── PayPal Wallet button ────────────────────────────── */}
                  <PayPalButtons
                    fundingSource={FUNDING.PAYPAL}
                    style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 48 }}
                    {...buttonProps}
                  />

                  {/* ── Credit / Debit Card button ──────────────────────── */}
                  {/* Rendered only when card funding is eligible for this account/country.
                      Uses FUNDING.CARD which triggers PayPal's standard card checkout
                      (redirect flow — no Hosted Fields required, works on all accounts). */}
                  {cardAvailable !== false && (
                    <div style={{ marginTop: "10px" }}>
                      <PayPalButtons
                        fundingSource={FUNDING.CARD}
                        style={{ layout: "vertical", color: "black", shape: "rect", label: "pay", height: 48 }}
                        {...buttonProps}
                      />
                    </div>
                  )}

                  {/* Card not available notice */}
                  {cardAvailable === false && (
                    <div style={{ marginTop: "12px", padding: "12px 16px", background: "#f8f6f0", border: "1px solid var(--border-light)", borderRadius: "8px", fontSize: "13px", color: "var(--foreground-muted)" }}>
                      Credit/Debit Card checkout is not available in your region — please use the PayPal button above, or contact us via WhatsApp.
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
              </div>

              <p style={{ fontSize: "11px", color: "var(--foreground-muted)", textAlign: "center", lineHeight: 1.6 }}>
                By placing an order you agree to our{" "}
                <Link href="/terms" style={{ color: "var(--primary)" }}>Terms & Conditions</Link>.
                All rugs are custom-made to order. No refunds on custom items.
              </p>
            </div>
          </div>

          {/* ── Right: Order Summary ────────────────────────────────────────── */}
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
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3, margin: 0 }}>{item.productTitle}</p>
                  <p style={{ fontSize: "11px", color: "var(--foreground-muted)", marginTop: "3px", marginBottom: 0 }}>{item.sizeLabel} · Qty {item.quantity}</p>
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
                {["🔒 SSL Secure", "✓ PayPal Protected", "🌍 Free Shipping"].map((badge) => (
                  <span key={badge} style={{ fontSize: "11px", color: "var(--foreground-muted)", background: "var(--background)", padding: "4px 10px", borderRadius: "20px", border: "1px solid var(--border-light)" }}>
                    {badge}
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

// ── Root export — wraps in PayPalScriptProvider ────────────────────────────────
export default function CheckoutContent() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency:         "USD",
        intent:           "capture",
        // Include both "buttons" and "card-fields" components.
        // "buttons" renders PayPal + card buttons.
        // "card-fields" is needed if we ever upgrade to Hosted Card Fields.
        // Having it here does NOT break anything for accounts without Advanced Cards.
        components:       "buttons,card-fields",
        // "enable-funding=card" explicitly requests the card button to be rendered.
        // Without this, PayPal may suppress the card button in some regions/accounts.
        "enable-funding": "card",
      }}
    >
      <CheckoutForm />
    </PayPalScriptProvider>
  );
}
