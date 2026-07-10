import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Payment Cancelled — The Fair Rugs",
  description: "Your payment was cancelled. Your cart is saved — return to checkout whenever you're ready.",
  robots: { index: false, follow: false },
};

export default function PaymentCancelPage() {
  return (
    <>
      <Header />
      <main>
        <div style={{ background: "var(--background)", minHeight: "70vh", padding: "80px 20px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            {/* Icon */}
            <div style={{
              width: "96px", height: "96px", background: "#f8f6f0",
              border: "3px solid #e5e1d8", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 32px",
            }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9a9585" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1 style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300,
              color: "var(--foreground)", marginBottom: "16px",
            }}>
              Payment Cancelled
            </h1>

            <p style={{ fontSize: "16px", color: "var(--foreground-muted)", lineHeight: 1.8, marginBottom: "12px" }}>
              No problem — your payment was cancelled and <strong>no charge was made</strong>.
            </p>
            <p style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.8, marginBottom: "40px" }}>
              Your cart items are still saved. Return to checkout whenever you&apos;re ready, or browse our collection for more beautiful rugs.
            </p>

            {/* Info box */}
            <div style={{
              background: "#fefce8", border: "1px solid #fde68a",
              borderRadius: "12px", padding: "20px 24px", marginBottom: "40px", textAlign: "left",
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#92400e", marginBottom: "10px" }}>Need help?</h3>
              <ul style={{ color: "#92400e", fontSize: "13px", lineHeight: 2, paddingLeft: "20px", margin: 0 }}>
                <li>Try a different payment method (credit card, debit card)</li>
                <li>Make sure your PayPal account has sufficient funds</li>
                <li>Contact us via WhatsApp for assistance</li>
              </ul>
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/checkout" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary" style={{ padding: "16px 40px" }}>
                  Return to Checkout →
                </button>
              </Link>
              <Link href="/cart" style={{ textDecoration: "none" }}>
                <button className="btn btn-ghost" style={{ padding: "16px 40px" }}>
                  View Cart
                </button>
              </Link>
            </div>

            <div style={{ marginTop: "24px" }}>
              <a
                href="https://wa.me/918416919470?text=Hi%2C+I+need+help+with+my+payment+on+The+Fair+Rugs+website."
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600, textDecoration: "none" }}
              >
                💬 Chat with us on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
