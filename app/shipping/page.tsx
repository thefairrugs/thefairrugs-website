import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Shipping Policy — The Fair Rugs",
  description: "Everything you need to know about shipping, delivery times, and tracking for your handmade rug order.",
};

export default function ShippingPolicy() {
  return (
    <>
      <Header />
      <main>
        <div
          style={{
            background: "linear-gradient(135deg, #2a3a20 0%, #1c2c15 100%)",
            padding: "80px 0",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 600, marginBottom: "12px" }}>
              Shipping & Delivery
            </p>
            <h1
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              Shipping Policy
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "12px", fontSize: "14px" }}>
              Free worldwide express shipping on all orders
            </p>
          </div>
        </div>

        <div className="container" style={{ maxWidth: "800px", padding: "80px 24px" }}>
          {[
            {
              title: "Free Worldwide Shipping",
              content: "We offer complimentary express shipping to 45+ countries worldwide via DHL Express and FedEx Priority. There is no minimum order value for free shipping. Every shipment is fully insured.",
            },
            {
              title: "Production Time",
              content: "All rugs are made to order. Production time depends on the rug type: Hand Knotted (6–12 weeks for custom, 3–5 weeks for catalogue items), Hand Tufted (3–6 weeks), Durrie / Flatweave (2–4 weeks). You will receive a production timeline in your order confirmation. We send progress photos at key milestones.",
            },
            {
              title: "Delivery Time",
              content: "Once production is complete and your rug passes our quality inspection, it ships within 24 hours. International delivery via DHL Express or FedEx Priority takes 4–7 business days to most destinations.",
            },
            {
              title: "Tracking",
              content: "You will receive a tracking number and live tracking link as soon as your rug is collected by the courier. You can track your shipment in real time on the DHL or FedEx website.",
            },
            {
              title: "Customs & Duties",
              content: "We handle all export documentation and customs declarations from our end. Import duties and taxes vary by country. In many cases, our export documentation structures help minimise duties. Customers are responsible for any import duties or taxes levied by their country's customs authority.",
            },
            {
              title: "Packaging",
              content: "Each rug is carefully rolled, wrapped in protective tissue, and packed in a custom-designed sturdy carton. Fragile handling instructions are printed on every box. For high-value orders, we add additional protective padding.",
            },
            {
              title: "Insurance",
              content: "Every shipment is fully insured for the full value of the order against loss, theft, or transit damage. In the unlikely event of a shipping issue, we will arrange a replacement or full refund.",
            },
            {
              title: "Contact",
              content: "For shipping enquiries, please contact us at: info@thefairrugs.com | WhatsApp: +91 84169 19470",
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: "48px" }}>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 400, color: "var(--foreground)", marginBottom: "16px", letterSpacing: "-0.01em" }}>
                {section.title}
              </h2>
              <p style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.8, fontWeight: 300 }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
