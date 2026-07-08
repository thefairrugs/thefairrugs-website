"use client";

import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Design & Consultation",
    duration: "1–3 days",
    description: "Every rug begins with a conversation. Our design team works with you to understand your space, style, and vision — then translates it into a detailed production brief.",
    details: ["Custom design sketching", "Color palette selection", "Material consultation", "Size and shape planning"],
    icon: "✏️",
  },
  {
    number: "02",
    title: "Material Sourcing",
    duration: "2–5 days",
    description: "We source only the finest natural fibers from trusted suppliers — pure wool from New Zealand, golden jute from Bengal, and premium silk from sustainable sources.",
    details: ["Hand-selected natural fibers", "Ethical sourcing", "Quality grading", "Color testing"],
    icon: "🌿",
  },
  {
    number: "03",
    title: "Dyeing & Preparation",
    duration: "3–7 days",
    description: "Fibers are hand-dyed using traditional plant-based and chrome dyes, achieving colours with extraordinary depth and permanence. Each batch is tested for colorfastness.",
    details: ["Natural and chrome dyes", "Traditional mordant process", "Colorfastness testing", "Fiber preparation"],
    icon: "🎨",
  },
  {
    number: "04",
    title: "Hand Weaving",
    duration: "2–5 weeks",
    description: "Master weavers spend weeks — sometimes months — creating each rug. Every knot, tuft, or weave is crafted by hand, building up the pile row by patient row.",
    details: ["200+ knots per sq inch", "Master artisan weaving", "Regular quality checks", "Traditional loom technique"],
    icon: "🧶",
  },
  {
    number: "05",
    title: "Finishing & Quality Control",
    duration: "3–5 days",
    description: "The completed rug undergoes rigorous quality inspection — washing, stretching, pile trimming, and final finishing to ensure every piece meets our uncompromising standards.",
    details: ["Hand washing & stretching", "Pile trimming & leveling", "Multi-point QC inspection", "Final photography"],
    icon: "✅",
  },
  {
    number: "06",
    title: "Packing & Worldwide Delivery",
    duration: "2–5 days",
    description: "Each rug is carefully rolled, wrapped, and packed to international shipping standards. We ship to 45+ countries with full insurance, tracking, and customs clearance support.",
    details: ["Archival quality packing", "Full shipping insurance", "Real-time tracking", "Customs documentation"],
    icon: "🚚",
  },
];

export default function ManufacturingProcess() {
  return (
    <section style={{
      padding: "110px 0",
      background: "linear-gradient(160deg, #edf2e5 0%, #f5f7f0 50%, #e8eddf 100%)",
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            <span className="eyebrow">How We Make It</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300,
            color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1.1,
            marginBottom: "18px",
          }}>
            The Journey of a Rug
          </h2>
          <p style={{
            color: "var(--foreground-muted)", fontSize: "17px",
            maxWidth: "540px", margin: "0 auto", lineHeight: 1.7, fontWeight: 300,
          }}>
            From the first design sketch to the moment it arrives at your door — a meticulous, human-led process that takes weeks of dedicated artisan work.
          </p>
        </div>

        {/* Steps Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-xl)",
                padding: "36px 32px",
                transition: "all 0.4s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = "var(--shadow-xl)";
                el.style.borderColor = "var(--border-green)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
                el.style.borderColor = "var(--border-light)";
              }}
            >
              {/* Step number watermark */}
              <div style={{
                position: "absolute", right: "20px", top: "16px",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "72px", fontWeight: 700, color: "var(--primary-pale)",
                lineHeight: 1, pointerEvents: "none", userSelect: "none",
              }}>
                {step.number}
              </div>

              {/* Icon */}
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{step.icon}</div>

              {/* Duration pill */}
              <div style={{
                display: "inline-block",
                padding: "4px 12px",
                background: "var(--sage-pale)",
                borderRadius: "9999px",
                fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.08em",
                color: "var(--primary)",
                marginBottom: "16px",
              }}>
                ⏱ {step.duration}
              </div>

              <h3 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "24px", fontWeight: 500,
                color: "var(--foreground)", marginBottom: "12px",
                letterSpacing: "-0.01em", lineHeight: 1.2,
              }}>
                {step.title}
              </h3>

              <p style={{
                fontSize: "14px", color: "var(--foreground-muted)",
                lineHeight: 1.75, fontWeight: 300, marginBottom: "20px",
              }}>
                {step.description}
              </p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
                {step.details.map((detail) => (
                  <li key={detail} style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    fontSize: "12px", color: "var(--foreground-muted)",
                  }}>
                    <span style={{
                      width: "16px", height: "16px", borderRadius: "50%",
                      background: "var(--primary-pale)", color: "var(--primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "9px", fontWeight: 700, flexShrink: 0,
                    }}>✓</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Timeline Note */}
        <div style={{
          textAlign: "center", marginTop: "60px",
          padding: "32px 40px",
          background: "var(--surface)",
          border: "1px solid var(--border-green)",
          borderRadius: "var(--radius-xl)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "32px",
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: "32px", fontWeight: 300, color: "var(--primary)", fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              3–6 Weeks
            </div>
            <div style={{ fontSize: "12px", color: "var(--foreground-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Total Production Time
            </div>
          </div>
          <div style={{ width: "1px", height: "48px", background: "var(--border)" }} />
          <div>
            <div style={{ fontSize: "32px", fontWeight: 300, color: "var(--primary)", fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              Free
            </div>
            <div style={{ fontSize: "12px", color: "var(--foreground-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Worldwide Shipping
            </div>
          </div>
          <div style={{ width: "1px", height: "48px", background: "var(--border)" }} />
          <div>
            <div style={{ fontSize: "32px", fontWeight: 300, color: "var(--primary)", fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              100%
            </div>
            <div style={{ fontSize: "12px", color: "var(--foreground-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Handmade
            </div>
          </div>
          <Link href="/custom-rug" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary" style={{ padding: "15px 36px", fontSize: "12px", letterSpacing: "0.1em" }}>
              Start Your Order
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .process-steps { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .process-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
