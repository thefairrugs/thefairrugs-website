"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  {
    image: "/images/rug1.png",
    eyebrow: "New Collection — 2025",
    headline: "Timeless Luxury,",
    subhead: "Woven by Hand",
    description:
      "Each rug is a singular work of art, crafted by master weavers using centuries-old techniques and the world's finest materials.",
    cta: { label: "Explore Collection", href: "/shop" },
    ctaSecondary: { label: "Design Your Own", href: "/custom-rug" },
  },
  {
    image: "/images/rug3.png",
    eyebrow: "Artisan Craftsmanship",
    headline: "Hand Knotted",
    subhead: "Pure Elegance",
    description:
      "From the looms of Jaipur to the finest homes worldwide. Premium wool, silk, and natural fibers crafted with extraordinary care.",
    cta: { label: "Shop Hand Knotted", href: "/shop" },
    ctaSecondary: { label: "Get a Quote", href: "/contact" },
  },
  {
    image: "/images/rug5.jpg",
    eyebrow: "Bespoke Service",
    headline: "Custom Rugs,",
    subhead: "Your Vision",
    description:
      "Collaborate with our design team to create a completely bespoke rug tailored to your space, style, and specifications.",
    cta: { label: "Start Designing", href: "/custom-rug" },
    ctaSecondary: { label: "View Gallery", href: "/shop" },
  },
];

const trustItems = [
  { icon: "✦", text: "Free Worldwide Shipping" },
  { icon: "✦", text: "3–5 Week Production" },
  { icon: "✦", text: "100% Handmade" },
  { icon: "✦", text: "Bespoke Designs" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const handleNext = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length);
      setTransitioning(false);
    }, 400);
  };

  const handlePrev = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c - 1 + slides.length) % slides.length);
      setTransitioning(false);
    }, 400);
  };

  const slide = slides[current];

  return (
    <section
      style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#1a1208",
        padding: 0,
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: transitioning ? 0 : 1,
          transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Image
          src={slide.image}
          alt={slide.headline}
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, rgba(26,18,8,0.85) 0%, rgba(26,18,8,0.55) 50%, rgba(26,18,8,0.25) 100%)",
          }}
        />
      </div>

      {/* Decorative gold line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          background:
            "linear-gradient(to bottom, transparent, var(--gold), transparent)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "80px 48px",
          maxWidth: "1440px",
        }}
      >
        <div style={{ maxWidth: "660px" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateY(8px)" : "translateY(0)",
              transition: "all 0.5s ease 0.1s",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "1px",
                background: "var(--gold)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--gold)",
                fontWeight: 600,
              }}
            >
              {slide.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(52px, 7vw, 90px)",
              fontWeight: 300,
              color: "#fff",
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
              marginBottom: "0",
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateY(12px)" : "translateY(0)",
              transition: "all 0.5s ease 0.15s",
            }}
          >
            {slide.headline}
            <br />
            <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
              {slide.subhead}
            </em>
          </h1>

          {/* Description */}
          <p
            style={{
              marginTop: "28px",
              fontSize: "17px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: "1.75",
              maxWidth: "520px",
              fontWeight: 300,
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateY(10px)" : "translateY(0)",
              transition: "all 0.5s ease 0.2s",
            }}
          >
            {slide.description}
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "44px",
              flexWrap: "wrap",
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateY(10px)" : "translateY(0)",
              transition: "all 0.5s ease 0.25s",
            }}
          >
            <Link href={slide.cta.href} style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "var(--gold)",
                  color: "var(--foreground)",
                  border: "none",
                  padding: "17px 38px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: "0 4px 20px rgba(201,169,110,0.35)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#b8954e";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(201,169,110,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(201,169,110,0.35)";
                }}
              >
                {slide.cta.label}
              </button>
            </Link>

            <Link href={slide.ctaSecondary.href} style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "transparent",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.45)",
                  padding: "16px 36px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.9)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.45)";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                {slide.ctaSecondary.label}
              </button>
            </Link>
          </div>
        </div>

        {/* Slide Controls */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "48px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <button
            onClick={handlePrev}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)";
            }}
            aria-label="Previous slide"
          >
            ←
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? "28px" : "8px",
                  height: "3px",
                  borderRadius: "2px",
                  background: i === current ? "var(--gold)" : "rgba(255,255,255,0.35)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.4s ease",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)";
            }}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        {/* Slide counter */}
        <div
          style={{
            position: "absolute",
            bottom: "56px",
            right: "48px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "12px",
            letterSpacing: "0.15em",
            fontWeight: 500,
          }}
        >
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      </div>

      {/* Trust Strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          background: "rgba(201,169,110,0.15)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(201,169,110,0.25)",
          padding: "14px 48px",
          display: "flex",
          justifyContent: "center",
          gap: "48px",
          flexWrap: "wrap",
        }}
      >
        {trustItems.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "rgba(255,255,255,0.85)",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "var(--gold)", fontSize: "10px" }}>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>
    </section>
  );
}
