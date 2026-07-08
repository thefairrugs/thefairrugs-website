"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../data/products";
import {
  constructionToRugType, computePrice, parseCustomSqft, formatSqft,
  groupSizesByShape, SHAPE_ORDER,
  type SizeMasterItem, type PricingItem,
} from "../../lib/pricing";

const WA_BASE = "https://wa.me/918416919470";

interface Props {
  product: Product;
  relatedProducts: Product[];
}
interface DiscountConfig {
  active: boolean;
  type: "percent" | "fixed";
  value: number;
  label: string;
}

export default function ProductDetail({ product, relatedProducts }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [shapeTab, setShapeTab] = useState("Rectangular");
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [customSize, setCustomSize] = useState(false);
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  // Live data from API
  const [discount, setDiscount] = useState<DiscountConfig | null>(null);
  const [sizeMaster, setSizeMaster] = useState<SizeMasterItem[]>([]);
  const [pricingData, setPricingData] = useState<PricingItem[]>([]);

  // Fetch live discount
  useEffect(() => {
    fetch("/api/admin/discount")
      .then(r => r.json())
      .then(d => { if (d.active) setDiscount(d); })
      .catch(() => {});
  }, []);

  // Fetch live Size Master
  useEffect(() => {
    fetch("/api/admin/sizes")
      .then(r => r.json())
      .then((data: SizeMasterItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setSizeMaster(data);
          // Default: first Rectangular size
          const firstRect = data.find(s => s.shape === "Rectangular" && s.active !== false);
          if (firstRect) setSelectedSizeId(firstRect.id);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch live pricing
  useEffect(() => {
    fetch("/api/admin/pricing")
      .then(r => r.json())
      .then((data: PricingItem[]) => { if (Array.isArray(data)) setPricingData(data); })
      .catch(() => {});
  }, []);

  const grouped = useMemo(() => groupSizesByShape(sizeMaster), [sizeMaster]);
  const availableShapes = SHAPE_ORDER.filter(s => grouped[s] && grouped[s].length > 0);

  // Keep shapeTab valid when sizeMaster loads
  useEffect(() => {
    if (availableShapes.length > 0 && !availableShapes.includes(shapeTab)) {
      setShapeTab(availableShapes[0]);
    }
  }, [availableShapes, shapeTab]);

  const currentGroupSizes = grouped[shapeTab] || [];

  const rugTypeId = constructionToRugType(product.construction);

  // Live price computation
  const pricing = useMemo(() => {
    let sqft = 0;
    let sizeLabel = "";
    let sizeInfo: SizeMasterItem | undefined;

    if (customSize && customW && customH) {
      sqft = parseCustomSqft(customW, customH);
      sizeLabel = `${customW} × ${customH} ft (Custom)`;
    } else {
      sizeInfo = sizeMaster.find(s => s.id === selectedSizeId);
      if (sizeInfo) { sqft = sizeInfo.sqft; sizeLabel = sizeInfo.name; }
    }

    const result = computePrice(
      sqft, rugTypeId, 1.0,
      discount ? { enabled: true, type: discount.type, value: discount.value } : undefined,
      pricingData.length > 0 ? pricingData : undefined
    );
    return { ...result, sqft, sizeLabel, sizeInfo };
  }, [selectedSizeId, customSize, customW, customH, rugTypeId, discount, sizeMaster, pricingData]);

  const totalPrice = pricing.displayPrice * quantity;
  const totalLabel = pricing.sqft > 0 ? `$${Math.round(totalPrice).toLocaleString()}` : "—";

  const waMessage = encodeURIComponent(
    `Hello! I'm interested in:\n\n*${product.title}*\n${product.construction} · ${product.material}\nSize: ${pricing.sizeLabel}\nArea: ${formatSqft(pricing.sqft)}\nPrice: ${totalLabel} (qty: ${quantity})\n\nPlease confirm availability and shipping details.`
  );

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product",
          productId: product.id,
          productTitle: product.title,
          selectedSize: pricing.sizeLabel,
          sqft: pricing.sqft,
          estimatedPrice: totalLabel,
          quantity,
          ...form,
        }),
      });
    } catch {}
    setSubmitted(true);
    setTimeout(() => { setInquiryOpen(false); setSubmitted(false); }, 3000);
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const shapeTabStyle = (active: boolean) => ({
    padding: "7px 18px",
    borderRadius: "9999px",
    border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
    background: active ? "var(--primary)" : "transparent",
    color: active ? "#fff" : "var(--foreground-muted)",
    fontSize: "12px", fontWeight: 600 as const, cursor: "pointer" as const,
    letterSpacing: "0.06em", transition: "all 0.2s ease",
  });

  const sizeBtnStyle = (active: boolean) => ({
    padding: "8px 10px",
    border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
    borderRadius: "8px",
    background: active ? "var(--primary)" : "white",
    color: active ? "#fff" : "var(--foreground)",
    fontSize: "11px", fontWeight: 500 as const, cursor: "pointer" as const,
    transition: "all 0.18s ease", textAlign: "left" as const,
    lineHeight: 1.35, minWidth: "80px",
  });

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: "var(--surface-alt)", padding: "14px 0", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container" style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: "var(--foreground-muted)" }}>
          <Link href="/" style={{ color: "var(--foreground-muted)" }}>Home</Link>
          <span>›</span>
          <Link href="/shop" style={{ color: "var(--foreground-muted)" }}>Shop</Link>
          <span>›</span>
          <Link href={`/shop?category=${product.rugType}`} style={{ color: "var(--foreground-muted)" }}>{product.category}</Link>
          <span>›</span>
          <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{product.title}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <section style={{ padding: "60px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "start" }}>

            {/* ── Gallery ── */}
            <div>
              <div
                style={{
                  position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden",
                  aspectRatio: "4/5", background: "var(--surface-alt)", cursor: "zoom-in",
                  boxShadow: "var(--shadow-lg)",
                }}
                onClick={() => setZoomOpen(true)}
              >
                <Image
                  src={product.images[activeImage] || product.image}
                  alt={product.title} fill priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                />
                <div style={{
                  position: "absolute", top: "16px", right: "16px",
                  background: "rgba(255,255,255,0.85)", borderRadius: "50%",
                  width: "40px", height: "40px", display: "flex", alignItems: "center",
                  justifyContent: "center", backdropFilter: "blur(8px)",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
                  </svg>
                </div>
                {product.badge && (
                  <div style={{
                    position: "absolute", top: "16px", left: "16px",
                    background: product.badge === "Bestseller" ? "var(--gold)" : product.badge === "Eco" ? "var(--sage)" : "var(--primary)",
                    color: product.badge === "Bestseller" ? "var(--foreground)" : "#fff",
                    padding: "6px 14px", borderRadius: "9999px",
                    fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                  }}>
                    {product.badge}
                  </div>
                )}
                {discount && (
                  <div style={{
                    position: "absolute", bottom: "16px", left: "16px",
                    background: "#dc2626", color: "#fff",
                    padding: "6px 14px", borderRadius: "9999px",
                    fontSize: "11px", fontWeight: 700,
                  }}>
                    {discount.label} {discount.type === "percent" ? `${discount.value}% OFF` : `$${discount.value} OFF`}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} style={{
                    width: "88px", height: "88px", padding: 0,
                    border: `2px solid ${activeImage === i ? "var(--primary)" : "var(--border-light)"}`,
                    borderRadius: "var(--radius-md)", overflow: "hidden",
                    cursor: "pointer", background: "none", flexShrink: 0,
                  }}>
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                      <Image src={img} alt={`View ${i + 1}`} fill sizes="88px" style={{ objectFit: "cover" }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Product Info ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Link href={`/shop?category=${product.rugType}`}>
                  <span style={{
                    background: "var(--primary-pale)", color: "var(--primary)",
                    padding: "4px 14px", borderRadius: "9999px", fontSize: "11px",
                    fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>
                    {product.category}
                  </span>
                </Link>
                {product.inStock && (
                  <span style={{
                    background: "#d1fae5", color: "#065f46",
                    padding: "4px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700,
                  }}>
                    ✓ In Stock
                  </span>
                )}
              </div>

              <h1 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.1,
                letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: "10px",
              }}>
                {product.title}
              </h1>
              <p style={{ color: "var(--primary)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
                {product.subtitle}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <span style={{ color: "var(--gold)", fontSize: "15px", letterSpacing: "2px" }}>★★★★★</span>
                <span style={{ fontSize: "13px", color: "var(--foreground-muted)" }}>({product.reviews} reviews)</span>
              </div>

              {/* ── SIZE SELECTOR — Full Size Master, grouped by shape ── */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)" }}>
                    Select Size
                  </label>
                  <button
                    onClick={() => { setCustomSize(!customSize); if (customSize) { setCustomW(""); setCustomH(""); } }}
                    style={{
                      background: customSize ? "var(--primary)" : "transparent",
                      color: customSize ? "#fff" : "var(--primary)",
                      border: "1.5px solid var(--primary)",
                      borderRadius: "9999px", padding: "4px 14px",
                      fontSize: "11px", fontWeight: 700, cursor: "pointer",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}
                  >
                    {customSize ? "✕ Custom" : "+ Custom Size"}
                  </button>
                </div>

                {/* Shape tabs */}
                {!customSize && availableShapes.length > 1 && (
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                    {availableShapes.map(sh => (
                      <button key={sh} onClick={() => setShapeTab(sh)} style={shapeTabStyle(shapeTab === sh)}>
                        {sh === "Rectangular" ? "▬ Rectangular" : sh === "Runner" ? "▰ Runner" : "● Round"}
                      </button>
                    ))}
                  </div>
                )}

                {customSize ? (
                  <div style={{
                    display: "flex", gap: "12px", padding: "16px",
                    background: "var(--surface-alt)", borderRadius: "var(--radius-lg)",
                    border: "1.5px solid var(--border-green)",
                  }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--foreground-muted)", display: "block", marginBottom: "6px" }}>Width (ft)</label>
                      <input type="number" placeholder="e.g. 8" min="1" max="30"
                        value={customW} onChange={e => setCustomW(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", outline: "none", background: "white" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--foreground-muted)", display: "block", marginBottom: "6px" }}>Length (ft)</label>
                      <input type="number" placeholder="e.g. 12" min="1" max="50"
                        value={customH} onChange={e => setCustomH(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", outline: "none", background: "white" }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Size grid — each button shows size / cm / sqft */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
                      {currentGroupSizes.map(s => (
                        <button key={s.id} onClick={() => setSelectedSizeId(s.id)} style={sizeBtnStyle(selectedSizeId === s.id)}>
                          <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "2px" }}>{s.name}</div>
                          <div style={{ fontSize: "9px", opacity: 0.75, lineHeight: 1.3 }}>{s.cm}</div>
                          <div style={{ fontSize: "10px", color: selectedSizeId === s.id ? "rgba(255,255,255,0.85)" : "var(--primary)", fontWeight: 600, marginTop: "2px" }}>
                            {s.sqft % 1 === 0 ? s.sqft : s.sqft.toFixed(1)} sq.ft
                          </div>
                        </button>
                      ))}
                    </div>
                    {/* Selected size details */}
                    {pricing.sizeInfo && (
                      <div style={{
                        marginTop: "10px", padding: "8px 14px",
                        background: "var(--primary-pale)", borderRadius: "var(--radius-md)",
                        fontSize: "12px", color: "var(--primary)", fontWeight: 600,
                        display: "flex", gap: "16px", flexWrap: "wrap",
                      }}>
                        <span>{pricing.sizeInfo.name}</span>
                        <span>·</span>
                        <span>{pricing.sizeInfo.cm}</span>
                        <span>·</span>
                        <span>{pricing.sizeInfo.sqft % 1 === 0 ? pricing.sizeInfo.sqft : pricing.sizeInfo.sqft.toFixed(1)} sq.ft</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ── LIVE PRICE ── */}
              <div style={{
                marginBottom: "24px", padding: "20px 24px",
                background: "linear-gradient(135deg, var(--primary-pale) 0%, var(--sage-pale) 100%)",
                borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border-green)",
              }}>
                {pricing.sqft > 0 ? (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{
                        fontFamily: "var(--font-cormorant), Georgia, serif",
                        fontSize: "40px", fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.02em", lineHeight: 1,
                      }}>
                        {pricing.priceLabel}
                      </span>
                      {pricing.discountedPrice !== null && (
                        <span style={{ fontSize: "22px", color: "#aaa", textDecoration: "line-through" }}>
                          ${Math.round(pricing.basePrice).toLocaleString()}
                        </span>
                      )}
                      {discount && pricing.discountedPrice !== null && (
                        <span style={{ background: "#dc2626", color: "#fff", padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700 }}>
                          {discount.label}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>
                        {formatSqft(pricing.sqft)} · {pricing.perSqftLabel}
                      </span>
                      {pricing.savingsPct > 0 && (
                        <span style={{ fontSize: "12px", color: "#059669", fontWeight: 600 }}>
                          You save ${Math.round(pricing.savingsAmount).toLocaleString()} ({pricing.savingsPct}% off)
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: "15px", color: "var(--foreground-muted)" }}>
                    Select a size above to see pricing
                  </p>
                )}
              </div>

              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--foreground-muted)", fontWeight: 300, marginBottom: "28px" }}>
                {product.description}
              </p>

              {/* Quantity */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", display: "block", marginBottom: "10px" }}>
                  Quantity
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0", width: "fit-content" }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: "44px", height: "44px", border: "1.5px solid var(--border)", borderRight: "none", borderRadius: "var(--radius-md) 0 0 var(--radius-md)", background: "var(--surface)", cursor: "pointer", fontSize: "18px", color: "var(--foreground)" }}>−</button>
                  <div style={{ width: "64px", height: "44px", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 600, color: "var(--foreground)" }}>{quantity}</div>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ width: "44px", height: "44px", border: "1.5px solid var(--border)", borderLeft: "none", borderRadius: "0 var(--radius-md) var(--radius-md) 0", background: "var(--surface)", cursor: "pointer", fontSize: "18px", color: "var(--foreground)" }}>+</button>
                </div>
                {quantity > 1 && pricing.sqft > 0 && (
                  <p style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 600, marginTop: "8px" }}>
                    Total for {quantity} rugs: {totalLabel}
                  </p>
                )}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                <a href={`${WA_BASE}?text=${waMessage}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button style={{
                    width: "100%", padding: "17px", background: "#25D366", color: "#fff",
                    border: "none", borderRadius: "var(--radius-full)", fontWeight: 700, fontSize: "13px",
                    letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
                  }}>
                    <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Chat on WhatsApp{pricing.sqft > 0 && <span>· {pricing.priceLabel}</span>}
                  </button>
                </a>
                <button onClick={() => setInquiryOpen(true)} style={{
                  width: "100%", padding: "16px", background: "var(--primary)", color: "#fff",
                  border: "none", borderRadius: "var(--radius-full)", fontWeight: 700, fontSize: "13px",
                  letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
                }}>
                  Send Website Inquiry
                </button>
                <Link href="/custom-rug" style={{ textDecoration: "none" }}>
                  <button style={{
                    width: "100%", padding: "15px", background: "transparent",
                    color: "var(--primary)", border: "1.5px solid var(--primary)",
                    borderRadius: "var(--radius-full)", fontWeight: 700, fontSize: "13px",
                    letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
                  }}>
                    Design Custom Version
                  </button>
                </Link>
              </div>

              {/* Quick Specs */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { label: "Material", value: product.material },
                    { label: "Construction", value: product.construction },
                    { label: "Pile Height", value: product.pile },
                    { label: "Shape", value: product.shape },
                    { label: "Origin", value: product.origin },
                    { label: "Lead Time", value: product.leadTime },
                  ].map(({ label, value }) => value ? (
                    <div key={label}>
                      <div style={{ fontSize: "10px", color: "var(--foreground-muted)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: "3px" }}>{label}</div>
                      <div style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 500 }}>{value}</div>
                    </div>
                  ) : null)}
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
                {[
                  { icon: "🚚", text: "Free Worldwide Shipping" },
                  { icon: "✋", text: "100% Handmade" },
                  { icon: "📐", text: "Any Custom Size" },
                ].map(item => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--foreground-muted)" }}>
                    <span style={{ fontSize: "16px" }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Description */}
      <section style={{ padding: "80px 0", background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "36px", fontWeight: 300, color: "var(--foreground)", marginBottom: "24px", letterSpacing: "-0.02em" }}>
                About This Rug
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.9, color: "var(--foreground-muted)", fontWeight: 300 }}>
                {product.longDescription}
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "36px", fontWeight: 300, color: "var(--foreground)", marginBottom: "24px", letterSpacing: "-0.02em" }}>
                Key Features
              </h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                {product.features.map((feature, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                    <span style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.6 }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Pricing Table */}
      <section style={{ padding: "80px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; Transparent Pricing</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "40px", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Sizes & Pricing
            </h2>
          </div>

          {/* Table per shape group */}
          {SHAPE_ORDER.filter(sh => grouped[sh]?.length > 0).map(sh => (
            <div key={sh} style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "32px", height: "1px", background: "var(--primary)", display: "inline-block" }} />
                {sh}
                <span style={{ width: "32px", height: "1px", background: "var(--primary)", display: "inline-block" }} />
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                  <thead>
                    <tr style={{ background: "var(--primary)" }}>
                      {["Size", "Dimensions (cm)", "Area (sq.ft)", "Price/sq.ft", "Total Price", ""].map(h => (
                        <th key={h} style={{ padding: "12px 16px", color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[sh].map((s, i) => {
                      const p = computePrice(
                        s.sqft, rugTypeId, 1.0,
                        discount ? { enabled: true, type: discount.type, value: discount.value } : undefined,
                        pricingData.length > 0 ? pricingData : undefined
                      );
                      return (
                        <tr key={s.id} style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--surface-alt)", borderBottom: "1px solid var(--border-light)" }}>
                          <td style={{ padding: "11px 16px", fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>{s.name}</td>
                          <td style={{ padding: "11px 16px", fontSize: "13px", color: "var(--foreground-muted)" }}>{s.cm}</td>
                          <td style={{ padding: "11px 16px", fontSize: "13px", color: "var(--foreground-muted)" }}>{s.sqft % 1 === 0 ? s.sqft : s.sqft.toFixed(1)} sq.ft</td>
                          <td style={{ padding: "11px 16px", fontSize: "13px", color: "var(--foreground-muted)" }}>{p.perSqftLabel}</td>
                          <td style={{ padding: "11px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--primary)" }}>{p.priceLabel}</span>
                              {p.discountedPrice !== null && <span style={{ fontSize: "13px", color: "#aaa", textDecoration: "line-through" }}>${Math.round(p.basePrice)}</span>}
                            </div>
                          </td>
                          <td style={{ padding: "11px 16px" }}>
                            <button
                              onClick={() => {
                                setShapeTab(s.shape);
                                setSelectedSizeId(s.id);
                                setCustomSize(false);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              style={{ padding: "5px 14px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "var(--foreground-muted)" }}>
            Need a different size? Use the custom size option above, or <Link href="/contact" style={{ color: "var(--primary)", fontWeight: 600 }}>contact us</Link>.
          </p>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ padding: "80px 0", background: "var(--surface-alt)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; You May Also Love</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "40px", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
                Related Rugs
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
              {relatedProducts.map(rel => (
                <Link key={rel.id} href={`/products/${rel.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
                      <Image src={rel.image} alt={rel.title} fill sizes="25vw" style={{ objectFit: "cover", transition: "transform 0.5s ease" }} />
                    </div>
                    <div style={{ padding: "20px" }}>
                      <p style={{ fontSize: "10px", color: "var(--primary)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>{rel.category}</p>
                      <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "20px", fontWeight: 500, color: "var(--foreground)", marginBottom: "8px" }}>{rel.title}</h3>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)" }}>View Pricing →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Zoom Modal */}
      {zoomOpen && (
        <div onClick={() => setZoomOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: "24px" }}>
          <div style={{ position: "relative", width: "min(90vw, 700px)", aspectRatio: "4/5" }}>
            <Image src={product.images[activeImage] || product.image} alt={product.title} fill sizes="90vw" style={{ objectFit: "contain" }} />
          </div>
          <button onClick={() => setZoomOpen(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9997, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={e => { if (e.target === e.currentTarget) setInquiryOpen(false); }}>
          <div style={{ background: "var(--surface)", borderRadius: "var(--radius-xl)", padding: "40px", width: "min(520px, 100%)", boxShadow: "var(--shadow-xl)", maxHeight: "90vh", overflowY: "auto" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 300, color: "var(--foreground)", marginBottom: "12px" }}>Inquiry Sent!</h3>
                <p style={{ color: "var(--foreground-muted)", fontSize: "15px" }}>We&apos;ll respond to {form.email} within 24 hours.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 300, color: "var(--foreground)" }}>Send Inquiry</h3>
                  <button onClick={() => setInquiryOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: "var(--foreground-muted)" }}>×</button>
                </div>
                <div style={{ padding: "12px 16px", background: "var(--primary-pale)", borderRadius: "var(--radius-md)", marginBottom: "24px", fontSize: "13px", color: "var(--primary)", fontWeight: 500 }}>
                  {product.title} · {pricing.sizeLabel} · {pricing.sqft > 0 ? `${totalLabel} (qty: ${quantity})` : "Select size for pricing"}
                </div>
                <form onSubmit={handleInquiry} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { key: "name", label: "Full Name *", type: "text", placeholder: "Your name", required: true },
                    { key: "email", label: "Email Address *", type: "email", placeholder: "your@email.com", required: true },
                    { key: "phone", label: "Phone / WhatsApp", type: "tel", placeholder: "+1 234 567 8900", required: false },
                    { key: "country", label: "Country", type: "text", placeholder: "e.g. United States", required: false },
                  ].map(({ key, label, type, placeholder, required }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "6px" }}>{label}</label>
                      <input type={type} placeholder={placeholder} required={required}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ width: "100%", padding: "11px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "6px" }}>Message</label>
                    <textarea rows={3} placeholder="Any additional requirements..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ width: "100%", padding: "11px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "14px", outline: "none", resize: "vertical" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "13px", marginTop: "4px" }}>
                    Send Inquiry
                  </button>
                  <p style={{ textAlign: "center", fontSize: "11px", color: "var(--foreground-muted)" }}>
                    We reply within 24 hours · thefairrugs@gmail.com
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
