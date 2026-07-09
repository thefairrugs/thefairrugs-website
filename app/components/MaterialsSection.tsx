"use client";

import Link from "next/link";

const materials = [
  {
    name: "Pure Wool",
    origin: "New Zealand & Rajasthan",
    description: "The gold standard of rug fibers. Hand-spun wool from free-range flocks delivers extraordinary softness, natural resilience, and a pile that deepens in beauty with age.",
    properties: ["Naturally flame-retardant", "Moisture-wicking", "Long-lasting durability", "Silky soft underfoot"],
    accentColor: "var(--primary)",
    // Warm cream/ivory tones representing wool texture
    bgGradient: "linear-gradient(135deg, #f5f0e8 0%, #ede3d0 40%, #e8ddc8 100%)",
    patternColor: "rgba(139,94,60,0.06)",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="28" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="38" cy="22" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="32" r="7" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="28" cy="40" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 44 Q32 50 54 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    name: "Bamboo Silk",
    origin: "Sustainable Bamboo Forests",
    description: "The ultimate in rug luxury. Bamboo silk produces an iridescent sheen and incomparable softness, creating rugs that glow in light and shimmer with every step.",
    properties: ["Extraordinary sheen", "Hypoallergenic", "Eco-sustainable", "Temperature-regulating"],
    accentColor: "var(--sage)",
    // Deep sage/forest greens representing bamboo
    bgGradient: "linear-gradient(135deg, #e8ede0 0%, #d8e4cc 40%, #ccd8be 100%)",
    patternColor: "rgba(74,124,89,0.07)",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8 Q20 32 20 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 12 Q32 36 32 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M44 8 Q44 32 44 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 24 Q26 20 32 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M32 18 Q38 14 44 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M20 40 Q26 36 32 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M32 34 Q38 30 44 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    name: "Natural Jute",
    origin: "Bengal & Bihar",
    description: "Earth's most sustainable luxury fiber. Golden jute is hand-woven into rich, textural floor coverings that bring organic warmth and conscious elegance to any space.",
    properties: ["100% biodegradable", "Carbon-negative fiber", "Natural golden tone", "Naturally antibacterial"],
    accentColor: "#4a7c59",
    // Golden-amber tones representing natural jute fiber
    bgGradient: "linear-gradient(135deg, #f0e8d0 0%, #e6d8b0 40%, #dcc890 100%)",
    patternColor: "rgba(120,90,30,0.07)",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 32 Q20 20 32 32 Q44 44 56 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M8 24 Q20 12 32 24 Q44 36 56 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M8 40 Q20 28 32 40 Q44 52 56 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: "Recycled Cotton",
    origin: "Upcycled from Indian Mills",
    description: "Beautiful sustainability in action. We transform premium textile offcuts into vibrant, durable rugs — giving waste materials a second life of extraordinary purpose.",
    properties: ["Zero-waste production", "Unique texture", "Vibrant color absorption", "Extremely durable"],
    accentColor: "var(--walnut)",
    // Soft white/cotton tones
    bgGradient: "linear-gradient(135deg, #f8f4ee 0%, #ede8e0 40%, #e4ddd4 100%)",
    patternColor: "rgba(100,70,40,0.05)",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 8 C22 8 14 16 14 26 C14 36 22 44 32 44 C42 44 50 36 50 26 C50 16 42 8 32 8Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M32 44 L32 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 50 L32 56 L40 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 20 Q32 16 42 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M18 28 Q32 22 46 28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="24" cy="16" r="2" fill="currentColor" opacity="0.4" />
        <circle cx="40" cy="16" r="2" fill="currentColor" opacity="0.4" />
        <circle cx="32" cy="12" r="2" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
];

export default function MaterialsSection() {
  return (
    <section style={{ padding: "110px 0", background: "var(--background)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            <span className="eyebrow">Premium Materials</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300,
            color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1.1,
            marginBottom: "18px",
          }}>
            The Finest Natural Fibers
          </h2>
          <p style={{
            color: "var(--foreground-muted)", fontSize: "17px",
            maxWidth: "540px", margin: "0 auto", lineHeight: 1.7, fontWeight: 300,
          }}>
            Every material we use is sourced responsibly and selected for its extraordinary quality, sustainability, and artisan suitability.
          </p>
        </div>

        {/* Materials Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "32px" }}>
          {materials.map((mat, i) => (
            <div
              key={i}
              style={{
                display: "flex", gap: "0",
                background: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.4s ease",
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
                el.style.boxShadow = "var(--shadow-sm)";
                el.style.borderColor = "var(--border-light)";
              }}
            >
              {/* Visual panel — CSS texture representing the material */}
              <div
                style={{
                  position: "relative",
                  width: "200px",
                  flexShrink: 0,
                  overflow: "hidden",
                  background: mat.bgGradient,
                }}
              >
                {/* Subtle woven texture overlay */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `
                      repeating-linear-gradient(
                        0deg,
                        transparent, transparent 3px,
                        ${mat.patternColor} 3px, ${mat.patternColor} 4px
                      ),
                      repeating-linear-gradient(
                        90deg,
                        transparent, transparent 3px,
                        ${mat.patternColor} 3px, ${mat.patternColor} 4px
                      )
                    `,
                  }}
                />
                {/* Diagonal accent lines */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `
                      repeating-linear-gradient(
                        45deg,
                        transparent, transparent 12px,
                        ${mat.patternColor} 12px, ${mat.patternColor} 13px
                      )
                    `,
                  }}
                />
                {/* Icon centered */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: mat.accentColor,
                    opacity: 0.6,
                  }}
                >
                  {mat.icon}
                </div>
                {/* Right fade to blend with content */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(to right, transparent 60%, var(--surface))`,
                }} />
              </div>

              {/* Content */}
              <div style={{ padding: "36px 32px", flex: 1 }}>
                <div style={{
                  display: "inline-block", padding: "4px 12px",
                  background: mat.accentColor + "15",
                  border: `1px solid ${mat.accentColor}30`,
                  borderRadius: "9999px", marginBottom: "16px",
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: mat.accentColor,
                }}>
                  {mat.origin}
                </div>

                <h3 style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "28px", fontWeight: 500,
                  color: "var(--foreground)", marginBottom: "12px",
                  letterSpacing: "-0.01em",
                }}>
                  {mat.name}
                </h3>

                <p style={{
                  fontSize: "14px", color: "var(--foreground-muted)",
                  lineHeight: 1.7, fontWeight: 300, marginBottom: "20px",
                }}>
                  {mat.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {mat.properties.map((prop) => (
                    <span key={prop} style={{
                      padding: "4px 10px",
                      background: "var(--surface-alt)",
                      borderRadius: "9999px",
                      fontSize: "11px", color: "var(--foreground-muted)", fontWeight: 500,
                    }}>
                      ✓ {prop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <Link href="/custom-rug" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary" style={{ padding: "17px 48px", fontSize: "12px", letterSpacing: "0.1em" }}>
              Design With Your Favourite Material
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .materials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
