import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — The Fair Rugs",
  description: "How The Fair Rugs collects, uses, and protects your personal information.",
};

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      content: `When you visit our website or place an order, we may collect the following information: your name, email address, phone number, shipping address, and payment information. We also collect non-personal information such as browser type, IP address, and pages visited to improve our website experience.`,
    },
    {
      title: "How We Use Your Information",
      content: `We use your personal information to: process and fulfill your orders, communicate with you about your order status, send you product updates and promotional offers (with your consent), improve our website and services, and comply with legal obligations. We never sell your personal information to third parties.`,
    },
    {
      title: "Data Security",
      content: `We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. All payment transactions are processed through secure, encrypted payment gateways. We retain your data only for as long as necessary to fulfill the purposes outlined in this policy.`,
    },
    {
      title: "Cookies",
      content: `Our website uses cookies to enhance your browsing experience, analyse site traffic, and personalise content. You can control cookie settings through your browser preferences. Disabling certain cookies may affect website functionality.`,
    },
    {
      title: "Third-Party Services",
      content: `We may share your information with trusted third-party service providers who assist us in operating our website and conducting our business (e.g., courier services, payment processors). These parties are obligated to keep your information confidential and use it only for the specified purpose.`,
    },
    {
      title: "Your Rights",
      content: `You have the right to access, correct, or delete your personal information at any time. You may also withdraw consent for marketing communications. To exercise these rights, please contact us at privacy@thefairrugs.com or via WhatsApp.`,
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.`,
    },
    {
      title: "Contact Us",
      content: `If you have any questions about our Privacy Policy, please contact us at: The Fair Rugs, Jaipur, Rajasthan, India. Email: info@thefairrugs.com | WhatsApp: +91 84169 19470`,
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
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
              Privacy Policy
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "12px", fontSize: "14px" }}>
              Last updated: January 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container" style={{ maxWidth: "800px", padding: "80px 24px" }}>
          <p
            style={{
              fontSize: "16px",
              color: "var(--foreground-muted)",
              lineHeight: 1.8,
              marginBottom: "48px",
              fontWeight: 300,
            }}
          >
            At The Fair Rugs, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or purchase our products.
          </p>

          {sections.map((section, i) => (
            <div key={i} style={{ marginBottom: "48px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "28px",
                  fontWeight: 400,
                  color: "var(--foreground)",
                  marginBottom: "16px",
                  letterSpacing: "-0.01em",
                }}
              >
                {i + 1}. {section.title}
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--foreground-muted)",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
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
