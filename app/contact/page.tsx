import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Get Your Custom Rug Quote",
  description:
    "Contact The Fair Rugs for custom rug quotes, trade enquiries, and expert design consultation. WhatsApp, email, or fill in our contact form — we respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section
          style={{
            background: "var(--foreground)",
            padding: "100px 0",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--gold)",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              ✦ &nbsp; We&apos;re Here to Help
            </p>
            <h1
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(44px, 6vw, 72px)",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
                marginBottom: "20px",
              }}
            >
              Get in Touch
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.6)",
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Whether you have questions, need a quote, or want to start a custom rug project, our team is ready to assist.
            </p>
          </div>
        </section>

        {/* Main Contact */}
        <section style={{ padding: "100px 0", background: "var(--surface-alt)" }}>
          <div className="container">
            <ContactForm />
          </div>
        </section>

        {/* Shipping Banner */}
        <section
          style={{
            padding: "80px 0",
            background: "var(--foreground)",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--gold)",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              ✦ &nbsp; We Ship Everywhere
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Delivered Worldwide, Free of Charge
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.6)",
                maxWidth: "520px",
                margin: "0 auto 48px",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Every rug is shipped fully insured, door-to-door, to your location — anywhere in the world, at no additional cost.
            </p>

            {/* Country grid */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              {[
                "🇺🇸 USA",
                "🇨🇦 Canada",
                "🇬🇧 United Kingdom",
                "🇦🇺 Australia",
                "🇩🇪 Germany",
                "🇫🇷 France",
                "🇮🇹 Italy",
                "🇪🇸 Spain",
                "🇳🇱 Netherlands",
                "🇸🇦 Saudi Arabia",
                "🇦🇪 UAE",
                "🌍 + 45 more",
              ].map((country) => (
                <span
                  key={country}
                  style={{
                    padding: "8px 18px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.65)",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {country}
                </span>
              ))}
            </div>

            <div style={{ marginTop: "48px" }}>
              <Link href="/shop" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    background: "var(--gold)",
                    color: "var(--foreground)",
                    border: "none",
                    padding: "16px 36px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Configure Your Rug
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
