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

  return (
    <div style={{ background: "var(--background)", padding: "40px 0 100px" }}>
      <div className="container" style={{ maxWidth: "860px" }}>

        {/* ── Success state ─────────────────────────────────────────────── */}
        {submitted ? (
          <div style={{
            background: "var(--surface)", border: "1.5px solid var(--border-green)",
            borderRadius: "var(--radius-xl)", padding: "60px 40px", textAlign: "center",
            boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
            <h3 style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "32px", fontWeight: 300, color: "var(--foreground)", marginBottom: "16px",
            }}>
              Request Received!
            </h3>
            <p style={{ color: "var(--foreground-muted)", fontSize: "15px", lineHeight: 1.8, maxWidth: "400px", margin: "0 auto 32px" }}>
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
                  background: "transparent", color: "var(--foreground-muted)",
                  border: "1.5px solid var(--border)",
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
              background: "var(--surface)", border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-xl)", padding: "36px",
              display: "flex", flexDirection: "column", gap: "32px",
              boxShadow: "var(--shadow-md)",
            }}>

              {/* ── Design Source tabs ──────────────────────────────────── */}
              <div>
                <label className="form-label" style={{ marginBottom: "12px", display: "block" }}>Design Source</label>
                <div style={{
                  display: "flex", gap: "8px",
                  background: "var(--surface-alt)", borderRadius: "10px",
                  padding: "4px", border: "1px solid var(--border-light)",
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
                      style={{
                        padding: "9px 18px", borderRadius: "8px", border: "none",
                        fontSize: "13px", fontWeight: designSource === tab.key ? 700 : 500,
                        cursor: "pointer", transition: "all 0.2s ease", letterSpacing: "0.03em",
                        background: designSource === tab.key ? "var(--primary)" : "transparent",
                        color: designSource === tab.key ? "#fff" : "var(--foreground-muted)",
                      }}
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
                        border: "2px dashed var(--border)", borderRadius: "var(--radius-lg)",
                        padding: "28px", textAlign: "center", cursor: "pointer",
                        background: designPreview ? "transparent" : "var(--surface-alt)",
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
                          <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "8px" }}>{designFile?.name}</p>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.4 }}>📎</div>
                          <p style={{ color: "var(--foreground-muted)", fontSize: "14px", marginBottom: "4px" }}>Click or drag & drop your design file</p>
                          <p style={{ color: "var(--foreground-muted)", fontSize: "12px", opacity: 0.6 }}>PNG, JPG, PDF up to 10MB</p>
                        </>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: "none" }} />
                    </div>
                  </div>
                )}

                {/* Browse panel */}
                {designSource === "browse" && (
                  <div style={{ marginTop: "16px" }}>
                    <p style={{ fontSize: "13px", color: "var(--foreground-muted)", marginBottom: "12px" }}>
                      Choose an existing design as your starting point — we&apos;ll customise it in any size, colour, or material.
                    </p>
                    {productsLoading ? (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                        {[1,2,3,4,5,6,7,8].map((i) => (
                          <div key={i} style={{ height: "100px", background: "var(--surface-alt)", borderRadius: "8px" }} />
                        ))}
                      </div>
                    ) : products.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px", color: "var(--foreground-muted)", fontSize: "14px" }}>
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
                                border: "1.5px solid var(--border-light)",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
                            >
                              <Image src={imgSrc} alt={product.title} fill sizes="100px" style={{ objectFit: "cover" }} />
                              <div style={{
                                position: "absolute", bottom: 0, left: 0, right: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
                                padding: "6px 5px 5px", fontSize: "9px", color: "#fff", fontWeight: 600,
                              }}>
                                {product.title.slice(0, 18)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <Link href="/shop" style={{ display: "inline-block", marginTop: "10px", fontSize: "12px", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                      View full collection →
                    </Link>
                  </div>
                )}
              </div>

              {/* ── Rug Specifications ──────────────────────────────────── */}
              <div>
                <label className="form-label" style={{ marginBottom: "16px", display: "block" }}>Rug Specifications</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

                  <div>
                    <label className="form-label">Material</label>
                    <div className="select-wrapper">
                      <select className="form-control" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}>
                        <option value="">Select material…</option>
                        {["Wool", "Wool & Silk", "Bamboo Silk", "Cotton", "Jute", "Synthetic / Polypropylene", "Not sure — advise me"].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Technique / Type</label>
                    <div className="select-wrapper">
                      <select className="form-control" value={form.rugType} onChange={(e) => setForm({ ...form, rugType: e.target.value })}>
                        <option value="">Select type…</option>
                        {["Hand Knotted", "Hand Tufted", "Durrie / Flat Weave", "Jute / Natural", "Not sure — advise me"].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Style / Look</label>
                    <div className="select-wrapper">
                      <select className="form-control" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })}>
                        <option value="">Select style…</option>
                        {["Traditional / Classic", "Modern / Contemporary", "Bohemian / Boho", "Moroccan", "Scandinavian", "Geometric", "Floral", "Abstract", "Transitional", "Minimalist"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Shape</label>
                    <div className="select-wrapper">
                      <select className="form-control" value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })}>
                        <option value="">Select shape…</option>
                        {["Rectangle", "Square", "Round / Circular", "Oval", "Runner", "Custom Shape"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Size Required</label>
                    <div className="select-wrapper">
                      <select className="form-control" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                        <option value="">Select size…</option>
                        {["2×3 ft", "3×5 ft", "4×6 ft", "5×7 ft", "6×9 ft", "8×10 ft", "9×12 ft", "10×14 ft", "Custom size"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Pile Height</label>
                    <div className="select-wrapper">
                      <select className="form-control" value={form.pileHeight} onChange={(e) => setForm({ ...form, pileHeight: e.target.value })}>
                        <option value="">Select pile height…</option>
                        {["Flat Weave (0mm)", "Low Pile (3–6mm)", "Medium Pile (7–12mm)", "High Pile (13–20mm)", "Shaggy / Ultra High (21mm+)", "Not sure — advise me"].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Primary Colour</label>
                    <input className="form-control" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} placeholder="e.g. Ivory, Navy, Terracotta" />
                  </div>

                  <div>
                    <label className="form-label">Secondary Colour</label>
                    <input className="form-control" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} placeholder="e.g. Gold, Sage, Cream" />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label">Room / Intended Use</label>
                    <div className="select-wrapper">
                      <select className="form-control" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}>
                        <option value="">Select room…</option>
                        {["Living Room", "Bedroom", "Dining Room", "Hallway / Entryway", "Office / Study", "Hotel Lobby", "Commercial Space", "Outdoor", "Other"].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label">Notes / Reference Image</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Describe your vision, share a Pinterest link, Pantone code, or any reference. Pile height preferences, budget range, delivery timeline…"
                      style={{ resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Live Price Estimate ─────────────────────────────────── */}
              <div style={{
                background: "var(--primary-pale)", border: "1px solid var(--border-green)",
                borderRadius: "var(--radius-lg)", padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
              }}>
                <div>
                  <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary)", fontWeight: 600, marginBottom: "4px" }}>
                    Live Price Estimate
                  </p>
                  <p style={{ fontSize: "26px", fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 500, color: "var(--foreground)" }}>
                    {priceEstimate}
                  </p>
                </div>
                <p style={{ fontSize: "12px", color: "var(--foreground-muted)", maxWidth: "260px", lineHeight: 1.5 }}>
                  {form.rugType && form.size
                    ? "Based on technique & size. Final quote confirmed within 24 hours."
                    : "Select technique & size above to see your price estimate."}
                </p>
              </div>

              {/* ── Customer Details ────────────────────────────────────── */}
              <div>
                <label className="form-label" style={{ marginBottom: "16px", display: "block" }}>Your Details</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input required className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input required type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="form-label">Phone / WhatsApp</label>
                    <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" />
                  </div>
                  <div>
                    <label className="form-label">Country</label>
                    <input className="form-control" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="United States" />
                  </div>
                </div>
              </div>

              {/* ── Error ───────────────────────────────────────────────── */}
              {submitError && (
                <div style={{
                  background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)",
                  borderRadius: "var(--radius-md)", padding: "12px 16px",
                  color: "#dc2626", fontSize: "14px",
                }}>
                  {submitError}
                </div>
              )}

              {/* ── Submit ──────────────────────────────────────────────── */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{
                    flex: 2, minWidth: "200px", padding: "16px",
                    fontSize: "12px", letterSpacing: "0.1em",
                    opacity: submitting ? 0.7 : 1, cursor: submitting ? "default" : "pointer",
                  }}
                >
                  {submitting ? "Submitting…" : "Submit Quote Request"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-ghost"
                  style={{ flex: 1, padding: "15px 24px", fontSize: "12px" }}
                >
                  Reset
                </button>
                <a
                  href={`https://wa.me/918416919470?text=Hi%2C+I%27m+interested+in+a+custom+rug.+Type%3A+${encodeURIComponent(form.rugType || "")},+Size%3A+${encodeURIComponent(form.size || "")},+Material%3A+${encodeURIComponent(form.material || "")}`}
                  target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flex: 1 }}
                >
                  <button type="button" style={{
                    width: "100%", padding: "15px", background: "#25D366", color: "#fff",
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
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--foreground-muted)" }}>
                    <span>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
}
