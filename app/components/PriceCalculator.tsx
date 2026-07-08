"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  SizeMasterItem, PricingItem, PriceResult,
  groupSizesByShape, SHAPE_ORDER, computePrice, parseCustomSqft, formatSqft,
} from "../lib/pricing";
import PriceSummary from "./PriceSummary";

// ── Static rug type list (UI labels only — prices come from /api/admin/pricing) ─
const RUG_TYPES = [
  { id: "hand-knotted", name: "Hand Knotted",  desc: "Traditional craftsmanship" },
  { id: "hand-tufted",  name: "Hand Tufted",   desc: "Versatile & affordable" },
  { id: "durrie",       name: "Durrie",         desc: "Flat weave heritage" },
  { id: "jute",         name: "Jute",           desc: "Natural & eco-friendly" },
];

const RUG_CATEGORIES: Record<string, string[]> = {
  "hand-knotted": ["Traditional Persian", "Tribal & Geometric", "Floral & Medallion", "Modern Abstract", "Oushak & Turkish"],
  "hand-tufted":  ["Contemporary", "Geometric Modern", "Floral Designs", "Bohemian", "Scandinavian"],
  "durrie":       ["Kilim Style", "Flatweave Stripes", "Boho Geometric", "Natural Tones", "Vintage"],
  "jute":         ["Natural Jute", "Jute-Cotton Blend", "Braided Jute", "Printed Jute", "Metallic Jute"],
};

const PILE_HEIGHTS = [
  { label: "Flat Weave", value: "flat",   mm: "0mm",    desc: "Durrie/Kilim",     multiplier: 0.85 },
  { label: "Low Pile",   value: "low",    mm: "5–8mm",  desc: "Easy clean",       multiplier: 0.95 },
  { label: "Medium Pile",value: "medium", mm: "10–13mm",desc: "Most popular",     multiplier: 1.00 },
  { label: "High Pile",  value: "high",   mm: "15–20mm",desc: "Luxurious plush",  multiplier: 1.15 },
  { label: "Shaggy",     value: "shaggy", mm: "25–35mm",desc: "Ultra-soft",       multiplier: 1.25 },
];

const COLORS = [
  "#f9f5ec", "#e8dfd0", "#c8b89a", "#b8975a", "#4a5c3a",
  "#7a8f6a", "#2a3a20", "#6b4f35", "#2e2e2a", "#1c1c1a",
  "#c1440e", "#1a3a6b", "#5c3d8c", "#2e6b4f", "#b8632a",
  "#ffffff", "#d4b47e", "#a3b494", "#8a6a50", "#444444",
];

const WEBSITE_DESIGNS = [
  { id: "d1", name: "Vintage Oushak",    image: "/images/rug1.png" },
  { id: "d2", name: "Moroccan Diamond",  image: "/images/rug2.png" },
  { id: "d3", name: "Persian Heritage",  image: "/images/rug3.png" },
  { id: "d4", name: "Geometric Modern",  image: "/images/rug4.jpg" },
  { id: "d5", name: "Abstract Art",      image: "/images/rug5.jpg" },
  { id: "d6", name: "Scandinavian Flat", image: "/images/rug6.png" },
  { id: "d7", name: "Boho Earth",        image: "/images/rug7.png" },
  { id: "d8", name: "Natural Jute",      image: "/images/rug8.jpeg" },
];

type DesignMode = "none" | "upload" | "browse";

// Shape tab icons — same as ProductDetail
const SHAPE_ICONS: Record<string, string> = {
  Rectangular: "▬",
  Runner: "▰",
  Round: "●",
};

