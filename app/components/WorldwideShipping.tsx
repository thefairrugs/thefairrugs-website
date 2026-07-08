"use client";

import { useState } from "react";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "UAE", "Singapore", "Netherlands", "Switzerland",
  "Sweden", "Norway", "Denmark", "New Zealand", "Japan",
  "South Korea", "Italy", "Spain", "Belgium", "Austria",
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman",
  "Hong Kong", "Ireland", "Portugal", "Finland", "South Africa",
  "Brazil", "Mexico", "Argentina", "Israel", "Greece",
  "Turkey", "Poland", "Czech Republic", "Hungary", "Romania",
  "Bulgaria", "Croatia", "Slovenia", "Slovakia", "Estonia",
  "Latvia", "Lithuania", "+15 more countries",
];

const SHIPPING_FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <path d="M8 16l16-8 16 8v16l-16 8-16-8V16z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 16l16 8 16-8M24 24v16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Professional Packaging",
    desc: "Each rug is rolled, wrapped in protective tissue, and packed in a custom-designed carton engineered for international shipping. Fragile packaging instructions are printed on every box.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M6 18h36M14 24h8M14 30h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="36" cy="27" r="5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M34 27l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Customs Cleared",
    desc: "We handle all export documentation, commercial invoices, and customs declarations. Our logistics partner ensures smooth clearance so your rug arrives without delays or additional duties.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M24 8v8M24 32v8M8 24h8M32 24h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
    title: "Live Tracking",
    desc: "Receive a live tracking link the moment your rug leaves our workshop. Monitor your shipment in real time — from Jaipur to your front door — with our courier partner's tracking system.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <path d="M24 4L6 14v12c0 10 7.5 19 18 22 10.5-3 18-12 18-22V14L24 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M16 24l6 6 10-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Fully Insured",
    desc: "Every shipment is fully insured against loss, theft, or transit damage. In the rare event of an issue, we guarantee a full replacement or complete refund — no questions asked.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <path d="M24 12v12l8 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
    title: "4–7 Day Express Delivery",
    desc: "Once your rug passes our final quality inspection, it ships via DHL Express or FedEx Priority — delivered to your door in just 4–7 business days, regardless of where you are in the world.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <path d="M12 38V20l12-12 12 12v18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <rect x="19" y="28" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
    title: "White Glove Delivery",
    desc: "For high-value orders, we offer optional white glove delivery: our partner places the rug in your chosen room and removes all packaging. Available in select cities across USA, UK, and UAE.",
  },
];

const STATS = [
  { number: "45+", label: "Countries Served" },
  { number: "Free", label: "Worldwide Shipping" },
  { number: "4–7", label: "Days Express Delivery" },
  { number: "100%", label: "Insured Shipments" },
];

export default function WorldwideShipping() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  return (
    <section
      style={{
        padding: "100px 0",
        background: "linear-gradient(135deg, #2a3a20 0%, #1c2c15 50%, #243018 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 15% 50%, rgba(184,151,90,0.1) 0%, transparent 40%), radial-gradient(circle at 85% 20%, rgba(122,143,106,0.12) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />

      {/* Globe decorative SVG */}
      <div
        style={{
          position: "absolute",
          right: "-100px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.04,
          pointerEvents: "none",
        }}
      >
        <svg viewBox="0 0 400 400" fill="none" width="500" height="500">
          <circle cx="200" cy="200" r="190" stroke="white" strokeWidth="1" />
          <ellipse cx="200" cy="200" rx="100" ry="190" stroke="white" strokeWidth="0.8" />
          <ellipse cx="200" cy="200" rx="150" ry="190" stroke="white" strokeWidth="0.5" />
          <path d="M10 200h380" stroke="white" strokeWidth="0.8" />
          <path d="M200 10v380" stroke="white" strokeWidth="0.8" />
          <path d="M50 100 Q200 130 350 100" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M30 150 Q200 170 370 150" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M30 250 Q200 230 370 250" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M50 300 Q200 270 350 300" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "70px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--gold-light)",
              fontWeight: 600,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "28px",
                height: "1px",
                background: "var(--gold)",
              }}
            />
            Delivered To Your Door
            <span
              style={{
                display: "inline-block",
                width: "28px",
                height: "1px",
                background: "var(--gold)",
              }}
            />
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 300,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Free Worldwide{" "}
            <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
              Shipping
            </em>
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.65)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.75,
              fontWeight: 300,
            }}
          >
            From our workshop in Jaipur, India to 45+ countries worldwide — complimentary express shipping on every order, fully insured.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "80px",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                padding: "36px 24px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "clamp(36px, 4vw, 52px)",
                  fontWeight: 400,
                  color: "var(--gold-light)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
            marginBottom: "80px",
          }}
        >
          {SHIPPING_FEATURES.map((feature, i) => (
            <div
              key={i}
              style={{
                background:
                  activeFeature === i
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)",
                padding: "36px 32px",
                cursor: "default",
                transition: "background 0.3s ease",
                borderRadius: i === 0 ? "16px 0 0 0" : i === 2 ? "0 16px 0 0" : i === 3 ? "0 0 0 16px" : i === 5 ? "0 0 16px 0" : "0",
              }}
              onMouseEnter={() => setActiveFeature(i)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div
                style={{
                  color: activeFeature === i ? "var(--gold-light)" : "rgba(255,255,255,0.55)",
                  marginBottom: "20px",
                  transition: "color 0.3s ease",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "10px",
                  letterSpacing: "-0.01em",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Countries We Ship To */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "48px",
            marginBottom: "60px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "28px",
              fontWeight: 300,
              color: "#fff",
              marginBottom: "8px",
              letterSpacing: "-0.01em",
            }}
          >
            We ship to{" "}
            <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
              45+ countries
            </em>
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "28px",
              fontWeight: 300,
            }}
          >
            Free express shipping worldwide — no minimum order required.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {COUNTRIES.map((country, i) => (
              <span
                key={i}
                style={{
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  background:
                    country.startsWith("+")
                      ? "rgba(184,151,90,0.2)"
                      : "rgba(255,255,255,0.07)",
                  color: country.startsWith("+")
                    ? "var(--gold-light)"
                    : "rgba(255,255,255,0.7)",
                  fontSize: "12px",
                  fontWeight: country.startsWith("+") ? 700 : 400,
                  letterSpacing: "0.02em",
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "default",
                }}
              >
                {country}
              </span>
            ))}
          </div>
        </div>

        {/* Shipping Timeline */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {[
            {
              step: "01",
              title: "Order Placed",
              desc: "We confirm your order within 4 hours and assign a dedicated artisan team.",
              time: "Day 0",
            },
            {
              step: "02",
              title: "Production Starts",
              desc: "Your rug enters production. You receive progress photos at each milestone.",
              time: "Week 1–3",
            },
            {
              step: "03",
              title: "Quality Inspection",
              desc: "Every rug passes our 12-point quality inspection before being approved.",
              time: "Week 3–5",
            },
            {
              step: "04",
              title: "Delivered",
              desc: "DHL Express or FedEx Priority delivers your rug to your door.",
              time: "+4–7 Days",
            },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                padding: "36px 28px",
                borderRight:
                  i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  color: "rgba(184,151,90,0.3)",
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: "20px",
                }}
              >
                {step.step}
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  background: "rgba(184,151,90,0.15)",
                  color: "var(--gold-light)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                {step.time}
              </div>
              <h4
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                {step.title}
              </h4>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
