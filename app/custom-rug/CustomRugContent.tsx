"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface Product {
  id: string; slug: string; title: string; subtitle?: string;
  construction: string; category: string; rugType: string;
  material: string; image: string; images?: string[]; badge?: string | null;
  active?: boolean;
}

const FORM_INIT = {
  name: "", email: "", phone: "", country: "",
  rugType: "", size: "", shape: "", material: "", pileHeight: "",
  primaryColor: "", secondaryColor: "",
  style: "", room: "", notes: "",
};

// Price range estimator — DO NOT MODIFY
function getPriceRange(rugType: string, size: string): string {
  const sizeMap: Record<string, number> = {
    "2×3 ft": 6, "3×5 ft": 15, "4×6 ft": 24, "5×7 ft": 35,
    "6×9 ft": 54, "8×10 ft": 80, "9×12 ft": 108, "10×14 ft": 140,
  };
  const sqft = sizeMap[size] || 0;
  if (!sqft || !rugType) return "Contact for pricing";
  const rateMap: Record<string, [number, number]> = {
    "Hand Knotted": [280, 480],
    "Hand Tufted": [45, 85],
    "Durrie / Flat Weave": [18, 35],
    "Jute / Natural": [12, 25],
  };
  const [lo, hi] = rateMap[rugType] || [30, 80];
  const low = Math.round(lo * sqft);
  const high = Math.round(hi * sqft);
  return `$${low.toLocaleString()} – $${high.toLocaleString()}`;
}

