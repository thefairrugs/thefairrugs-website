"use client";

import Link from "next/link";
import Image from "next/image";

const benefits = [
  "Exclusive trade pricing — up to 30% below retail",
  "Dedicated account manager for every project",
  "Priority production scheduling",
  "Sample programme with free delivery",
  "Custom rug development with your specifications",
  "Complimentary design consultation service",
  "Project invoicing and purchase order terms",
  "Access to our complete material library",
];

// All available rug images for premium display
const ALL_IMAGES = [
  { src: "/images/rug1.png", alt: "Luxury hand-knotted wool rug in living room" },
  { src: "/images/rug2.png", alt: "Premium handmade rug close-up detail" },
  { src: "/images/rug3.png", alt: "Custom rug in modern interior" },
  { src: "/images/rug4.jpg", alt: "Handcrafted rug artisan Jaipur" },
  { src: "/images/rug5.jpg", alt: "Luxury area rug in elegant bedroom" },
  { src: "/images/rug6.png", alt: "Bespoke wool rug close-up texture" },
  { src: "/images/rug7.png", alt: "Premium hand-knotted rug in interior" },
  { src: "/images/rug8.jpeg", alt: "Fine artisan rug lifestyle photography" },
];

export default function DesignerSection() {
  return (
    <>
      {/* ═══ LUXURY RUG PHOTOGRAPHY SHOWCASE ════════════════════════════ */}
      <section
        style={{
          padding: "100px 0 0",
          background: "var(--background)",
          overflow: "hidden",
        }}
      >
        <div className="container">
          {/* Section eyebrow */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{
              fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase",
              color: "var(--gold)", fontWeight: 600, marginBottom: "16px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            }}>
              <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
              Premium Handmade Rugs
              <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
            </p>
            <h2 style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(38px, 5vw, 60px)", fontWeight: 300,
              lineHeight: 1.08, letterSpacing: "-0.02em",
              color: "var(--foreground)", marginBottom: "16px",
            }}>
              Art You Walk Upon
            </h2>
            <p style={{
              fontSize: "16px", lineHeight: 1.8, color: "var(--foreground-muted)",
              fontWeight: 300, maxWidth: "540px", margin: "0 auto",
            }}>
              Every rug is a handcrafted masterpiece — woven by artisans with decades of expertise
              using the world&apos;s finest wool, silk, and natural fibres.
            </p>
          </div>

          {/* ── Masonry-style luxury photography grid ── */}
          <div className="luxury-grid" style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: "16px",
            marginBottom: "16px",
          }}>
            {/* Hero image — spans 2 rows */}
            <div style={{
              gridRow: "1 / 3", borderRadius: "var(--radius-xl)",
              overflow: "hidden", position: "relative", minHeight: "520px",
              boxShadow: "var(--shadow-xl)",
            }}>
              <Image
                src={ALL_IMAGES[0].src}
                alt={ALL_IMAGES[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 55%, rgba(10,14,8,0.80) 100%)",
              }} />
              <div style={{
                position: "absolute", bottom: "28px", left: "24px", right: "24px",
              }}>
                <div style={{
                  background: "rgba(255,255,255,0.96)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "var(--radius-lg)",
                  padding: "18px 22px",
                }}>
                  <p style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                    ✦ Master Artisan Collection
                  </p>
                  <p style={{ fontSize: "15px", color: "var(--foreground)", fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
                    Hand-knotted over 2–8 weeks by skilled weavers with 15+ years of expertise
                  </p>
                </div>
              </div>
            </div>

            {/* Top middle */}
            <div style={{
              borderRadius: "var(--radius-xl)", overflow: "hidden",
              position: "relative", minHeight: "248px",
              boxShadow: "var(--shadow-lg)",
            }}>
              <Image
                src={ALL_IMAGES[1].src}
                alt={ALL_IMAGES[1].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 45%, rgba(10,14,8,0.7) 100%)",
              }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px" }}>
                <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, margin: 0 }}>Hand Knotted</p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px", margin: "2px 0 0" }}>Heirloom Quality</p>
              </div>
            </div>

            {/* Top right */}
            <div style={{
              borderRadius: "var(--radius-xl)", overflow: "hidden",
              position: "relative", minHeight: "248px",
              boxShadow: "var(--shadow-lg)",
            }}>
              <Image
                src={ALL_IMAGES[2].src}
                alt={ALL_IMAGES[2].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 45%, rgba(10,14,8,0.7) 100%)",
              }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px" }}>
                <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, margin: 0 }}>Custom Design</p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px", margin: "2px 0 0" }}>Any Vision, Any Size</p>
              </div>
            </div>

            {/* Bottom middle */}
            <div style={{
              borderRadius: "var(--radius-xl)", overflow: "hidden",
              position: "relative", minHeight: "248px",
              boxShadow: "var(--shadow-lg)",
            }}>
              <Image
                src={ALL_IMAGES[3].src}
                alt={ALL_IMAGES[3].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 45%, rgba(10,14,8,0.7) 100%)",
              }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px" }}>
                <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, margin: 0 }}>Hand Tufted</p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px", margin: "2px 0 0" }}>Modern Precision</p>
              </div>
            </div>

            {/* Bottom right */}
            <div style={{
              borderRadius: "var(--radius-xl)", overflow: "hidden",
              position: "relative", minHeight: "248px",
              boxShadow: "var(--shadow-lg)",
            }}>
              <Image
                src={ALL_IMAGES[4].src}
                alt={ALL_IMAGES[4].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 45%, rgba(10,14,8,0.7) 100%)",
              }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px" }}>
                <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, margin: 0 }}>Natural Materials</p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px", margin: "2px 0 0" }}>Wool, Silk & Jute</p>
              </div>
            </div>
          </div>

          {/* ── Bottom 4-image lifestyle strip ── */}
          <div className="lifestyle-strip" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "80px",
          }}>
            {ALL_IMAGES.slice(4).map((img, i) => {
              const labels = [
                { title: "Living Room", sub: "Centrepiece elegance" },
                { title: "Close-up Detail", sub: "Every knot, perfection" },
                { title: "Bedroom Style", sub: "Warmth underfoot" },
                { title: "Artisan Work", sub: "15+ years expertise" },
              ];
              const lbl = labels[i] || { title: "Premium Rug", sub: "Master craftsmanship" };
              return (
                <div key={img.src} style={{
                  position: "relative", borderRadius: "var(--radius-lg)",
                  overflow: "hidden", aspectRatio: "4/3",
                  boxShadow: "var(--shadow-md)", cursor: "pointer",
                }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.06)"; }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(10,14,8,0.72) 0%, transparent 55%)",
                  }} />
                  <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: "14px", margin: 0, letterSpacing: "-0.01em" }}>{lbl.title}</p>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px", margin: "2px 0 0" }}>{lbl.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TRADE / DESIGNER PROGRAMME ══════════════════════════════════ */}
      <section
        style={{
          padding: "100px 0 120px",
          background: "var(--surface-alt)",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <div
            className="designer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "center",
            }}
          >
            {/* Left: Content */}
            <div>
              <p style={{
                fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase",
                color: "var(--gold)", fontWeight: 600, marginBottom: "20px",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
                Trade Programme
              </p>

              <h2 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(36px, 4.5vw, 54px)", fontWeight: 300,
                lineHeight: 1.1, letterSpacing: "-0.02em",
                color: "var(--foreground)", marginBottom: "24px",
              }}>
                Exclusively for
                <br />
                <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
                  Designers & Architects
                </em>
              </h2>

              <p style={{
                fontSize: "16px", lineHeight: 1.8, color: "var(--foreground-muted)",
                fontWeight: 300, marginBottom: "40px",
              }}>
                The Fair Rugs partners with interior designers, architects, and hospitality professionals worldwide. Our trade programme is built around your needs — giving you the tools, pricing, and service to create extraordinary spaces.
              </p>

              {/* Benefits List */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "44px" }}>
                {benefits.map((benefit, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "12px",
                      fontSize: "14px", color: "var(--foreground-muted)", lineHeight: 1.6, fontWeight: 300,
                    }}
                  >
                    <span style={{
                      flexShrink: 0, width: "20px", height: "20px", borderRadius: "50%",
                      background: "rgba(74,92,58,0.1)", border: "1px solid rgba(74,92,58,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", color: "var(--primary)", fontWeight: 700, marginTop: "1px",
                    }}>
                      ✓
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Stats Row */}
              <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
                {[
                  { num: "500+", label: "Trade Clients" },
                  { num: "30%", label: "Trade Discount" },
                  { num: "45+", label: "Countries" },
                  { num: "24h", label: "Response" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "30px", fontWeight: 600, color: "var(--primary)", lineHeight: 1,
                    }}>
                      {s.num}
                    </div>
                    <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--foreground-muted)", marginTop: "4px", fontWeight: 500 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link href="/b2b" style={{ textDecoration: "none" }}>
                  <button className="btn btn-primary" style={{ padding: "16px 36px" }}>
                    Apply for Trade Access
                  </button>
                </Link>
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <button className="btn btn-ghost" style={{ padding: "15px 28px" }}>
                    Request Sample Kit
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Stacked rug imagery */}
            <div style={{ position: "relative" }}>
              {/* Main large image */}
              <div style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                aspectRatio: "4/5",
                position: "relative",
                boxShadow: "var(--shadow-xl)",
              }}>
                <Image
                  src={ALL_IMAGES[5].src}
                  alt="Luxury handmade rug — premium quality artisan craftsmanship"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                {/* Gradient overlay with info card */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to bottom, transparent 50%, rgba(15,20,10,0.75) 100%)",
                }} />
                <div style={{
                  position: "absolute", bottom: "28px", left: "24px", right: "24px",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px 24px",
                }}>
                  <p style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
                    ✦ Bespoke Wool & Silk Collection
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
                    Custom dimensions, Pantone-matched colours, factory-direct pricing
                  </p>
                </div>
              </div>

              {/* Floating small image — top right */}
              <div style={{
                position: "absolute", top: "-24px", right: "-28px",
                width: "160px", height: "160px",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-xl)",
                border: "4px solid #fff",
              }}>
                <Image
                  src={ALL_IMAGES[6].src}
                  alt="Hand-knotted rug detail close-up"
                  fill
                  sizes="160px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Floating small image — bottom left */}
              <div style={{
                position: "absolute", bottom: "100px", left: "-32px",
                width: "140px", height: "140px",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-xl)",
                border: "4px solid #fff",
              }}>
                <Image
                  src={ALL_IMAGES[7].src}
                  alt="Premium wool rug interior lifestyle"
                  fill
                  sizes="140px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Floating badge — top left */}
              <div style={{
                position: "absolute", top: "28px", left: "-20px",
                background: "var(--foreground)",
                borderRadius: "var(--radius-lg)",
                padding: "16px 20px",
                boxShadow: "var(--shadow-xl)",
                zIndex: 2,
              }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "4px" }}>
                  Trusted by
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                  500+ Designers
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px", fontWeight: 300 }}>
                  Across 45 Countries
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .luxury-grid { grid-template-columns: 1fr 1fr !important; }
          .luxury-grid > div:first-child { grid-row: auto !important; min-height: 280px !important; }
          .designer-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .lifestyle-strip { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .luxury-grid { grid-template-columns: 1fr !important; }
          .lifestyle-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
