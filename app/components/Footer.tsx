"use client";

import Link from "next/link";

const navColumns = [
  {
    title: "Collections",
    links: [
      { label: "Hand Knotted Rugs", href: "/shop" },
      { label: "Hand Tufted Rugs", href: "/shop" },
      { label: "Durrie Collection", href: "/shop" },
      { label: "Jute Rugs", href: "/shop" },
      { label: "Custom Rugs", href: "/custom-rug" },
      { label: "All Rugs", href: "/shop" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Rug Configurator", href: "/shop" },
      { label: "Custom Design", href: "/custom-rug" },
      { label: "Interior Designer Program", href: "/contact" },
      { label: "Hotel & Commercial", href: "/contact" },
      { label: "Sample Request", href: "/contact" },
      { label: "Get a Quote", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/about" },
      { label: "Sustainability", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "WhatsApp", href: "https://wa.me/919999999999" },
    ],
  },
];

const countries = ["🇺🇸 USA", "🇨🇦 Canada", "🇬🇧 UK", "🇦🇺 Australia", "🇩🇪 Germany", "🇫🇷 France", "🇮🇹 Italy", "🇦🇪 UAE"];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--foreground)",
        color: "rgba(255,255,255,0.7)",
      }}
    >
      {/* Global Shipping Banner */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "28px 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "40px",
            animation: "scroll-ticker 20s linear infinite",
            whiteSpace: "nowrap",
            width: "max-content",
          }}
        >
          {[...countries, ...countries].map((country, i) => (
            <span
              key={i}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.5)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {country}
              <span style={{ color: "var(--gold)", fontSize: "10px" }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div
        className="container"
        style={{
          padding: "80px 0 60px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
            gap: "60px",
          }}
        >
          {/* Brand Column */}
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  THE FAIR RUGS
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.3em",
                    color: "var(--gold)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Handmade · Luxury · Custom
                </div>
              </div>
            </Link>

            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.5)",
                fontWeight: 300,
                maxWidth: "300px",
                marginBottom: "32px",
              }}
            >
              Luxury handmade rugs crafted by master artisans in Jaipur, India. Bespoke designs, premium materials, worldwide delivery.
            </p>

            {/* Social Links */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "36px" }}>
              {[
                { label: "Instagram", icon: "IG", href: "#" },
                { label: "Pinterest", icon: "PI", href: "#" },
                { label: "Houzz", icon: "HZ", href: "#" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.05em",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "var(--gold)";
                    el.style.color = "var(--gold)";
                    el.style.background = "rgba(201,169,110,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "rgba(255,255,255,0.15)";
                    el.style.color = "rgba(255,255,255,0.5)";
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
                href="https://wa.me/919999999999"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                }}
              >
                <span style={{ color: "#25D366", fontSize: "16px" }}>●</span>
                WhatsApp: +91 99999 99999
              </a>
              <a
                href="mailto:hello@thefairrugs.com"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                }}
              >
                ✉ hello@thefairrugs.com
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "24px",
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.5)",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                        fontWeight: 300,
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = "#fff")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "rgba(255,255,255,0.5)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications / Trust */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: "60px",
            paddingTop: "40px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
          }}
        >
          {[
            { icon: "🚚", text: "Free Worldwide Shipping" },
            { icon: "🔒", text: "Secure Payments" },
            { icon: "🤝", text: "Handmade Guarantee" },
            { icon: "📦", text: "Fully Insured Delivery" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.04em",
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: "40px",
            paddingTop: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>
            © {new Date().getFullYear()} The Fair Rugs. All rights reserved. Handmade in India.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
              <Link
                key={item}
                href="/"
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                  fontWeight: 300,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")
                }
              >
                {item}
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
      `}</style>
    </footer>
  );
}
