"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  image: string;
  rugType: string;
  active?: boolean;
}

// Static craft definitions — images are fetched dynamically from live products
const CRAFTS = [
  {
    slug: "hand-tufted",
    title: "Hand Tufted",
    sub: "Modern · Persian · Geometric · Irregular Shape",
    description: "A contemporary favourite — plush, vivid, and precisely crafted for today's interiors.",
    tag: "Most Popular",
    tagColor: "var(--primary)",
    fallbackGradient: "linear-gradient(135deg, #2d2c28 0%, #1c1a16 100%)",
  },
  {
    slug: "hand-knotted",
    title: "Hand Knotted",
    sub: "Modern · Oushak · Persian",
    description: "The pinnacle of rug-making. Each knot is tied by hand — heirlooms that last generations.",
    tag: "Heritage Craft",
    tagColor: "var(--walnut)",
    fallbackGradient: "linear-gradient(135deg, #2a2218 0%, #1a1510 100%)",
  },
  {
    slug: "durrie",
    title: "Durrie",
    sub: "Flat Weave Collection",
    description: "Lightweight, reversible, and elegant. A timeless flat-weave tradition reimagined.",
    tag: "Classic",
    tagColor: "var(--sage)",
    fallbackGradient: "linear-gradient(135deg, #22281e 0%, #161c13 100%)",
  },
  {
    slug: "jute",
    title: "Jute",
    sub: "Natural · Sustainable",
    description: "Earth-conscious luxury. Pure natural jute woven into refined, textural beauty.",
    tag: "Eco Luxury",
    tagColor: "#4a7c59",
    fallbackGradient: "linear-gradient(135deg, #1e2818 0%, #121c0e 100%)",
  },
];

export default function Categories() {
  // Map of rugType slug → first product image URL
  const [craftImages, setCraftImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const active = data.filter((p) => p.active !== false && p.image);
        const map: Record<string, string> = {};
        // For each craft type, find the first active product of that type
        for (const craft of CRAFTS) {
          const match = active.find((p) => p.rugType === craft.slug);
          if (match) map[craft.slug] = match.image;
        }
        setCraftImages(map);
      })
      .catch(() => {});
  }, []);

  return (
    <section style={{ padding: "110px 0", background: "var(--surface-alt)" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            <span className="eyebrow">Our Collections</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 300, color: "var(--foreground)",
            letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "18px",
          }}>
            Shop by Craft
          </h2>
          <p style={{
            color: "var(--foreground-muted)", fontSize: "17px",
            maxWidth: "500px", margin: "0 auto",
            lineHeight: 1.7, fontWeight: 300,
          }}>
            Centuries of artisanal tradition, expressed through four distinct weaving techniques.
          </p>
        </div>

        {/* Grid */}
        <div
          className="cat-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}
        >
          {CRAFTS.map((item) => {
            const img = craftImages[item.slug] || null;
            return (
              <Link
                key={item.slug}
                href={`/shop?category=${item.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--surface)", borderRadius: "var(--radius-lg)",
                    overflow: "hidden", border: "1px solid var(--border-light)",
                    boxShadow: "var(--shadow-sm)", cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-8px)";
                    el.style.boxShadow = "var(--shadow-xl)";
                    el.style.borderColor = "var(--border-green)";
                    const imgEl = el.querySelector("img") as HTMLImageElement | null;
                    if (imgEl) imgEl.style.transform = "scale(1.07)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "var(--shadow-sm)";
                    el.style.borderColor = "var(--border-light)";
                    const imgEl = el.querySelector("img") as HTMLImageElement | null;
                    if (imgEl) imgEl.style.transform = "scale(1)";
                  }}
                >
                  {/* Image area */}
                  <div
                    style={{
                      position: "relative", height: "280px", overflow: "hidden",
                      background: img ? "transparent" : item.fallbackGradient,
                    }}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={`${item.title} rug`}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        style={{
                          objectFit: "cover",
                          transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                        }}
                      />
                    ) : (
                      /* CSS-only placeholder when no product image exists for this type */
                      <>
                        <div
                          style={{
                            position: "absolute", inset: 0,
                            backgroundImage: `
                              repeating-linear-gradient(
                                45deg,
                                transparent, transparent 20px,
                                rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px
                              )
                            `,
                          }}
                        />
                        <div style={{
                          position: "absolute", inset: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <div style={{
                            fontFamily: "var(--font-cormorant), Georgia, serif",
                            fontSize: "64px", fontWeight: 300,
                            color: "rgba(184,151,90,0.25)",
                            letterSpacing: "-0.03em",
                          }}>
                            {item.title[0]}
                          </div>
                        </div>
                      </>
                    )}
                    {/* Gradient overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(28,35,20,0.4) 0%, transparent 60%)",
                    }} />
                    {/* Tag */}
                    <div style={{
                      position: "absolute", top: "16px", left: "16px",
                      background: item.tagColor, color: "#fff",
                      padding: "5px 12px", borderRadius: "9999px",
                      fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}>
                      {item.tag}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "28px" }}>
                    <h3 style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "26px", fontWeight: 500,
                      color: "var(--foreground)", letterSpacing: "-0.01em",
                      marginBottom: "6px", lineHeight: 1.2,
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontSize: "11px", color: "var(--primary)",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      fontWeight: 600, marginBottom: "14px",
                    }}>
                      {item.sub}
                    </p>
                    <p style={{
                      color: "var(--foreground-muted)", fontSize: "14px",
                      lineHeight: "1.7", fontWeight: 300, marginBottom: "24px",
                    }}>
                      {item.description}
                    </p>

                    {/* CTA */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      color: "var(--primary)", fontSize: "12px",
                      fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                    }}>
                      Explore Collection
                      <span style={{ display: "inline-block", transition: "transform 0.2s ease" }}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "56px" }}>
          <Link href="/shop" style={{ textDecoration: "none" }}>
            <button className="btn btn-outline" style={{ padding: "15px 40px", fontSize: "12px", letterSpacing: "0.1em" }}>
              View All Collections →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
