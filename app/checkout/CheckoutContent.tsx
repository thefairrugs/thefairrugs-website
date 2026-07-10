"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// ── Types ──────────────────────────────────────────────────────────────────────
interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  notes: string;
}

const emptyForm: CustomerForm = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", city: "", country: "", postalCode: "", notes: "",
};

// ── Shared styles ──────────────────────────────────────────────────────────────
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

// ── PayPal button loader indicator ────────────────────────────────────────────
function PayPalLoading() {
  const [{ isPending }] = usePayPalScriptReducer();
  if (!isPending) return null;
  return (
    <div style={{ textAlign: "center", padding: "20px", color: "var(--foreground-muted)", fontSize: "14px" }}>
      Loading PayPal…
    </div>
  );
}

// ── Inner checkout (needs PayPalScriptProvider context) ────────────────────────
function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [formValid, setFormValid] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [error, setError] = useState("");
  const [paypalReady, setPaypalReady] = useState(false);

  // Validate all required fields
  const validateForm = useCallback((f: CustomerForm): boolean => {
    return !!(
      f.firstName.trim() &&
      f.lastName.trim() &&
      f.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) &&
      f.address.trim() &&
      f.city.trim() &&
      f.country.trim()
    );
  }, []);

  const handleFieldChange = (field: keyof CustomerForm, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    const valid = validateForm(updated);
    setFormValid(valid);
    if (valid && !paypalReady) setPaypalReady(true);
    if (!valid && paypalReady) setPaypalReady(false);
  };

  // ── PayPal createOrder callback ────────────────────────────────────────────
  const handleCreateOrder = useCallback(async (): Promise<string> => {
    setError("");
    if (!validateForm(form)) {
      setFormTouched(true);
      throw new Error("Please complete all required fields before proceeding.");
    }
    if (items.length === 0) {
      throw new Error("Your cart is empty.");
    }

    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        subtotal,
        customerInfo: form,
      }),
    });

    const data = await res.json() as { orderID?: string; error?: string };

    if (!res.ok || !data.orderID) {
      throw new Error(data.error || "Failed to create PayPal order. Please try again.");
    }

    return data.orderID;
  }, [form, items, subtotal, validateForm]);

  // ── PayPal onApprove callback (payment approved by user → capture on server) ─
  const handleApprove = useCallback(async (data: { orderID: string }) => {
    setError("");
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: data.orderID,
          customerInfo: form,
          items,
          subtotal,
        }),
      });

      const result = await res.json() as {
        success?: boolean;
        orderId?: string;
        transactionId?: string;
        amount?: number;
        currency?: string;
        error?: string;
      };

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Payment capture failed. Please contact support.");
      }

      // Payment captured — clear cart and redirect to success page
      clearCart();
      const params = new URLSearchParams({
        orderId: result.orderId || "",
        transactionId: result.transactionId || "",
        amount: String(result.amount || subtotal),
        currency: result.currency || "USD",
        email: form.email,
        name: `${form.firstName} ${form.lastName}`,
      });
      router.push(`/checkout/success?${params.toString()}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setError(message);
      router.push(`/checkout/error?reason=${encodeURIComponent(message)}`);
    }
  }, [form, items, subtotal, clearCart, router]);

  // ── PayPal onCancel callback ────────────────────────────────────────────────
  const handleCancel = useCallback(() => {
    router.push("/checkout/cancel");
  }, [router]);

  // ── PayPal onError callback ─────────────────────────────────────────────────
  const handleError = useCallback((err: Record<string, unknown>) => {
    console.error("[PayPal] SDK error:", err);
    const message = "A PayPal error occurred. Please try again or use a different payment method.";
    setError(message);
    router.push(`/checkout/error?reason=${encodeURIComponent(message)}`);
  }, [router]);

  // ── Empty cart ─────────────────────────────────────────────────────────────
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
              {/* Contact Info */}
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                  Contact Information
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelSt}>First Name *</label>
                    <input
                      required
                      value={form.firstName}
                      onChange={(e) => handleFieldChange("firstName", e.target.value)}
                      style={{ ...inputSt, borderColor: formTouched && !form.firstName.trim() ? "#dc2626" : undefined }}
                    />
                  </div>
                  <div>
                    <label style={labelSt}>Last Name *</label>
                    <input
                      required
                      value={form.lastName}
                      onChange={(e) => handleFieldChange("lastName", e.target.value)}
                      style={{ ...inputSt, borderColor: formTouched && !form.lastName.trim() ? "#dc2626" : undefined }}
                    />
                  </div>
                  <div>
                    <label style={labelSt}>Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      style={{ ...inputSt, borderColor: formTouched && (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) ? "#dc2626" : undefined }}
                    />
                  </div>
                  <div>
                    <label style={labelSt}>Phone / WhatsApp</label>
                    <input
                      value={form.phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      style={inputSt}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
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
                      onChange={(e) => handleFieldChange("address", e.target.value)}
                      style={{ ...inputSt, borderColor: formTouched && !form.address.trim() ? "#dc2626" : undefined }}
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={labelSt}>City *</label>
                      <input
                        required
                        value={form.city}
                        onChange={(e) => handleFieldChange("city", e.target.value)}
                        style={{ ...inputSt, borderColor: formTouched && !form.city.trim() ? "#dc2626" : undefined }}
                      />
                    </div>
                    <div>
                      <label style={labelSt}>Postal Code</label>
                      <input
                        value={form.postalCode}
                        onChange={(e) => handleFieldChange("postalCode", e.target.value)}
                        style={inputSt}
                      />
                    </div>
                    <div>
                      <label style={labelSt}>Country *</label>
                      <input
                        required
                        value={form.country}
                        onChange={(e) => handleFieldChange("country", e.target.value)}
                        style={{ ...inputSt, borderColor: formTouched && !form.country.trim() ? "#dc2626" : undefined }}
                        placeholder="United States"
                      />
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
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                  placeholder="Special requests, colour preferences, installation notes…"
                  style={{ ...inputSt, resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              {/* Payment Section */}
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                  Payment
                </h2>

                {/* PayPal secure badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#f0f7ff", border: "1px solid #bfdbfe", borderRadius: "8px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "20px" }}>🔒</span>
                  <p style={{ margin: 0, fontSize: "13px", color: "#1e40af" }}>
                    <strong>Secure Payment via PayPal</strong> — Pay with your PayPal account, credit card, or debit card. All transactions are encrypted and protected.
                  </p>
                </div>

                {/* Form validation hint */}
                {!formValid && (
                  <div style={{ padding: "12px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", color: "#92400e" }}>
                    ⚠️ Please fill in all required fields above (marked with *) to enable payment.
                  </div>
                )}

                {/* Error display */}
                {error && (
                  <div style={{ padding: "12px 16px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px", marginBottom: "16px", color: "#dc2626", fontSize: "14px", fontWeight: 600 }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* PayPal Buttons — shown when form is valid */}
                <div style={{ opacity: formValid ? 1 : 0.4, pointerEvents: formValid ? "auto" : "none", transition: "opacity 0.2s" }}>
                  <PayPalLoading />
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      color: "gold",
                      shape: "rect",
                      label: "pay",
                      height: 48,
                    }}
                    fundingSource={undefined}  // undefined = show all: PayPal + card options
                    forceReRender={[subtotal, form.email]}
                    createOrder={handleCreateOrder}
                    onApprove={handleApprove}
                    onCancel={handleCancel}
                    onError={handleError}
                  />
                </div>

                {/* WhatsApp alternative */}
                <div style={{ padding: "14px 20px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "12px", marginTop: "16px" }}>
                  <p style={{ fontSize: "13px", color: "#166534", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                    <span>💬</span>
                    <span>Prefer WhatsApp? <a href="https://wa.me/918416919470" target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", fontWeight: 700 }}>Chat with us</a> to place your order directly.</span>
                  </p>
                </div>
              </div>

              <p style={{ fontSize: "11px", color: "var(--foreground-muted)", textAlign: "center", lineHeight: 1.6 }}>
                By placing an order you agree to our <Link href="/terms" style={{ color: "var(--primary)" }}>Terms & Conditions</Link>.
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
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", marginTop: "4px", marginBottom: 0 }}>${Math.round(item.unitPrice * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--foreground-muted)", marginBottom: "8px" }}>
                <span>Shipping</span><span style={{ color: "#16a34a", fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: 800, color: "var(--foreground)", marginTop: "12px" }}>
                <span>Total</span>
                <span>${Math.round(subtotal).toLocaleString()}</span>
              </div>
            </div>
            {/* Security badges */}
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                {["🔒 SSL Secure", "✓ PayPal Protected", "🌍 Worldwide Shipping"].map((badge) => (
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

// ── Root export — wraps everything in PayPalScriptProvider ─────────────────────
export default function CheckoutContent() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
        components: "buttons",
        // enable-funding: venmo,paylater  — uncomment to show additional funding sources
        // disable-funding: credit,card    — uncomment to hide credit/debit card option
      }}
    >
      <CheckoutForm />
    </PayPalScriptProvider>
  );
}
