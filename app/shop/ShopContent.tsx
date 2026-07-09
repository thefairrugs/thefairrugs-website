"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { constructionToRugType, computePrice, sizes, type PricingItem } from "../lib/pricing";

// ── Default reference size for "from $X" display (5×8 ft = 40 sqft) ──────────
const DISPLAY_SIZE = sizes.find((s) => s.name === "5×8 ft") || { sqft: 40 };

interface DiscountConfig {
  active: boolean;
  type: "percent" | "fixed";
  value: number;
  label: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  active: boolean;
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
  // Smart pricing
  priceAdjustment?: number;
  // Attributes
  primaryColor?: string;
  secondaryColor?: string;
  homeStyle?: string;
  occasion?: string;
  room?: string;
  rugTypeTags?: string;
  pileHeight?: string;
}

const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Rugs", slug: "all", active: true },
  { id: "hand-knotted", name: "Hand Knotted", slug: "hand-knotted", active: true },
  { id: "hand-tufted", name: "Hand Tufted", slug: "hand-tufted", active: true },
  { id: "durrie", name: "Durrie", slug: "durrie", active: true },
  { id: "jute", name: "Jute", slug: "jute", active: true },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Reviewed", value: "reviews" },
];

const badgeColors: Record<string, { bg: string; color: string }> = {
  Bestseller: { bg: "var(--gold)", color: "var(--foreground)" },
  New: { bg: "var(--primary)", color: "#fff" },
  Heritage: { bg: "var(--charcoal)", color: "var(--gold-light)" },
  Featured: { bg: "var(--sage)", color: "#fff" },
  Eco: { bg: "#4a7c59", color: "#fff" },
  Exclusive: { bg: "var(--walnut)", color: "#e8dfd0" },
};

