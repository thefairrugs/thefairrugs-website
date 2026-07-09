"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";

type PaymentMethod = "paypal" | "card" | "";

export default function CheckoutContent() {
  const { items, subtotal, clearCart } = useCart();
  const [payMethod, setPayMethod] = useState<PaymentMethod>("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "",
    country: "", postalCode: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0 && !submitted) {
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

  if (submitted) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "72px", marginBottom: "24px" }}>✅</div>
        <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "42px", fontWeight: 300, color: "var(--foreground)", marginBottom: "16px" }}>
          Order Received!
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: "16px", maxWidth: "480px", lineHeight: 1.7, marginBottom: "32px" }}>
          Thank you for your order. Our team will contact you within 24 hours to confirm payment and begin production of your handmade rug.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/shop" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary" style={{ padding: "16px 40px" }}>Continue Shopping</button>
          </Link>
          <a href="https://wa.me/918416919470?text=Hi%2C+I+just+placed+an+order+on+The+Fair+Rugs+website.+Please+confirm+payment+details." target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button className="btn btn-ghost" style={{ padding: "16px 40px", borderColor: "#25D366", color: "#16a34a" }}>
              Confirm via WhatsApp
            </button>
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payMethod) { setError("Please select a payment method."); return; }
    setLoading(true);
    setError("");

    // If PayPal selected, redirect to PayPal
    if (payMethod === "paypal") {
      // Submit order inquiry first
      try {
        await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "order",
            ...form,
            paymentMethod: "PayPal",
            orderItems: items.map((i) => ({
              product: i.productTitle, size: i.sizeLabel, qty: i.quantity, price: Math.round(i.unitPrice * i.quantity),
            })),
            totalAmount: Math.round(subtotal),
          }),
        });
      } catch {}
      // Redirect to PayPal payment — replace with real PayPal link when configured
      window.open(`https://www.paypal.com/paypalme/thefairrugs/${Math.round(subtotal)}USD`, "_blank");
      setSubmitted(true);
      clearCart();
      setLoading(false);
      return;
    }

    // Card payment — submit inquiry for manual processing
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          ...form,
          paymentMethod: "Credit/Debit Card",
          orderItems: items.map((i) => ({
            product: i.productTitle, size: i.sizeLabel, qty: i.quantity, price: Math.round(i.unitPrice * i.quantity),
          })),
          totalAmount: Math.round(subtotal),
        }),
      });
      clearCart();
      setSubmitted(true);
    } catch {
      setError("Failed to submit order. Please try again or contact us via WhatsApp.");
    }
    setLoading(false);
  };

  const inputSt: React.CSSProperties = {
    width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)",
    borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--foreground)", background: "#fff",
  };

  const labelSt: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 700,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "var(--foreground-muted)", marginBottom: "6px",
  };

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
          {/* Left: Form */}
          <div>
            <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "40px", fontWeight: 300, color: "var(--foreground)", marginBottom: "36px" }}>
              Checkout
            </h1>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Contact Info */}
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                  Contact Information
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelSt}>First Name *</label>
                    <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={inputSt} />
                  </div>
                  <div>
                    <label style={labelSt}>Last Name *</label>
                    <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={inputSt} />
                  </div>
                  <div>
                    <label style={labelSt}>Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputSt} />
                  </div>
                  <div>
                    <label style={labelSt}>Phone / WhatsApp</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputSt} placeholder="+1 234 567 8900" />
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
                    <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputSt} placeholder="123 Main Street, Apt 4B" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={labelSt}>City *</label>
                      <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputSt} />
                    </div>
                    <div>
                      <label style={labelSt}>Postal Code</label>
                      <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} style={inputSt} />
                    </div>
                    <div>
                      <label style={labelSt}>Country *</label>
                      <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={inputSt} placeholder="United States" />
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
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Special requests, colour preferences, installation notes…"
                  style={{ ...inputSt, resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              {/* Payment Method */}
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                  Payment Method
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* PayPal */}
                  <label style={{
                    display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px",
                    border: `2px solid ${payMethod === "paypal" ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: "12px", cursor: "pointer", background: payMethod === "paypal" ? "var(--surface-alt)" : "white",
                    transition: "all 0.2s ease",
                  }}>
                    <input type="radio" name="payment" value="paypal" checked={payMethod === "paypal"} onChange={() => setPayMethod("paypal")} style={{ width: "18px", height: "18px" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ fontWeight: 700, fontSize: "18px", color: "#003087" }}>
                        Pay<span style={{ color: "#009cde" }}>Pal</span>
                      </div>
                      <span style={{ fontSize: "13px", color: "var(--foreground-muted)" }}>— Pay securely with your PayPal account</span>
                    </div>
                  </label>

                  {/* Card */}
                  <label style={{
                    display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px",
                    border: `2px solid ${payMethod === "card" ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: "12px", cursor: "pointer", background: payMethod === "card" ? "var(--surface-alt)" : "white",
                    transition: "all 0.2s ease",
                  }}>
                    <input type="radio" name="payment" value="card" checked={payMethod === "card"} onChange={() => setPayMethod("card")} style={{ width: "18px", height: "18px" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "22px" }}>💳</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--foreground)" }}>Credit / Debit Card</div>
                        <div style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>Visa, Mastercard, Amex — We'll contact you to process payment securely</div>
                      </div>
                    </div>
                  </label>

                  {/* WhatsApp */}
                  <div style={{ padding: "14px 20px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "12px" }}>
                    <p style={{ fontSize: "13px", color: "#166534", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>💬</span>
                      <span>Prefer WhatsApp? <a href="https://wa.me/918416919470" target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", fontWeight: 700 }}>Chat with us</a> to place your order directly.</span>
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ padding: "12px 16px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px", color: "#dc2626", fontSize: "14px", fontWeight: 600 }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: "100%", padding: "18px", fontSize: "14px", justifyContent: "center", letterSpacing: "0.06em" }}
              >
                {loading ? "Processing…" : payMethod === "paypal" ? "Continue to PayPal →" : "Place Order →"}
              </button>

              <p style={{ fontSize: "11px", color: "var(--foreground-muted)", textAlign: "center", lineHeight: 1.6 }}>
                By placing an order you agree to our <Link href="/terms" style={{ color: "var(--primary)" }}>Terms & Conditions</Link>.
                All rugs are custom-made to order. No refunds on custom items.
              </p>
            </form>
          </div>

          {/* Right: Order Summary */}
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
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3 }}>{item.productTitle}</p>
                  <p style={{ fontSize: "11px", color: "var(--foreground-muted)", marginTop: "3px" }}>{item.sizeLabel} · Qty {item.quantity}</p>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", marginTop: "4px" }}>${Math.round(item.unitPrice * item.quantity).toLocaleString()}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
