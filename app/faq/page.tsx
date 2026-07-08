"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

const faqs = [
  {
    category: "Ordering & Pricing",
    questions: [
      {
        q: "How do I order a custom rug?",
        a: "You can use our Rug Configurator to get an instant price estimate, then contact us via WhatsApp or email to confirm your order. Our team will guide you through the entire process — from design approval to production and delivery.",
      },
      {
        q: "Are your prices negotiable for large orders?",
        a: "Yes. We offer volume discounts for orders of multiple rugs, hotel and commercial projects, and our interior designer trade programme. Please contact us directly for a custom quotation.",
      },
      {
        q: "Is the price on the configurator the final price?",
        a: "The configurator provides an estimated price based on your specifications. Final pricing is confirmed after reviewing your exact design requirements — complex patterns, high knot counts, or specialty fibres may affect the final cost. We always confirm the final price before production begins.",
      },
      {
        q: "Do you require a deposit?",
        a: "Yes, we require a 50% deposit to begin production, with the remaining balance due before shipping. For trade clients, we can arrange purchase order terms.",
      },
    ],
  },
  {
    category: "Materials & Craft",
    questions: [
      {
        q: "What materials do you use?",
        a: "We work with premium New Zealand wool, Himalayan silk, bamboo silk, organic cotton, and natural jute. All materials are ethically sourced and of the highest quality. We also offer luxurious wool-silk blends for an exceptionally soft, lustrous finish.",
      },
      {
        q: "What is the difference between hand knotted and hand tufted?",
        a: "Hand knotted rugs are made by individually tying each knot around the warp threads — a technique that can take months and produces rugs that last for generations. Hand tufted rugs use a tufting gun to push yarn through a backing fabric, resulting in a plush, uniform pile that is quicker to produce and more affordable, without compromising on quality or design.",
      },
      {
        q: "How long does a hand knotted rug last?",
        a: "A properly made hand knotted rug with quality wool can last over 100 years, often being passed down through generations. Our hand knotted rugs are genuine heirloom investments.",
      },
      {
        q: "Do you use natural dyes?",
        a: "We offer both natural and synthetic dye options. Our natural dye collection uses traditional plant-based dyes that create beautifully nuanced tones that soften and deepen with age. Synthetic dyes offer greater colour consistency and Pantone-matching capability.",
      },
    ],
  },
  {
    category: "Custom Orders",
    questions: [
      {
        q: "Can I order any size?",
        a: "Yes — we produce rugs in any size, from small accent rugs to grand room-sized carpets. There are no standard size limitations. Simply tell us your exact dimensions in feet, inches, or centimetres.",
      },
      {
        q: "Can I provide my own design?",
        a: "Absolutely. You can provide a design sketch, a mood board, a floor plan, a photograph of a reference rug, or even a Pantone colour palette. Our design team will translate your vision into a detailed technical specification.",
      },
      {
        q: "How accurate is the colour matching?",
        a: "We can match colours very accurately using Pantone references with our synthetic dye range. Natural dyes produce more organic, nuanced tones that are beautiful but may have slight natural variations. We provide a digital colour preview before production begins.",
      },
      {
        q: "Can you make irregular or custom-shaped rugs?",
        a: "Yes — we specialise in irregular shapes and are experienced in creating rugs that follow architectural floor plans, curved staircases, or entirely unique shapes. Simply share your floor plan or dimensions.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "Do you ship worldwide?",
        a: "Yes — we offer free worldwide shipping to the USA, Canada, UK, Europe, Australia, UAE, and virtually every other country. Your rug is fully insured during transit.",
      },
      {
        q: "How long does production take?",
        a: "Hand tufted rugs typically take 3–4 weeks. Hand knotted rugs take 4–8 weeks depending on the size and knot density. Once shipped, delivery takes 4–7 business days via express courier.",
      },
      {
        q: "How is the rug packaged for shipping?",
        a: "Rugs are professionally cleaned, rolled around a solid tube, wrapped in protective fabric, and then in a waterproof outer wrap. The roll is then crated or placed in a sturdy box appropriate for the rug's size. All international shipments include full insurance.",
      },
      {
        q: "Will I receive updates during production?",
        a: "Yes — we send you photo updates at key stages of production, including the completed design drawing, the started piece, and the finished rug before packaging. You can also contact us at any time for a WhatsApp progress update.",
      },
    ],
  },
  {
    category: "Care & Maintenance",
    questions: [
      {
        q: "How do I care for my handmade rug?",
        a: "For daily care, regular vacuuming (without the beater bar on high pile rugs) is recommended. Rotate the rug periodically to ensure even wear. For spills, blot immediately with a clean cloth — never rub. Professional cleaning every 2–3 years is recommended for wool rugs.",
      },
      {
        q: "Can handmade rugs be professionally cleaned?",
        a: "Yes — all our rugs can be professionally hand-washed. We recommend using a specialist oriental rug cleaning service. Never machine-wash a handmade wool rug.",
      },
    ],
  },
];

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
          maxHeight: open ? "400px" : "0",
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

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(faqs[0].category);

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
                margin: "0 auto",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Everything you need to know about ordering, craftsmanship, shipping, and care.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section style={{ padding: "100px 0", background: "var(--surface-alt)" }}>
          <div className="container">
            <div
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
                          (e.currentTarget as HTMLElement).style.background = "rgba(139,94,60,0.08)";
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
            background: "var(--surface-alt)",
            textAlign: "center",
          }}
        >
          <div className="container">
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 300,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Ready to Create Your Rug?
            </h2>
            <p
              style={{
                fontSize: "17px",
                color: "var(--foreground-muted)",
                maxWidth: "420px",
                margin: "0 auto 44px",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Use our configurator for an instant estimate, or contact us to begin your bespoke journey.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/shop" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary" style={{ padding: "17px 40px" }}>
                  Rug Configurator
                </button>
              </Link>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <button className="btn btn-outline" style={{ padding: "16px 36px" }}>
                  Contact Us
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
