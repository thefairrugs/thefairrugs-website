"use client";

import ContactForm from "./ContactForm";

const WA_URL = "https://wa.me/918416919470?text=Hello%2C%20I%27d%20like%20to%20make%20an%20inquiry%20about%20your%20rugs.";

export default function ContactContent() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #2a3a20 0%, #1c2c15 60%, #243018 100%)",
          padding: "90px 0 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 25% 60%, rgba(184,151,90,0.1) 0%, transparent 55%), radial-gradient(circle at 75% 40%, rgba(122,143,106,0.08) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "620px" }}>
            <p style={{
              fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase",
              color: "var(--gold-light)", fontWeight: 600, marginBottom: "20px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
              Get In Touch
            </p>
            <h1 style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(40px, 6vw, 68px)",
              fontWeight: 300, color: "#fff",
              letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: "24px",
            }}>
              We&apos;d Love to<br />
              <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Hear From You</em>
            </h1>
            <p style={{
              fontSize: "17px", lineHeight: 1.8,
              color: "rgba(255,255,255,0.65)", fontWeight: 300,
            }}>
              Whether you&apos;re looking for a specific rug, need a custom design, or want to discuss a wholesale project — we&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: "80px 0 100px", background: "var(--background)" }}>
        <div className="container">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "80px", alignItems: "start" }}
          >
            {/* Contact Info */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "38px", fontWeight: 300,
                color: "var(--foreground)", letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}>
                Two ways to reach us
              </h2>
              <p style={{ color: "var(--foreground-muted)", fontSize: "15px", lineHeight: 1.7, marginBottom: "40px" }}>
                Choose whichever method is most convenient for you. We typically respond within a few hours.
              </p>

              {/* WhatsApp Option */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", display: "block", marginBottom: "20px" }}
              >
                <div
                  style={{
                    padding: "28px 32px",
                    background: "var(--surface)",
                    border: "2px solid var(--border-light)",
                    borderRadius: "var(--radius-xl)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#25D366";
                    el.style.boxShadow = "0 8px 28px rgba(37,211,102,0.15)";
                    el.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--border-light)";
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "50%",
                      background: "#25D366", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
                        Chat on WhatsApp
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--foreground-muted)" }}>
                        Fastest response — usually within minutes
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--foreground-muted)", lineHeight: 1.6, marginBottom: "16px" }}>
                    Send us a message directly on WhatsApp. Perfect for quick questions, sharing photos of your space, or getting instant price estimates.
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    color: "#25D366", fontSize: "13px", fontWeight: 700,
                  }}>
                    Open WhatsApp →
                  </div>
                </div>
              </a>

              {/* Email/Form Option */}
              <div style={{
                padding: "24px 32px",
                background: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-xl)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: "var(--primary-pale)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "20px", flexShrink: 0,
                  }}>
                    ✉
                  </div>
                  <div>
                    <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--foreground)" }}>hello@thefairrugs.com</div>
                    <div style={{ fontSize: "13px", color: "var(--foreground-muted)" }}>Response within 24 hours</div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { icon: "📍", label: "Workshop", value: "Jaipur, Rajasthan, India" },
                  { icon: "🌍", label: "Ships To", value: "USA, Canada, UK, Australia, Europe & Worldwide" },
                  { icon: "⏱️", label: "Production Time", value: "3–6 weeks (custom rugs)" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <span style={{ fontSize: "22px", marginTop: "1px" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--foreground-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: "2px" }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 500 }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-xl)",
                padding: "48px",
                boxShadow: "var(--shadow-md)",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "32px", fontWeight: 300,
                  color: "var(--foreground)", marginBottom: "8px",
                }}>
                  Website Inquiry Form
                </h3>
                <p style={{ color: "var(--foreground-muted)", fontSize: "14px", marginBottom: "32px" }}>
                  Fill in the form below and we&apos;ll get back to you with pricing and availability.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
