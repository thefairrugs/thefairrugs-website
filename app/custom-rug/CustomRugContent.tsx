"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const processSteps = [
  { step: "01", title: "Share Your Vision", desc: "Tell us about your space, your style, and your requirements. Share any reference images, colour palettes, or design ideas." },
  { step: "02", title: "Design Consultation", desc: "Our design team creates a detailed specification and digital preview of your rug. We refine until it's perfect." },
  { step: "03", title: "Expert Weaving", desc: "Our master artisans weave your rug on traditional handlooms using the finest materials. Production takes 3–5 weeks." },
  { step: "04", title: "Quality & Delivery", desc: "Your rug is inspected, finished, photographed, and delivered worldwide — fully insured, door-to-door." },
];

const customOptions = [
  { title: "Any Size", desc: "From small accent rugs to expansive room-sized carpets. We work in metric or imperial — your choice.", icon: "⬛" },
  { title: "Any Shape", desc: "Rectangle, round, runner, oval, square, irregular, or completely custom shaped to your floor plan.", icon: "◐" },
  { title: "Any Material", desc: "New Zealand wool, Himalayan silk, bamboo silk, organic cotton, jute, or luxurious wool-silk blends.", icon: "🧵" },
  { title: "Any Design", desc: "Traditional, contemporary, geometric, abstract, bespoke patterns, or an exact match to your design specification.", icon: "🎨" },
  { title: "Any Colour", desc: "Pantone-matched colours using natural, eco-friendly dyes. We can match existing decor palettes precisely.", icon: "🎨" },
  { title: "Any Technique", desc: "Hand knotted, hand tufted, flat weave durrie, or natural jute — each offering a distinct texture and character.", icon: "✦" },
];

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

