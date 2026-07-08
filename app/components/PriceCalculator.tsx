"use client";

import { useMemo, useState, useRef } from "react";
import { rugTypes } from "../data/rugTypes";
import { sizes } from "../data/sizes";
import PriceSummary from "./PriceSummary";

const shapes = ["Rectangle", "Runner", "Round", "Square", "Oval", "Irregular"];

const shapeIcons: Record<string, string> = {
  Rectangle: "▬", Runner: "▰", Round: "●", Square: "■", Oval: "⬭", Irregular: "✦",
};

const PILE_HEIGHTS = [
  { label: "Flat Weave", value: "flat", mm: "0mm", desc: "Durrie / Kilim" },
  { label: "Low Pile", value: "low", mm: "5–8mm", desc: "Easy clean" },
  { label: "Medium Pile", value: "medium", mm: "10–13mm", desc: "Most popular" },
  { label: "High Pile", value: "high", mm: "15–20mm", desc: "Luxurious plush" },
  { label: "Shaggy", value: "shaggy", mm: "25–35mm", desc: "Ultra-soft" },
];

const COLORS = [
  "#f9f5ec", "#e8dfd0", "#c8b89a", "#b8975a", "#4a5c3a",
  "#7a8f6a", "#2a3a20", "#6b4f35", "#2e2e2a", "#1c1c1a",
  "#c1440e", "#1a3a6b", "#5c3d8c", "#2e6b4f", "#b8632a",
  "#ffffff", "#d4b47e", "#a3b494", "#8a6a50", "#444444",
];

const WEBSITE_DESIGNS = [
  { id: "d1", name: "Vintage Oushak", image: "/images/rug1.png" },
  { id: "d2", name: "Moroccan Diamond", image: "/images/rug2.png" },
  { id: "d3", name: "Persian Heritage", image: "/images/rug3.png" },
  { id: "d4", name: "Geometric Modern", image: "/images/rug4.jpg" },
  { id: "d5", name: "Abstract Art", image: "/images/rug5.jpg" },
  { id: "d6", name: "Scandinavian Flat", image: "/images/rug6.png" },
  { id: "d7", name: "Boho Earth", image: "/images/rug7.png" },
  { id: "d8", name: "Natural Jute", image: "/images/rug8.jpeg" },
];

type DesignMode = "none" | "upload" | "browse";

