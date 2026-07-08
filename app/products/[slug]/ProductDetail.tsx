"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../data/products";

const WA_BASE = "https://wa.me/918416919470";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.standardSizes[2] || product.standardSizes[0]);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [customSize, setCustomSize] = useState(false);
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const waMessage = encodeURIComponent(
    `Hello, I'm interested in the ${product.title} (${product.construction}, ${selectedSize}). Could you please share more details and pricing?`
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
          selectedSize,
          quantity,
          ...form,
        }),
      });
    } catch {}
    setSubmitted(true);
    setTimeout(() => { setInquiryOpen(false); setSubmitted(false); }, 3000);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: "var(--surface-alt)", padding: "16px 0", borderBottom: "1px solid var(--border-light)" }}>
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
              {/* Main Image */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  aspectRatio: "4/5",
                  background: "var(--surface-alt)",
                  cursor: "zoom-in",
                  boxShadow: "var(--shadow-lg)",
                }}
                onClick={() => setZoomOpen(true)}
              >
                <Image
                  src={product.images[activeImage] || product.image}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                />
                {/* Zoom icon */}
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
                {/* Badge */}
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
              </div>

              {/* Thumbnails */}
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: "88px", height: "88px", padding: 0,
                      border: `2px solid ${activeImage === i ? "var(--primary)" : "var(--border-light)"}`,
                      borderRadius: "var(--radius-md)", overflow: "hidden",
                      cursor: "pointer", background: "none",
                      transition: "border-color 0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                      <Image src={img} alt={`View ${i + 1}`} fill sizes="88px" style={{ objectFit: "cover" }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Product Info ── */}
            <div>
              {/* Category pill */}
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
                    padding: "4px 14px", borderRadius: "9999px", fontSize: "11px",
                    fontWeight: 700, letterSpacing: "0.08em",
                  }}>
                    ✓ In Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 300, lineHeight: 1.1,
                letterSpacing: "-0.02em", color: "var(--foreground)",
                marginBottom: "10px",
              }}>
                {product.title}
              </h1>

              <p style={{ color: "var(--primary)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
                {product.subtitle}
              </p>

              {/* Stars */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <span style={{ color: "var(--gold)", fontSize: "15px", letterSpacing: "2px" }}>★★★★★</span>
                <span style={{ fontSize: "13px", color: "var(--foreground-muted)" }}>({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div style={{ marginBottom: "28px", padding: "20px", background: "var(--surface-alt)", borderRadius: "var(--radius-lg)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.02em" }}>
                    {product.priceDisplay}
                  </span>
                  <span style={{ fontSize: "18px", color: "#aaa", textDecoration: "line-through" }}>
                    {product.oldPriceDisplay}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>{product.priceNote}</p>
              </div>

              {/* Description */}
              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--foreground-muted)", fontWeight: 300, marginBottom: "32px" }}>
                {product.description}
              </p>

              {/* Size Selector */}
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label" style={{ marginBottom: "12px" }}>
                  Select Size
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {product.standardSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: "8px 16px",
                        border: `1.5px solid ${selectedSize === size ? "var(--primary)" : "var(--border)"}`,
                        borderRadius: "var(--radius-md)",
                        background: selectedSize === size ? "var(--primary)" : "transparent",
                        color: selectedSize === size ? "#fff" : "var(--foreground)",
                        fontSize: "13px", fontWeight: 500,
                        cursor: "pointer", transition: "all 0.2s ease",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Size Toggle */}
              <div style={{ marginBottom: "24px" }}>
                <button
                  onClick={() => setCustomSize(!customSize)}
                  style={{
                    background: "none", border: "none",
                    color: "var(--primary)", fontSize: "13px",
                    fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "6px",
                    textDecoration: "underline",
                  }}
                >
                  {customSize ? "▲" : "▼"} Need a custom size?
                </button>
                {customSize && (
                  <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Width (ft)</label>
                      <input
                        type="number" placeholder="e.g. 8"
                        className="form-control"
                        value={customW}
                        onChange={(e) => setCustomW(e.target.value)}
                        style={{ marginTop: "4px" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Length (ft)</label>
                      <input
                        type="number" placeholder="e.g. 12"
                        className="form-control"
                        value={customH}
                        onChange={(e) => setCustomH(e.target.value)}
                        style={{ marginTop: "4px" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div style={{ marginBottom: "28px" }}>
                <label className="form-label" style={{ marginBottom: "10px" }}>Quantity</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: "44px", height: "44px",
                      border: "1.5px solid var(--border)", borderRight: "none",
                      borderRadius: "var(--radius-md) 0 0 var(--radius-md)",
                      background: "var(--surface)", cursor: "pointer",
                      fontSize: "18px", color: "var(--foreground)",
                    }}
                  >
                    −
                  </button>
                  <div style={{
                    width: "64px", height: "44px",
                    border: "1.5px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", fontWeight: 600, color: "var(--foreground)",
                  }}>
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: "44px", height: "44px",
                      border: "1.5px solid var(--border)", borderLeft: "none",
                      borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                      background: "var(--surface)", cursor: "pointer",
                      fontSize: "18px", color: "var(--foreground)",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                <a
                  href={`${WA_BASE}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "100%", justifyContent: "center",
                      padding: "18px", fontSize: "13px",
                      gap: "10px", borderRadius: "var(--radius-md)",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Chat on WhatsApp
                  </button>
                </a>

                <button
                  className="btn btn-outline"
                  onClick={() => setInquiryOpen(true)}
                  style={{
                    width: "100%", justifyContent: "center",
                    padding: "17px", fontSize: "13px",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  Send Website Inquiry
                </button>
              </div>

              {/* Quick Specs */}
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { label: "Material", value: product.material },
                    { label: "Construction", value: product.construction },
                    { label: "Pile Height", value: product.pile },
                    { label: "Shape", value: product.shape },
                    { label: "Origin", value: product.origin },
                    { label: "Lead Time", value: product.leadTime },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: "10px", color: "var(--foreground-muted)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: "3px" }}>{label}</div>
                      <div style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 500 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust items */}
              <div style={{ display: "flex", gap: "20px", marginTop: "24px", flexWrap: "wrap" }}>
                {[
                  { icon: "🚚", text: "Free Worldwide Shipping" },
                  { icon: "✋", text: "100% Handmade" },
                  { icon: "🔄", text: "Custom Sizes" },
                ].map((item) => (
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
            {/* Long Description */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "36px", fontWeight: 300,
                color: "var(--foreground)", marginBottom: "24px",
                letterSpacing: "-0.02em",
              }}>
                About This Rug
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.9, color: "var(--foreground-muted)", fontWeight: 300 }}>
                {product.longDescription}
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "36px", fontWeight: 300,
                color: "var(--foreground)", marginBottom: "24px",
                letterSpacing: "-0.02em",
              }}>
                Key Features
              </h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                {product.features.map((feature, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: "var(--primary)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", flexShrink: 0, marginTop: "1px",
                    }}>✓</span>
                    <span style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.6 }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ padding: "80px 0", background: "var(--background)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; You May Also Love</p>
              <h2 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "40px", fontWeight: 300, letterSpacing: "-0.02em",
                color: "var(--foreground)",
              }}>
                Related Rugs
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
              {relatedProducts.map((rel) => (
                <Link key={rel.id} href={`/products/${rel.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    className="rug-card"
                    style={{ borderRadius: "var(--radius-lg)", overflow: "hidden" }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-6px)";
                      el.style.boxShadow = "var(--shadow-xl)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(0)";
                      el.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
                      <Image src={rel.image} alt={rel.title} fill sizes="25vw" style={{ objectFit: "cover", transition: "transform 0.5s ease" }} />
                    </div>
                    <div style={{ padding: "20px" }}>
                      <p style={{ fontSize: "10px", color: "var(--primary)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>
                        {rel.category}
                      </p>
                      <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "20px", fontWeight: 500, color: "var(--foreground)", marginBottom: "8px" }}>
                        {rel.title}
                      </h3>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary)" }}>{rel.priceDisplay}</span>
                        <span style={{ fontSize: "14px", color: "#bbb", textDecoration: "line-through" }}>{rel.oldPriceDisplay}</span>
                      </div>
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
        <div
          onClick={() => setZoomOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out", padding: "24px",
          }}
        >
          <div style={{ position: "relative", width: "min(90vw, 700px)", aspectRatio: "4/5" }}>
            <Image
              src={product.images[activeImage] || product.image}
              alt={product.title}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          <button
            onClick={() => setZoomOpen(false)}
            style={{
              position: "absolute", top: "20px", right: "20px",
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", borderRadius: "50%", width: "44px", height: "44px",
              cursor: "pointer", fontSize: "20px", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9997,
            background: "rgba(0,0,0,0.6)", display: "flex",
            alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setInquiryOpen(false); }}
        >
          <div style={{
            background: "var(--surface)", borderRadius: "var(--radius-xl)",
            padding: "40px", width: "min(520px, 100%)",
            boxShadow: "var(--shadow-xl)",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 300, color: "var(--foreground)", marginBottom: "12px" }}>
                  Inquiry Sent!
                </h3>
                <p style={{ color: "var(--foreground-muted)", fontSize: "15px" }}>
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                  <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 300, color: "var(--foreground)" }}>
                    Send Inquiry
                  </h3>
                  <button
                    onClick={() => setInquiryOpen(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: "var(--foreground-muted)", lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
                <div style={{
                  padding: "12px 16px", background: "var(--primary-pale)",
                  borderRadius: "var(--radius-md)", marginBottom: "24px",
                  fontSize: "13px", color: "var(--primary)", fontWeight: 500,
                }}>
                  {product.title} · {selectedSize} · Qty: {quantity}
                </div>
                <form onSubmit={handleInquiry} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="form-label">Name *</label>
                      <input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="form-label">Phone</label>
                      <input type="tel" className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" />
                    </div>
                    <div>
                      <label className="form-label">Country</label>
                      <input className="form-control" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="USA" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Any specific requirements, custom size, color preferences..."
                      style={{ resize: "vertical" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "13px", borderRadius: "var(--radius-md)" }}>
                    Send Inquiry
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-main-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
