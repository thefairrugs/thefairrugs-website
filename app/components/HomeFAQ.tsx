"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    category: "Products & Quality",
    items: [
      {
        q: "Are your rugs truly handmade?",
        a: "Absolutely. Every rug in our collection is handmade by master artisans in our workshops in Jaipur, India. We never use machine manufacturing. Depending on the rug type — hand knotted, hand tufted, or durrie — the weaving process takes between 2 and 12 weeks per piece.",
      },
      {
        q: "What materials do you use?",
        a: "We use only premium-grade natural fibres: New Zealand wool (known for exceptional softness and durability), Indian wool, bamboo silk (for a natural sheen and luxury feel), natural jute, and recycled cotton. All materials are sourced ethically from certified suppliers.",
      },
      {
        q: "What is the difference between hand knotted and hand tufted rugs?",
        a: "Hand knotted rugs are the pinnacle of the craft — each individual knot is tied by hand onto the warp threads, creating a dense, reversible rug that can last generations. Hand tufted rugs use a tufting gun to loop pile yarn through a backing, which is then latex-coated — a faster process that still produces beautiful, high-quality results at a more accessible price point.",
      },
      {
        q: "How long do your rugs last?",
        a: "A well-maintained hand knotted wool rug can last 50–100 years or more. Hand tufted rugs typically last 20–30 years with proper care. We include detailed care instructions with every purchase, and our team is always available to advise on cleaning and maintenance.",
      },
    ],
  },
  {
    category: "Custom Orders",
    items: [
      {
        q: "Can I order a custom size or design?",
        a: "Yes — every rug we make can be fully customised. You can specify your exact dimensions (any size, any shape including rounds, runners, and irregular shapes), choose your pile height, select your material, and even provide a custom design or colour palette. Use our Build Your Rug configurator or contact us directly on WhatsApp.",
      },
      {
        q: "How long does a custom rug take?",
        a: "Custom production time depends on the rug type, size, and complexity. Hand knotted custom rugs typically take 6–12 weeks. Hand tufted and durrie rugs take 3–6 weeks. We will provide a precise timeline in your quote confirmation. All timelines are for production — shipping is an additional 4–7 days.",
      },
      {
        q: "Can I see a sample before placing a large order?",
        a: "Yes. For orders above a certain value, we can provide material swatches or a small pilot sample (at a nominal cost). For B2B and trade clients, we have a dedicated sampling programme. Contact us for details.",
      },
      {
        q: "What information do I need to provide for a custom order?",
        a: "We'll need: your desired size (width × length), shape, material preference, design reference (if any), and pile height. If you have an interior design brief, feel free to share it. Our design team will guide you through the rest. You can start via our Custom Rug configurator or WhatsApp.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        q: "Do you offer free worldwide shipping?",
        a: "Yes, we offer complimentary express shipping to 45+ countries worldwide via DHL Express and FedEx Priority. There is no minimum order value for free shipping. Every shipment is fully insured and comes with a live tracking link.",
      },
      {
        q: "How long does shipping take?",
        a: "Once your rug has completed production and passed our quality inspection, it ships within 24 hours. International delivery via DHL Express or FedEx Priority takes 4–7 business days to most destinations. You will receive a tracking number as soon as your rug is collected by the courier.",
      },
      {
        q: "Do I need to pay customs duties or taxes?",
        a: "Import duties and taxes depend on your country's regulations. In many cases (USA, EU, UAE), our B2B export pricing structures help minimise duties. We handle all export documentation from our end. For specific duty enquiries, we recommend contacting your local customs authority or we can advise you.",
      },
    ],
  },
  {
    category: "Payments & Returns",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept bank wire transfer (T/T), PayPal, and major credit/debit cards (Visa, Mastercard, American Express). For custom orders, we typically require a 50% deposit at order confirmation, with the balance due before shipping. We will send you a secure payment link via email.",
      },
      {
        q: "What is your return policy?",
        a: "For catalogue products (in-stock items), we accept returns within 14 days of delivery if the rug is unused and in its original packaging. For custom-made rugs, we are unable to accept returns unless there is a manufacturing defect — which we take very seriously and resolve immediately. Please contact us within 48 hours of delivery if you have any concerns.",
      },
      {
        q: "What if my rug arrives damaged?",
        a: "Every shipment is fully insured. If your rug arrives damaged, please take photos immediately and contact us within 48 hours. We will arrange a replacement or full refund without delay. Our quality record is exceptional — less than 0.2% of deliveries have any issue.",
      },
    ],
  },
];

