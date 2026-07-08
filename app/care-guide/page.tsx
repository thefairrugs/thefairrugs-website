import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Rug Care Guide — How to Clean & Maintain Your Handmade Rug",
  description: "Expert care instructions for your handmade rug. How to clean, maintain, and preserve your luxury wool, silk, and jute rug for generations.",
};

const CARE_TIPS = [
  {
    icon: "🌬️",
    title: "Regular Vacuuming",
    tips: [
      "Vacuum your rug once or twice a week to prevent dirt from settling into the pile",
      "Always vacuum in the direction of the pile (run your hand along the rug — smooth direction = correct direction)",
      "Use low suction on delicate wool and silk rugs",
      "Avoid vacuuming the fringe — brush it gently by hand instead",
      "Never use a beater bar on hand knotted or hand tufted rugs",
    ],
  },
  {
    icon: "💧",
    title: "Spot Cleaning Spills",
    tips: [
      "Act immediately — blot (never rub) any spill with a clean white cloth",
      "Work from the outer edges inward to prevent spreading",
      "Use a mild, natural fibre-safe cleaner diluted in cool water",
      "Test any cleaning solution on a small, hidden area first",
      "Allow to air dry completely — never use a hairdryer or place in direct sunlight to dry",
    ],
  },
  {
    icon: "🏠",
    title: "Placement & Rotation",
    tips: [
      "Rotate your rug 180° every 6–12 months to ensure even wear and sun exposure",
      "Use a quality rug pad underneath to prevent slipping and protect the back of the rug",
      "Avoid placing rugs in direct, prolonged sunlight — UV rays can fade natural fibres",
      "In high-traffic areas, place the rug so the pile runs toward the main walking direction",
      "Keep rugs away from direct heating vents or fireplaces",
    ],
  },
  {
    icon: "🧹",
    title: "Professional Cleaning",
    tips: [
      "Have your rug professionally cleaned every 2–3 years, or when visibly soiled",
      "Always use a professional cleaner who specialises in handmade natural fibre rugs",
      "Inform the cleaner of the rug's material (wool, silk, jute) and construction method",
      "Avoid steam cleaning wool rugs — excessive moisture can damage natural fibres",
      "After professional cleaning, ensure the rug is fully dried before returning it to the floor",
    ],
  },
  {
    icon: "📦",
    title: "Storage",
    tips: [
      "To store a rug, roll it (do not fold) — folding can cause permanent creases",
      "Roll with the pile facing inward to protect it during storage",
      "Wrap in breathable cotton or acid-free paper — never plastic, which can trap moisture",
      "Store in a cool, dry, dark place with good air circulation",
      "Use cedar balls or lavender sachets to deter moths — never mothballs, which can damage fibres",
    ],
  },
  {
    icon: "🪲",
    title: "Pest Prevention",
    tips: [
      "Natural wool rugs can attract moths if left in dark, undisturbed areas for extended periods",
      "Regular vacuuming is the best moth prevention — moths prefer undisturbed fibres",
      "Cedar wood blocks or lavender sachets near stored rugs help deter moths naturally",
      "If you notice moth damage, contact a professional rug cleaner immediately",
      "Keep rugs clean — food spills left untreated can attract carpet beetles",
    ],
  },
];

export default function CareGuide() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, #2a3a20 0%, #1c2c15 100%)",
            padding: "80px 0",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 600, marginBottom: "12px" }}>
              Artisan Knowledge
            </p>
            <h1
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Rug Care Guide
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "16px", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
              Your handmade rug is a lifetime investment. Follow these expert care tips to keep it beautiful for generations.
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="container" style={{ maxWidth: "800px", padding: "80px 24px 40px" }}>
          <div
            style={{
              background: "var(--primary-pale)",
              borderRadius: "16px",
              padding: "32px 36px",
              borderLeft: "4px solid var(--primary)",
              marginBottom: "60px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary-dark)", marginBottom: "12px" }}>
              A Note from Our Artisans
            </h3>
            <p style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.8, fontWeight: 300 }}>
              Each rug we create is made with centuries-old techniques, the finest natural fibres, and extraordinary care. Natural fibre rugs — wool, silk, jute — are inherently durable and resilient. With proper care, a quality hand knotted rug will outlast several generations of family. These guidelines will help you protect your investment and enjoy your rug for decades to come.
            </p>
          </div>

          {/* Material Quick Reference */}
          <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "32px", fontWeight: 300, color: "var(--foreground)", marginBottom: "24px", letterSpacing: "-0.01em" }}>
            Care by Material
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "60px" }}>
            {[
              { material: "Wool", safe: "Vacuum, spot clean with mild soap, professional wet clean", avoid: "Harsh chemicals, bleach, excessive moisture, direct sunlight" },
              { material: "Bamboo Silk", safe: "Gentle vacuuming, dry cleaning preferred", avoid: "Water-based cleaning, rubbing, beater bar vacuum" },
              { material: "Jute", safe: "Vacuum, spot clean with minimal water, dry quickly", avoid: "Wet cleaning, prolonged moisture (can cause mould)" },
              { material: "Cotton / Durrie", safe: "Vacuum, spot clean, some cotton rugs are machine washable", avoid: "Harsh chemicals, tumble drying on high heat" },
            ].map((item, i) => (
              <div key={i} style={{ background: "var(--surface)", borderRadius: "12px", padding: "24px", border: "1px solid var(--border-light)" }}>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--primary)", marginBottom: "12px" }}>
                  {item.material}
                </h4>
                <p style={{ fontSize: "12px", color: "var(--foreground-muted)", lineHeight: 1.6, marginBottom: "8px" }}>
                  <strong style={{ color: "#2d7a3a" }}>✓ Safe: </strong>{item.safe}
                </p>
                <p style={{ fontSize: "12px", color: "var(--foreground-muted)", lineHeight: 1.6 }}>
                  <strong style={{ color: "#c1440e" }}>✗ Avoid: </strong>{item.avoid}
                </p>
              </div>
            ))}
          </div>

          {/* Care Tips */}
          {CARE_TIPS.map((section, i) => (
            <div key={i} style={{ marginBottom: "48px" }}>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 400, color: "var(--foreground)", marginBottom: "20px", letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "12px" }}>
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {section.tips.map((tip, j) => (
                  <li key={j} style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                    <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>✦</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div style={{ background: "linear-gradient(135deg, #2a3a20, #1c2c15)", borderRadius: "20px", padding: "40px", textAlign: "center", marginTop: "24px" }}>
            <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 300, color: "#fff", marginBottom: "12px" }}>
              Need personalised advice?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", marginBottom: "24px", lineHeight: 1.7, fontWeight: 300 }}>
              Our team is happy to provide specific care advice for your rug based on its material and construction. Contact us anytime.
            </p>
            <a
              href="https://wa.me/918416919470?text=Hi%2C%20I%20need%20care%20advice%20for%20my%20rug."
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button style={{
                padding: "14px 36px", borderRadius: "9999px", border: "none",
                background: "#25D366", color: "#fff", fontSize: "13px",
                fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                cursor: "pointer",
              }}>
                Chat on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
