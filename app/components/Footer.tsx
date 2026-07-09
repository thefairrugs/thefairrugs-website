"use client";

import Link from "next/link";
import { useState } from "react";

const WA_URL = "https://wa.me/918416919470?text=Hello%2C%20I%27m%20interested%20in%20your%20luxury%20rugs.";

const navColumns = [
  {
    title: "Collections",
    links: [
      { label: "Hand Knotted Rugs", href: "/shop?category=hand-knotted" },
      { label: "Hand Tufted Rugs", href: "/shop?category=hand-tufted" },
      { label: "Durrie Collection", href: "/shop?category=durrie" },
      { label: "Jute Rugs", href: "/shop?category=jute" },
      { label: "Custom Rugs", href: "/custom-rug" },
      { label: "All Rugs", href: "/shop" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Rug Configurator", href: "/shop" },
      { label: "Custom Design", href: "/custom-rug" },
      { label: "B2B & Wholesale", href: "/b2b" },
      { label: "Interior Designers", href: "/b2b" },
      { label: "Hotel Projects", href: "/b2b" },
      { label: "Sample Request", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Return Policy", href: "/returns" },
      { label: "Refund Policy", href: "/refunds" },
      { label: "Care Guide", href: "/care-guide" },
      { label: "Sitemap", href: "/sitemap.xml" },
      { label: "Newsletter", href: "#newsletter" },
      { label: "Trade Programme", href: "/b2b" },
    ],
  },
];

const countries = [
  "🇺🇸 USA", "🇨🇦 Canada", "🇬🇧 UK", "🇦🇺 Australia",
  "🇩🇪 Germany", "🇫🇷 France", "🇮🇹 Italy", "🇦🇪 UAE",
  "🇸🇬 Singapore", "🇳🇿 NZ", "🇳🇱 Netherlands", "🇯🇵 Japan",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email }),
      });
    } catch {}
    setSubscribed(true);
  };

  return (
    <footer style={{ background: "var(--charcoal)", color: "rgba(255,255,255,0.7)" }}>
      {/* Global Shipping Banner */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "24px 0", overflow: "hidden" }}>
        <div style={{
          display: "flex", gap: "40px",
          animation: "scroll-ticker 25s linear infinite",
          whiteSpace: "nowrap", width: "max-content",
        }}>
          {[...countries, ...countries].map((country, i) => (
            <span key={i} style={{
              fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.45)",
              display: "inline-flex", alignItems: "center", gap: "8px",
            }}>
              {country}
              <span style={{ color: "var(--gold)", fontSize: "9px" }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Newsletter Strip */}
      <div id="newsletter" style={{
        background: "rgba(184,151,90,0.08)",
        borderBottom: "1px solid rgba(184,151,90,0.15)",
        padding: "56px 0",
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{
            fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase",
            color: "var(--gold)", fontWeight: 600, marginBottom: "16px",
          }}>
            ✦ &nbsp; Stay Inspired
          </p>
          <h3 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300,
            color: "#fff", letterSpacing: "-0.02em", marginBottom: "12px",
          }}>
            Join Our Newsletter
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", marginBottom: "32px" }}>
            New collections, design inspiration, and exclusive offers delivered to your inbox.
          </p>

          {subscribed ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "rgba(74,124,89,0.2)", border: "1px solid rgba(74,124,89,0.4)",
              padding: "14px 28px", borderRadius: "9999px",
              color: "#6fcf97", fontSize: "14px", fontWeight: 500,
            }}>
              ✓ Subscribed! Thank you for joining.
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              style={{ display: "flex", gap: "0", maxWidth: "480px", margin: "0 auto" }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  flex: 1, padding: "16px 20px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  borderRight: "none",
                  borderRadius: "9999px 0 0 9999px",
                  fontSize: "14px", color: "#fff", outline: "none",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "16px 28px",
                  background: "var(--gold)",
                  border: "1.5px solid var(--gold)",
                  borderRadius: "0 9999px 9999px 0",
                  color: "var(--foreground)",
                  fontSize: "12px", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="container" style={{ padding: "80px 0 60px" }}>
        <div
          className="footer-grid"
          style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr", gap: "48px" }}
        >
          {/* Brand Column */}
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "26px", fontWeight: 600,
                  color: "#fff", letterSpacing: "0.06em", lineHeight: 1, marginBottom: "6px",
                }}>
                  THE FAIR RUGS
                </div>
                <div style={{
                  fontSize: "9px", letterSpacing: "0.3em", color: "var(--gold)",
                  fontWeight: 600, textTransform: "uppercase",
                }}>
                  Handmade · Luxury · Custom
                </div>
              </div>
            </Link>

            <p style={{
              fontSize: "14px", lineHeight: 1.8, color: "rgba(255,255,255,0.45)",
              fontWeight: 300, maxWidth: "260px", marginBottom: "28px",
            }}>
              Luxury handmade rugs crafted by master artisans in Jaipur, India. Bespoke designs, premium materials, worldwide delivery.
            </p>

            {/* Social Links */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
              {[
                { label: "Instagram", icon: "IG", href: "https://www.instagram.com/thefairrugs" },
                { label: "Pinterest", icon: "PI", href: "https://www.pinterest.com/thefairrugs" },
                { label: "Facebook", icon: "FB", href: "https://www.facebook.com/thefairrugs" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 700,
                    color: "rgba(255,255,255,0.45)", textDecoration: "none",
                    transition: "all 0.2s ease", letterSpacing: "0.03em",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "var(--gold)";
                    el.style.color = "var(--gold)";
                    el.style.background = "rgba(184,151,90,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "rgba(255,255,255,0.15)";
                    el.style.color = "rgba(255,255,255,0.45)";
                    el.style.background = "transparent";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  fontSize: "13px", color: "rgba(255,255,255,0.5)", textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#25D366")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
              >
                <span style={{ color: "#25D366", fontSize: "14px" }}>●</span>
                WhatsApp: +91 84169 19470
              </a>
              <a
                href="mailto:thefairrugs@gmail.com"
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
              >
                ✉ thefairrugs@gmail.com
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h4 style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px",
              }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "13px", color: "rgba(255,255,255,0.45)",
                        textDecoration: "none", transition: "color 0.2s ease", fontWeight: 300,
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Strip */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          marginTop: "60px", paddingTop: "40px",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px",
        }}>
          {[
            { icon: "🚚", text: "Free Worldwide Shipping" },
            { icon: "✋", text: "100% Handmade Guarantee" },
            { icon: "🔒", text: "Secure Payments" },
            { icon: "📦", text: "Fully Insured Delivery" },
          ].map((item) => (
            <div key={item.text} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "14px 18px",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "var(--radius-md)",
            }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.45)", letterSpacing: "0.03em" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          marginTop: "36px", paddingTop: "24px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "16px",
        }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
            © 2026 The Fair Rugs. All Rights Reserved. Handmade in Jaipur, India.
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Shipping Policy", href: "/shipping" },
              { label: "Return Policy", href: "/returns" },
              { label: "Sitemap", href: "/sitemap.xml" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontSize: "11px", color: "rgba(255,255,255,0.3)",
                  textDecoration: "none", fontWeight: 300, transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 1100px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