export default function PriceCalculator() {
  // ── Live data from API ──────────────────────────────────────────────────────
  const [sizeMaster, setSizeMaster]   = useState<SizeMasterItem[]>([]);
  const [pricingData, setPricingData] = useState<PricingItem[]>([]);
  const [loadingSizes, setLoadingSizes] = useState(true);

  useEffect(() => {
    // Fetch Size Master
    fetch("/api/admin/sizes")
      .then((r) => r.json())
      .then((data: SizeMasterItem[]) => {
        setSizeMaster(Array.isArray(data) ? data : []);
        // Default to first Rectangular
        const first = data.find((s) => s.shape === "Rectangular" && s.active !== false);
        if (first) setSelectedSizeId(first.id);
        setLoadingSizes(false);
      })
      .catch(() => setLoadingSizes(false));

    // Fetch Pricing
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((data: PricingItem[]) => { if (Array.isArray(data)) setPricingData(data); })
      .catch(() => {});
  }, []);

  // ── Configurator state ──────────────────────────────────────────────────────
  const [rugTypeId,       setRugTypeId]       = useState("hand-tufted");
  const [category,        setCategory]        = useState(RUG_CATEGORIES["hand-tufted"][0]);
  const [activeShape,     setActiveShape]     = useState("Rectangular");
  const [selectedSizeId,  setSelectedSizeId]  = useState("");
  const [useCustomSize,   setUseCustomSize]   = useState(false);
  const [customWidth,     setCustomWidth]     = useState("");
  const [customHeight,    setCustomHeight]    = useState("");
  const [pileHeight,      setPileHeight]      = useState("medium");
  const [selectedColors,  setSelectedColors]  = useState<string[]>(["#4a5c3a", "#f9f5ec"]);
  const [designMode,      setDesignMode]      = useState<DesignMode>("none");
  const [selectedDesign,  setSelectedDesign]  = useState<string | null>(null);
  const [uploadedDesign,  setUploadedDesign]  = useState<string | null>(null);
  const [uploadedRef,     setUploadedRef]     = useState<string | null>(null);
  const [notes,           setNotes]           = useState("");
  const [activeSection,   setActiveSection]   = useState(1);

  const fileRef    = useRef<HTMLInputElement>(null);
  const refFileRef = useRef<HTMLInputElement>(null);

  // ── Grouped sizes ────────────────────────────────────────────────────────────
  const grouped = useMemo(() => groupSizesByShape(sizeMaster), [sizeMaster]);
  const availableShapes = SHAPE_ORDER.filter((sh) => (grouped[sh]?.length ?? 0) > 0);

  // When active shape changes, auto-select first size in that shape
  const handleShapeChange = (sh: string) => {
    setActiveShape(sh);
    const first = grouped[sh]?.[0];
    if (first) setSelectedSizeId(first.id);
    setUseCustomSize(false);
  };

  // Keep activeShape in sync once sizeMaster loads
  useEffect(() => {
    if (sizeMaster.length > 0 && !activeShape) {
      const first = sizeMaster.find((s) => s.active !== false);
      if (first) setActiveShape(first.shape);
    }
  }, [sizeMaster, activeShape]);

  // ── Pile multiplier ─────────────────────────────────────────────────────────
  const pileMultiplier = useMemo(() => {
    return PILE_HEIGHTS.find((p) => p.value === pileHeight)?.multiplier ?? 1.0;
  }, [pileHeight]);

  // ── sq.ft + price calculation ───────────────────────────────────────────────
  const sqft = useMemo(() => {
    if (useCustomSize) return parseCustomSqft(customWidth, customHeight);
    const size = sizeMaster.find((s) => s.id === selectedSizeId);
    return size ? size.sqft : 0;
  }, [useCustomSize, customWidth, customHeight, selectedSizeId, sizeMaster]);

  const priceResult: PriceResult = useMemo(() => {
    return computePrice(
      sqft,
      rugTypeId,
      pileMultiplier,
      undefined,
      pricingData.length > 0 ? pricingData : undefined
    );
  }, [sqft, rugTypeId, pileMultiplier, pricingData]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const currentSize = sizeMaster.find((s) => s.id === selectedSizeId);
  const currentPricing = pricingData.find((p) => p.id === rugTypeId);
  const pricePerSqft = currentPricing?.pricePerSqft ?? priceResult.pricePerSqft / pileMultiplier;

  const toggleColor = (c: string) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : prev.length < 5 ? [...prev, c] : prev
    );

  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedDesign(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedRef(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ── Styles ───────────────────────────────────────────────────────────────────
  const sectionStyle = (n: number) => ({
    border: `1.5px solid ${activeSection === n ? "var(--primary)" : "var(--border-light)"}`,
    borderRadius: "var(--radius-lg)",
    padding: "28px 32px",
    marginBottom: "20px",
    background: activeSection === n ? "rgba(74,92,58,0.02)" : "var(--surface)",
    transition: "all 0.2s ease",
    cursor: "pointer" as const,
  });

  const stepHeadStyle = (n: number) => ({
    display: "flex", alignItems: "center", gap: "12px",
    marginBottom: activeSection === n ? "24px" : "0",
  });

  const stepNumStyle = (n: number) => ({
    width: "30px", height: "30px", borderRadius: "50%",
    background: activeSection >= n ? "var(--primary)" : "var(--border)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: 700, flexShrink: 0,
  });

  // Full label shown in collapsed section header: "3 x 5 ft — 91 x 152 cm (15 sq.ft)"
  const sizeDisplayLabel = useCustomSize
    ? customWidth && customHeight
      ? `${customWidth} × ${customHeight} ft (custom) · ${sqft > 0 ? sqft.toFixed(1) : "—"} sq.ft`
      : "Custom dimensions"
    : currentSize
      ? `${currentSize.name} — ${currentSize.cm} (${currentSize.sqft % 1 === 0 ? currentSize.sqft : currentSize.sqft.toFixed(1)} sq.ft)`
      : "—";

  return (
    <section style={{ background: "var(--surface-alt)", padding: "80px 0 100px" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--primary)", fontWeight: 600, marginBottom: "12px" }}>
            ✦ &nbsp; Bespoke Service
          </p>
          <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "12px" }}>
            Build Your <em style={{ fontStyle: "italic", color: "var(--primary)" }}>Perfect Rug</em>
          </h2>
          <p style={{ fontSize: "16px", color: "var(--foreground-muted)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            Configure every detail — material, size, shape, pile height, colors — and get an instant price estimate.
          </p>
        </div>

        {/* Main Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px", alignItems: "start" }}>
          {/* Left: Configuration */}
          <div>

            {/* ── Section 1: Design Source ── */}
            <div style={sectionStyle(1)} onClick={() => setActiveSection(1)}>
              <div style={stepHeadStyle(1)}>
                <div style={stepNumStyle(1)}>1</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Design Source</h3>
                  {activeSection !== 1 && (
                    <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>
                      {designMode === "upload" && uploadedDesign
                        ? "Custom design uploaded"
                        : designMode === "browse" && selectedDesign
                          ? WEBSITE_DESIGNS.find((d) => d.id === selectedDesign)?.name
                          : "No design selected"}
                    </p>
                  )}
                </div>
              </div>

              {activeSection === 1 && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
                    {([
                      { mode: "none" as DesignMode,   icon: "✦", label: "Custom Design",      desc: "We design for you" },
                      { mode: "upload" as DesignMode, icon: "↑", label: "Upload Your Design",  desc: "Share your artwork" },
                      { mode: "browse" as DesignMode, icon: "⊞", label: "Browse Our Designs",  desc: "Choose from gallery" },
                    ]).map((opt) => (
                      <button key={opt.mode} onClick={(e) => { e.stopPropagation(); setDesignMode(opt.mode); }}
                        style={{
                          padding: "16px 12px", borderRadius: "var(--radius-md)", cursor: "pointer",
                          border: `2px solid ${designMode === opt.mode ? "var(--primary)" : "var(--border-light)"}`,
                          background: designMode === opt.mode ? "rgba(74,92,58,0.06)" : "var(--surface)",
                          textAlign: "center", transition: "all 0.2s",
                        }}>
                        <div style={{ fontSize: "20px", marginBottom: "8px", color: designMode === opt.mode ? "var(--primary)" : "var(--foreground-muted)" }}>{opt.icon}</div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: designMode === opt.mode ? "var(--primary)" : "var(--foreground)", marginBottom: "3px" }}>{opt.label}</div>
                        <div style={{ fontSize: "11px", color: "var(--foreground-muted)" }}>{opt.desc}</div>
                      </button>
                    ))}
                  </div>

                  {designMode === "upload" && (
                    <div>
                      <input type="file" accept="image/*" ref={fileRef} onChange={handleDesignUpload} style={{ display: "none" }} />
                      {uploadedDesign ? (
                        <div style={{ position: "relative" }}>
                          <img src={uploadedDesign} alt="Uploaded design" style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                          <button onClick={() => setUploadedDesign(null)} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px" }}>✕</button>
                        </div>
                      ) : (
                        <button onClick={() => fileRef.current?.click()}
                          style={{ width: "100%", padding: "28px", border: "2px dashed var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface-alt)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--primary)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                        >
                          <div style={{ fontSize: "28px", marginBottom: "8px" }}>📎</div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "4px" }}>Click to upload your design</div>
                          <div style={{ fontSize: "11px", color: "var(--foreground-muted)" }}>PNG, JPG, PDF up to 20MB</div>
                        </button>
                      )}
                    </div>
                  )}

                  {designMode === "browse" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {WEBSITE_DESIGNS.map((d) => (
                        <button key={d.id} onClick={() => setSelectedDesign(d.id)}
                          style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", border: `2px solid ${selectedDesign === d.id ? "var(--primary)" : "transparent"}`, cursor: "pointer", background: "none", padding: 0, aspectRatio: "1" }}>
                          <img src={d.image} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {selectedDesign === d.id && (
                            <div style={{ position: "absolute", inset: 0, background: "rgba(74,92,58,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ color: "#fff", fontSize: "18px" }}>✓</span>
                            </div>
                          )}
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", padding: "6px 6px 5px", fontSize: "9px", color: "#fff", fontWeight: 600, letterSpacing: "0.04em" }}>{d.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Section 2: Material & Style ── */}
            <div style={sectionStyle(2)} onClick={() => setActiveSection(2)}>
              <div style={stepHeadStyle(2)}>
                <div style={stepNumStyle(2)}>2</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Material & Style</h3>
                  {activeSection !== 2 && (
                    <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>
                      {RUG_TYPES.find((r) => r.id === rugTypeId)?.name} — {category}
                    </p>
                  )}
                </div>
              </div>

              {activeSection === 2 && (
                <>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "12px" }}>Craft Technique</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "24px" }}>
                    {RUG_TYPES.map((rt) => {
                      const livePrice = pricingData.find((p) => p.id === rt.id);
                      return (
                        <button key={rt.id} onClick={() => { setRugTypeId(rt.id); setCategory(RUG_CATEGORIES[rt.id]?.[0] ?? ""); }}
                          style={{ padding: "14px 16px", border: `2px solid ${rugTypeId === rt.id ? "var(--primary)" : "var(--border-light)"}`, borderRadius: "var(--radius-md)", background: rugTypeId === rt.id ? "rgba(74,92,58,0.06)" : "var(--surface)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: rugTypeId === rt.id ? "var(--primary)" : "var(--foreground)", marginBottom: "3px" }}>{rt.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--foreground-muted)" }}>
                            {livePrice ? `from $${livePrice.pricePerSqft}/sq.ft` : rt.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "10px" }}>Design Style</p>
                  <div className="select-wrapper">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                      {(RUG_CATEGORIES[rugTypeId] ?? []).map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* ── Section 3: Size (Grouped by Shape — same as Product Detail) ── */}
            <div style={sectionStyle(3)} onClick={() => setActiveSection(3)}>
              <div style={stepHeadStyle(3)}>
                <div style={stepNumStyle(3)}>3</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Size</h3>
                  {activeSection !== 3 && (
                    <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>
                      {sizeDisplayLabel}
                    </p>
                  )}
                </div>
              </div>

              {activeSection === 3 && (
                <>
                  {/* Standard / Custom toggle */}
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    {[{ label: "Standard Size", val: false }, { label: "Custom Size", val: true }].map((opt) => (
                      <button key={String(opt.val)} onClick={() => setUseCustomSize(opt.val)}
                        style={{ flex: 1, padding: "10px", border: `2px solid ${useCustomSize === opt.val ? "var(--primary)" : "var(--border-light)"}`, borderRadius: "var(--radius-md)", background: useCustomSize === opt.val ? "rgba(74,92,58,0.06)" : "var(--surface)", cursor: "pointer", fontSize: "12px", fontWeight: 700, color: useCustomSize === opt.val ? "var(--primary)" : "var(--foreground-muted)", transition: "all 0.2s" }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {!useCustomSize ? (
                    loadingSizes ? (
                      <div style={{ padding: "24px", textAlign: "center", color: "var(--foreground-muted)", fontSize: "13px" }}>Loading sizes…</div>
                    ) : (
                      <>
                        {/* Shape tabs */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                          {availableShapes.map((sh) => (
                            <button key={sh} onClick={() => handleShapeChange(sh)}
                              style={{
                                padding: "8px 16px", borderRadius: "var(--radius-md)", cursor: "pointer",
                                border: `2px solid ${activeShape === sh ? "var(--primary)" : "var(--border-light)"}`,
                                background: activeShape === sh ? "rgba(74,92,58,0.06)" : "var(--surface)",
                                fontSize: "12px", fontWeight: 700,
                                color: activeShape === sh ? "var(--primary)" : "var(--foreground-muted)",
                                transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px",
                              }}>
                              <span>{SHAPE_ICONS[sh] ?? "▬"}</span>
                              <span>{sh}</span>
                            </button>
                          ))}
                        </div>

                        {/* Size list — each row: "3 x 5 ft — 91 × 152 cm (15 sq.ft)" */}
                        <div style={{
                          display: "flex", flexDirection: "column", gap: "5px",
                          maxHeight: "340px", overflowY: "auto", paddingRight: "4px",
                        }}>
                          {(grouped[activeShape] ?? []).map((size) => {
                            const isSelected = selectedSizeId === size.id;
                            return (
                              <button key={size.id}
                                onClick={() => { setSelectedSizeId(size.id); setUseCustomSize(false); }}
                                style={{
                                  padding: "9px 14px",
                                  border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border-light)"}`,
                                  borderRadius: "var(--radius-md)", cursor: "pointer",
                                  background: isSelected ? "var(--primary)" : "var(--surface)",
                                  transition: "all 0.15s",
                                  display: "flex", alignItems: "center",
                                  justifyContent: "space-between", gap: "8px", width: "100%",
                                  textAlign: "left",
                                }}>
                                {/* ft name */}
                                <span style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "#fff" : "var(--foreground)", whiteSpace: "nowrap", flexShrink: 0 }}>
                                  {size.name}
                                </span>
                                {/* cm */}
                                <span style={{ fontSize: "12px", color: isSelected ? "rgba(255,255,255,0.75)" : "var(--foreground-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                                  {size.cm}
                                </span>
                                {/* sqft badge */}
                                <span style={{
                                  marginLeft: "auto", flexShrink: 0,
                                  fontSize: "11px", fontWeight: 700,
                                  background: isSelected ? "rgba(255,255,255,0.2)" : "var(--primary-pale)",
                                  color: isSelected ? "#fff" : "var(--primary)",
                                  padding: "2px 8px", borderRadius: "9999px",
                                }}>
                                  {size.sqft % 1 === 0 ? size.sqft : size.sqft.toFixed(1)} sq.ft
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected size detail bar */}
                        {currentSize && (
                          <div style={{ marginTop: "10px", padding: "9px 14px", background: "var(--primary-pale)", borderRadius: "var(--radius-md)", border: "1px solid rgba(74,92,58,0.15)", fontSize: "13px", fontWeight: 600, color: "var(--primary)" }}>
                            {currentSize.name} — {currentSize.cm} ({currentSize.sqft % 1 === 0 ? currentSize.sqft : currentSize.sqft.toFixed(1)} sq.ft)
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label className="form-label">Width (ft)</label>
                        <input type="number" step="0.5" min="1" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} placeholder="e.g. 8" className="form-control" />
                      </div>
                      <div>
                        <label className="form-label">Length (ft)</label>
                        <input type="number" step="0.5" min="1" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} placeholder="e.g. 10" className="form-control" />
                      </div>
                      {customWidth && customHeight && sqft > 0 && (
                        <div style={{ gridColumn: "1/-1", padding: "12px 16px", background: "rgba(74,92,58,0.06)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-green)" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)" }}>
                            {customWidth} × {customHeight} ft &nbsp;≈&nbsp; {sqft.toFixed(1)} sq.ft
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--foreground-muted)", marginLeft: "12px" }}>
                            ({(parseFloat(customWidth) * 30.48).toFixed(0)} × {(parseFloat(customHeight) * 30.48).toFixed(0)} cm)
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Section 4: Pile Height ── */}
            <div style={sectionStyle(4)} onClick={() => setActiveSection(4)}>
              <div style={stepHeadStyle(4)}>
                <div style={stepNumStyle(4)}>4</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Pile Height</h3>
                  {activeSection !== 4 && (
                    <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>
                      {PILE_HEIGHTS.find((p) => p.value === pileHeight)?.label}
                    </p>
                  )}
                </div>
              </div>

              {activeSection === 4 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {PILE_HEIGHTS.map((ph) => (
                    <button key={ph.value} onClick={() => setPileHeight(ph.value)}
                      style={{ padding: "12px 8px", border: `2px solid ${pileHeight === ph.value ? "var(--primary)" : "var(--border-light)"}`, borderRadius: "var(--radius-md)", background: pileHeight === ph.value ? "rgba(74,92,58,0.06)" : "var(--surface)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: pileHeight === ph.value ? "var(--primary)" : "var(--foreground)", marginBottom: "4px" }}>{ph.label}</div>
                      <div style={{ fontSize: "10px", color: "var(--foreground-muted)" }}>{ph.mm}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Section 5: Colors ── */}
            <div style={sectionStyle(5)} onClick={() => setActiveSection(5)}>
              <div style={stepHeadStyle(5)}>
                <div style={stepNumStyle(5)}>5</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Color Palette</h3>
                  {activeSection !== 5 && (
                    <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                      {selectedColors.map((c) => (
                        <div key={c} style={{ width: "14px", height: "14px", borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.1)" }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {activeSection === 5 && (
                <>
                  <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginBottom: "14px" }}>Select up to 5 colors for your rug (click to toggle)</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    {COLORS.map((c) => (
                      <button key={c} onClick={() => toggleColor(c)}
                        style={{
                          width: "36px", height: "36px", borderRadius: "50%", background: c,
                          border: `3px solid ${selectedColors.includes(c) ? "var(--primary)" : "rgba(0,0,0,0.1)"}`,
                          cursor: "pointer", transition: "all 0.15s",
                          transform: selectedColors.includes(c) ? "scale(1.2)" : "scale(1)",
                          boxShadow: selectedColors.includes(c) ? "0 0 0 2px #fff, 0 0 0 4px var(--primary)" : "none",
                        }}
                        title={c} />
                    ))}
                  </div>
                  {selectedColors.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>Your palette:</span>
                      {selectedColors.map((c) => (
                        <div key={c} style={{ width: "24px", height: "24px", borderRadius: "50%", background: c, border: "2px solid var(--border)" }} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Section 6: Notes & Reference ── */}
            <div style={sectionStyle(6)} onClick={() => setActiveSection(6)}>
              <div style={stepHeadStyle(6)}>
                <div style={stepNumStyle(6)}>6</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Notes & Reference Image</h3>
                  {activeSection !== 6 && (
                    <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>
                      {notes ? notes.slice(0, 40) + (notes.length > 40 ? "..." : "") : "Optional"}
                    </p>
                  )}
                </div>
              </div>

              {activeSection === 6 && (
                <>
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your space, any specific requirements, color preferences, room use, etc."
                    className="form-control" style={{ minHeight: "100px", resize: "vertical", marginBottom: "20px" }}
                  />
                  <label className="form-label">
                    Reference Image{" "}
                    <span style={{ color: "var(--foreground-muted)", fontWeight: 400 }}>(optional — share a photo of your room or inspiration)</span>
                  </label>
                  <input type="file" accept="image/*" ref={refFileRef} onChange={handleRefUpload} style={{ display: "none" }} />
                  {uploadedRef ? (
                    <div style={{ position: "relative" }}>
                      <img src={uploadedRef} alt="Reference" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                      <button onClick={() => setUploadedRef(null)} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px" }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => refFileRef.current?.click()}
                      style={{ width: "100%", padding: "20px", border: "2px dashed var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface-alt)", cursor: "pointer", textAlign: "center", fontSize: "13px", color: "var(--foreground-muted)", transition: "all 0.2s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--primary)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                    >
                      📷 Upload room photo or reference image
                    </button>
                  )}
                </>
              )}
            </div>

          </div>

          {/* Right: Summary */}
          <div style={{ position: "sticky", top: "120px" }}>
            <PriceSummary
              rugType={RUG_TYPES.find((r) => r.id === rugTypeId)?.name ?? rugTypeId}
              category={category}
              shape={activeShape}
              size={
                useCustomSize
                  ? customWidth && customHeight
                    ? `${customWidth} × ${customHeight} ft (custom)`
                    : "Custom (enter dims)"
                  : currentSize
                    ? `${currentSize.name} (${currentSize.cm})`
                    : "—"
              }
              sqft={sqft}
              price={priceResult.displayPrice}
            />

            {/* Live Pricing Breakdown */}
            {sqft > 0 && (
              <div style={{ marginTop: "16px", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", padding: "16px 20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "10px" }}>Price Breakdown</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--foreground-muted)" }}>Area</span>
                    <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{formatSqft(sqft)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--foreground-muted)" }}>Rate</span>
                    <span style={{ fontWeight: 600, color: "var(--foreground)" }}>${(priceResult.pricePerSqft).toFixed(2)}/sq.ft</span>
                  </div>
                  {pileMultiplier !== 1.0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ color: "var(--foreground-muted)" }}>Pile adjustment</span>
                      <span style={{ color: "var(--foreground-muted)" }}>×{pileMultiplier}</span>
                    </div>
                  )}
                  <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "8px", marginTop: "4px", display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
                    <span style={{ fontWeight: 700, color: "var(--foreground)" }}>Total Estimate</span>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{priceResult.priceLabel}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Preview */}
            {(selectedDesign || uploadedDesign) && (
              <div style={{ marginTop: "20px", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)" }}>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>Design Preview</h4>
                </div>
                <div style={{ position: "relative", height: "200px" }}>
                  <img
                    src={uploadedDesign || WEBSITE_DESIGNS.find((d) => d.id === selectedDesign)?.image || ""}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "9999px", letterSpacing: "0.05em" }}>
                    {uploadedDesign ? "YOUR DESIGN" : WEBSITE_DESIGNS.find((d) => d.id === selectedDesign)?.name}
                  </div>
                </div>
              </div>
            )}

            {/* Color Preview */}
            {selectedColors.length > 0 && (
              <div style={{ marginTop: "16px", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", padding: "16px 20px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>Selected Colors</h4>
                <div style={{ display: "flex", gap: "6px" }}>
                  {selectedColors.map((c) => (
                    <div key={c} style={{ flex: 1, height: "40px", borderRadius: "var(--radius-sm)", background: c, border: "1px solid rgba(0,0,0,0.1)" }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
