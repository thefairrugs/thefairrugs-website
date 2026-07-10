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

// ─── Design inquiry form initial values ───────────────────────────────────────
const FORM_INIT = {
  name: "", email: "", phone: "", country: "",
  rugType: "", size: "", shape: "", material: "", primaryColor: "", secondaryColor: "",
  style: "", room: "", notes: "",
};

export default function CustomRugContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState(FORM_INIT);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch live products — cache: no-store so additions/deletions from admin panel are always fresh
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

  // Shuffle once so repeated visits show a fresh order
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

    // If there's a design file, upload it first
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
    width: "100%", padding: "11px 14px", border: "1.5px solid var(--border)",
    borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--foreground)", background: "#fff",
  };
  const labelSt: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 700,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "var(--foreground-muted)", marginBottom: "6px",
  };

  return (
    <>
      {/* Hero — minimal top banner */}
      <section style={{ background: "var(--foreground)", padding: "64px 0 48px", position: "relative", overflow: "hidden" }}>
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
          {/* Quick nav */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Custom Design", href: "#configurator" },
              { label: "Upload Your Design", href: "#configurator" },
              { label: "Browse Our Designs", href: "#browse" },
              { label: "Order Summary", href: "#configurator" },
            ].map((item) => (
              <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                <span style={{
                  display: "inline-block", padding: "9px 20px",
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "9999px", color: "rgba(255,255,255,0.85)",
                  fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em",
                  transition: "all 0.2s ease", cursor: "pointer",
                }}>
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CONFIGURATOR — appears first per user request (builder at top)
          ════════════════════════════════════════════════════════════════ */}
      <section id="configurator" style={{ padding: "80px 0", background: "var(--foreground)" }}>
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "14px" }}>✦ &nbsp; Build Your Custom Rug</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>
                Design Your Perfect Rug
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", marginTop: "12px", lineHeight: 1.7 }}>
                Fill in as much detail as you have. We&apos;ll contact you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(201,169,110,0.3)", borderRadius: "var(--radius-xl)", padding: "60px 40px", textAlign: "center" }}>
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
              <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-xl)", padding: "48px", display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* Contact */}
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    Your Contact Details
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Full Name *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="Your name" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Email *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="you@email.com" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Phone / WhatsApp</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="+1 234 567 8900" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Country</label>
                      <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="United States" />
                    </div>
                  </div>
                </div>

                {/* Rug Specs */}
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    Rug Specifications
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Rug Type / Technique</label>
                      <select value={form.rugType} onChange={(e) => setForm({ ...form, rugType: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.rugType ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select type…</option>
                        {["Hand Knotted", "Hand Tufted", "Durrie / Flat Weave", "Jute / Natural", "Not sure — advise me"].map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Material</label>
                      <select value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.material ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select material…</option>
                        {["Wool", "Wool & Silk", "Bamboo Silk", "Cotton", "Jute", "Synthetic / Polypropylene", "Not sure — advise me"].map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Size Required</label>
                      <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="e.g. 8×10 ft or 240×300 cm" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Shape</label>
                      <select value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.shape ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select shape…</option>
                        {["Rectangle", "Square", "Round / Circular", "Oval", "Runner", "Custom Shape"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Primary Colour</label>
                      <input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="e.g. Ivory, Navy, Terracotta" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Secondary Colour</label>
                      <input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="e.g. Gold, Sage, Cream" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Style / Look</label>
                      <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.style ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select style…</option>
                        {["Traditional / Classic", "Modern / Contemporary", "Bohemian / Boho", "Moroccan", "Scandinavian", "Geometric", "Floral", "Abstract", "Transitional", "Minimalist"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Room / Intended Use</label>
                      <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.room ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select room…</option>
                        {["Living Room", "Bedroom", "Dining Room", "Hallway / Entryway", "Office / Study", "Hotel Lobby", "Commercial Space", "Outdoor", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Design Upload */}
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    Upload Your Design (Optional)
                  </h3>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "2px dashed rgba(255,255,255,0.2)", borderRadius: "var(--radius-lg)",
                      padding: "40px", textAlign: "center", cursor: "pointer",
                      background: designPreview ? "transparent" : "rgba(255,255,255,0.03)",
                      transition: "all 0.2s ease", position: "relative",
                    }}
                    onDragOver={(e) => { e.preventDefault(); }}
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
                        >
                          ×
                        </button>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "12px" }}>{designFile?.name}</p>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.4 }}>📎</div>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "6px" }}>
                          Click or drag & drop your design file
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                          PNG, JPG, PDF, or any image up to 10MB
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Additional Notes</label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any additional details, references, budget range, or specific requirements..."
                    style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff", resize: "vertical" }}
                  />
                </div>

                {submitError && (
                  <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "var(--radius-md)", padding: "12px 16px", color: "#fca5a5", fontSize: "14px" }}>
                    {submitError}
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
                    style={{
                      padding: "17px 24px", background: "transparent",
                      color: "rgba(255,255,255,0.5)", border: "1.5px solid rgba(255,255,255,0.15)",
                      borderRadius: "9999px", fontSize: "12px", cursor: "pointer",
                    }}
                  >
                    Reset
                  </button>
                </div>

                <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", paddingTop: "8px" }}>
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
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Browse Our Designs — live from Admin Panel */}
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
                      style={{
                        background: "var(--surface)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        border: `1px solid ${isHovered ? "var(--border-green)" : "var(--border-light)"}`,
                        boxShadow: isHovered ? "var(--shadow-xl)" : "var(--shadow-sm)",
                        cursor: "pointer",
                        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                        transition: "all 0.35s ease",
                      }}
                    >
                      <div style={{ position: "relative", height: "260px", overflow: "hidden" }}>
                        <Image
                          src={imgSrc}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          style={{ objectFit: "cover", transform: isHovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.6s ease" }}
                        />
                        {product.badge && (
                          <div style={{ position: "absolute", top: "12px", left: "12px", padding: "3px 10px", borderRadius: "9999px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", background: "var(--gold)", color: "var(--foreground)" }}>
                            {product.badge}
                          </div>
                        )}
                        {/* Hover overlay — rendered via React state, not CSS class */}
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                          opacity: isHovered ? 1 : 0,
                          transition: "opacity 0.35s ease",
                          display: "flex", alignItems: "flex-end", padding: "16px",
                        }}>
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

      {/* Options Grid */}
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

      {/* Process */}
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

      {/* Custom Rug Configurator Form */}
      <section id="configurator" style={{ padding: "100px 0", background: "var(--foreground)" }}>
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "16px" }}>✦ &nbsp; Request a Quote</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>
                Design Your Custom Rug
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", marginTop: "16px", lineHeight: 1.7 }}>
                Fill in as much detail as you have. We'll contact you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(201,169,110,0.3)", borderRadius: "var(--radius-xl)", padding: "60px 40px", textAlign: "center" }}>
                <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "32px", fontWeight: 300, color: "#fff", marginBottom: "16px" }}>
                  Request Received!
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.8, maxWidth: "400px", margin: "0 auto 32px" }}>
                  Thank you for your enquiry. Our design team will contact you within 24 hours with a personalised quote and design proposal.
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
              <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-xl)", padding: "48px", display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* Contact */}
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    Your Contact Details
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Full Name *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="Your name" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Email *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="you@email.com" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Phone / WhatsApp</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="+1 234 567 8900" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Country</label>
                      <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="United States" />
                    </div>
                  </div>
                </div>

                {/* Rug Specs */}
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    Rug Specifications
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Rug Type / Technique</label>
                      <select value={form.rugType} onChange={(e) => setForm({ ...form, rugType: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.rugType ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select type…</option>
                        {["Hand Knotted", "Hand Tufted", "Durrie / Flat Weave", "Jute / Natural", "Not sure — advise me"].map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Material</label>
                      <select value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.material ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select material…</option>
                        {["Wool", "Wool & Silk", "Bamboo Silk", "Cotton", "Jute", "Synthetic / Polypropylene", "Not sure — advise me"].map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Size Required</label>
                      <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="e.g. 8×10 ft or 240×300 cm" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Shape</label>
                      <select value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.shape ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select shape…</option>
                        {["Rectangle", "Square", "Round / Circular", "Oval", "Runner", "Custom Shape"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Primary Colour</label>
                      <input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="e.g. Ivory, Navy, Terracotta" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Secondary Colour</label>
                      <input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="e.g. Gold, Sage, Cream" />
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Style / Look</label>
                      <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.style ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select style…</option>
                        {["Traditional / Classic", "Modern / Contemporary", "Bohemian / Boho", "Moroccan", "Scandinavian", "Geometric", "Floral", "Abstract", "Transitional", "Minimalist"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Room / Intended Use</label>
                      <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} style={{ ...inputSt, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: form.room ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Select room…</option>
                        {["Living Room", "Bedroom", "Dining Room", "Hallway / Entryway", "Home Office", "Kitchen", "Outdoor / Patio", "Commercial / Hotel", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Design Upload */}
                <div>
                  <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Upload Design Reference (optional)</label>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: "8px", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600 }}>
                      📎 Choose Image
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                    </label>
                    {designPreview && (
                      <div style={{ position: "relative", width: "60px", height: "60px", borderRadius: "6px", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={designPreview} alt="Design preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => { setDesignFile(null); setDesignPreview(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          style={{ position: "absolute", top: "2px", right: "2px", width: "18px", height: "18px", background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", borderRadius: "50%", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                      </div>
                    )}
                    {designFile && <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{designFile.name}</span>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label style={{ ...labelSt, color: "rgba(255,255,255,0.5)" }}>Additional Notes / Vision</label>
                  <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Describe your vision, any specific patterns, pile height preferences, budget range, delivery timeline, or any other details that will help us create your perfect rug…"
                    style={{ ...inputSt, resize: "vertical", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit" }} />
                </div>

                {submitError && (
                  <div style={{ padding: "12px 16px", background: "#fee2e2", borderRadius: "8px", color: "#dc2626", fontSize: "13px", fontWeight: 600 }}>
                    ⚠️ {submitError}
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="submit" disabled={submitting} style={{ flex: 1, padding: "17px", background: "var(--gold)", color: "var(--foreground)", border: "none", borderRadius: "9999px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
                    {submitting ? "Sending…" : "Submit Custom Request"}
                  </button>
                  <button type="button" onClick={resetForm} style={{ padding: "17px 24px", background: "transparent", color: "rgba(255,255,255,0.5)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "9999px", fontWeight: 600, fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap" }}>
                    Reset Form
                  </button>
                </div>

                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.6 }}>
                  We will never share your information. We typically respond within 24 hours on business days.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
