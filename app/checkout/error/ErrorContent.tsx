"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorContent() {
  const params = useSearchParams();
  const reason = params.get("reason") || "";

  return (
    <div style={{ background: "var(--background)", minHeight: "70vh", padding: "80px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        {/* Icon */}
        <div style={{
          width: "96px", height: "96px", background: "#fee2e2",
          border: "3px solid #fca5a5", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300,
          color: "var(--foreground)", marginBottom: "16px",
        }}>
          Payment Failed
        </h1>

        <p style={{ fontSize: "16px", color: "var(--foreground-muted)", lineHeight: 1.8, marginBottom: "12px" }}>
          Something went wrong with your payment. <strong>No charge was made</strong> to your account.
        </p>

        {reason && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px", textAlign: "left" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#dc2626" }}>
              <strong>Error:</strong> {reason}
            </p>
          </div>
        )}

        <p style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.8, marginBottom: "40px" }}>
          Please try again. If the problem persists, contact us via WhatsApp and we&apos;ll help you complete your order manually.
        </p>

        {/* Suggestions */}
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: "12px", padding: "20px 24px", marginBottom: "40px", textAlign: "left",
        }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#7f1d1d", marginBottom: "10px" }}>What you can try:</h3>
          <ul style={{ color: "#7f1d1d", fontSize: "13px", lineHeight: 2, paddingLeft: "20px", margin: 0 }}>
            <li>Return to checkout and try paying again</li>
            <li>Use a different payment method (different card or PayPal account)</li>
            <li>Check that your card is enabled for international transactions</li>
            <li>Contact your bank to approve the transaction</li>
            <li>Message us on WhatsApp and we&apos;ll process your order manually</li>
          </ul>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/checkout" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary" style={{ padding: "16px 40px" }}>
              Try Again →
            </button>
          </Link>
          <Link href="/cart" style={{ textDecoration: "none" }}>
            <button className="btn btn-ghost" style={{ padding: "16px 40px" }}>
              Back to Cart
            </button>
          </Link>
        </div>

        <div style={{ marginTop: "24px" }}>
          <a
            href="https://wa.me/918416919470?text=Hi%2C+I%27m+having+trouble+completing+my+payment+on+The+Fair+Rugs+website.+Can+you+help%3F"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600, textDecoration: "none" }}
          >
            💬 Chat with us on WhatsApp →
          </a>
        </div>

        <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "28px" }}>
          Email: <a href="mailto:thefairrugs@gmail.com" style={{ color: "var(--primary)" }}>thefairrugs@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
