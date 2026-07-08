"use client";

import Link from "next/link";
import Image from "next/image";

const rugs = [
  {
    image: "/images/rug1.png",
    title: "Vintage Oushak Rug",
    material: "Hand Knotted · Wool",
    price: "$249",
    oldPrice: "$399",
    reviews: "245",
    badge: "Bestseller",
  },
  {
    image: "/images/rug2.png",
    title: "Moroccan Wool Rug",
    material: "Hand Tufted · Premium Wool",
    price: "$299",
    oldPrice: "$449",
    reviews: "198",
    badge: "New",
  },
  {
    image: "/images/rug3.png",
    title: "Hand Knotted Wool Rug",
    material: "Hand Knotted · Pure Wool",
    price: "$399",
    oldPrice: "$549",
    reviews: "312",
    badge: "Heritage",
  },
  {
    image: "/images/rug4.jpg",
    title: "Geometric Area Rug",
    material: "Hand Tufted · Wool-Blend",
    price: "$279",
    oldPrice: "$389",
    reviews: "156",
    badge: null,
  },
  {
    image: "/images/rug5.jpg",
    title: "Modern Abstract Rug",
    material: "Hand Tufted · New Zealand Wool",
    price: "$329",
    oldPrice: "$469",
    reviews: "287",
    badge: "Featured",
  },
  {
    image: "/images/rug6.png",
    title: "Scandinavian Wool Rug",
    material: "Durrie · Flat Weave",
    price: "$289",
    oldPrice: "$419",
    reviews: "175",
    badge: null,
  },
  {
    image: "/images/rug7.png",
    title: "Boho Handmade Rug",
    material: "Hand Tufted · Recycled Fiber",
    price: "$259",
    oldPrice: "$379",
    reviews: "221",
    badge: "Eco",
  },
  {
    image: "/images/rug8.jpeg",
    title: "Custom Tufted Rug",
    material: "Hand Tufted · Jute",
    price: "$349",
    oldPrice: "$499",
    reviews: "268",
    badge: "Exclusive",
  },
];

const badgeColors: Record<string, { bg: string; color: string }> = {
  Bestseller: { bg: "#c9a96e", color: "#1a1208" },
  New: { bg: "#8B5E3C", color: "#fff" },
  Heritage: { bg: "#1a1208", color: "#c9a96e" },
  Featured: { bg: "#8B5E3C", color: "#fff" },
  Eco: { bg: "#4a7c59", color: "#fff" },
  Exclusive: { bg: "#6d4629", color: "#e8d9bd" },
};

export default function FeaturedRugs() {
  return (
    <section
      style={{
        padding: "110px 0",
        background: "var(--background)",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            <span className="eyebrow">Curated Selection</span>
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
            Featured Collection
          </h2>

          <p
            style={{
              color: "var(--foreground-muted)",
              fontSize: "17px",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Handpicked masterpieces from our artisan workshops, each telling a story of extraordinary craftsmanship.
          </p>
        </div>

        {/* Rugs Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "28px",
          }}
        >
          {rugs.map((rug, index) => (
            <Link key={index} href="/shop" style={{ textDecoration: "none" }}>
              <div
                className="rug-card"
                style={{
                  position: "relative",
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
                  const img = el.querySelector("img") as HTMLImageElement;
                  if (img) img.style.transform = "scale(1.06)";
                  const overlay = el.querySelector(".rug-hover-overlay") as HTMLElement;
                  if (overlay) overlay.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "var(--shadow-sm)";
                  el.style.borderColor = "var(--border-light)";
                  const img = el.querySelector("img") as HTMLImageElement;
                  if (img) img.style.transform = "scale(1)";
                  const overlay = el.querySelector(".rug-hover-overlay") as HTMLElement;
                  if (overlay) overlay.style.opacity = "0";
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: "280px", overflow: "hidden" }}>
                  <Image
                    src={rug.image}
                    alt={rug.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                  {/* Overlay */}
                  <div
                    className="rug-hover-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(26,18,8,0.6) 0%, transparent 55%)",
                      opacity: 0,
                      transition: "opacity 0.4s ease",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "20px",
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      View Details →
                    </span>
                  </div>

                  {/* Badge */}
                  {rug.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        padding: "4px 11px",
                        borderRadius: "9999px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        background: badgeColors[rug.badge]?.bg || "var(--primary)",
                        color: badgeColors[rug.badge]?.color || "#fff",
                      }}
                    >
                      {rug.badge}
                    </div>
                  )}

                  {/* Discount tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      background: "#e63946",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    SALE
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "22px 24px 26px" }}>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "var(--primary)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    {rug.material}
                  </p>

                  <h3
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "22px",
                      fontWeight: 500,
                      color: "var(--foreground)",
                      letterSpacing: "-0.01em",
                      marginBottom: "12px",
                      lineHeight: 1.2,
                    }}
                  >
                    {rug.title}
                  </h3>

                  {/* Stars */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "14px",
                    }}
                  >
                    <span style={{ color: "var(--gold)", fontSize: "13px", letterSpacing: "2px" }}>
                      ★★★★★
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--foreground-muted)",
                      }}
                    >
                      ({rug.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "var(--primary)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {rug.price}
                    </span>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#bbb",
                        textDecoration: "line-through",
                        fontWeight: 400,
                      }}
                    >
                      {rug.oldPrice}
                    </span>
                  </div>

                  {/* Quick Quote */}
                  <button
                    style={{
                      marginTop: "18px",
                      width: "100%",
                      padding: "12px",
                      background: "transparent",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--foreground)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      const btn = e.currentTarget as HTMLButtonElement;
                      btn.style.borderColor = "var(--primary)";
                      btn.style.background = "var(--primary)";
                      btn.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      const btn = e.currentTarget as HTMLButtonElement;
                      btn.style.borderColor = "var(--border)";
                      btn.style.background = "transparent";
                      btn.style.color = "var(--foreground)";
                    }}
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <Link href="/shop" style={{ textDecoration: "none" }}>
            <button
              className="btn btn-dark"
              style={{
                padding: "17px 48px",
                fontSize: "12px",
                letterSpacing: "0.12em",
              }}
            >
              View All Rugs
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