export default function ShopContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [discount, setDiscount] = useState<DiscountConfig | null>(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [dbProducts, setDbProducts] = useState<Product[] | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [pricingData, setPricingData] = useState<PricingItem[]>([]);

  // Fetch live pricing config
  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((data: PricingItem[]) => { if (Array.isArray(data)) setPricingData(data); })
      .catch(() => {});
  }, []);

  // Fetch discount config (live)
  useEffect(() => {
    fetch("/api/admin/discount")
      .then((r) => r.json())
      .then((d) => { if (d.active) setDiscount(d); })
      .catch(() => {});
  }, []);

  // Fetch categories from API
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((cats: Category[]) => {
        if (Array.isArray(cats) && cats.length > 0) {
          const active = cats.filter((c) => c.active !== false);
          setCategories([
            { id: "all", name: "All Rugs", slug: "all", active: true },
            ...active.map((c) => ({ id: c.id, name: c.name, slug: c.slug, active: c.active })),
          ]);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch products from the admin database — single source of truth
  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((prods: Product[]) => {
        if (Array.isArray(prods)) {
          // Only show active products on the public shop
          setDbProducts(prods.filter((p) => (p as { active?: boolean }).active !== false));
        }
      })
      .catch(() => { setDbProducts([]); })
      .finally(() => setProductsLoading(false));
  }, []);

  const displayProducts = dbProducts ?? [];

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = displayProducts.filter((p) => {
    if (activeCategory === "all") return true;
    return p.rugType === activeCategory || p.category?.toLowerCase().replace(/\s+/g, "-") === activeCategory;
  });

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") {
        const pa = computePrice(DISPLAY_SIZE.sqft, constructionToRugType(a.construction), 1.0, undefined, pricingData.length ? pricingData : undefined, a.priceAdjustment || 0).displayPrice;
        const pb = computePrice(DISPLAY_SIZE.sqft, constructionToRugType(b.construction), 1.0, undefined, pricingData.length ? pricingData : undefined, b.priceAdjustment || 0).displayPrice;
        return pa - pb;
      }
      if (sortBy === "price-desc") {
        const pa = computePrice(DISPLAY_SIZE.sqft, constructionToRugType(a.construction), 1.0, undefined, pricingData.length ? pricingData : undefined, a.priceAdjustment || 0).displayPrice;
        const pb = computePrice(DISPLAY_SIZE.sqft, constructionToRugType(b.construction), 1.0, undefined, pricingData.length ? pricingData : undefined, b.priceAdjustment || 0).displayPrice;
        return pb - pa;
      }
      if (sortBy === "reviews") return (b.reviews || 0) - (a.reviews || 0);
      return 0;
    });
  }, [filtered, sortBy, pricingData]);

  const currentCategory = categories.find((c) => c.id === activeCategory || c.slug === activeCategory);

  return (
    <>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #2a3a20 0%, #1c2c15 40%, #243018 100%)",
          padding: "80px 0 90px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 30% 60%, rgba(184,151,90,0.12) 0%, transparent 55%), radial-gradient(circle at 70% 40%, rgba(122,143,106,0.1) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase",
            color: "var(--gold-light)", fontWeight: 600, marginBottom: "16px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
          }}>
            <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
            Artisan Craftsmanship
            <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(40px, 6vw, 68px)",
            fontWeight: 300, color: "#fff",
            letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: "20px",
          }}>
            {activeCategory === "all" ? (
              <>Shop All <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Luxury Rugs</em></>
            ) : (
              <><em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>{currentCategory?.name}</em> Rugs</>
            )}
          </h1>
          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.6)",
            maxWidth: "520px", margin: "0 auto",
            lineHeight: 1.75, fontWeight: 300,
          }}>
            Every rug handmade in Jaipur by master artisans. Free worldwide shipping. Custom sizes available on all rugs.
          </p>
          {discount && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              marginTop: "24px", background: "#dc2626",
              color: "#fff", padding: "8px 24px", borderRadius: "9999px",
              fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em",
            }}>
              🏷️ {discount.label} — {discount.type === "percent" ? `${discount.value}% OFF` : `$${discount.value} OFF`} All Rugs
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border-light)",
        position: "sticky", top: "0", zIndex: 50,
        boxShadow: "0 2px 12px rgba(30,40,20,0.06)",
      }}>
        <div className="container" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 0", flexWrap: "wrap", gap: "12px",
        }}>
          {/* Category Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug || cat.id)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  border: `1.5px solid ${(activeCategory === cat.slug || activeCategory === cat.id) ? "var(--primary)" : "var(--border)"}`,
                  background: (activeCategory === cat.slug || activeCategory === cat.id) ? "var(--primary)" : "transparent",
                  color: (activeCategory === cat.slug || activeCategory === cat.id) ? "#fff" : "var(--foreground-muted)",
                  fontSize: "12px", fontWeight: 600,
                  letterSpacing: "0.06em", cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort & Count */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "13px", color: "var(--foreground-muted)" }}>
              {sorted.length} rug{sorted.length !== 1 ? "s" : ""}
            </span>
            <div className="select-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control"
                style={{ padding: "8px 40px 8px 14px", fontSize: "12px", minWidth: "180px" }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section style={{ padding: "60px 0 100px", background: "var(--background)" }}>
        <div className="container">
          {/* Loading skeleton */}
          {productsLoading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-light)", background: "var(--surface)" }}>
                  <div style={{ height: "280px", background: "linear-gradient(90deg, #f0ece4 25%, #e8e4dc 50%, #f0ece4 75%)" }} />
                  <div style={{ padding: "22px 24px 26px" }}>
                    <div style={{ height: "10px", width: "60%", background: "#e8e4dc", borderRadius: "4px", marginBottom: "12px" }} />
                    <div style={{ height: "22px", width: "80%", background: "#e8e4dc", borderRadius: "4px", marginBottom: "12px" }} />
                    <div style={{ height: "18px", width: "45%", background: "#e8e4dc", borderRadius: "4px" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!productsLoading && sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
              <div style={{ fontSize: "56px", marginBottom: "24px" }}>🧶</div>
              <h3 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "32px", fontWeight: 300, color: "var(--foreground)", marginBottom: "16px",
              }}>
                No products available
              </h3>
              <p style={{ color: "var(--foreground-muted)", fontSize: "16px", marginBottom: "32px" }}>
                We don&apos;t have any {currentCategory?.name} rugs in our catalog yet, but we can create one custom for you.
              </p>
              <Link href="/custom-rug" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary" style={{ padding: "16px 40px", fontSize: "13px" }}>
                  Request Custom Rug
                </button>
              </Link>
            </div>
          ) : !productsLoading ? (
            <div
              className="featured-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" }}
            >
              {sorted.map((rug) => {
                const rugTypeId = constructionToRugType(rug.construction);
                const pricing = computePrice(
                  DISPLAY_SIZE.sqft,
                  rugTypeId,
                  1.0,
                  discount ? { enabled: true, type: discount.type, value: discount.value } : undefined,
                  pricingData.length ? pricingData : undefined,
                  rug.priceAdjustment || 0
                );
                return (
                  <Link key={rug.id} href={`/products/${rug.slug}`} style={{ textDecoration: "none" }}>
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
                        const img = el.querySelector("img") as HTMLImageElement;
                        if (img) img.style.transform = "scale(1.06)";
                        const overlay = el.querySelector(".shop-overlay") as HTMLElement;
                        if (overlay) overlay.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(0)";
                        el.style.boxShadow = "var(--shadow-sm)";
                        el.style.borderColor = "var(--border-light)";
                        const img = el.querySelector("img") as HTMLImageElement;
                        if (img) img.style.transform = "scale(1)";
                        const overlay = el.querySelector(".shop-overlay") as HTMLElement;
                        if (overlay) overlay.style.opacity = "0";
                      }}
                    >
                      <div style={{ position: "relative", height: "280px", overflow: "hidden" }}>
                        <Image
                          src={rug.image}
                          alt={rug.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          style={{ objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}
                        />
                        <div
                          className="shop-overlay"
                          style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(to top, rgba(28,35,20,0.65) 0%, transparent 55%)",
                            opacity: 0, transition: "opacity 0.4s ease",
                            display: "flex", alignItems: "flex-end", padding: "20px",
                          }}
                        >
                          <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            View Details →
                          </span>
                        </div>

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

                        {/* Only show SALE badge if discount is active */}
                        {discount && (
                          <div style={{
                            position: "absolute", top: "14px", right: "14px",
                            background: "#dc2626", color: "#fff",
                            padding: "3px 9px", borderRadius: "9999px",
                            fontSize: "10px", fontWeight: 700,
                          }}>
                            {discount.label}
                          </div>
                        )}
                      </div>

                      <div style={{ padding: "22px 24px 26px" }}>
                        <p style={{ fontSize: "10px", color: "var(--primary)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>
                          {rug.subtitle || rug.category}
                        </p>
                        <h3 style={{
                          fontFamily: "var(--font-cormorant), Georgia, serif",
                          fontSize: "22px", fontWeight: 500,
                          color: "var(--foreground)", letterSpacing: "-0.01em",
                          marginBottom: "10px", lineHeight: 1.2,
                        }}>
                          {rug.title}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <span style={{ color: "var(--gold)", fontSize: "13px", letterSpacing: "2px" }}>★★★★★</span>
                          <span style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>({rug.reviews || 0})</span>
                        </div>
                        {/* Dynamic pricing from shared engine */}
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
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
                          <p style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600, marginTop: "4px" }}>
                            Save {pricing.savingsPct}% · {discount?.label}
                          </p>
                        )}
                        <p style={{ fontSize: "11px", color: "var(--foreground-muted)", marginTop: "4px" }}>
                          For 5×8 ft · {pricing.perSqftLabel}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      {/* Custom Rug CTA Section */}
      <section style={{
        padding: "80px 0",
        background: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)",
        textAlign: "center",
      }}>
        <div className="container">
          <p style={{ color: "var(--gold-light)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>
            ✦ &nbsp; Bespoke Service
          </p>
          <h2 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300,
            color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "20px",
          }}>
            Can&apos;t find what you&apos;re looking for?<br />
            <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>We&apos;ll make it for you.</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", maxWidth: "480px", margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 300 }}>
            Any size, any design, any material. Our artisans can create exactly the rug you envision.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/custom-rug" style={{ textDecoration: "none" }}>
              <button className="btn btn-gold" style={{ padding: "16px 40px", fontSize: "12px", letterSpacing: "0.1em" }}>
                Design Your Custom Rug
              </button>
            </Link>
            <a href="https://wa.me/918416919470?text=Hi%2C%20I%27d%20like%20to%20order%20a%20custom%20rug." target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={{
                background: "transparent", color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.45)",
                padding: "15px 36px", borderRadius: "9999px",
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", cursor: "pointer",
              }}>
                Chat on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
