"use client";

import { useState } from "react";

interface TrackingOrder {
  orderId: string;
  status: string;
  courierCompany?: string;
  trackingNumber?: string;
  dispatchDate?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  createdAt?: string;
  updatedAt?: string;
  totalAmount?: number;
  paymentMethod?: string;
  items?: { productTitle: string; sizeLabel?: string; quantity: number; lineTotal?: number }[];
  customer?: { firstName?: string; lastName?: string; email?: string; phone?: string };
  shippingAddress?: { address?: string; city?: string; postalCode?: string; country?: string };
}

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: "📋", desc: "Your order has been received and is being reviewed." },
  { key: "processing", label: "Processing", icon: "⚙️", desc: "We're preparing your order and confirming all details." },
  { key: "production", label: "In Production", icon: "🧶", desc: "Your rug is being handcrafted by our master artisans." },
  { key: "ready", label: "Ready to Ship", icon: "📦", desc: "Your rug has passed quality control and is ready for dispatch." },
  { key: "dispatched", label: "Dispatched", icon: "🚚", desc: "Your order has been handed to the courier and is on its way." },
  { key: "in-transit", label: "In Transit", icon: "✈️", desc: "Your rug is travelling to your destination." },
  { key: "delivered", label: "Delivered", icon: "✅", desc: "Your order has been delivered successfully." },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0, processing: 1, production: 2,
  ready: 3, dispatched: 4, "in-transit": 5, delivered: 6,
};

function getStatusIndex(status: string): number {
  return STATUS_INDEX[status] ?? 0;
}

