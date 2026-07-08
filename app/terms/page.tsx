import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — The Fair Rugs",
  description: "Terms and conditions for purchasing handmade rugs from The Fair Rugs.",
};

export default function TermsAndConditions() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing or using the The Fair Rugs website and placing an order, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website or services.`,
    },
    {
      title: "Products & Orders",
      content: `All rugs are handmade and may have slight variations in colour, texture, and pattern due to the nature of artisan craftsmanship. These variations are a hallmark of authentic handmade products. Product images are representative — actual colours may vary slightly due to screen settings. We reserve the right to refuse or cancel any order at our discretion.`,
    },
    {
      title: "Pricing",
      content: `All prices are listed in US Dollars (USD) unless otherwise stated. Prices are subject to change without notice. The price displayed at the time of order confirmation is the price you will be charged. For custom orders, pricing is confirmed in a formal quote before production begins.`,
    },
    {
      title: "Custom Orders",
      content: `Custom rug orders require a 50% deposit at the time of order confirmation. The remaining balance is due before shipment. Custom orders are non-refundable once production has commenced, except in cases of manufacturing defects. Production timelines provided are estimates; we will communicate any changes promptly.`,
    },
    {
      title: "Intellectual Property",
      content: `All content on this website — including images, text, designs, and graphics — is the property of The Fair Rugs and is protected by copyright law. You may not reproduce, distribute, or use any content without our written permission.`,
    },
    {
      title: "Limitation of Liability",
      content: `To the maximum extent permitted by law, The Fair Rugs shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the relevant order.`,
    },
    {
      title: "Governing Law",
      content: `These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Jaipur, Rajasthan, India.`,
    },
    {
      title: "Contact",
      content: `For questions about these Terms & Conditions, please contact us at: info@thefairrugs.com | WhatsApp: +91 84169 19470`,
    },
  ];

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
              Legal
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
              Terms & Conditions
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "12px", fontSize: "14px" }}>
              Last updated: January 2026
            </p>
          </div>
        </div>

        <div className="container" style={{ maxWidth: "800px", padding: "80px 24px" }}>
          <p style={{ fontSize: "16px", color: "var(--foreground-muted)", lineHeight: 1.8, marginBottom: "48px", fontWeight: 300 }}>
            These Terms & Conditions govern your use of The Fair Rugs website and your purchase of our handmade rugs. Please read them carefully before placing an order.
          </p>

          {sections.map((section, i) => (
            <div key={i} style={{ marginBottom: "48px" }}>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 400, color: "var(--foreground)", marginBottom: "16px", letterSpacing: "-0.01em" }}>
                {i + 1}. {section.title}
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
