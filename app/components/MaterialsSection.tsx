"use client";

import Image from "next/image";
import Link from "next/link";

const materials = [
  {
    name: "Pure Wool",
    origin: "New Zealand & Rajasthan",
    description: "The gold standard of rug fibers. Hand-spun wool from free-range flocks delivers extraordinary softness, natural resilience, and a pile that deepens in beauty with age.",
    properties: ["Naturally flame-retardant", "Moisture-wicking", "Long-lasting durability", "Silky soft underfoot"],
    image: "/images/rug1.png",
    color: "var(--primary)",
  },
  {
    name: "Bamboo Silk",
    origin: "Sustainable Bamboo Forests",
    description: "The ultimate in rug luxury. Bamboo silk produces an iridescent sheen and incomparable softness, creating rugs that glow in light and shimmer with every step.",
    properties: ["Extraordinary sheen", "Hypoallergenic", "Eco-sustainable", "Temperature-regulating"],
    image: "/images/rug3.png",
    color: "var(--sage)",
  },
  {
    name: "Natural Jute",
    origin: "Bengal & Bihar",
    description: "Earth's most sustainable luxury fiber. Golden jute is hand-woven into rich, textural floor coverings that bring organic warmth and conscious elegance to any space.",
    properties: ["100% biodegradable", "Carbon-negative fiber", "Natural golden tone", "Naturally antibacterial"],
    image: "/images/rug8.jpeg",
    color: "#4a7c59",
  },
  {
    name: "Recycled Cotton",
    origin: "Upcycled from Indian Mills",
    description: "Beautiful sustainability in action. We transform premium textile offcuts into vibrant, durable rugs — giving waste materials a second life of extraordinary purpose.",
    properties: ["Zero-waste production", "Unique texture", "Vibrant color absorption", "Extremely durable"],
    image: "/images/rug7.png",
    color: "var(--walnut)",
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
              {/* Image */}
              <div style={{ position: "relative", width: "200px", flexShrink: 0, overflow: "hidden" }}>
                <Image
                  src={mat.image}
                  alt={mat.name}
                  fill
                  sizes="200px"
                  style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(to right, transparent 60%, var(--surface))`,
                }} />
              </div>

              {/* Content */}
              <div style={{ padding: "36px 32px", flex: 1 }}>
                <div style={{
                  display: "inline-block", padding: "4px 12px",
                  background: mat.color + "15",
                  border: `1px solid ${mat.color}30`,
                  borderRadius: "9999px", marginBottom: "16px",
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: mat.color,
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
    </section>
  );
}