export default function HomeFAQ() {
  const [openCategory, setOpenCategory] = useState<string>("Products & Quality");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const activeCategory = FAQS.find((f) => f.category === openCategory);

  return (
    <section
      style={{
        padding: "100px 0",
        background: "var(--surface)",
        borderTop: "1px solid var(--border-light)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--primary)",
              fontWeight: 600,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "28px",
                height: "1px",
                background: "var(--primary)",
              }}
            />
            Everything You Need to Know
            <span
              style={{
                display: "inline-block",
                width: "28px",
                height: "1px",
                background: "var(--primary)",
              }}
            />
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 300,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Frequently Asked{" "}
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
              Questions
            </em>
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--foreground-muted)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Can't find your answer? Our team responds within a few hours via WhatsApp or email.
          </p>
        </div>

        {/* FAQ Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "60px",
            alignItems: "start",
          }}
        >
          {/* Category Tabs (Left) */}
          <div style={{ position: "sticky", top: "100px" }}>
            <h4
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--foreground-light)",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Categories
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {FAQS.map((category) => (
                <button
                  key={category.category}
                  onClick={() => {
                    setOpenCategory(category.category);
                    setOpenQuestion(null);
                  }}
                  style={{
                    padding: "14px 20px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background:
                      openCategory === category.category
                        ? "var(--primary)"
                        : "transparent",
                    color:
                      openCategory === category.category
                        ? "#fff"
                        : "var(--foreground-muted)",
                    fontSize: "14px",
                    fontWeight: openCategory === category.category ? 700 : 400,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    letterSpacing: "-0.01em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => {
                    if (openCategory !== category.category) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--surface-alt)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--foreground)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (openCategory !== category.category) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--foreground-muted)";
                    }
                  }}
                >
                  <span>{category.category}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      opacity: 0.7,
                      fontWeight: 600,
                    }}
                  >
                    {category.items.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Contact CTA */}
            <div
              style={{
                marginTop: "36px",
                padding: "24px",
                background: "var(--primary-pale)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-green)",
              }}
            >
              <h5
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--primary-dark)",
                  marginBottom: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                Still have questions?
              </h5>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--foreground-muted)",
                  lineHeight: 1.6,
                  marginBottom: "16px",
                  fontWeight: 300,
                }}
              >
                Our team is available Mon–Sat, 9am–6pm IST. We respond within a few hours.
              </p>
              <a
                href="https://wa.me/918416919470?text=Hi%2C%20I%20have%20a%20question%20about%20your%20rugs."
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    background: "#25D366",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#20b858";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#25D366";
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </button>
              </a>
            </div>
          </div>

          {/* Questions (Right) */}
          <div>
            {activeCategory?.items.map((item, i) => {
              const isOpen = openQuestion === `${openCategory}-${i}`;
              return (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() =>
                      setOpenQuestion(
                        isOpen ? null : `${openCategory}-${i}`
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "24px 0",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: isOpen ? "var(--primary)" : "var(--foreground)",
                        lineHeight: 1.4,
                        letterSpacing: "-0.01em",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {item.q}
                    </span>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: `1.5px solid ${isOpen ? "var(--primary)" : "var(--border)"}`,
                        background: isOpen ? "var(--primary)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <span
                        style={{
                          color: isOpen ? "#fff" : "var(--foreground-muted)",
                          fontSize: "18px",
                          lineHeight: 1,
                          fontWeight: 300,
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          display: "block",
                          transition: "transform 0.3s ease",
                          marginTop: "-2px",
                        }}
                      >
                        +
                      </span>
                    </div>
                  </button>

                  <div
                    style={{
                      maxHeight: isOpen ? "500px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        color: "var(--foreground-muted)",
                        lineHeight: 1.8,
                        fontWeight: 300,
                        paddingBottom: "28px",
                        paddingRight: "52px",
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* View All FAQs */}
            <div style={{ marginTop: "40px" }}>
              <Link href="/faq" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    borderRadius: "9999px",
                    border: "1.5px solid var(--primary)",
                    background: "transparent",
                    color: "var(--primary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.background = "var(--primary)";
                    btn.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.background = "transparent";
                    btn.style.color = "var(--primary)";
                  }}
                >
                  View All FAQs
                  <span style={{ fontSize: "16px" }}>→</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
