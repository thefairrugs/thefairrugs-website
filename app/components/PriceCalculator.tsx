"use client";

import { useMemo, useState } from "react";
import { rugTypes } from "../data/rugTypes";
import { sizes } from "../data/sizes";
import PriceSummary from "./PriceSummary";

const shapes = ["Rectangle", "Runner", "Round", "Square", "Oval", "Irregular", "Custom"];

const shapeIcons: Record<string, string> = {
  Rectangle: "▬",
  Runner: "▰",
  Round: "●",
  Square: "■",
  Oval: "⬭",
  Irregular: "✦",
  Custom: "✏",
};

export default function PriceCalculator() {
  const [rugType, setRugType] = useState(rugTypes[0]);
  const [category, setCategory] = useState(rugTypes[0].categories[0]);
  const [shape, setShape] = useState("Rectangle");
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [customWidth, setCustomWidth] = useState("");
  const [customLength, setCustomLength] = useState("");
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const isCustom = shape === "Custom";

  const sqft = useMemo(() => {
    if (isCustom) {
      const w = Number(customWidth);
      const l = Number(customLength);
      if (!w || !l) return 0;
      const widthFeet = w / 30.48;
      const lengthFeet = l / 30.48;
      return widthFeet * lengthFeet;
    }
    return selectedSize.sqft;
  }, [customWidth, customLength, selectedSize, isCustom]);

  const totalPrice = useMemo(() => {
    return sqft * rugType.price;
  }, [sqft, rugType]);

  const steps = [
    {
      number: 1,
      label: "Material & Style",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L6 7H3v10h3l6 5 6-5h3V7h-3L12 2z" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      number: 2,
      label: "Shape",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
        </svg>
      ),
    },
    {
      number: 3,
      label: "Size",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3h18M3 21h18M3 3v18M21 3v18" strokeLinecap="round"/>
          <path d="M8 8h8v8H8z"/>
        </svg>
      ),
    },
  ];

  return (
    <section
      style={{
        background: "var(--surface-alt)",
        padding: "80px 0 100px",
      }}
    >
      <div className="container">
        {/* Step progress */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
            marginBottom: "60px",
          }}
        >
          {steps.map((step, i) => (
            <div key={step.number} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "15px",
                    boxShadow: "0 4px 12px rgba(139,94,60,0.3)",
                  }}
                >
                  {step.number}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: "80px",
                    height: "1px",
                    background: "linear-gradient(90deg, var(--primary), var(--border))",
                    margin: "0 16px",
                    marginBottom: "28px",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Left: Configuration Panel */}
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-xl)",
              padding: "48px",
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--border-light)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "32px",
                fontWeight: 400,
                color: "var(--foreground)",
                marginBottom: "8px",
                letterSpacing: "-0.01em",
              }}
            >
              Configure Your Rug
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--foreground-muted)",
                marginBottom: "40px",
                fontWeight: 300,
              }}
            >
              Select your preferences below to get an instant price estimate.
            </p>

            {/* ── Step 1: Material ── */}
            <div
              style={{
                border: "1.5px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "32px",
                marginBottom: "24px",
                transition: "border-color 0.2s ease",
              }}
              onFocus={() => setActiveStep(1)}
              onBlur={() => setActiveStep(null)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Material & Style
                </h3>
              </div>

              {/* Rug Type Cards */}
              <label className="form-label">Craft Technique</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "12px",
                  marginBottom: "28px",
                }}
              >
                {rugTypes.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => {
                      setRugType(rt);
                      setCategory(rt.categories[0]);
                    }}
                    style={{
                      padding: "16px",
                      border: `2px solid ${rugType.id === rt.id ? "var(--primary)" : "var(--border-light)"}`,
                      borderRadius: "var(--radius-md)",
                      background: rugType.id === rt.id ? "rgba(139,94,60,0.06)" : "var(--surface)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (rugType.id !== rt.id) {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (rugType.id !== rt.id) {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)";
                      }
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: rugType.id === rt.id ? "var(--primary)" : "var(--foreground)",
                        marginBottom: "4px",
                      }}
                    >
                      {rt.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--foreground-muted)",
                        fontWeight: 400,
                      }}
                    >
                      from ${rt.price}/sq.ft
                    </div>
                  </button>
                ))}
              </div>

              {/* Category Select */}
              <label className="form-label">Design Style</label>
              <div className="select-wrapper" style={{ marginBottom: "0" }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                  style={{ paddingRight: "44px" }}
                >
                  {rugType.categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Step 2: Shape ── */}
            <div
              style={{
                border: "1.5px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "32px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Rug Shape
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "10px",
                }}
              >
                {shapes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    style={{
                      padding: "14px 8px",
                      border: `2px solid ${shape === s ? "var(--primary)" : "var(--border-light)"}`,
                      borderRadius: "var(--radius-md)",
                      background: shape === s ? "rgba(139,94,60,0.06)" : "var(--surface)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "22px",
                        color: shape === s ? "var(--primary)" : "var(--foreground-muted)",
                        lineHeight: 1,
                      }}
                    >
                      {shapeIcons[s]}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: shape === s ? "var(--primary)" : "var(--foreground-muted)",
                        letterSpacing: "0.03em",
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      {s}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Step 3: Size ── */}
            <div
              style={{
                border: "1.5px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {isCustom ? "Custom Dimensions" : "Standard Size"}
                </h3>
              </div>

              {!isCustom && (
                <>
                  <label className="form-label">Select Size</label>
                  <div className="select-wrapper">
                    <select
                      value={selectedSize.name}
                      onChange={(e) =>
                        setSelectedSize(sizes.find((s) => s.name === e.target.value)!)
                      }
                      className="form-control"
                      style={{ paddingRight: "44px" }}
                    >
                      {sizes.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name} — {item.cm} cm ({item.sqft} sq.ft)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size visual hint */}
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "16px 20px",
                      background: "var(--surface-alt)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--foreground-muted)",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Selected
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-cormorant), Georgia, serif",
                          fontSize: "22px",
                          fontWeight: 500,
                          color: "var(--foreground)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {selectedSize.name}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--foreground-muted)",
                          marginBottom: "4px",
                        }}
                      >
                        {selectedSize.cm} cm
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "var(--primary)",
                        }}
                      >
                        {selectedSize.sqft} sq.ft
                      </div>
                    </div>
                  </div>
                </>
              )}

              {isCustom && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="form-label">Width (CM)</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      placeholder="e.g. 250"
                      className="form-control"
                    />
                  </div>
                  <div>
                    <label className="form-label">Length (CM)</label>
                    <input
                      type="number"
                      value={customLength}
                      onChange={(e) => setCustomLength(e.target.value)}
                      placeholder="e.g. 350"
                      className="form-control"
                    />
                  </div>
                  {customWidth && customLength && (
                    <div
                      style={{
                        gridColumn: "1/-1",
                        padding: "16px 20px",
                        background: "rgba(139,94,60,0.06)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(139,94,60,0.15)",
                      }}
                    >
                      <div style={{ fontSize: "13px", color: "var(--foreground-muted)", marginBottom: "4px" }}>
                        Custom Size Summary
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--primary)" }}>
                        {customWidth} × {customLength} cm &nbsp;|&nbsp; ≈ {sqft.toFixed(1)} sq.ft
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom note */}
            <div
              style={{
                marginTop: "28px",
                padding: "20px 24px",
                background: "rgba(201,169,110,0.08)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(201,169,110,0.2)",
                fontSize: "13px",
                color: "var(--foreground-muted)",
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: "var(--foreground)", display: "block", marginBottom: "4px" }}>
                💡 Price is an estimate
              </strong>
              Final pricing may vary based on design complexity, colour count, and finishing. Our team will confirm exact pricing within 24 hours of your request.
            </div>
          </div>

          {/* Right: Summary Panel */}
          <div style={{ position: "sticky", top: "120px" }}>
            <PriceSummary
              rugType={rugType.name}
              category={category}
              shape={shape}
              size={
                isCustom
                  ? `${customWidth || "—"} × ${customLength || "—"} CM`
                  : `${selectedSize.name} (${selectedSize.cm})`
              }
              sqft={sqft}
              price={totalPrice}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
