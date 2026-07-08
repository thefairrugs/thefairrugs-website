"use client";

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <path d="M24 4L6 14v12c0 10 7.5 19 18 22 10.5-3 18-12 18-22V14L24 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M17 24l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Master Artisans",
    description:
      "Every rug passes through the hands of craftsmen with decades of expertise, trained in centuries-old weaving traditions from Jaipur and Varanasi.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 24h20M24 14v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 18l12 12M30 18L18 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
      </svg>
    ),
    title: "Premium Materials",
    description:
      "We source only the finest New Zealand wool, Himalayan silk, organic cotton, and natural jute — materials that age beautifully and last for generations.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <rect x="6" y="8" width="36" height="32" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M6 16h36M16 8v8M32 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M13 26h8M13 32h12M29 26h6M29 32h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Fully Custom",
    description:
      "Any size. Any shape. Any design. We collaborate closely with interior designers, architects, and homeowners to realise completely bespoke rugs.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <path d="M8 24C8 15.163 15.163 8 24 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 24C40 32.837 32.837 40 24 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M24 8C20 14 20 34 24 40M24 8C28 14 28 34 24 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 24h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
      </svg>
    ),
    title: "Worldwide Delivery",
    description:
      "Free shipping to USA, Canada, UK, Europe, Australia and beyond. Your rug arrives fully insured, carefully rolled, and ready to place.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <path d="M24 6l4.5 9 10 1.5-7.25 7 1.75 10L24 29l-9 4.5 1.75-10L9.5 16.5l10-1.5L24 6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M24 38v4M16 42h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Fair Pricing",
    description:
      "Factory-direct pricing means you get international luxury quality at honest, transparent prices — with no middlemen inflating the cost.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <path d="M24 42c-2-3-14-11-14-22a14 14 0 0128 0C38 31 26 39 24 42z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="24" cy="20" r="5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    title: "Sustainable Origin",
    description:
      "Ethically produced in certified workshops in Jaipur. We ensure fair wages, safe conditions, and environmentally responsible practices throughout.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      style={{
        padding: "110px 0",
        background: "var(--foreground)",
        color: "#fff",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "end",
            marginBottom: "80px",
          }}
        >
          <div>
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
              Why The Fair Rugs
            </p>

            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "#fff",
              }}
            >
              Where Heritage Meets
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
                Contemporary Luxury
              </em>
            </h2>
          </div>

          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.6)",
              fontWeight: 300,
              paddingBottom: "4px",
            }}
          >
            We are not simply rug makers — we are custodians of an ancient craft, bringing the finest handmade rugs to the world&apos;s most discerning homes, hotels, and design studios.
          </p>
        </div>

        {/* Pillars Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
          }}
        >
          {pillars.map((pillar, i) => (
            <div
              key={i}
              style={{
                padding: "44px 40px",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(201,169,110,0.06)";
                el.style.borderColor = "rgba(201,169,110,0.25)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: "rgba(201,169,110,0.12)",
                  border: "1px solid rgba(201,169,110,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gold)",
                  marginBottom: "28px",
                }}
              >
                {pillar.icon}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "24px",
                  fontWeight: 500,
                  color: "#fff",
                  marginBottom: "14px",
                  letterSpacing: "-0.01em",
                }}
              >
                {pillar.title}
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 300,
                }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
            marginTop: "80px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "60px",
          }}
        >
          {[
            { number: "15+", label: "Years of Craftsmanship" },
            { number: "5,000+", label: "Rugs Delivered Worldwide" },
            { number: "45+", label: "Countries Served" },
            { number: "100%", label: "Handmade in India" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "0 20px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "clamp(40px, 5vw, 60px)",
                  fontWeight: 300,
                  color: "var(--gold)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "12px",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
