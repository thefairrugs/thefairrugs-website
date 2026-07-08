"use client";

import { useState } from "react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    title: "Interior Designer, New York",
    rating: 5,
    text: "The Fair Rugs has become my go-to source for every high-end residential project. The quality rivals anything I've sourced from European ateliers — at a fraction of the price. My clients are always astonished.",
    country: "🇺🇸",
    project: "Upper East Side Penthouse",
  },
  {
    name: "James Worthington",
    title: "Architect & Principal, London",
    rating: 5,
    text: "We specified a 4×6 metre custom hand-knotted rug for a Grade I listed property. The colour accuracy, pile consistency, and delivery speed were impeccable. An outstanding experience from first consultation to installation.",
    country: "🇬🇧",
    project: "Historic Manor Restoration",
  },
  {
    name: "Claudette Beaumont",
    title: "Hospitality Designer, Paris",
    rating: 5,
    text: "Three luxury hotel projects in a year — all featuring The Fair Rugs. The bespoke service is extraordinary. They matched our pantone exactly and delivered on schedule. Truly world-class.",
    country: "🇫🇷",
    project: "Boutique Hotel, Loire Valley",
  },
  {
    name: "David & Emma Chen",
    title: "Homeowners, Sydney",
    rating: 5,
    text: "We ordered a custom 9×12 ft wool rug for our new home. The process was seamless — instant WhatsApp responses, regular production updates, and the rug arrived beautifully packaged. Absolutely perfect.",
    country: "🇦🇺",
    project: "Custom Family Home",
  },
  {
    name: "Isabella Rossi",
    title: "Luxury Property Developer, Milan",
    rating: 5,
    text: "For our latest development, I needed 24 bespoke rugs in three months. The Fair Rugs delivered every single one on time, with consistent quality throughout. A supplier I trust completely.",
    country: "🇮🇹",
    project: "Luxury Residential Development",
  },
  {
    name: "Michael Thompson",
    title: "Design Director, Toronto",
    rating: 5,
    text: "The level of craftsmanship in the hand-knotted collection is extraordinary. You can feel the difference immediately. These are rugs that will outlast everything else in the room.",
    country: "🇨🇦",
    project: "Award-Winning Residence",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const perPage = 3;
  const total = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(active * perPage, active * perPage + perPage);

  return (
    <section
      style={{
        padding: "110px 0",
        background: "var(--cream)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            <span className="eyebrow">Client Voices</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 300,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Trusted by Designers Worldwide
          </h2>

          <p
            style={{
              color: "var(--foreground-muted)",
              fontSize: "17px",
              maxWidth: "460px",
              margin: "0 auto",
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            From Manhattan penthouses to Parisian boutique hotels — here is what our clients say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          {visible.map((t, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-xl)",
                padding: "40px 36px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "var(--shadow-lg)";
                el.style.borderColor = "var(--border)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "var(--shadow-sm)";
                el.style.borderColor = "var(--border-light)";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "80px",
                  lineHeight: 0.7,
                  color: "var(--gold-light)",
                  marginBottom: "20px",
                  display: "block",
                  fontWeight: 700,
                  opacity: 0.5,
                }}
              >
                &ldquo;
              </div>

              {/* Stars */}
              <div
                style={{
                  color: "var(--gold)",
                  fontSize: "14px",
                  letterSpacing: "3px",
                  marginBottom: "20px",
                }}
              >
                {"★".repeat(t.rating)}
              </div>

              {/* Text */}
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: "var(--foreground-muted)",
                  fontWeight: 300,
                  marginBottom: "32px",
                  fontStyle: "italic",
                }}
              >
                {t.text}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "var(--border-light)",
                  marginBottom: "24px",
                }}
              />

              {/* Author */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      marginBottom: "4px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {t.country} {t.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--foreground-muted)",
                      fontWeight: 400,
                    }}
                  >
                    {t.title}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    fontWeight: 600,
                    textAlign: "right",
                    lineHeight: 1.4,
                    maxWidth: "120px",
                  }}
                >
                  {t.project}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "36px" : "10px",
                height: "10px",
                borderRadius: "5px",
                background: i === active ? "var(--primary)" : "var(--border)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
              aria-label={`Go to testimonial page ${i + 1}`}
            />
          ))}
        </div>

        {/* Google Rating */}
        <div
          style={{
            textAlign: "center",
            marginTop: "60px",
            padding: "36px",
            background: "var(--surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-light)",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                color: "var(--gold)",
                fontSize: "22px",
                letterSpacing: "3px",
              }}
            >
              ★★★★★
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "32px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                4.9
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--foreground-muted)",
                  marginLeft: "6px",
                }}
              >
                / 5 from 500+ verified reviews
              </span>
            </div>
          </div>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--foreground-muted)",
              fontWeight: 500,
            }}
          >
            Trusted by interior designers, architects & luxury homeowners worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
