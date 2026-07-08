"use client";

import Link from "next/link";
import Image from "next/image";

const benefits = [
  "Exclusive trade pricing — up to 30% below retail",
  "Dedicated account manager for every project",
  "Priority production scheduling",
  "Sample programme with free delivery",
  "Custom rug development with your specifications",
  "Complimentary design consultation service",
  "Project invoicing and purchase order terms",
  "Access to our complete material library",
];

export default function DesignerSection() {
  return (
    <section
      style={{
        padding: "120px 0",
        background: "var(--background)",
        overflow: "hidden",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
        >
          {/* Left: Content */}
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--gold)",
                fontWeight: 600,
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "28px",
                  height: "1px",
                  background: "var(--gold)",
                  display: "inline-block",
                }}
              />
              Trade Programme
            </p>

            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(36px, 4.5vw, 54px)",
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--foreground)",
                marginBottom: "24px",
              }}
            >
              Exclusively for
              <br />
              <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
                Designers & Architects
              </em>
            </h2>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "var(--foreground-muted)",
                fontWeight: 300,
                marginBottom: "40px",
              }}
            >
              The Fair Rugs partners with interior designers, architects, and hospitality professionals worldwide. Our trade programme is built around your needs — giving you the tools, pricing, and service to create extraordinary spaces.
            </p>

            {/* Benefits List */}
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "44px",
              }}
            >
              {benefits.map((benefit, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    fontSize: "14px",
                    color: "var(--foreground-muted)",
                    lineHeight: 1.6,
                    fontWeight: 300,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "rgba(139,94,60,0.1)",
                      border: "1px solid rgba(139,94,60,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      color: "var(--primary)",
                      fontWeight: 700,
                      marginTop: "1px",
                    }}
                  >
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary" style={{ padding: "16px 36px" }}>
                  Apply for Trade Access
                </button>
              </Link>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <button className="btn btn-ghost" style={{ padding: "15px 28px" }}>
                  Request Sample Kit
                </button>
              </Link>
            </div>
          </div>

          {/* Right: Image + stats */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                aspectRatio: "5/6",
                position: "relative",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <Image
                src="/images/rug4.jpg"
                alt="Interior designer using The Fair Rugs"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              {/* Dark overlay for professionalism */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, rgba(26,18,8,0.15) 0%, rgba(26,18,8,0.5) 100%)",
                }}
              />
              {/* Interior text overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: "36px",
                  left: "36px",
                  right: "36px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    borderRadius: "var(--radius-lg)",
                    padding: "24px 28px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {[
                      { num: "500+", label: "Trade Clients" },
                      { num: "30%", label: "Trade Discount" },
                      { num: "24h", label: "Response Time" },
                    ].map((stat, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontFamily: "var(--font-cormorant), Georgia, serif",
                            fontSize: "28px",
                            fontWeight: 600,
                            color: "var(--primary)",
                            lineHeight: 1,
                            marginBottom: "4px",
                          }}
                        >
                          {stat.num}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "var(--foreground-muted)",
                            fontWeight: 500,
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "-24px",
                background: "var(--foreground)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 24px",
                boxShadow: "var(--shadow-xl)",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                Trusted by
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                500+ Designers
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "3px",
                  fontWeight: 300,
                }}
              >
                Across 45 Countries
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
