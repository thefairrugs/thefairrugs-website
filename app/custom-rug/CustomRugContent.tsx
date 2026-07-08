"use client";

import Image from "next/image";
import Link from "next/link";

const processSteps = [
  {
    step: "01",
    title: "Share Your Vision",
    desc: "Tell us about your space, your style, and your requirements. Share any reference images, colour palettes, or design ideas.",
  },
  {
    step: "02",
    title: "Design Consultation",
    desc: "Our design team creates a detailed specification and digital preview of your rug. We refine until it's perfect.",
  },
  {
    step: "03",
    title: "Expert Weaving",
    desc: "Our master artisans weave your rug on traditional handlooms using the finest materials. Production takes 3–5 weeks.",
  },
  {
    step: "04",
    title: "Quality & Delivery",
    desc: "Your rug is inspected, finished, photographed, and delivered worldwide — fully insured, door-to-door.",
  },
];

const customOptions = [
  {
    title: "Any Size",
    desc: "From small accent rugs to expansive room-sized carpets. We work in metric or imperial — your choice.",
    icon: "⬛",
  },
  {
    title: "Any Shape",
    desc: "Rectangle, round, runner, oval, square, irregular, or completely custom shaped to your floor plan.",
    icon: "◐",
  },
  {
    title: "Any Material",
    desc: "New Zealand wool, Himalayan silk, bamboo silk, organic cotton, jute, or luxurious wool-silk blends.",
    icon: "🧵",
  },
  {
    title: "Any Design",
    desc: "Traditional, contemporary, geometric, abstract, bespoke patterns, or an exact match to your design specification.",
    icon: "🎨",
  },
  {
    title: "Any Colour",
    desc: "Pantone-matched colours using natural, eco-friendly dyes. We can match existing decor palettes precisely.",
    icon: "🎨",
  },
  {
    title: "Any Technique",
    desc: "Hand knotted, hand tufted, flat weave durrie, or natural jute — each offering a distinct texture and character.",
    icon: "✦",
  },
];

export default function CustomRugContent() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "var(--foreground)",
          padding: "100px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 70% 40%, rgba(201,169,110,0.08) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            className="two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "center",
            }}
          >
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
                <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
                Bespoke Service
              </p>

              <h1
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "clamp(44px, 6vw, 72px)",
                  fontWeight: 300,
                  color: "#fff",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.08,
                  marginBottom: "28px",
                }}
              >
                Your Vision,
                <br />
                <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
                  Perfectly Woven
                </em>
              </h1>

              <p
                style={{
                  fontSize: "17px",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.65)",
                  fontWeight: 300,
                  maxWidth: "480px",
                  marginBottom: "44px",
                }}
              >
                Every custom rug we create is a singular work of art, crafted to your exact specifications by master artisans with decades of experience.
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a href="#configurator" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      background: "var(--gold)",
                      color: "var(--foreground)",
                      border: "none",
                      padding: "17px 36px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxShadow: "0 4px 20px rgba(201,169,110,0.35)",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#b8954e";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    }}
                  >
                    Use the Configurator
                  </button>
                </a>
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      background: "transparent",
                      color: "#fff",
                      border: "1.5px solid rgba(255,255,255,0.4)",
                      padding: "16px 32px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.8)";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.4)";
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    Talk to a Designer
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div>
              <div
                style={{
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  aspectRatio: "4/5",
                  position: "relative",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src="/images/rug3.png"
                  alt="Custom handmade luxury rug"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Options Grid */}
      <section style={{ padding: "110px 0", background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; Fully Customisable</p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 300,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Everything is Custom
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {customOptions.map((opt, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                  padding: "36px 32px",
                  border: "1px solid var(--border-light)",
                  transition: "all 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "var(--shadow-lg)";
                  el.style.borderColor = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                  el.style.borderColor = "var(--border-light)";
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "16px" }}>
                  {opt.icon}
                </div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    marginBottom: "12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {opt.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--foreground-muted)",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {opt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: "110px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; How It Works</p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 300,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              From Idea to Doorstep
            </h2>
          </div>

          <div
            className="process-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "40px",
            }}
          >
            {processSteps.map((step, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    margin: "0 auto 24px",
                    boxShadow: "0 6px 20px rgba(139,94,60,0.3)",
                  }}
                >
                  {step.step}
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    marginBottom: "12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--foreground-muted)",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
