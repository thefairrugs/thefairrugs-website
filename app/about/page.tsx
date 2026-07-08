import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Our Story — The Art of Handmade Rugs",
  description:
    "Learn about The Fair Rugs — a luxury handmade rug brand born from a passion for artisan craftsmanship. Discover our story, our values, and our commitment to bringing world-class rugs to discerning homes worldwide.",
};

const milestones = [
  {
    year: "2009",
    title: "The Beginning",
    desc: "Founded in Jaipur, India, with a single workshop and a dream to bring master artisan rugs to the world.",
  },
  {
    year: "2013",
    title: "First International Export",
    desc: "Our first collection reached luxury homeowners in the USA and Europe, marking our global journey.",
  },
  {
    year: "2017",
    title: "Designer Programme Launched",
    desc: "We launched our exclusive interior designer and architect programme, now serving 500+ trade clients worldwide.",
  },
  {
    year: "2021",
    title: "Certified Sustainable",
    desc: "Received certification for ethical manufacturing practices, fair wages, and environmental responsibility.",
  },
  {
    year: "2024",
    title: "5,000 Rugs Delivered",
    desc: "A milestone celebrated across our Jaipur workshops — 5,000 handmade rugs delivered to 45+ countries.",
  },
];

const values = [
  {
    title: "Uncompromising Quality",
    desc: "We source only the finest materials and work with master weavers who have dedicated their lives to the craft. Every rug is inspected at multiple stages before it leaves our workshop.",
  },
  {
    title: "Transparent Pricing",
    desc: "We sell factory-direct. No middlemen, no markups. You receive international luxury quality at honest, fair prices — hence our name.",
  },
  {
    title: "Artisan Partnership",
    desc: "We pay our artisans fairly, provide safe working conditions, and invest in their skills. Behind every rug is a craftsperson whose livelihood we are proud to support.",
  },
  {
    title: "Sustainable Sourcing",
    desc: "From biodegradable dyes to ethically sourced wool and natural fibres, we make decisions that are good for both our customers and the planet.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section
          style={{
            background: "var(--foreground)",
            padding: "100px 0 110px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 60%, rgba(201,169,110,0.07) 0%, transparent 55%), radial-gradient(circle at 80% 40%, rgba(139,94,60,0.05) 0%, transparent 55%)",
              pointerEvents: "none",
            }}
          />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: "700px" }}>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  fontWeight: 600,
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
                Our Story
              </p>

              <h1
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "clamp(44px, 6vw, 76px)",
                  fontWeight: 300,
                  color: "#fff",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.08,
                  marginBottom: "28px",
                }}
              >
                Born from a
                <br />
                <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
                  Love of Craft
                </em>
              </h1>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.65)",
                  fontWeight: 300,
                  maxWidth: "580px",
                }}
              >
                The Fair Rugs was founded with a single belief: that the world&apos;s most beautiful handmade rugs should be accessible — priced with honesty and delivered with care.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section style={{ padding: "110px 0", background: "var(--background)" }}>
          <div className="container">
            <div
              className="two-col"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "80px",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    aspectRatio: "4/5",
                    boxShadow: "var(--shadow-xl)",
                  }}
                >
                  <Image
                    src="/images/rug7.png"
                    alt="Artisan weaving a rug in Jaipur"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

              <div>
                <p className="eyebrow" style={{ marginBottom: "20px" }}>
                  ✦ &nbsp; Our Beginning
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "clamp(32px, 4vw, 48px)",
                    fontWeight: 300,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: "var(--foreground)",
                    marginBottom: "28px",
                  }}
                >
                  Rooted in Jaipur,
                  <br />
                  <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
                    Known Worldwide
                  </em>
                </h2>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.85,
                    color: "var(--foreground-muted)",
                    fontWeight: 300,
                    marginBottom: "24px",
                  }}
                >
                  The Fair Rugs began in the weaving lanes of Jaipur, where centuries-old traditions meet modern design sensibility. Our founders saw master artisans creating extraordinary work — work that deserved a global audience.
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.85,
                    color: "var(--foreground-muted)",
                    fontWeight: 300,
                    marginBottom: "40px",
                  }}
                >
                  Today, we partner with over 200 skilled weavers across Rajasthan, ensuring fair wages, excellent working conditions, and a livelihood that sustains families and preserves an ancient craft for future generations.
                </p>

                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <button className="btn btn-primary" style={{ padding: "16px 36px" }}>
                    Get in Touch
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section style={{ padding: "110px 0", background: "var(--surface-alt)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "72px" }}>
              <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; Our Journey</p>
              <h2
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "clamp(32px, 4.5vw, 52px)",
                  fontWeight: 300,
                  color: "var(--foreground)",
                  letterSpacing: "-0.02em",
                }}
              >
                15 Years of Excellence
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                maxWidth: "800px",
                margin: "0 auto",
                position: "relative",
              }}
            >
              {/* Vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: "89px",
                  top: "28px",
                  bottom: "28px",
                  width: "1px",
                  background: "linear-gradient(to bottom, var(--gold), var(--border))",
                }}
              />

              {milestones.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "36px",
                    alignItems: "flex-start",
                    padding: "28px 0",
                  }}
                >
                  {/* Year */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "80px",
                      textAlign: "right",
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "var(--primary)",
                      paddingTop: "4px",
                    }}
                  >
                    {m.year}
                  </div>

                  {/* Dot */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "var(--surface)",
                      border: "3px solid var(--gold)",
                      marginTop: "6px",
                      zIndex: 1,
                    }}
                  />

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        marginBottom: "8px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {m.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--foreground-muted)",
                        lineHeight: 1.7,
                        fontWeight: 300,
                      }}
                    >
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ padding: "110px 0", background: "var(--foreground)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "72px" }}>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                ✦ &nbsp; What We Stand For
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "clamp(32px, 4.5vw, 52px)",
                  fontWeight: 300,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                Our Values
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "2px",
              }}
            >
              {values.map((v, i) => (
                <div
                  key={i}
                  className="hover-value"
                  style={{
                    padding: "48px 44px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    transition: "background 0.3s ease",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "64px",
                      fontWeight: 300,
                      color: "rgba(201,169,110,0.15)",
                      lineHeight: 1,
                      marginBottom: "20px",
                    }}
                  >
                    0{i + 1}
                  </div>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 600,
                      color: "#fff",
                      marginBottom: "16px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.8,
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 300,
                    }}
                  >
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            padding: "100px 0",
            background: "var(--surface-alt)",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p className="eyebrow" style={{ marginBottom: "20px" }}>
              ✦ &nbsp; Ready to Begin?
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 300,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
                marginBottom: "24px",
              }}
            >
              Let&apos;s Create Something Beautiful
            </h2>
            <p
              style={{
                fontSize: "17px",
                color: "var(--foreground-muted)",
                maxWidth: "480px",
                margin: "0 auto 44px",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Whether you know exactly what you want or need expert guidance, our team is here to help you find the perfect rug.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/custom-rug" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary" style={{ padding: "17px 40px" }}>
                  Design Your Custom Rug
                </button>
              </Link>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <button className="btn btn-outline" style={{ padding: "16px 36px" }}>
                  Speak with an Expert
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
