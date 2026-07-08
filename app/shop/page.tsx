import type { Metadata } from "next";
import Header from "../components/Header";
import PriceCalculator from "../components/PriceCalculator";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Rug Configurator — Design Your Luxury Rug",
  description:
    "Use our luxury rug configurator to design your perfect handmade rug. Choose material, size, shape and get an instant price estimate. Hand knotted, hand tufted, durrie and jute rugs available.",
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        {/* Page Hero */}
        <div
          style={{
            background: "var(--foreground)",
            padding: "72px 0 80px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(201,169,110,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(139,94,60,0.06) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--gold)",
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
                  width: "28px",
                  height: "1px",
                  background: "var(--gold)",
                  display: "inline-block",
                }}
              />
              Bespoke Service
              <span
                style={{
                  width: "28px",
                  height: "1px",
                  background: "var(--gold)",
                  display: "inline-block",
                }}
              />
            </p>

            <h1
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(40px, 6vw, 68px)",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                marginBottom: "20px",
              }}
            >
              Design Your
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
                Luxury Rug
              </em>
            </h1>

            <p
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.6)",
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Configure your perfect handmade rug in minutes. Choose your craft technique, style category, shape and size — and get an instant pricing estimate.
            </p>
          </div>
        </div>

        <PriceCalculator />
      </main>
      <Footer />
    </>
  );
}
