"use client";

import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Design & Consultation",
    description:
      "Every journey begins with a conversation. Our design team collaborates with you to translate your vision into detailed specifications.",
  },
  {
    number: "02",
    title: "Material Selection",
    description:
      "We hand-select premium wools, silks, and natural fibres from trusted sustainable sources, chosen for quality and longevity.",
  },
  {
    number: "03",
    title: "Artisan Weaving",
    description:
      "Master weavers in our Jaipur workshops bring your design to life, working with care and precision on traditional handlooms.",
  },
  {
    number: "04",
    title: "Quality & Finish",
    description:
      "Each rug undergoes rigorous quality inspection, washing, stretching, and finishing before it earns The Fair Rugs mark.",
  },
];

export default function Craftsmanship() {
  return (
    <section
      style={{
        padding: "120px 0",
        background: "var(--surface-alt)",
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
          {/* Left: Image Stack */}
          <div style={{ position: "relative" }}>
            {/* Main image */}
            <div
              style={{
                position: "relative",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                aspectRatio: "4/5",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <Image
                src="/images/rug2.png"
                alt="Artisan weaving a luxury rug"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              {/* Overlay text */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "40px 36px",
                  background:
                    "linear-gradient(to top, rgba(26,18,8,0.85) 0%, transparent 100%)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "28px",
                    fontStyle: "italic",
                    color: "#fff",
                    fontWeight: 300,
                    lineHeight: 1.3,
                  }}
                >
                  &ldquo;Each rug carries the
                  <br />
                  soul of its maker.&rdquo;
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    color: "var(--gold)",
                    marginTop: "12px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  — Jaipur Workshop
                </p>
              </div>
            </div>

            {/* Floating card */}
            <div
              style={{
                position: "absolute",
                top: "-28px",
                right: "-28px",
                background: "var(--foreground)",
                color: "#fff",
                borderRadius: "var(--radius-lg)",
                padding: "28px 32px",
                boxShadow: "var(--shadow-xl)",
                zIndex: 2,
                minWidth: "180px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "52px",
                  fontWeight: 300,
                  color: "var(--gold)",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                15+
              </div>
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 500,
                }}
              >
                Years of
                <br />
                Excellence
              </div>
            </div>

            {/* Second floating element */}
            <div
              style={{
                position: "absolute",
                bottom: "36px",
                left: "-32px",
                background: "var(--gold)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 24px",
                boxShadow: "var(--shadow-lg)",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--foreground)",
                  marginBottom: "4px",
                }}
              >
                Certified
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  letterSpacing: "-0.01em",
                }}
              >
                Handmade in India
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--primary)",
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
                  background: "var(--primary)",
                  display: "inline-block",
                }}
              />
              Our Process
            </p>

            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(36px, 4vw, 52px)",
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--foreground)",
                marginBottom: "24px",
              }}
            >
              The Art of
              <br />
              <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
                Handmade Excellence
              </em>
            </h2>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "var(--foreground-muted)",
                fontWeight: 300,
                marginBottom: "48px",
              }}
            >
              From design concept to your doorstep, every stage of our process
              is guided by one principle: uncompromising quality. We believe
              that a truly exceptional rug is not manufactured — it is
              cultivated with patience, skill, and reverence for the craft.
            </p>

            {/* Process Steps */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                marginBottom: "48px",
              }}
            >
              {steps.map((step) => (
                <div
                  key={step.number}
                  style={{
                    display: "flex",
                    gap: "24px",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Number */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      border: "1.5px solid var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "var(--primary)",
                    }}
                  >
                    {step.number}
                  </div>
                  {/* Text */}
                  <div>
                    <h4
                      style={{
                        fontSize: "17px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        marginBottom: "6px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--foreground-muted)",
                        lineHeight: 1.7,
                        fontWeight: 300,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/custom-rug" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary" style={{ padding: "16px 36px" }}>
                  Start Your Custom Rug
                </button>
              </Link>
              <Link href="/about" style={{ textDecoration: "none" }}>
                <button className="btn btn-outline" style={{ padding: "15px 32px" }}>
                  Our Story
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
