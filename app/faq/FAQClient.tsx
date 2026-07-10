"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

interface FAQSection {
  category: string;
  questions: { q: string; a: string }[];
}

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--border-light)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "24px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "24px",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--foreground)",
            lineHeight: 1.4,
            flex: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {q}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "1.5px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            color: open ? "#fff" : "var(--primary)",
            background: open ? "var(--primary)" : "transparent",
            borderColor: open ? "var(--primary)" : "var(--border)",
            transition: "all 0.2s ease",
            marginTop: "2px",
          }}
        >
          {open ? "−" : "+"}
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? "500px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.8,
            color: "var(--foreground-muted)",
            fontWeight: 300,
            paddingBottom: "24px",
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQClient({ faqs }: { faqs: FAQSection[] }) {
  const [activeCategory, setActiveCategory] = useState(faqs[0].category);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section
          style={{
            background: "linear-gradient(135deg, #1a2814 0%, #2a3a20 60%, #1e2f18 100%)",
            padding: "100px 0",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(184,151,90,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(122,143,106,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          }} />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
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
              ✦ &nbsp; Questions Answered
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
              Frequently Asked
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
                Questions
              </em>
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.6)",
                maxWidth: "480px",
                margin: "0 auto 40px",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Everything you need to know about ordering, craftsmanship, shipping, and care.
            </p>

            {/* Quick Stats */}
            <div style={{ display: "flex", gap: "0", justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { icon: "✦", text: "5 Categories" },
                { icon: "✦", text: "18 Questions" },
                { icon: "✦", text: "Instant Answers" },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: "8px 28px",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none",
                  fontSize: "12px", color: "rgba(255,255,255,0.65)", fontWeight: 500,
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <span style={{ color: "var(--gold)", fontSize: "9px" }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section style={{ padding: "100px 0", background: "var(--surface-alt)" }}>
          <div className="container">
            <div
              className="faq-layout"
              style={{
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                gap: "60px",
                alignItems: "start",
              }}
            >
              {/* Category Nav */}
              <div style={{ position: "sticky", top: "120px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--foreground-muted)",
                    marginBottom: "16px",
                  }}
                >
                  Categories
                </p>
                <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {faqs.map((section) => (
                    <button
                      key={section.category}
                      onClick={() => setActiveCategory(section.category)}
                      style={{
                        background:
                          activeCategory === section.category
                            ? "var(--primary)"
                            : "transparent",
                        color:
                          activeCategory === section.category
                            ? "#fff"
                            : "var(--foreground-muted)",
                        border: "none",
                        cursor: "pointer",
                        padding: "12px 16px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "13px",
                        fontWeight: 600,
                        textAlign: "left",
                        transition: "all 0.2s ease",
                        letterSpacing: "0.02em",
                      }}
                      onMouseEnter={(e) => {
                        if (activeCategory !== section.category) {
                          (e.currentTarget as HTMLElement).style.background = "rgba(74,92,58,0.08)";
                          (e.currentTarget as HTMLElement).style.color = "var(--primary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeCategory !== section.category) {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "var(--foreground-muted)";
                        }
                      }}
                    >
                      {section.category}
                    </button>
                  ))}
                </nav>

                {/* Still Have Questions */}
                <div
                  style={{
                    marginTop: "40px",
                    padding: "24px",
                    background: "var(--surface)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      marginBottom: "8px",
                    }}
                  >
                    Still have questions?
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--foreground-muted)",
                      lineHeight: 1.6,
                      marginBottom: "16px",
                      fontWeight: 300,
                    }}
                  >
                    Our team is happy to help with any enquiry.
                  </p>
                  <Link href="/contact" style={{ textDecoration: "none" }}>
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", fontSize: "11px", padding: "12px" }}
                    >
                      Contact Us
                    </button>
                  </Link>

                  <a
                    href="https://wa.me/918416919470?text=Hello%2C%20I%20have%20a%20question%20about%20your%20rugs."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", display: "block", marginTop: "10px" }}
                  >
                    <button
                      style={{
                        width: "100%", padding: "12px",
                        background: "#25D366", color: "#fff",
                        border: "none", borderRadius: "var(--radius-md)",
                        fontSize: "11px", fontWeight: 700,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      💬 WhatsApp Us
                    </button>
                  </a>
                </div>

                {/* Certifications mini */}
                <div style={{
                  marginTop: "20px", padding: "20px",
                  background: "var(--surface)", borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-light)",
                }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "14px" }}>
                    Certified Quality
                  </p>
                  {[
                    { icon: "🏅", text: "OEKO-TEX® Certified" },
                    { icon: "♻️", text: "GRS Recycled Content" },
                    { icon: "🤝", text: "Fair Trade Practices" },
                    { icon: "🌿", text: "Eco-Friendly Dyes" },
                  ].map((cert) => (
                    <div key={cert.text} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      marginBottom: "10px", fontSize: "12px",
                      color: "var(--foreground-muted)",
                    }}>
                      <span>{cert.icon}</span>
                      <span style={{ fontWeight: 500 }}>{cert.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div>
                {faqs
                  .filter((s) => s.category === activeCategory)
                  .map((section) => (
                    <div key={section.category}>
                      <h2
                        style={{
                          fontFamily: "var(--font-cormorant), Georgia, serif",
                          fontSize: "36px",
                          fontWeight: 400,
                          color: "var(--foreground)",
                          letterSpacing: "-0.01em",
                          marginBottom: "32px",
                        }}
                      >
                        {section.category}
                      </h2>
                      <div
                        style={{
                          background: "var(--surface)",
                          borderRadius: "var(--radius-xl)",
                          padding: "8px 40px",
                          border: "1px solid var(--border-light)",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        {section.questions.map((item, i) => (
                          <AccordionItem key={i} q={item.q} a={item.a} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            padding: "100px 0",
            background: "linear-gradient(135deg, #1a2814 0%, #2a3a20 100%)",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, marginBottom: "20px" }}>
              ✦ &nbsp; Begin Your Journey
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Ready to Create Your Perfect Rug?
            </h2>
            <p
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.6)",
                maxWidth: "420px",
                margin: "0 auto 44px",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Use our configurator for an instant estimate, or contact us to begin your bespoke journey.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/custom-rug" style={{ textDecoration: "none" }}>
                <button className="btn btn-gold" style={{ padding: "17px 40px" }}>
                  Rug Configurator
                </button>
              </Link>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    background: "transparent", color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    padding: "16px 36px", borderRadius: "9999px",
                    fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: "pointer",
                  }}
                >
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .faq-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