export default function CustomRugContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [designSource, setDesignSource] = useState<"custom" | "upload" | "browse">("custom");

  // Form state
  const [form, setForm] = useState(FORM_INIT);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((prods: Product[]) => {
        if (Array.isArray(prods)) {
          setProducts(prods.filter((p) => p.active !== false));
        }
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  const shuffledProducts = useMemo(() => [...products].sort(() => 0), [products]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDesignFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setDesignPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = useCallback(() => {
    if (!confirm("Reset all fields? All entered information will be lost.")) return;
    setForm(FORM_INIT);
    setDesignFile(null);
    setDesignPreview("");
    setSubmitError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    let designUrl = "";
    if (designFile) {
      try {
        const fd = new FormData();
        fd.append("images", designFile);
        fd.append("slug", `custom-inquiry-${Date.now()}`);
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.urls?.[0]) designUrl = uploadData.urls[0];
      } catch {}
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          ...form,
          designImage: designUrl || "",
          submittedAt: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError("Submission failed. Please try again or contact us via WhatsApp.");
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    }
    setSubmitting(false);
  };

  const priceEstimate = getPriceRange(form.rugType, form.size);

  const inputSt: React.CSSProperties = {
    width: "100%", padding: "11px 14px", border: "1.5px solid rgba(255,255,255,0.15)",
    borderRadius: "8px", fontSize: "14px", outline: "none", color: "#fff",
    background: "rgba(255,255,255,0.07)", boxSizing: "border-box",
  };
  const labelSt: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 700,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)", marginBottom: "6px",
  };
  const selectSt: React.CSSProperties = { ...inputSt, cursor: "pointer" };
  const tabActiveStyle: React.CSSProperties = {
    background: "rgba(201,169,110,0.25)", color: "var(--gold-light)",
    border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer",
    letterSpacing: "0.05em", padding: "10px 20px", borderRadius: "8px",
    transition: "all 0.2s ease",
  };
  const tabInactiveStyle: React.CSSProperties = {
    background: "transparent", color: "rgba(255,255,255,0.45)",
    border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer",
    letterSpacing: "0.05em", padding: "10px 20px", borderRadius: "8px",
    transition: "all 0.2s ease",
  };

  return (
    <section style={{ background: "var(--foreground)", minHeight: "100vh", padding: "64px 0 100px" }}>
      <div className="container" style={{ maxWidth: "860px" }}>

        {/* ── Compact Hero ─────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{
            fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase",
            color: "var(--gold)", fontWeight: 600, marginBottom: "14px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          }}>
            <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
            ✦ Bespoke Service · Jaipur, India
            <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 300,
            color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "0",
          }}>
            Build Your <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Perfect Rug</em>
          </h1>
        </div>

        {/* ── Success state ─────────────────────────────────────────────── */}
        {submitted ? (
          <div style={{
            background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(201,169,110,0.3)",
            borderRadius: "var(--radius-xl)", padding: "60px 40px", textAlign: "center",
          }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
            <h3 style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "32px", fontWeight: 300, color: "#fff", marginBottom: "16px",
            }}>
              Request Received!
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.8, maxWidth: "400px", margin: "0 auto 32px" }}>
              Our design team will contact you within 24 hours with a personalised quote and design proposal.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/918416919470?text=Hi%2C+I+just+submitted+a+custom+rug+request+on+your+website."
                target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}
              >
                <button style={{
                  background: "#25D366", color: "#fff", border: "none",
                  padding: "14px 32px", borderRadius: "9999px", fontWeight: 700,
                  fontSize: "12px", letterSpacing: "0.1em", cursor: "pointer",
                }}>
                  Follow up on WhatsApp
                </button>
              </a>
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  background: "transparent", color: "rgba(255,255,255,0.6)",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  padding: "13px 28px", borderRadius: "9999px", fontSize: "12px", cursor: "pointer",
                }}
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-xl)", padding: "36px",
              display: "flex", flexDirection: "column", gap: "32px",
            }}>

              {/* ── Design Source tabs ──────────────────────────────────── */}
              <div>
                <label style={{ ...labelSt, marginBottom: "12px" }}>Design Source</label>
                <div style={{
                  display: "flex", gap: "8px",
                  background: "rgba(255,255,255,0.05)", borderRadius: "10px",
                  padding: "4px", border: "1px solid rgba(255,255,255,0.1)",
                  width: "fit-content",
                }}>
                  {([
                    { key: "custom", label: "✏️ Custom Design" },
                    { key: "upload", label: "📎 Upload Your Design" },
                    { key: "browse", label: "🎨 Browse Our Designs" },
                  ] as const).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setDesignSource(tab.key)}
                      style={designSource === tab.key ? tabActiveStyle : tabInactiveStyle}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Upload panel */}
                {designSource === "upload" && (
                  <div style={{ marginTop: "16px" }}>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: "2px dashed rgba(255,255,255,0.2)", borderRadius: "var(--radius-lg)",
                        padding: "28px", textAlign: "center", cursor: "pointer",
                        background: designPreview ? "transparent" : "rgba(255,255,255,0.03)",
                        transition: "all 0.2s ease",
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          setDesignFile(file);
                          const reader = new FileReader();
                          reader.onload = (ev) => setDesignPreview(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    >
                      {designPreview ? (
                        <div style={{ position: "relative", display: "inline-block" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={designPreview} alt="Design preview"
                            style={{ maxHeight: "160px", maxWidth: "100%", objectFit: "contain", borderRadius: "var(--radius-md)" }}
                          />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setDesignFile(null); setDesignPreview(""); }}
                            style={{
                              position: "absolute", top: "-8px", right: "-8px", background: "#dc2626",
                              border: "none", borderRadius: "50%", width: "24px", height: "24px",
                              color: "#fff", cursor: "pointer", fontSize: "14px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >×</button>
                          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>{designFile?.name}</p>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.4 }}>📎</div>
                          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "4px" }}>Click or drag & drop your design file</p>
                          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>PNG, JPG, PDF up to 10MB</p>
                        </>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: "none" }} />
                    </div>
                  </div>
                )}

                {/* Browse panel */}
                {designSource === "browse" && (
                  <div style={{ marginTop: "16px" }}>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
                      Choose an existing design as your starting point — we&apos;ll customise it in any size, colour, or material.
                    </p>
                    {productsLoading ? (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                        {[1,2,3,4,5,6,7,8].map((i) => (
                          <div key={i} style={{ height: "100px", background: "rgba(255,255,255,0.06)", borderRadius: "8px" }} />
                        ))}
                      </div>
                    ) : products.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                        No designs available yet.
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", maxHeight: "280px", overflowY: "auto" }}>
                        {shuffledProducts.map((product) => {
                          const imgSrc = (product.images && product.images.length > 0) ? product.images[0] : product.image;
                          return (
                            <div
                              key={product.id}
                              style={{
                                borderRadius: "8px", overflow: "hidden", position: "relative",
                                aspectRatio: "1", cursor: "pointer",
                                border: "1.5px solid rgba(255,255,255,0.1)",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                            >
                              <Image src={imgSrc} alt={product.title} fill sizes="100px" style={{ objectFit: "cover" }} />
                              <div style={{
                                position: "absolute", bottom: 0, left: 0, right: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                                padding: "6px 5px 5px", fontSize: "9px", color: "#fff", fontWeight: 600,
                              }}>
                                {product.title.slice(0, 18)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <Link href="/shop" style={{ display: "inline-block", marginTop: "10px", fontSize: "12px", color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>
                      View full collection →
                    </Link>
                  </div>
                )}
              </div>

              {/* ── Rug Specifications ──────────────────────────────────── */}
              <div>
                <label style={{ ...labelSt, marginBottom: "16px" }}>Rug Specifications</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

                  {/* Material */}
                  <div>
                    <label style={labelSt}>Material</label>
                    <select value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} style={selectSt}>
                      <option value="">Select material…</option>
                      {["Wool", "Wool & Silk", "Bamboo Silk", "Cotton", "Jute", "Synthetic / Polypropylene", "Not sure — advise me"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Technique */}
                  <div>
                    <label style={labelSt}>Technique / Type</label>
                    <select value={form.rugType} onChange={(e) => setForm({ ...form, rugType: e.target.value })} style={selectSt}>
                      <option value="">Select type…</option>
                      {["Hand Knotted", "Hand Tufted", "Durrie / Flat Weave", "Jute / Natural", "Not sure — advise me"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Style */}
                  <div>
                    <label style={labelSt}>Style / Look</label>
                    <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} style={selectSt}>
                      <option value="">Select style…</option>
                      {["Traditional / Classic", "Modern / Contemporary", "Bohemian / Boho", "Moroccan", "Scandinavian", "Geometric", "Floral", "Abstract", "Transitional", "Minimalist"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Shape */}
                  <div>
                    <label style={labelSt}>Shape</label>
                    <select value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} style={selectSt}>
                      <option value="">Select shape…</option>
                      {["Rectangle", "Square", "Round / Circular", "Oval", "Runner", "Custom Shape"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label style={labelSt}>Size Required</label>
                    <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} style={selectSt}>
                      <option value="">Select size…</option>
                      {["2×3 ft", "3×5 ft", "4×6 ft", "5×7 ft", "6×9 ft", "8×10 ft", "9×12 ft", "10×14 ft", "Custom size"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pile Height */}
                  <div>
                    <label style={labelSt}>Pile Height</label>
                    <select value={form.pileHeight} onChange={(e) => setForm({ ...form, pileHeight: e.target.value })} style={selectSt}>
                      <option value="">Select pile height…</option>
                      {[
                        "Flat Weave (0mm)",
                        "Low Pile (3–6mm)",
                        "Medium Pile (7–12mm)",
                        "High Pile (13–20mm)",
                        "Shaggy / Ultra High (21mm+)",
                        "Not sure — advise me",
                      ].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Colour */}
                  <div>
                    <label style={labelSt}>Primary Colour</label>
                    <input
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      style={inputSt}
                      placeholder="e.g. Ivory, Navy, Terracotta"
                    />
                  </div>

                  {/* Secondary Colour */}
                  <div>
                    <label style={labelSt}>Secondary Colour</label>
                    <input
                      value={form.secondaryColor}
                      onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                      style={inputSt}
                      placeholder="e.g. Gold, Sage, Cream"
                    />
                  </div>

                  {/* Room */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelSt}>Room / Intended Use</label>
                    <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} style={selectSt}>
                      <option value="">Select room…</option>
                      {["Living Room", "Bedroom", "Dining Room", "Hallway / Entryway", "Office / Study", "Hotel Lobby", "Commercial Space", "Outdoor", "Other"].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelSt}>Notes / Reference Image</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Describe your vision, share a Pinterest link, Pantone code, or any reference. Pile height preferences, budget range, delivery timeline…"
                      style={{ ...inputSt, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Live Price Estimate ─────────────────────────────────── */}
              <div style={{
                background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.25)",
                borderRadius: "var(--radius-lg)", padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
              }}>
                <div>
                  <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>
                    Live Price Estimate
                  </p>
                  <p style={{ fontSize: "26px", fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 500, color: "var(--gold-light)" }}>
                    {priceEstimate}
                  </p>
                </div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", maxWidth: "260px", lineHeight: 1.5 }}>
                  {form.rugType && form.size
                    ? "Based on technique & size. Final quote confirmed within 24 hours."
                    : "Select technique & size above to see your price estimate."}
                </p>
              </div>

              {/* ── Customer Details ────────────────────────────────────── */}
              <div>
                <label style={{ ...labelSt, marginBottom: "16px" }}>Your Details</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelSt}>Full Name *</label>
                    <input
                      required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={inputSt} placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label style={labelSt}>Email *</label>
                    <input
                      required type="email" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={inputSt} placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label style={labelSt}>Phone / WhatsApp</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={inputSt} placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label style={labelSt}>Country</label>
                    <input
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      style={inputSt} placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {/* ── Error ───────────────────────────────────────────────── */}
              {submitError && (
                <div style={{
                  background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)",
                  borderRadius: "var(--radius-md)", padding: "12px 16px",
                  color: "#fca5a5", fontSize: "14px",
                }}>
                  {submitError}
                </div>
              )}

              {/* ── Submit ──────────────────────────────────────────────── */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 2, minWidth: "200px", padding: "18px",
                    background: "var(--gold)", color: "var(--foreground)",
                    border: "none", borderRadius: "9999px",
                    fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: submitting ? "default" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    boxShadow: "0 4px 20px rgba(201,169,110,0.35)",
                  }}
                >
                  {submitting ? "Submitting…" : "Submit Quote Request"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    flex: 1, padding: "17px 24px", background: "transparent",
                    color: "rgba(255,255,255,0.5)",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                    borderRadius: "9999px", fontSize: "12px", cursor: "pointer",
                  }}
                >
                  Reset
                </button>
                <a
                  href={`https://wa.me/918416919470?text=Hi%2C+I%27m+interested+in+a+custom+rug.+Type%3A+${encodeURIComponent(form.rugType || "")},+Size%3A+${encodeURIComponent(form.size || "")},+Material%3A+${encodeURIComponent(form.material || "")}`}
                  target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flex: 1 }}
                >
                  <button type="button" style={{
                    width: "100%", padding: "17px", background: "#25D366", color: "#fff",
                    border: "none", borderRadius: "9999px", fontSize: "13px", fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    WhatsApp
                  </button>
                </a>
              </div>

              {/* Trust strip */}
              <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", paddingTop: "4px" }}>
                {[
                  { icon: "🔒", text: "Secure & Confidential" },
                  { icon: "⏱️", text: "24hr Response" },
                  { icon: "🚚", text: "Free Worldwide Shipping" },
                  { icon: "💬", text: "WhatsApp Support" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                    <span>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>

            </div>
          </form>
        )}
      </div>
    </section>
  );
}
