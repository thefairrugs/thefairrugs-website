"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessContent() {
  const params = useSearchParams();
  const orderId        = params.get("orderId")        || "";
  const transactionId  = params.get("transactionId")  || "";
  const amount         = params.get("amount")         || "";
  const currency       = params.get("currency")       || "USD";
  const email          = params.get("email")          || "";
  const name           = params.get("name")           || "";
  const paymentMethod  = params.get("paymentMethod")  || "PayPal";

  // Build a human-readable payment method label with icon
  const isCard       = paymentMethod.toLowerCase().startsWith("card");
  const isApplePay   = paymentMethod === "Apple Pay";
  const isGooglePay  = paymentMethod === "Google Pay";
  const methodLabel  = isCard
    ? `Paid via Card (${paymentMethod.replace(/^Card\s*/, "")})`
    : isApplePay
      ? "Paid via Apple Pay"
      : isGooglePay
        ? "Paid via Google Pay"
        : "Paid via PayPal";

  return (
    <div style={{ background: "var(--background)", minHeight: "70vh", padding: "80px 20px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
        {/* Success icon */}
        <div style={{
          width: "96px", height: "96px", background: "linear-gradient(135deg, #4a5c3a, #6b7f58)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px", boxShadow: "0 8px 32px rgba(74,92,58,0.25)",
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300,
          color: "var(--foreground)", marginBottom: "16px", lineHeight: 1.2,
        }}>
          Order Confirmed!
        </h1>

        {name && (
          <p style={{ fontSize: "18px", color: "var(--foreground-muted)", marginBottom: "8px" }}>
            Thank you, <strong style={{ color: "var(--foreground)" }}>{name}</strong>!
          </p>
        )}

        <p style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.8, marginBottom: "40px", maxWidth: "520px", margin: "0 auto 40px" }}>
          Your payment was successful and your order is confirmed. Our master artisans in Jaipur will begin crafting your handmade rug.
          {email && (
            <> A confirmation email has been sent to <strong style={{ color: "var(--foreground)" }}>{email}</strong>.</>
          )}
        </p>

        {/* Order details card */}
        {orderId && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border-light)",
            borderRadius: "16px", padding: "32px", marginBottom: "40px", textAlign: "left",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "20px" }}>
              Order Details
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "14px", color: "var(--foreground-muted)" }}>Order ID</span>
                <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 700, color: "var(--foreground)", background: "var(--background)", padding: "4px 12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                  {orderId}
                </span>
              </div>

              {transactionId && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
                  <span style={{ fontSize: "14px", color: "var(--foreground-muted)" }}>Transaction ID</span>
                  <span style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--foreground-muted)" }}>{transactionId}</span>
                </div>
              )}

              {amount && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
                  <span style={{ fontSize: "14px", color: "var(--foreground-muted)" }}>Amount Paid</span>
                  <span style={{ fontSize: "17px", fontWeight: 800, color: "#16a34a" }}>
                    ${parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", color: "var(--foreground-muted)" }}>Payment Method</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#16a34a", fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {methodLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div style={{
          background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "16px",
          padding: "28px 32px", marginBottom: "40px", textAlign: "left",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0369a1", marginBottom: "16px" }}>
            What happens next?
          </h2>
          <ol style={{ color: "#0369a1", fontSize: "14px", lineHeight: 2.2, paddingLeft: "20px", margin: 0 }}>
            <li>Our team reviews your order within <strong>24 hours</strong></li>
            <li>Master artisans begin handcrafting your rug in <strong>Jaipur, India</strong></li>
            <li>Quality inspection and professional packaging</li>
            <li>Worldwide shipping with tracking — <strong>3–5 weeks</strong> production time</li>
          </ol>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary" style={{ padding: "16px 40px" }}>
              Continue Shopping
            </button>
          </Link>
          <a
            href={`https://wa.me/918416919470?text=${encodeURIComponent(`Hi, I just placed an order on The Fair Rugs. My order ID is #${orderId}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              className="btn btn-ghost"
              style={{ padding: "16px 40px", borderColor: "#25D366", color: "#16a34a" }}
            >
              💬 WhatsApp Us
            </button>
          </a>
        </div>

        <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "32px", lineHeight: 1.7 }}>
          Save your Order ID for reference. If you have any questions, contact us at{" "}
          <a href="mailto:thefairrugs@gmail.com" style={{ color: "var(--primary)" }}>thefairrugs@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