// Price range estimator based on selections
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [designSource, setDesignSource] = useState<"upload" | "browse">("upload");

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
  const selectSt: React.CSSProperties = {
    ...inputSt, cursor: "pointer",
  };

  const priceEstimate = getPriceRange(form.rugType, form.size);

  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--foreground)", padding: "64px 0 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 40%, rgba(201,169,110,0.08) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
            Bespoke Service · Jaipur, India
            <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: "20px" }}>
            Build Your <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Perfect Rug</em>
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.8, color: "rgba(255,255,255,0.65)", fontWeight: 300, maxWidth: "520px", margin: "0 auto 28px" }}>
            Custom design, any size, any material — crafted by master artisans with decades of experience.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Design Your Rug", href: "#configurator" },
              { label: "Upload Your Design", href: "#configurator" },
              { label: "Browse Our Designs", href: "#browse" },
            ].map((item) => (
              <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                <span style={{ display: "inline-block", padding: "9px 20px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px", color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em" }}>
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONFIGURATOR — two-column layout ═══════════════════════ */}
      <section id="configurator" style={{ padding: "80px 0", background: "var(--foreground)" }}>
        <div className="container">

          {/* Section heading */}
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "14px" }}>✦ &nbsp; Rug Builder</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>
              Design Your Custom Rug
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", marginTop: "12px", lineHeight: 1.7 }}>
              Configure your specifications below — then fill in your details to receive a personalised quote within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div style={{ maxWidth: "600px", margin: "0 auto", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(201,169,110,0.3)", borderRadius: "var(--radius-xl)", padding: "60px 40px", textAlign: "center" }}>
              <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
              <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "32px", fontWeight: 300, color: "#fff", marginBottom: "16px" }}>
                Request Received!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.8, maxWidth: "400px", margin: "0 auto 32px" }}>
                Our design team will contact you within 24 hours with a personalised quote and design proposal.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://wa.me/918416919470?text=Hi%2C+I+just+submitted+a+custom+rug+request+on+your+website." target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button style={{ background: "#25D366", color: "#fff", border: "none", padding: "14px 32px", borderRadius: "9999px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em", cursor: "pointer" }}>
                    Follow up on WhatsApp
                  </button>
                </a>
                <button onClick={() => setSubmitted(false)} style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.2)", padding: "13px 28px", borderRadius: "9999px", fontSize: "12px", cursor: "pointer" }}>
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* ── TWO-COLUMN LAYOUT: left = specs, right = sticky order summary ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>

                {/* ─── LEFT COLUMN: Design Source + All Spec Fields ─────────────── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

                  {/* Design Source Tabs */}
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-xl)", padding: "28px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      Step 1 — Design Source
                    </h3>
                    {/* Tabs */}
                    <div style={{ display: "flex", gap: "0", marginBottom: "24px", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "10px", overflow: "hidden" }}>
                      {(["upload", "browse"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setDesignSource(tab)}
                          style={{
                            flex: 1, padding: "12px 16px",
                            background: designSource === tab ? "rgba(201,169,110,0.25)" : "transparent",
                            border: "none", color: designSource === tab ? "var(--gold-light)" : "rgba(255,255,255,0.5)",
                            fontSize: "13px", fontWeight: 700, cursor: "pointer",
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            borderRight: tab === "upload" ? "1px solid rgba(255,255,255,0.15)" : "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {tab === "upload" ? "📎 Upload Your Design" : "🎨 Browse Our Designs"}
                        </button>
                      ))}
                    </div>

                    {/* Upload panel */}
                    {designSource === "upload" && (
                      <div>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", lineHeight: 1.6 }}>
                          Upload your design file — sketch, mood board, fabric sample photo, or any reference image.
                        </p>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            border: "2px dashed rgba(255,255,255,0.2)", borderRadius: "var(--radius-lg)",
                            padding: "36px", textAlign: "center", cursor: "pointer",
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
                            <div style={{ position: "relative" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={designPreview} alt="Design preview" style={{ maxHeight: "200px", maxWidth: "100%", objectFit: "contain", borderRadius: "var(--radius-md)" }} />
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setDesignFile(null); setDesignPreview(""); }}
                                style={{ position: "absolute", top: "-8px", right: "-8px", background: "#dc2626", border: "none", borderRadius: "50%", width: "24px", height: "24px", color: "#fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
                              >×</button>
                              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "12px" }}>{designFile?.name}</p>
                            </div>
                          ) : (
                            <>
                              <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.4 }}>📎</div>
                              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "6px" }}>Click or drag & drop your design file</p>
                              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>PNG, JPG, PDF up to 10MB</p>
                            </>
                          )}
                          <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: "none" }} />
                        </div>
                      </div>
                    )}

                    {/* Browse panel — scroll preview inside form */}
                    {designSource === "browse" && (
                      <div>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", lineHeight: 1.6 }}>
                          Choose an existing design as your starting point — we&apos;ll customise it in any size, colour, or material.
                        </p>
                        {productsLoading ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                            {[1,2,3,4,5,6].map((i) => (
                              <div key={i} style={{ height: "120px", background: "rgba(255,255,255,0.06)", borderRadius: "8px" }} />
                            ))}
                          </div>
                        ) : products.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "32px", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                            No designs available yet.
                          </div>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", maxHeight: "320px", overflowY: "auto" }}>
                            {products.slice(0, 12).map((product) => {
                              const imgSrc = (product.images && product.images.length > 0) ? product.images[0] : product.image;
                              return (
                                <div key={product.id} style={{ borderRadius: "8px", overflow: "hidden", position: "relative", aspectRatio: "1", cursor: "pointer", border: "1.5px solid rgba(255,255,255,0.1)" }}
                                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}>
                                  <Image src={imgSrc} alt={product.title} fill sizes="120px" style={{ objectFit: "cover" }} />
                                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)", padding: "8px 6px 6px", fontSize: "10px", color: "#fff", fontWeight: 600 }}>
                                    {product.title.slice(0, 20)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <a href="#browse" style={{ display: "inline-block", marginTop: "12px", fontSize: "12px", color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>
                          View full collection ↓
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Rug Specifications */}
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-xl)", padding: "28px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      Step 2 — Rug Specifications
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                      {/* Material */}
                      <div>
                        <label style={labelSt}>Material</label>
                        <select value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} style={selectSt}>
                          <option value="">Select material…</option>
                          {["Wool", "Wool & Silk", "Bamboo Silk", "Cotton", "Jute", "Synthetic / Polypropylene", "Not sure — advise me"].map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      {/* Rug Type / Technique */}
                      <div>
                        <label style={labelSt}>Technique / Type</label>
                        <select value={form.rugType} onChange={(e) => setForm({ ...form, rugType: e.target.value })} style={selectSt}>
                          <option value="">Select type…</option>
                          {["Hand Knotted", "Hand Tufted", "Durrie / Flat Weave", "Jute / Natural", "Not sure — advise me"].map((t) => <option key={t} value={t}>{t}</option>)}
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

                      {/* Shape */}
                      <div>
                        <label style={labelSt}>Shape</label>
                        <select value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} style={selectSt}>
                          <option value="">Select shape…</option>
                          {["Rectangle", "Square", "Round / Circular", "Oval", "Runner", "Custom Shape"].map((s) => <option key={s} value={s}>{s}</option>)}
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
                          ].map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>

                      {/* Style */}
                      <div>
                        <label style={labelSt}>Style / Look</label>
                        <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} style={selectSt}>
                          <option value="">Select style…</option>
                          {["Traditional / Classic", "Modern / Contemporary", "Bohemian / Boho", "Moroccan", "Scandinavian", "Geometric", "Floral", "Abstract", "Transitional", "Minimalist"].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      {/* Primary Colour */}
                      <div>
                        <label style={labelSt}>Primary Colour</label>
                        <input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} style={inputSt} placeholder="e.g. Ivory, Navy, Terracotta" />
                      </div>

                      {/* Secondary Colour */}
                      <div>
                        <label style={labelSt}>Secondary Colour</label>
                        <input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} style={inputSt} placeholder="e.g. Gold, Sage, Cream" />
                      </div>

                      {/* Room */}
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelSt}>Room / Intended Use</label>
                        <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} style={selectSt}>
                          <option value="">Select room…</option>
                          {["Living Room", "Bedroom", "Dining Room", "Hallway / Entryway", "Office / Study", "Hotel Lobby", "Commercial Space", "Outdoor", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>

                      {/* Reference Image note */}
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelSt}>Reference Image / Design Note</label>
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

                  {/* Contact Form — ONLY ONCE, after all specs */}
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-xl)", padding: "28px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      Step 3 — Your Contact Details
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={labelSt}>Full Name *</label>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputSt} placeholder="Your name" />
                      </div>
                      <div>
                        <label style={labelSt}>Email *</label>
                        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputSt} placeholder="you@email.com" />
                      </div>
                      <div>
                        <label style={labelSt}>Phone / WhatsApp</label>
                        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputSt} placeholder="+1 234 567 8900" />
                      </div>
                      <div>
                        <label style={labelSt}>Country</label>
                        <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={inputSt} placeholder="United States" />
                      </div>
                    </div>

                    {submitError && (
                      <div style={{ marginTop: "16px", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "var(--radius-md)", padding: "12px 16px", color: "#fca5a5", fontSize: "14px" }}>
                        {submitError}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          flex: 1, minWidth: "200px", padding: "18px",
                          background: "var(--gold)", color: "var(--foreground)",
                          border: "none", borderRadius: "9999px",
                          fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em",
                          textTransform: "uppercase", cursor: submitting ? "default" : "pointer",
                          opacity: submitting ? 0.7 : 1,
                          boxShadow: "0 4px 20px rgba(201,169,110,0.35)",
                        }}
                      >
                        {submitting ? "Submitting…" : "Submit Custom Rug Request"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        style={{ padding: "17px 24px", background: "transparent", color: "rgba(255,255,255,0.5)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "9999px", fontSize: "12px", cursor: "pointer" }}
                      >
                        Reset
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", paddingTop: "16px" }}>
                      {[
                        { icon: "🔒", text: "Secure & Confidential" },
                        { icon: "⏱️", text: "24hr Response" },
                        { icon: "🚚", text: "Free Worldwide Shipping" },
                        { icon: "💬", text: "WhatsApp Support" },
                      ].map((item) => (
                        <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                          <span>{item.icon}</span> {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ─── RIGHT COLUMN: Sticky Order Summary ───────────────────────── */}
                <div style={{ position: "sticky", top: "24px" }}>
                  <div style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(201,169,110,0.25)", borderRadius: "var(--radius-xl)", padding: "28px", backdropFilter: "blur(12px)" }}>
                    <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 300, color: "#fff", marginBottom: "6px" }}>
                      Order Summary
                    </h3>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>Updates as you build your rug</p>

                    {/* Summary rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                      {[
                        { label: "Design Source", value: designSource === "upload" ? (designFile ? designFile.name.slice(0, 20) : "Upload your design") : "Browsing collection" },
                        { label: "Material", value: form.material || "Not selected" },
                        { label: "Technique", value: form.rugType || "Not selected" },
                        { label: "Size", value: form.size || "Not selected" },
                        { label: "Shape", value: form.shape || "Not selected" },
                        { label: "Pile Height", value: form.pileHeight || "Not selected" },
                        { label: "Primary Colour", value: form.primaryColor || "Not selected" },
                        { label: "Secondary Colour", value: form.secondaryColor || "Not selected" },
                        { label: "Room / Use", value: form.room || "Not selected" },
                      ].map((row) => (
                        <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>{row.label}</span>
                          <span style={{ fontSize: "12px", color: row.value === "Not selected" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)", fontWeight: row.value === "Not selected" ? 400 : 600, textAlign: "right" }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price estimate */}
                    <div style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: "var(--radius-md)", padding: "16px", marginBottom: "20px" }}>
                      <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>Estimated Price Range</p>
                      <p style={{ fontSize: "22px", fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 500, color: "var(--gold-light)" }}>
                        {priceEstimate}
                      </p>
                      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                        {form.rugType && form.size ? "Based on your selections. Final quote sent within 24h." : "Select technique & size for estimate"}
                      </p>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href={`https://wa.me/918416919470?text=Hi%2C+I%27m+interested+in+a+custom+rug.+Type%3A+${encodeURIComponent(form.rugType || "")},+Size%3A+${encodeURIComponent(form.size || "")},+Material%3A+${encodeURIComponent(form.material || "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", display: "block", marginBottom: "12px" }}
                    >
                      <button type="button" style={{ width: "100%", padding: "13px", background: "#25D366", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        Chat on WhatsApp
                      </button>
                    </a>

                    {/* Trust indicators */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        { icon: "🏭", text: "Handcrafted in Jaipur, India" },
                        { icon: "🚚", text: "Free worldwide shipping" },
                        { icon: "🛡️", text: "Fully insured delivery" },
                        { icon: "⏱️", text: "3–8 week production" },
                      ].map((item) => (
                        <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                          <span>{item.icon}</span> {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ═══ BROWSE OUR DESIGNS ══════════════════════════════════════════ */}
      <section id="browse" style={{ padding: "100px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; Browse & Choose</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Our Design Collection
            </h2>
            <p style={{ color: "var(--foreground-muted)", fontSize: "15px", maxWidth: "480px", margin: "16px auto 0", lineHeight: 1.7, fontWeight: 300 }}>
              Choose an existing design as your starting point — we can customise it in any size, colour, or material.
            </p>
          </div>

          {productsLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
              {[1,2,3,4].map((i) => (
                <div key={i} style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-light)", background: "var(--surface)" }}>
                  <div style={{ height: "260px", background: "linear-gradient(90deg, #f0ece4 25%, #e8e4dc 50%, #f0ece4 75%)" }} />
                  <div style={{ padding: "20px" }}>
                    <div style={{ height: "8px", width: "60%", background: "#e8e4dc", borderRadius: "4px", marginBottom: "10px" }} />
                    <div style={{ height: "20px", width: "80%", background: "#e8e4dc", borderRadius: "4px" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--foreground-muted)", fontSize: "16px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧶</div>
              <p>No designs available yet. Please check back soon or contact us directly.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
              {shuffledProducts.map((product) => {
                const isHovered = hoveredCard === product.id;
                const imgSrc = (product.images && product.images.length > 0) ? product.images[0] : product.image;
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <div
                      onMouseEnter={() => setHoveredCard(product.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", border: `1px solid ${isHovered ? "var(--border-green)" : "var(--border-light)"}`, boxShadow: isHovered ? "var(--shadow-xl)" : "var(--shadow-sm)", cursor: "pointer", transform: isHovered ? "translateY(-6px)" : "translateY(0)", transition: "all 0.35s ease" }}
                    >
                      <div style={{ position: "relative", height: "260px", overflow: "hidden" }}>
                        <Image src={imgSrc} alt={product.title} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: "cover", transform: isHovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.6s ease" }} />
                        {product.badge && (
                          <div style={{ position: "absolute", top: "12px", left: "12px", padding: "3px 10px", borderRadius: "9999px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", background: "var(--gold)", color: "var(--foreground)" }}>
                            {product.badge}
                          </div>
                        )}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)", opacity: isHovered ? 1 : 0, transition: "opacity 0.35s ease", display: "flex", alignItems: "flex-end", padding: "16px" }}>
                          <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>View &amp; Customise →</span>
                        </div>
                      </div>
                      <div style={{ padding: "18px 20px" }}>
                        <p style={{ fontSize: "10px", color: "var(--primary)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>
                          {product.subtitle || product.category}
                        </p>
                        <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "20px", fontWeight: 500, color: "var(--foreground)", marginBottom: "6px", lineHeight: 1.2 }}>
                          {product.title}
                        </h3>
                        <p style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>{product.material}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/shop" style={{ textDecoration: "none" }}>
              <button className="btn btn-ghost" style={{ padding: "14px 36px", fontSize: "12px", letterSpacing: "0.08em" }}>
                View Full Collection →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ OPTIONS GRID ════════════════════════════════════════════════ */}
      <section style={{ padding: "110px 0", background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; Fully Customisable</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Everything is Custom
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {customOptions.map((opt, i) => (
              <div key={i} style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "36px 32px", border: "1px solid var(--border-light)", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "var(--shadow-lg)"; el.style.borderColor = "var(--primary)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; el.style.borderColor = "var(--border-light)"; }}>
                <div style={{ fontSize: "28px", marginBottom: "16px" }}>{opt.icon}</div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>{opt.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--foreground-muted)", lineHeight: 1.7, fontWeight: 300 }}>{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ═════════════════════════════════════════════════════ */}
      <section style={{ padding: "110px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; How It Works</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              From Idea to Doorstep
            </h2>
          </div>
          <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px" }}>
            {processSteps.map((step, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 600, margin: "0 auto 24px", boxShadow: "0 6px 20px rgba(139,94,60,0.3)" }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>{step.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--foreground-muted)", lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