export default function TrackingClient() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() && !email.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);

    try {
      // We hit the public tracking endpoint
      const params = new URLSearchParams();
      if (orderId.trim()) params.set("orderId", orderId.trim());
      if (email.trim()) params.set("email", email.trim().toLowerCase());
      const res = await fetch(`/api/order-tracking?${params.toString()}`);
      const data = await res.json();
      if (data.error || !data.orderId) {
        setError("No order found with those details. Please check your Order ID and email address.");
      } else {
        setOrder(data as TrackingOrder);
      }
    } catch {
      setError("Unable to look up your order right now. Please try again or contact us on WhatsApp.");
    }
    setLoading(false);
  };

  const currentStep = order ? getStatusIndex(order.status) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>

      {/* Hero */}
      <section style={{ background: "var(--foreground)", padding: "64px 0 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 60% 40%, rgba(201,169,110,0.08) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "16px" }}>
            ✦ &nbsp; Order Status
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "16px" }}>
            Track Your <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Order</em>
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.8, color: "rgba(255,255,255,0.6)", fontWeight: 300, maxWidth: "460px", margin: "0 auto 40px" }}>
            Enter your Order ID or email address to see real-time production and shipping updates.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} style={{ maxWidth: "520px", margin: "0 auto" }}>
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-xl)", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                  Order ID
                </label>
                <input
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. TFR-20261234"
                  style={{ width: "100%", padding: "12px 14px", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "8px", fontSize: "14px", background: "rgba(255,255,255,0.07)", color: "#fff", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.12)" }} />
                OR
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.12)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={{ width: "100%", padding: "12px 14px", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "8px", fontSize: "14px", background: "rgba(255,255,255,0.07)", color: "#fff", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <button
                type="submit"
                disabled={loading || (!orderId.trim() && !email.trim())}
                style={{ padding: "15px", background: "var(--gold)", color: "var(--foreground)", border: "none", borderRadius: "9999px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", opacity: (loading || (!orderId.trim() && !email.trim())) ? 0.6 : 1 }}
              >
                {loading ? "Looking up…" : "Track My Order →"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="container" style={{ maxWidth: "760px", margin: "0 auto" }}>

          {/* Error state */}
          {searched && error && (
            <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: "var(--radius-lg)", padding: "24px 28px", textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
              <p style={{ fontWeight: 700, color: "#dc2626", marginBottom: "8px", fontSize: "16px" }}>Order Not Found</p>
              <p style={{ color: "#7f1d1d", fontSize: "14px", lineHeight: 1.6 }}>{error}</p>
              <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://wa.me/918416919470?text=Hi%2C+I%27m+trying+to+track+my+order+but+can%27t+find+it." target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button style={{ background: "#25D366", color: "#fff", border: "none", padding: "11px 24px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                    WhatsApp Support
                  </button>
                </a>
                <a href="mailto:thefairrugs@gmail.com" style={{ textDecoration: "none" }}>
                  <button style={{ background: "#fff", color: "#dc2626", border: "1.5px solid #fca5a5", padding: "11px 24px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                    Email Us
                  </button>
                </a>
              </div>
            </div>
          )}

          {/* Order found */}
          {order && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Order summary header */}
              <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: "1px solid #e5e7eb", padding: "28px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <p style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Order ID</p>
                    <h2 style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: 800, color: "#1c1c1a", marginBottom: "4px" }}>{order.orderId}</h2>
                    {order.createdAt && <p style={{ fontSize: "12px", color: "#9ca3af" }}>Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "8px 20px", borderRadius: "9999px", fontSize: "13px", fontWeight: 700,
                      background: isCancelled ? "#fee2e2" : "#d1fae5",
                      color: isCancelled ? "#dc2626" : "#059669",
                    }}>
                      {isCancelled ? "❌ Cancelled" : `✓ ${STATUS_STEPS[currentStep]?.label || order.status}`}
                    </span>
                    {order.totalAmount && (
                      <p style={{ fontSize: "18px", fontWeight: 800, color: "#1c1c1a", marginTop: "8px" }}>
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              {!isCancelled && (
                <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: "1px solid #e5e7eb", padding: "28px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1c1c1a", marginBottom: "28px" }}>Order Progress</h3>
                  <div style={{ position: "relative" }}>
                    {/* Progress line */}
                    <div style={{ position: "absolute", left: "19px", top: "0", bottom: "0", width: "2px", background: "#e5e7eb", zIndex: 0 }} />
                    <div style={{ position: "absolute", left: "19px", top: "0", width: "2px", background: "#4a5c3a", zIndex: 1, height: `${Math.min(100, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%`, transition: "height 0.5s ease" }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                      {STATUS_STEPS.map((step, i) => {
                        const done = i <= currentStep;
                        const active = i === currentStep;
                        return (
                          <div key={step.key} style={{ display: "flex", alignItems: "flex-start", gap: "20px", paddingBottom: i < STATUS_STEPS.length - 1 ? "28px" : "0", position: "relative", zIndex: 2 }}>
                            {/* Circle */}
                            <div style={{
                              width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                              background: done ? "#4a5c3a" : "#fff",
                              border: done ? "2px solid #4a5c3a" : "2px solid #e5e7eb",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "18px",
                              boxShadow: active ? "0 0 0 4px rgba(74,92,58,0.15)" : "none",
                              transition: "all 0.3s ease",
                            }}>
                              {done ? (
                                active ? <span style={{ fontSize: "16px" }}>{step.icon}</span> : <span style={{ color: "#fff", fontSize: "14px" }}>✓</span>
                              ) : (
                                <span style={{ fontSize: "16px", opacity: 0.3 }}>{step.icon}</span>
                              )}
                            </div>

                            {/* Content */}
                            <div style={{ paddingTop: "8px" }}>
                              <p style={{ fontWeight: active ? 700 : done ? 600 : 400, color: done ? "#1c1c1a" : "#9ca3af", fontSize: "14px", marginBottom: "2px" }}>
                                {step.label}
                                {active && <span style={{ marginLeft: "8px", fontSize: "10px", background: "#4a5c3a", color: "#fff", padding: "2px 8px", borderRadius: "9999px", verticalAlign: "middle", fontWeight: 700, letterSpacing: "0.05em" }}>CURRENT</span>}
                              </p>
                              {(done || active) && <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.5 }}>{step.desc}</p>}
                              {/* Show dispatch date if dispatched */}
                              {step.key === "dispatched" && order.dispatchDate && done && (
                                <p style={{ fontSize: "11px", color: "#4a5c3a", fontWeight: 600, marginTop: "4px" }}>📅 {order.dispatchDate}</p>
                              )}
                              {/* Show delivered date if delivered */}
                              {step.key === "delivered" && order.deliveredDate && done && (
                                <p style={{ fontSize: "11px", color: "#059669", fontWeight: 600, marginTop: "4px" }}>✅ Delivered {order.deliveredDate}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tracking Info */}
              {(order.courierCompany || order.trackingNumber || order.estimatedDelivery) && (
                <div style={{ background: "#f0fdf4", borderRadius: "var(--radius-xl)", border: "1.5px solid #86efac", padding: "28px 32px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#166534", marginBottom: "20px" }}>🚚 Shipping & Tracking</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {order.courierCompany && (
                      <div>
                        <p style={{ fontSize: "11px", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: "4px" }}>Courier</p>
                        <p style={{ fontWeight: 700, color: "#166534", fontSize: "15px" }}>{order.courierCompany}</p>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div>
                        <p style={{ fontSize: "11px", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: "4px" }}>Tracking Number</p>
                        <p style={{ fontWeight: 700, color: "#166534", fontSize: "15px", fontFamily: "monospace" }}>{order.trackingNumber}</p>
                      </div>
                    )}
                    {order.dispatchDate && (
                      <div>
                        <p style={{ fontSize: "11px", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: "4px" }}>Dispatch Date</p>
                        <p style={{ fontWeight: 600, color: "#166534" }}>{order.dispatchDate}</p>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div>
                        <p style={{ fontSize: "11px", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: "4px" }}>Estimated Delivery</p>
                        <p style={{ fontWeight: 700, color: "#166534", fontSize: "15px" }}>{order.estimatedDelivery}</p>
                      </div>
                    )}
                    {order.deliveredDate && (
                      <div style={{ gridColumn: "1 / -1", background: "#dcfce7", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "24px" }}>✅</span>
                        <div>
                          <p style={{ fontWeight: 700, color: "#166534", fontSize: "14px" }}>Delivered on {order.deliveredDate}</p>
                          <p style={{ fontSize: "12px", color: "#4ade80" }}>Your order has been delivered successfully. Enjoy your rug!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ordered Items */}
              {order.items && order.items.length > 0 && (
                <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: "1px solid #e5e7eb", padding: "28px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1c1c1a", marginBottom: "20px" }}>Ordered Items</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
                        <div>
                          <p style={{ fontWeight: 600, color: "#1c1c1a", marginBottom: "2px" }}>{item.productTitle}</p>
                          {item.sizeLabel && <p style={{ fontSize: "12px", color: "#6b7280" }}>{item.sizeLabel} · Qty: {item.quantity}</p>}
                        </div>
                        {item.lineTotal && <p style={{ fontWeight: 700, color: "#4a5c3a", fontSize: "15px" }}>${item.lineTotal.toFixed(2)}</p>}
                      </div>
                    ))}
                    {order.totalAmount && (
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "4px" }}>
                        <span style={{ fontWeight: 700, color: "#1c1c1a" }}>Total</span>
                        <span style={{ fontWeight: 800, fontSize: "18px", color: "#4a5c3a" }}>${order.totalAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact support */}
              <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)", padding: "28px 32px", textAlign: "center" }}>
                <p style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: "6px" }}>Need help with your order?</p>
                <p style={{ fontSize: "13px", color: "var(--foreground-muted)", marginBottom: "20px" }}>
                  Our team responds within 24 hours, Monday to Saturday.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={`https://wa.me/918416919470?text=Hi%2C+I+need+help+with+my+order+${encodeURIComponent(order.orderId)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <button style={{ background: "#25D366", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                      WhatsApp
                    </button>
                  </a>
                  <a href="mailto:thefairrugs@gmail.com" style={{ textDecoration: "none" }}>
                    <button style={{ background: "var(--foreground)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                      Email Support
                    </button>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Initial state hint */}
          {!searched && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--foreground-muted)" }}>
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>📦</div>
              <p style={{ fontWeight: 600, fontSize: "16px", marginBottom: "8px" }}>Enter your order details above</p>
              <p style={{ fontSize: "14px", lineHeight: 1.7 }}>
                You can find your Order ID in your confirmation email.<br />
                Status updates automatically when our team processes your order.
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
