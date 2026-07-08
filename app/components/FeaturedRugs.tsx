"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { constructionToRugType, computePrice } from "../lib/pricing";

// 5×8 ft reference display size (40 sq.ft)
const DISPLAY_SQFT = 40;

interface DiscountConfig {
  active: boolean;
  type: "percent" | "fixed";
  value: number;
  label: string;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  rugType: string;
  construction: string;
  image: string;
  images?: string[];
  badge?: string | null;
  reviews?: number;
  active?: boolean;
}

const badgeColors: Record<string, { bg: string; color: string }> = {
  Bestseller: { bg: "var(--gold)",        color: "var(--foreground)" },
  New:        { bg: "var(--primary)",     color: "#fff" },
  Heritage:   { bg: "var(--charcoal)",    color: "var(--gold-light)" },
  Featured:   { bg: "var(--sage)",        color: "#fff" },
  Eco:        { bg: "#4a7c59",            color: "#fff" },
  Exclusive:  { bg: "var(--walnut)",      color: "#e8dfd0" },
};

export default function FeaturedRugs() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [discount, setDiscount]   = useState<DiscountConfig | null>(null);
  const [loading, setLoading]     = useState(true);

  // Fetch live products from the admin database — single source of truth
  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          // Only show active products
          setProducts(data.filter((p) => p.active !== false));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch live discount config
  useEffect(() => {
    fetch("/api/admin/discount")
      .then((r) => r.json())
      .then((d) => { if (d.active) setDiscount(d); })
      .catch(() => {});
  }, []);

  return (
    <section style={{ padding: "110px 0", background: "var(--background)" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            <span className="eyebrow">Curated Selection</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 300, color: "var(--foreground)",
            letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "18px",
          }}>
            Featured Collection
          </h2>
          <p style={{
            color: "var(--foreground-muted)", fontSize: "17px",
            maxWidth: "480px", margin: "0 auto",
            lineHeight: 1.7, fontWeight: 300,
          }}>
            Handpicked masterpieces from our artisan workshops — each telling a story of extraordinary craftsmanship.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                borderRadius: "var(--radius-lg)", overflow: "hidden",
                border: "1px solid var(--border-light)", background: "var(--surface)",
              }}>
                <div style={{ height: "280px", background: "linear-gradient(90deg, #f0ece4 25%, #e8e4dc 50%, #f0ece4 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                <div style={{ padding: "22px 24px 26px" }}>
                  <div style={{ height: "10px", width: "60%", background: "#e8e4dc", borderRadius: "4px", marginBottom: "12px" }} />
                  <div style={{ height: "22px", width: "80%", background: "#e8e4dc", borderRadius: "4px", marginBottom: "12px" }} />
                  <div style={{ height: "18px", width: "45%", background: "#e8e4dc", borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No products state */}
        {!loading && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧶</div>
            <p style={{ color: "var(--foreground-muted)", fontSize: "16px" }}>
              No products in the collection yet.
            </p>
          </div>
        )}

        {/* Rugs Grid — live from database */}
        {!loading && products.length > 0 && (
          <div
            className="featured-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" }}
          >
            {products.map((rug) => {
              const rugTypeId = constructionToRugType(rug.construction);
              const pricing = computePrice(
                DISPLAY_SQFT,
                rugTypeId,
                1.0,
                discount ? { enabled: true, type: discount.type, value: discount.value } : undefined,
              );
              return (
                <Link key={rug.id} href={`/products/${rug.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      position: "relative", background: "var(--surface)",
                      borderRadius: "var(--radius-lg)", overflow: "hidden",
                      border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)",
                      cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-8px)";
                      el.style.boxShadow = "var(--shadow-xl)";
                      el.style.borderColor = "var(--border-green)";
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
                      {/* Hover overlay */}
                      <div
                        className="rug-hover-overlay"
                        style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(to top, rgba(28,35,20,0.65) 0%, transparent 55%)",
                          opacity: 0, transition: "opacity 0.4s ease",
                          display: "flex", alignItems: "flex-end", padding: "20px",
                        }}
                      >
                        <span style={{
                          color: "#fff", fontSize: "12px", fontWeight: 700,
                          letterSpacing: "0.1em", textTransform: "uppercase",
                        }}>
                          View Details →
                        </span>
                      </div>

                      {/* Product badge */}
                      {rug.badge && (
                        <div style={{
                          position: "absolute", top: "14px", left: "14px",
                          padding: "4px 12px", borderRadius: "9999px",
                          fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          background: badgeColors[rug.badge]?.bg || "var(--primary)",
                          color: badgeColors[rug.badge]?.color || "#fff",
                        }}>
                          {rug.badge}
                        </div>
                      )}

                      {/* Sale badge — only when discount is active */}
                      {discount && (
                        <div style={{
                          position: "absolute", top: "14px", right: "14px",
                          background: "#dc2626", color: "#fff",
                          padding: "3px 9px", borderRadius: "9999px",
                          fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
                        }}>
                          {discount.label}
                        </div>
                      )}
                    </div>

                    {/* Card content */}
                    <div style={{ padding: "22px 24px 26px" }}>
                      <p style={{
                        fontSize: "10px", color: "var(--primary)",
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        fontWeight: 600, marginBottom: "8px",
                      }}>
                        {rug.subtitle || rug.category}
                      </p>

                      <h3 style={{
                        fontFamily: "var(--font-cormorant), Georgia, serif",
                        fontSize: "22px", fontWeight: 500,
                        color: "var(--foreground)", letterSpacing: "-0.01em",
                        marginBottom: "12px", lineHeight: 1.2,
                      }}>
                        {rug.title}
                      </h3>

                      {/* Stars */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                        <span style={{ color: "var(--gold)", fontSize: "13px", letterSpacing: "2px" }}>★★★★★</span>
                        <span style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>({rug.reviews ?? 0})</span>
                      </div>

                      {/* Dynamic Price */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.02em" }}>
                          From {pricing.priceLabel}
                        </span>
                        {pricing.discountedPrice !== null && (
                          <span style={{ fontSize: "13px", color: "#bbb", textDecoration: "line-through" }}>
                            ${Math.round(pricing.basePrice)}
                          </span>
                        )}
                      </div>
                      {pricing.discountedPrice !== null && (
                        <p style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600, marginBottom: "4px" }}>
                          Save {pricing.savingsPct}% · {discount?.label}
                        </p>
                      )}
                      <p style={{ fontSize: "11px", color: "var(--foreground-muted)", marginBottom: "18px" }}>
                        For 5×8 ft · {pricing.perSqftLabel}
                      </p>

                      {/* CTA */}
                      <div style={{
                        width: "100%", padding: "11px",
                        background: "var(--primary-pale)", color: "var(--primary)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", textAlign: "center",
                        border: "1.5px solid var(--border-green)",
                      }}>
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All */}
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <Link href="/shop" style={{ textDecoration: "none" }}>
            <button className="btn btn-dark" style={{ padding: "17px 48px", fontSize: "12px", letterSpacing: "0.12em" }}>
              View All Rugs
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