export default function PriceCalculator() {
  const [rugType, setRugType] = useState(rugTypes[0]);
  const [category, setCategory] = useState(rugTypes[0].categories[0]);
  const [shape, setShape] = useState("Rectangle");
  const [selectedSize, setSelectedSize] = useState(sizes[6]);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState("");
  const [customLength, setCustomLength] = useState("");
  const [pileHeight, setPileHeight] = useState("medium");
  const [selectedColors, setSelectedColors] = useState<string[]>(["#4a5c3a", "#f9f5ec"]);
  const [designMode, setDesignMode] = useState<DesignMode>("none");
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null);
  const [uploadedRef, setUploadedRef] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [activeSection, setActiveSection] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const refFileRef = useRef<HTMLInputElement>(null);

  const sqft = useMemo(() => {
    if (useCustomSize) {
      const w = Number(customWidth);
      const l = Number(customLength);
      if (!w || !l) return 0;
      return (w / 30.48) * (l / 30.48);
    }
    return selectedSize.sqft;
  }, [customWidth, customLength, selectedSize, useCustomSize]);

  const totalPrice = useMemo(() => {
    let price = sqft * rugType.price;
    // Pile height adjustments
    if (pileHeight === "high") price *= 1.15;
    if (pileHeight === "shaggy") price *= 1.25;
    if (pileHeight === "flat") price *= 0.85;
    return price;
  }, [sqft, rugType, pileHeight]);

  const toggleColor = (c: string) => {
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : prev.length < 5 ? [...prev, c] : prev
    );
  };

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
    display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px",
    ...(activeSection !== n ? { marginBottom: "0" } : {}),
  });

  const stepNumStyle = (n: number) => ({
    width: "30px", height: "30px", borderRadius: "50%",
    background: activeSection >= n ? "var(--primary)" : "var(--border)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: 700, flexShrink: 0,
  });

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
                  {activeSection !== 1 && <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>
                    {designMode === "upload" && uploadedDesign ? "Custom design uploaded" : designMode === "browse" && selectedDesign ? WEBSITE_DESIGNS.find(d => d.id === selectedDesign)?.name : "No design selected"}
                  </p>}
                </div>
              </div>

              {activeSection === 1 && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
                    {([
                      { mode: "none" as DesignMode, icon: "✦", label: "Custom Design", desc: "We design for you" },
                      { mode: "upload" as DesignMode, icon: "↑", label: "Upload Your Design", desc: "Share your artwork" },
                      { mode: "browse" as DesignMode, icon: "⊞", label: "Browse Our Designs", desc: "Choose from gallery" },
                    ]).map(opt => (
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
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
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
                      {WEBSITE_DESIGNS.map(d => (
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
                  {activeSection !== 2 && <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>{rugType.name} — {category}</p>}
                </div>
              </div>

              {activeSection === 2 && (
                <>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "12px" }}>Craft Technique</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "24px" }}>
                    {rugTypes.map((rt) => (
                      <button key={rt.id} onClick={() => { setRugType(rt); setCategory(rt.categories[0]); }}
                        style={{ padding: "14px 16px", border: `2px solid ${rugType.id === rt.id ? "var(--primary)" : "var(--border-light)"}`, borderRadius: "var(--radius-md)", background: rugType.id === rt.id ? "rgba(74,92,58,0.06)" : "var(--surface)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: rugType.id === rt.id ? "var(--primary)" : "var(--foreground)", marginBottom: "3px" }}>{rt.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--foreground-muted)" }}>from ${rt.price}/sq.ft</div>
                      </button>
                    ))}
                  </div>

                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "10px" }}>Design Style</p>
                  <div className="select-wrapper">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                      {rugType.categories.map((cat) => <option key={cat}>{cat}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* ── Section 3: Shape ── */}
            <div style={sectionStyle(3)} onClick={() => setActiveSection(3)}>
              <div style={stepHeadStyle(3)}>
                <div style={stepNumStyle(3)}>3</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Shape</h3>
                  {activeSection !== 3 && <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>{shape}</p>}
                </div>
              </div>

              {activeSection === 3 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {shapes.map((s) => (
                    <button key={s} onClick={() => setShape(s)}
                      style={{ padding: "14px 8px", border: `2px solid ${shape === s ? "var(--primary)" : "var(--border-light)"}`, borderRadius: "var(--radius-md)", background: shape === s ? "rgba(74,92,58,0.06)" : "var(--surface)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", transition: "all 0.2s" }}>
                      <span style={{ fontSize: "22px", color: shape === s ? "var(--primary)" : "var(--foreground-muted)" }}>{shapeIcons[s]}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: shape === s ? "var(--primary)" : "var(--foreground-muted)", textAlign: "center" }}>{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Section 4: Size ── */}
            <div style={sectionStyle(4)} onClick={() => setActiveSection(4)}>
              <div style={stepHeadStyle(4)}>
                <div style={stepNumStyle(4)}>4</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Size</h3>
                  {activeSection !== 4 && <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>
                    {useCustomSize ? (customWidth && customLength ? `${customWidth}×${customLength} cm` : "Custom dimensions") : selectedSize.name}
                  </p>}
                </div>
              </div>

              {activeSection === 4 && (
                <>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    {[{ label: "Standard Size", val: false }, { label: "Custom Size", val: true }].map(opt => (
                      <button key={String(opt.val)} onClick={() => setUseCustomSize(opt.val)}
                        style={{ flex: 1, padding: "10px", border: `2px solid ${useCustomSize === opt.val ? "var(--primary)" : "var(--border-light)"}`, borderRadius: "var(--radius-md)", background: useCustomSize === opt.val ? "rgba(74,92,58,0.06)" : "var(--surface)", cursor: "pointer", fontSize: "12px", fontWeight: 700, color: useCustomSize === opt.val ? "var(--primary)" : "var(--foreground-muted)", transition: "all 0.2s" }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {!useCustomSize ? (
                    <>
                      <div className="select-wrapper" style={{ marginBottom: "14px" }}>
                        <select value={selectedSize.name} onChange={(e) => setSelectedSize(sizes.find(s => s.name === e.target.value)!)} className="form-control">
                          {sizes.map(item => <option key={item.name} value={item.name}>{item.name} — {item.cm} cm ({item.sqft} sq.ft)</option>)}
                        </select>
                      </div>
                      <div style={{ padding: "14px 18px", background: "var(--surface-alt)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "13px", color: "var(--foreground-muted)" }}>{selectedSize.cm} cm</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)" }}>{selectedSize.sqft} sq.ft</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label className="form-label">Width (CM)</label>
                        <input type="number" value={customWidth} onChange={e => setCustomWidth(e.target.value)} placeholder="e.g. 250" className="form-control" />
                      </div>
                      <div>
                        <label className="form-label">Length (CM)</label>
                        <input type="number" value={customLength} onChange={e => setCustomLength(e.target.value)} placeholder="e.g. 350" className="form-control" />
                      </div>
                      {customWidth && customLength && (
                        <div style={{ gridColumn: "1/-1", padding: "12px 16px", background: "rgba(74,92,58,0.06)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-green)" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)" }}>{customWidth}×{customLength} cm &nbsp;≈&nbsp; {sqft.toFixed(1)} sq.ft</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Section 5: Pile Height ── */}
            <div style={sectionStyle(5)} onClick={() => setActiveSection(5)}>
              <div style={stepHeadStyle(5)}>
                <div style={stepNumStyle(5)}>5</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Pile Height</h3>
                  {activeSection !== 5 && <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>{PILE_HEIGHTS.find(p => p.value === pileHeight)?.label}</p>}
                </div>
              </div>

              {activeSection === 5 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {PILE_HEIGHTS.map(ph => (
                    <button key={ph.value} onClick={() => setPileHeight(ph.value)}
                      style={{ padding: "12px 8px", border: `2px solid ${pileHeight === ph.value ? "var(--primary)" : "var(--border-light)"}`, borderRadius: "var(--radius-md)", background: pileHeight === ph.value ? "rgba(74,92,58,0.06)" : "var(--surface)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: pileHeight === ph.value ? "var(--primary)" : "var(--foreground)", marginBottom: "4px" }}>{ph.label}</div>
                      <div style={{ fontSize: "10px", color: "var(--foreground-muted)" }}>{ph.mm}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Section 6: Colors ── */}
            <div style={sectionStyle(6)} onClick={() => setActiveSection(6)}>
              <div style={stepHeadStyle(6)}>
                <div style={stepNumStyle(6)}>6</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Color Palette</h3>
                  {activeSection !== 6 && (
                    <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                      {selectedColors.map(c => <div key={c} style={{ width: "14px", height: "14px", borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.1)" }} />)}
                    </div>
                  )}
                </div>
              </div>

              {activeSection === 6 && (
                <>
                  <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginBottom: "14px" }}>Select up to 5 colors for your rug (click to toggle)</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    {COLORS.map(c => (
                      <button key={c} onClick={() => toggleColor(c)}
                        style={{ width: "36px", height: "36px", borderRadius: "50%", background: c, border: `3px solid ${selectedColors.includes(c) ? "var(--primary)" : "rgba(0,0,0,0.1)"}`, cursor: "pointer", transition: "all 0.15s", transform: selectedColors.includes(c) ? "scale(1.2)" : "scale(1)", boxShadow: selectedColors.includes(c) ? "0 0 0 2px #fff, 0 0 0 4px var(--primary)" : "none" }}
                        title={c} />
                    ))}
                  </div>
                  {selectedColors.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>Your palette:</span>
                      {selectedColors.map(c => (
                        <div key={c} style={{ width: "24px", height: "24px", borderRadius: "50%", background: c, border: "2px solid var(--border)" }} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Section 7: Notes & Reference ── */}
            <div style={sectionStyle(7)} onClick={() => setActiveSection(7)}>
              <div style={stepHeadStyle(7)}>
                <div style={stepNumStyle(7)}>7</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Notes & Reference Image</h3>
                  {activeSection !== 7 && <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "2px" }}>{notes ? notes.slice(0, 40) + (notes.length > 40 ? "..." : "") : "Optional"}</p>}
                </div>
              </div>

              {activeSection === 7 && (
                <>
                  <label className="form-label">Additional Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe your space, any specific requirements, color preferences, room use, etc." className="form-control" style={{ minHeight: "100px", resize: "vertical", marginBottom: "20px" }} />

                  <label className="form-label">Reference Image <span style={{ color: "var(--foreground-muted)", fontWeight: 400 }}>(optional — share a photo of your room or inspiration)</span></label>
                  <input type="file" accept="image/*" ref={refFileRef} onChange={handleRefUpload} style={{ display: "none" }} />
                  {uploadedRef ? (
                    <div style={{ position: "relative" }}>
                      <img src={uploadedRef} alt="Reference" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                      <button onClick={() => setUploadedRef(null)} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px" }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => refFileRef.current?.click()}
                      style={{ width: "100%", padding: "20px", border: "2px dashed var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface-alt)", cursor: "pointer", textAlign: "center", fontSize: "13px", color: "var(--foreground-muted)", transition: "all 0.2s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
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
              rugType={rugType.name}
              category={category}
              shape={shape}
              size={useCustomSize ? (customWidth && customLength ? `${customWidth}×${customLength} CM` : "Custom (enter dims)") : `${selectedSize.name} (${selectedSize.cm})`}
              sqft={sqft}
              price={totalPrice}
            />

            {/* Live Preview */}
            {(selectedDesign || uploadedDesign) && (
              <div style={{ marginTop: "20px", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)" }}>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>Design Preview</h4>
                </div>
                <div style={{ position: "relative", height: "200px" }}>
                  <img
                    src={uploadedDesign || WEBSITE_DESIGNS.find(d => d.id === selectedDesign)?.image || ""}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "9999px", letterSpacing: "0.05em" }}>
                    {uploadedDesign ? "YOUR DESIGN" : WEBSITE_DESIGNS.find(d => d.id === selectedDesign)?.name}
                  </div>
                </div>
              </div>
            )}

            {/* Color Preview */}
            {selectedColors.length > 0 && (
              <div style={{ marginTop: "16px", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", padding: "16px 20px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>Selected Colors</h4>
                <div style={{ display: "flex", gap: "6px" }}>
                  {selectedColors.map(c => (
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
