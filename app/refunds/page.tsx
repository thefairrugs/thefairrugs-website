import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Refund Policy — The Fair Rugs",
  description: "The Fair Rugs refund policy for handmade rug orders.",
};

export default function RefundPolicy() {
  return (
    <>
      <Header />
      <main>
        <div
          style={{
            background: "linear-gradient(135deg, #2a3a20 0%, #1c2c15 100%)",
            padding: "80px 0",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 600, marginBottom: "12px" }}>
              Customer Service
            </p>
            <h1
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              Refund Policy
            </h1>
          </div>
        </div>

        <div className="container" style={{ maxWidth: "800px", padding: "80px 24px" }}>
          <p style={{ fontSize: "16px", color: "var(--foreground-muted)", lineHeight: 1.8, marginBottom: "48px", fontWeight: 300 }}>
            Your satisfaction is our priority. Below you will find our complete refund policy.
          </p>

          {[
            {
              title: "Eligible Refunds",
              content: "Refunds are available for: (1) Catalogue items returned within 14 days of delivery in unused, original condition. (2) Custom orders with manufacturing defects or incorrect specifications. (3) Orders damaged in transit. (4) Orders cancelled before production commences (custom deposits may be partially refunded).",
            },
            {
              title: "Refund Timeline",
              content: "Once we receive and inspect a returned item, we will process your refund within 5–7 business days. Refunds are issued to the original payment method. Bank transfers may take an additional 3–5 business days to reflect in your account.",
            },
            {
              title: "Partial Refunds",
              content: "For custom orders cancelled after design approval but before production starts, we may charge a design fee and issue a partial refund of the deposit. The exact amount will be communicated at the time of cancellation request.",
            },
            {
              title: "Non-Refundable Situations",
              content: "We are unable to process refunds for: custom rugs once production has commenced (except for defects), items returned after the 14-day window, items showing signs of use or damage caused by the customer, and items not returned in their original packaging.",
            },
            {
              title: "How to Request a Refund",
              content: "Contact us within the eligible window: Email refunds@thefairrugs.com or WhatsApp +91 84169 19470. Include your order number, reason for refund, and photos if applicable. Our team will respond within a few hours and guide you through the process.",
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: "48px" }}>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 400, color: "var(--foreground)", marginBottom: "16px", letterSpacing: "-0.01em" }}>
                {section.title}
              </h2>
              <p style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.8, fontWeight: 300 }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
