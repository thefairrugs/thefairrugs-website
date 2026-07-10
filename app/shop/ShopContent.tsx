"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  rating?: number;
  active?: boolean;
  material?: string;
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

function StarRating({ rating, count }: { rating: number; count: number }) {
  const stars = Math.round(rating || 5);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{ display: "flex", gap: "1px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= stars ? "var(--gold)" : "none"} stroke={i <= stars ? "var(--gold)" : "#ccc"} strokeWidth="1.5">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </div>
      <span style={{ fontSize: "11px", color: "var(--foreground-muted)", fontWeight: 500 }}>
        ({count || 0})
      </span>
    </div>
  );
}

function WishlistButton({ productId, productTitle }: { productId: string; productTitle: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/favorites?productId=${productId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.count === "number") setCount(d.count);
        const visitorId = localStorage.getItem("tfr_visitor_id");
        if (visitorId && d.visitors && Array.isArray(d.visitors)) {
          setLiked(d.visitors.includes(visitorId));
        }
      })
      .catch(() => {});
  }, [productId]);

  const toggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    let visitorId = localStorage.getItem("tfr_visitor_id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("tfr_visitor_id", visitorId);
    }

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productTitle, visitorId }),
      });
      const d = await res.json();
      setLiked(d.liked);
      setCount(d.count || 0);
    } catch {}
    setLoading(false);
  }, [productId, productTitle, loading]);

  return (
    <button
      onClick={toggle}
      title={liked ? "Remove from wishlist" : "Save to wishlist"}
      style={{
        position: "absolute", top: "12px", right: "12px",
        width: "36px", height: "36px",
        borderRadius: "50%",
        background: liked ? "rgba(220,38,38,0.9)" : "rgba(255,255,255,0.92)",
        border: "1.5px solid " + (liked ? "rgba(220,38,38,0.3)" : "rgba(255,255,255,0.3)"),
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        transition: "all 0.2s ease",
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        transform: loading ? "scale(0.9)" : "scale(1)",
      }}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg width="15" height="15" viewBox="0 0 24 24"
        fill={liked ? "#fff" : "none"}
        stroke={liked ? "#fff" : "#666"}
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count > 0 && (
        <span style={{
          position: "absolute", top: "-4px", right: "-4px",
          background: liked ? "#dc2626" : "var(--primary)",
          color: "#fff", fontSize: "9px", fontWeight: 700,
          borderRadius: "9999px", padding: "1px 5px",
          border: "1.5px solid #fff",
          lineHeight: 1.4,
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

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
      {/* Hero Banner — Premium USA/UK */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a2814 0%, #2a3a20 45%, #1e2f18 100%)",
          padding: "100px 0 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(184,151,90,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(122,143,106,0.12) 0%, transparent 50%), radial-gradient(circle at 50% 90%, rgba(184,151,90,0.08) 0%, transparent 40%)",
          pointerEvents: "none",
        }} />
        {/* Subtle texture lines */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "12px",
            background: "rgba(184,151,90,0.15)", border: "1px solid rgba(184,151,90,0.3)",
            borderRadius: "9999px", padding: "6px 20px", marginBottom: "28px",
          }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 700 }}>
              ✦ Handcrafted · Jaipur, India
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(44px, 7vw, 76px)",
            fontWeight: 300, color: "#fff",
            letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "24px",
          }}>
            {activeCategory === "all" ? (
              <>Shop All{" "}
                <em style={{ fontStyle: "italic", color: "var(--gold-light)", display: "block" }}>Luxury Rugs</em>
              </>
            ) : (
              <><em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>{currentCategory?.name}</em>
                <span style={{ display: "block", fontSize: "0.6em", letterSpacing: "-0.01em", color: "rgba(255,255,255,0.7)", fontStyle: "normal" }}>
                  Master Artisan Collection
                </span>
              </>
            )}
          </h1>
          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.65)",
            maxWidth: "560px", margin: "0 auto 32px",
            lineHeight: 1.8, fontWeight: 300,
          }}>
            Every rug handmade in Jaipur by master artisans.
            Free worldwide shipping to USA & UK. Custom sizes on every design.
          </p>

          {/* Trust signals */}
          <div style={{
            display: "flex", gap: "0", justifyContent: "center", flexWrap: "wrap",
            marginBottom: "28px",
          }}>
            {[
              { icon: "🚚", text: "Free Worldwide Shipping" },
              { icon: "✋", text: "100% Handmade" },
              { icon: "📐", text: "Custom Sizes" },
              { icon: "🔒", text: "Secure Payment" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "8px 20px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none",
                fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 500,
              }}>
                <span>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          {discount && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#dc2626", color: "#fff",
              padding: "10px 28px", borderRadius: "9999px",
              fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em",
              boxShadow: "0 4px 20px rgba(220,38,38,0.4)",
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
                  <div style={{ height: "300px", background: "linear-gradient(90deg, #f0ece4 25%, #e8e4dc 50%, #f0ece4 75%)", animation: "shimmer 1.5s infinite" }} />
                  <div style={{ padding: "22px 24px 26px" }}>
                    <div style={{ height: "10px", width: "60%", background: "#e8e4dc", borderRadius: "4px", marginBottom: "12px" }} />
                    <div style={{ height: "22px", width: "80%", background: "#e8e4dc", borderRadius: "4px", marginBottom: "12px" }} />
                    <div style={{ height: "14px", width: "50%", background: "#e8e4dc", borderRadius: "4px", marginBottom: "10px" }} />
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
                const starRating = rug.rating || 5;
                const reviewCount = rug.reviews || 0;

                return (
                  <Link key={rug.id} href={`/products/${rug.slug}`} style={{ textDecoration: "none" }}>
                    <div
                      className="product-card"
                      style={{
                        background: "var(--surface)", borderRadius: "var(--radius-lg)",
                        overflow: "hidden", border: "1px solid var(--border-light)",
                        boxShadow: "var(--shadow-sm)", cursor: "pointer",
                        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(-8px)";
                        el.style.boxShadow = "0 20px 60px rgba(30,40,20,0.18), 0 8px 20px rgba(30,40,20,0.1)";
                        el.style.borderColor = "var(--border-green)";
                        const img = el.querySelector("img") as HTMLImageElement;
                        if (img) img.style.transform = "scale(1.08)";
                        const overlay = el.querySelector(".shop-overlay") as HTMLElement;
                        if (overlay) overlay.style.opacity = "1";
                        const quickView = el.querySelector(".quick-view-btn") as HTMLElement;
                        if (quickView) quickView.style.opacity = "1";
                        const quickView2 = el.querySelector(".quick-view-btn") as HTMLElement;
                        if (quickView2) quickView2.style.transform = "translateY(0)";
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
                        const quickView = el.querySelector(".quick-view-btn") as HTMLElement;
                        if (quickView) quickView.style.opacity = "0";
                        const quickView2 = el.querySelector(".quick-view-btn") as HTMLElement;
                        if (quickView2) quickView2.style.transform = "translateY(8px)";
                      }}
                    >
                      {/* Image Container */}
                      <div style={{ position: "relative", height: "300px", overflow: "hidden" }}>
                        <Image
                          src={rug.image}
                          alt={rug.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          style={{ objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}
                        />

                        {/* Gradient Overlay */}
                        <div
                          className="shop-overlay"
                          style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(to top, rgba(20,28,15,0.75) 0%, rgba(20,28,15,0.2) 50%, transparent 100%)",
                            opacity: 0, transition: "opacity 0.4s ease",
                            pointerEvents: "none",
                          }}
                        />

                        {/* Wishlist Button */}
                        <WishlistButton productId={rug.id} productTitle={rug.title} />

                        {/* Badge — collection type */}
                        {rug.badge && (
                          <div style={{
                            position: "absolute", top: "14px", left: "14px",
                            padding: "4px 12px", borderRadius: "9999px",
                            fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            background: badgeColors[rug.badge]?.bg || "var(--primary)",
                            color: badgeColors[rug.badge]?.color || "#fff",
                            backdropFilter: "blur(4px)",
                          }}>
                            {rug.badge}
                          </div>
                        )}

                        {/* Sale badge */}
                        {discount && (
                          <div style={{
                            position: "absolute", top: rug.badge ? "48px" : "14px", left: "14px",
                            background: "#dc2626", color: "#fff",
                            padding: "3px 10px", borderRadius: "9999px",
                            fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
                          }}>
                            SALE {discount.type === "percent" ? `−${discount.value}%` : `−$${discount.value}`}
                          </div>
                        )}

                        {/* Material tag bottom-left */}
                        {rug.material && (
                          <div style={{
                            position: "absolute", bottom: "14px", left: "14px",
                            background: "rgba(255,255,255,0.88)",
                            backdropFilter: "blur(6px)",
                            padding: "3px 10px", borderRadius: "9999px",
                            fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em",
                            color: "var(--charcoal)", textTransform: "uppercase",
                          }}>
                            {rug.material.split(" ")[0]}
                          </div>
                        )}

                        {/* Quick View Button */}
                        <div
                          className="quick-view-btn"
                          style={{
                            position: "absolute", bottom: "14px", right: "14px",
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(8px)",
                            padding: "8px 16px", borderRadius: "9999px",
                            fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                            color: "var(--charcoal)", textTransform: "uppercase",
                            opacity: 0, transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                            transform: "translateY(8px)",
                            pointerEvents: "none",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          }}
                        >
                          View Details →
                        </div>
                      </div>

                      {/* Card Content */}
                      <div style={{ padding: "22px 24px 26px" }}>
                        {/* Category / Subtitle */}
                        <p style={{
                          fontSize: "10px", color: "var(--primary)", letterSpacing: "0.14em",
                          textTransform: "uppercase", fontWeight: 700, marginBottom: "6px",
                          display: "flex", alignItems: "center", gap: "6px",
                        }}>
                          {rug.subtitle || rug.category}
                        </p>

                        {/* Title */}
                        <h3 style={{
                          fontFamily: "var(--font-cormorant), Georgia, serif",
                          fontSize: "22px", fontWeight: 500,
                          color: "var(--foreground)", letterSpacing: "-0.01em",
                          marginBottom: "10px", lineHeight: 1.2,
                        }}>
                          {rug.title}
                        </h3>

                        {/* Star Rating */}
                        <div style={{ marginBottom: "14px" }}>
                          <StarRating rating={starRating} count={reviewCount} />
                        </div>

                        {/* Pricing */}
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                          <span style={{
                            fontSize: "19px", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.02em",
                          }}>
                            From {pricing.priceLabel}
                          </span>
                          {pricing.discountedPrice !== null && (
                            <span style={{ fontSize: "13px", color: "#bbb", textDecoration: "line-through" }}>
                              ${Math.round(pricing.basePrice)}
                            </span>
                          )}
                        </div>

                        {pricing.discountedPrice !== null ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                            <span style={{
                              fontSize: "11px", color: "#fff", fontWeight: 700,
                              background: "#dc2626", padding: "2px 8px", borderRadius: "4px",
                            }}>
                              Save {pricing.savingsPct}%
                            </span>
                            <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600 }}>
                              {discount?.label}
                            </span>
                          </div>
                        ) : (
                          <p style={{ fontSize: "11px", color: "var(--foreground-muted)", marginTop: "2px" }}>
                            For 5×8 ft · {pricing.perSqftLabel}
                          </p>
                        )}

                        {/* Bottom Action Strip */}
                        <div style={{
                          marginTop: "18px", paddingTop: "16px",
                          borderTop: "1px solid var(--border-light)",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                          <span style={{
                            fontSize: "11px", color: "var(--foreground-muted)", fontWeight: 500,
                            display: "flex", alignItems: "center", gap: "5px",
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Custom sizes available
                          </span>
                          <span style={{
                            fontSize: "11px", fontWeight: 700, color: "var(--primary)",
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            display: "flex", alignItems: "center", gap: "4px",
                          }}>
                            Explore
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </span>
                        </div>
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

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .product-card { will-change: transform; }
        @media (max-width: 1200px) {
          .featured-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .featured-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .featured-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
