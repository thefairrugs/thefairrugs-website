"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    title: "Hand Tufted",
    sub: "Modern · Persian · Geometric · Irregular Shape",
    description:
      "A contemporary favourite — plush, vivid, and precisely crafted for today's interiors.",
    image: "/images/rug5.jpg",
    href: "/shop",
    tag: "Most Popular",
  },
  {
    title: "Hand Knotted",
    sub: "Modern · Oushak · Persian",
    description:
      "The pinnacle of rug-making. Each knot is tied by hand — heirlooms that last generations.",
    image: "/images/rug3.png",
    href: "/shop",
    tag: "Heritage Craft",
  },
  {
    title: "Durrie",
    sub: "Flat Weave Collection",
    description:
      "Lightweight, reversible, and elegant. A timeless flat-weave tradition reimagined.",
    image: "/images/rug6.png",
    href: "/shop",
    tag: "Classic",
  },
  {
    title: "Jute",
    sub: "Natural · Sustainable",
    description:
      "Earth-conscious luxury. Pure natural jute woven into refined, textural beauty.",
    image: "/images/rug8.jpeg",
    href: "/shop",
    tag: "Eco Luxury",
  },
];

export default function Categories() {
  return (
    <section
      style={{
        padding: "110px 0",
        background: "var(--surface-alt)",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            <span className="eyebrow">Our Collections</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 300,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "18px",
            }}
          >
            Shop by Craft
          </h2>

          <p
            style={{
              color: "var(--foreground-muted)",
              fontSize: "17px",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Centuries of artisanal tradition, expressed through four distinct weaving techniques.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
          }}
        >
          {categories.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <div
                className="category-card"
                style={{
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-8px)";
                  el.style.boxShadow = "var(--shadow-xl)";
                  el.style.borderColor = "var(--border)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "var(--shadow-sm)";
                  el.style.borderColor = "var(--border-light)";
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    height: "280px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                    }}
                  />
                  {/* Tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      background: "rgba(26,18,8,0.75)",
                      color: "var(--gold-light)",
                      padding: "5px 12px",
                      borderRadius: "9999px",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {item.tag}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "28px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "26px",
                      fontWeight: 500,
                      color: "var(--foreground)",
                      letterSpacing: "-0.01em",
                      marginBottom: "6px",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--primary)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      marginBottom: "14px",
                    }}
                  >
                    {item.sub}
                  </p>

                  <p
                    style={{
                      color: "var(--foreground-muted)",
                      fontSize: "14px",
                      lineHeight: "1.7",
                      fontWeight: 300,
                      marginBottom: "24px",
                    }}
                  >
                    {item.description}
                  </p>

                  {/* CTA */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--primary)",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Explore Collection
                    <span
                      style={{
                        display: "inline-block",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "56px" }}>
          <Link href="/shop" style={{ textDecoration: "none" }}>
            <button
              className="btn btn-outline"
              style={{
                padding: "15px 40px",
                fontSize: "12px",
                letterSpacing: "0.1em",
              }}
            >
              View All Collections →
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .categories-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
