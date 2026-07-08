import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Return Policy — The Fair Rugs",
  description: "The Fair Rugs return and exchange policy for handmade rugs.",
};

export default function ReturnPolicy() {
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
              Return Policy
            </h1>
          </div>
        </div>

        <div className="container" style={{ maxWidth: "800px", padding: "80px 24px" }}>
          <p style={{ fontSize: "16px", color: "var(--foreground-muted)", lineHeight: 1.8, marginBottom: "48px", fontWeight: 300 }}>
            We want you to be completely satisfied with your purchase. If for any reason you are not happy, please contact us within the timeframes outlined below.
          </p>

          {[
            {
              title: "Catalogue / In-Stock Items",
              content: "For catalogue products that are in stock and shipped from our warehouse, we accept returns within 14 days of delivery. The rug must be unused, in its original condition, and returned in the original packaging. You are responsible for return shipping costs. Once we receive and inspect the returned rug, we will process your refund within 5–7 business days.",
            },
            {
              title: "Custom-Made Rugs",
              content: "Custom rugs are made specifically to your specifications and are non-refundable once production has commenced. However, if a custom rug arrives with a manufacturing defect, incorrect specifications, or is damaged in transit, we will arrange a full replacement or refund at no cost to you. Please contact us within 48 hours of delivery.",
            },
            {
              title: "Damaged or Defective Items",
              content: "If your rug arrives damaged or defective, please photograph the damage immediately upon unpacking and contact us within 48 hours of delivery. Send photos to info@thefairrugs.com or WhatsApp us. We will arrange a replacement or full refund without delay. All our shipments are fully insured for exactly this reason.",
            },
            {
              title: "Return Process",
              content: "To initiate a return: 1) Contact us within the return window via email or WhatsApp. 2) We will provide return shipping instructions and a Return Merchandise Authorisation (RMA) number. 3) Pack the rug securely in its original packaging. 4) Ship to our Jaipur warehouse. 5) We will process your refund within 5–7 business days of receiving the returned item.",
            },
            {
              title: "Exchanges",
              content: "We do not offer direct exchanges. If you wish to exchange a rug, please return the original item for a refund and place a new order. Contact our team for assistance.",
            },
            {
              title: "Contact for Returns",
              content: "Email: returns@thefairrugs.com | WhatsApp: +91 84169 19470 | Our team responds within a few hours Monday–Saturday.",
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
