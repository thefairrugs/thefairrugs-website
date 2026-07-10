"use client";

import { useState } from "react";

const WA_URL = "https://wa.me/918416919470?text=Hello%2C%20I%27m%20interested%20in%20B2B%2FWholesale%20partnership%20with%20The%20Fair%20Rugs.";

const BUSINESS_TYPES = [
  "Interior Designer", "Architect", "Hotel / Hospitality",
  "Retail Store", "Online Retailer", "Dealer / Distributor",
  "Importer / Exporter", "Commercial Property Developer",
  "Hospitality Consultant", "Other",
];

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Italy", "Spain", "Netherlands", "UAE", "Singapore",
  "India", "New Zealand", "Japan", "South Korea", "Other",
];

const CERTIFICATIONS = [
  {
    icon: "🌿",
    title: "OEKO-TEX® Certified",
    desc: "All yarns and dyes tested for harmful substances — safe for families, children, and pets.",
  },
  {
    icon: "♻️",
    title: "GRS Certified",
    desc: "Global Recycled Standard — we use post-consumer recycled fibre in select collections.",
  },
  {
    icon: "⚖️",
    title: "Fair Trade Practices",
    desc: "Verified fair wages, safe conditions, and zero child labour across all production units.",
  },
  {
    icon: "🏭",
    title: "ISO 9001:2015",
    desc: "Quality Management System certified — consistent standards from raw material to dispatch.",
  },
  {
    icon: "🛂",
    title: "GST / Export Certified",
    desc: "Fully registered Indian exporter with all required GST, IEC, and customs documentation.",
  },
  {
    icon: "🇺🇸",
    title: "US Import Compliant",
    desc: "All products meet US Consumer Product Safety Commission (CPSC) and FTC labelling requirements.",
  },
];

const MANUFACTURING_STEPS = [
  {
    step: "01",
    title: "Design & Sampling",
    time: "5–7 days",
    desc: "Your design is translated into a technical weave specification. A physical sample swatch is produced and shipped for your approval before full production begins.",
  },
  {
    step: "02",
    title: "Material Sourcing",
    time: "3–5 days",
    desc: "Premium yarns (New Zealand wool, Himalayan silk, bamboo silk, or cotton) are sourced, dyed to your exact Pantone specification, and quality-checked.",
  },
  {
    step: "03",
    title: "Loom Setup & Weaving",
    time: "2–8 weeks",
    desc: "Master artisans set up traditional handlooms or tufting frames. Hand-knotted rugs take 1 knot per second — a 9×12 ft rug has over 1.5 million individual knots.",
  },
  {
    step: "04",
    title: "Washing & Finishing",
    time: "4–6 days",
    desc: "Rugs are washed with eco-friendly agents, sun-dried, stretched flat, trimmed, and given final pile adjustments to achieve the precise height and texture specified.",
  },
  {
    step: "05",
    title: "QC Inspection",
    time: "1–2 days",
    desc: "Multi-point quality inspection: knot density, pile height, colour accuracy, dimension check, and surface uniformity. Documented with photos sent to you.",
  },
  {
    step: "06",
    title: "Packaging & Export",
    time: "1–2 days",
    desc: "Rugs are rolled on acid-free tubes, wrapped in cotton fabric, boxed, and fully insured. Air or sea freight arranged per your preference with full tracking.",
  },
];

const QUALITY_CONTROL = [
  { icon: "🔬", title: "Raw Material Inspection", desc: "Every yarn batch is tested for tensile strength, colourfastness, and fibre content before entering production." },
  { icon: "📏", title: "Dimension & Tolerance Check", desc: "Every rug is measured to ±1cm tolerance. Oversized or undersized pieces are returned to finishing." },
  { icon: "🎨", title: "Colour Accuracy", desc: "Pantone-matched dye baths verified under D65 standard lighting. Colour delta checked against approved swatches." },
  { icon: "✋", title: "Pile Height Verification", desc: "Pile height measured across 5 zones. Any deviation from specification triggers re-trimming." },
  { icon: "📸", title: "Photo Milestone Reports", desc: "Progress photos sent at: loom setup, 50% weaving, pre-wash, post-wash, and final inspection stages." },
  { icon: "📋", title: "Final QC Certificate", desc: "Each shipment includes a signed QC certificate covering knot count, materials, dimensions, and packing details." },
];

const MOQ_INFO = [
  { construction: "Hand Knotted", moq: "1 piece", leadTime: "4–8 weeks", note: "Luxury handcrafted · Quote on request" },
  { construction: "Hand Tufted", moq: "1 piece", leadTime: "3–5 weeks", note: "Commercial grade available · Quote on request" },
  { construction: "Durrie / Flat Weave", moq: "5 pieces", leadTime: "2–4 weeks", note: "Bulk discounts available · Quote on request" },
  { construction: "Jute / Natural Fibre", moq: "5 pieces", leadTime: "2–3 weeks", note: "Eco-certified · Quote on request" },
  { construction: "Custom Blend", moq: "10 pieces", leadTime: "5–8 weeks", note: "Tailored specification · Quote on request" },
];

const EXPORT_MARKETS = [
  { flag: "🇺🇸", country: "USA", detail: "Tariff-free available · Air & Sea · 7–14 day delivery" },
  { flag: "🇬🇧", country: "United Kingdom", detail: "Free shipping · DDP · 5–10 day delivery" },
  { flag: "🇦🇺", country: "Australia", detail: "Fully insured · Air freight · 8–14 days" },
  { flag: "🇩🇪", country: "Germany", detail: "EU customs handled · 7–12 days" },
  { flag: "🇫🇷", country: "France", detail: "EU DDP available · 7–12 days" },
  { flag: "🇨🇦", country: "Canada", detail: "CETA benefit · 7–14 days" },
  { flag: "🇦🇪", country: "UAE", detail: "Air freight · 5–8 days" },
  { flag: "🇯🇵", country: "Japan", detail: "Air freight · 7–10 days" },
];

const TRADE_BENEFITS = [
  { icon: "💰", title: "Trade Pricing 20–40% Off", desc: "Registered trade clients receive exclusive wholesale pricing. Volume discounts apply for orders above 10, 50, and 100 pieces." },
  { icon: "🎨", title: "Private Label / OEM", desc: "Launch your own rug brand. We manufacture to your exact specifications, labels, and packaging — fully confidential." },
  { icon: "🏭", title: "Factory-Direct Access", desc: "Visit our Jaipur production facility, meet the artisans, and see the manufacturing process first-hand. Virtual tours also available." },
  { icon: "📦", title: "Bulk & Repeat Orders", desc: "From 1 sample to 10,000 units. Consistent quality across large orders with dedicated QC at every production stage." },
  { icon: "🧾", title: "Sample Programme", desc: "Request physical samples before committing. Trade clients receive samples at subsidised cost. Full design swatches available." },
  { icon: "📄", title: "Export Documentation", desc: "Full export documentation: GST invoice, packing list, COO, CITES if required, and customs HS code classification support." },
];

export default function B2BContent() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "", businessType: "", contactName: "", email: "",
    phone: "", country: "", website: "",
    inquiryType: "", material: "", construction: "", size: "",
    quantity: "", targetDelivery: "", budget: "", projectDetails: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "b2b", ...form }),
      });
    } catch { /* silent */ }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Premium B2B header
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #1a2814 0%, #2a3a20 50%, #1e2f18 100%)",
        padding: "80px 0 60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 15% 60%, rgba(184,151,90,0.15) 0%, transparent 50%), radial-gradient(circle at 85% 35%, rgba(122,143,106,0.12) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "60px", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(184,151,90,0.15)", border: "1px solid rgba(184,151,90,0.3)", borderRadius: "9999px", padding: "6px 18px", marginBottom: "24px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 700 }}>✦ Trade & Wholesale Programme</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(40px, 5.5vw, 68px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: "20px" }}>
                Partner with India&apos;s<br />
                <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Premier Rug Manufacturer</em>
              </h1>
              <p style={{ fontSize: "17px", lineHeight: 1.8, color: "rgba(255,255,255,0.65)", fontWeight: 300, maxWidth: "520px", marginBottom: "32px" }}>
                Factory-direct manufacturing from Jaipur, India. We serve interior designers, architects, hotels, retailers, and importers in 45+ countries — with trade pricing, private label, and full export support.
              </p>
              {/* Trust strip */}
              <div style={{ display: "flex", gap: "0", flexWrap: "wrap" }}>
                {[
                  { icon: "🏭", text: "Factory Direct" },
                  { icon: "📦", text: "MOQ from 1 pc" },
                  { icon: "🌍", text: "45+ Countries" },
                  { icon: "⏱️", text: "24hr Response" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 18px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none", fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                    <span>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick contact card on hero */}
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-xl)", padding: "32px", backdropFilter: "blur(12px)" }}>
              <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "24px", fontWeight: 300, color: "#fff", marginBottom: "6px" }}>Get Trade Pricing</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>Fill the full form below or reach us directly:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a href="#b2b-form" style={{ textDecoration: "none" }}>
                  <button style={{ width: "100%", padding: "14px", background: "var(--gold)", color: "var(--foreground)", border: "none", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 20px rgba(184,151,90,0.35)" }}>
                    Submit B2B Inquiry ↓
                  </button>
                </a>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button style={{ width: "100%", padding: "13px", background: "#25D366", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    WhatsApp Trade Team
                  </button>
                </a>
                <div style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.4)", paddingTop: "4px" }}>
                  thefairrugs@gmail.com · Mon–Sat 9am–6pm IST
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: "var(--charcoal)", padding: "0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
            {[
              { value: "500+", label: "Trade Clients" },
              { value: "45+", label: "Countries Served" },
              { value: "15+", label: "Years Experience" },
              { value: "5,000+", label: "Rugs Exported" },
              { value: "200+", label: "Master Artisans" },
            ].map((stat, i) => (
              <div key={stat.label} style={{ textAlign: "center", padding: "28px 16px", borderRight: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "40px", fontWeight: 300, color: "var(--gold-light)", letterSpacing: "-0.02em", lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "6px", fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          B2B INQUIRY FORM — AT THE TOP as requested
          ═══════════════════════════════════════════════════════════════ */}
      <section id="b2b-form" style={{ padding: "80px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p className="eyebrow" style={{ marginBottom: "14px" }}>✦ &nbsp; Start Your Partnership</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em", marginBottom: "12px" }}>
                Submit Your B2B Inquiry
              </h2>
              <p style={{ color: "var(--foreground-muted)", fontSize: "15px", lineHeight: 1.7 }}>
                Our trade team responds within 24 hours with pricing, samples, and a dedicated account manager.
              </p>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "52px", boxShadow: "var(--shadow-lg)" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "64px", marginBottom: "24px" }}>🤝</div>
                  <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "36px", fontWeight: 300, color: "var(--foreground)", marginBottom: "16px" }}>Inquiry Received!</h3>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "16px", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 32px" }}>
                    Thank you! Our trade team will contact you within 24 hours with wholesale pricing, product catalogue, and next steps.
                  </p>
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary" style={{ padding: "15px 40px", fontSize: "12px" }}>Also Chat on WhatsApp</button>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Company Info */}
                  <h4 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 500, color: "var(--foreground)", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
                    1. Company Information
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    {[
                      { label: "Company Name *", key: "companyName", type: "text", placeholder: "Your company name", required: true },
                      { label: "Contact Name *", key: "contactName", type: "text", placeholder: "Your full name", required: true },
                      { label: "Business Email *", key: "email", type: "email", placeholder: "business@company.com", required: true },
                      { label: "Phone / WhatsApp *", key: "phone", type: "tel", placeholder: "+1 555 000 0000", required: true },
                    ].map(({ label, key, type, placeholder, required }) => (
                      <div key={key}>
                        <label className="form-label">{label}</label>
                        <input required={required} type={type} className="form-control" placeholder={placeholder}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                      </div>
                    ))}
                    <div>
                      <label className="form-label">Business Type *</label>
                      <div className="select-wrapper">
                        <select required className="form-control" value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })}>
                          <option value="">Select business type</option>
                          {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Country *</label>
                      <div className="select-wrapper">
                        <select required className="form-control" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                          <option value="">Select country</option>
                          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "32px" }}>
                    <label className="form-label">Website / Instagram (Optional)</label>
                    <input className="form-control" placeholder="https://yourcompany.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                  </div>

                  {/* Inquiry Details */}
                  <h4 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 500, color: "var(--foreground)", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
                    2. Inquiry Details
                  </h4>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="form-label">Type of Inquiry *</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                      {["Bulk Order", "Sample Request", "Trade Pricing", "Become Dealer", "Private Label / OEM", "Hotel Project", "Custom Design", "Wholesale Catalogue"].map((type) => (
                        <button key={type} type="button" onClick={() => setForm({ ...form, inquiryType: type })}
                          style={{ padding: "8px 18px", border: `1.5px solid ${form.inquiryType === type ? "var(--primary)" : "var(--border)"}`, borderRadius: "9999px", background: form.inquiryType === type ? "var(--primary)" : "transparent", color: form.inquiryType === type ? "#fff" : "var(--foreground-muted)", fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease" }}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label className="form-label">Material Preference</label>
                      <div className="select-wrapper">
                        <select className="form-control" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}>
                          <option value="">Select material</option>
                          {["100% Wool", "Wool-Silk Blend", "New Zealand Wool", "Jute", "Cotton", "Bamboo Silk", "Recycled Fiber", "Custom / Mix"].map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Construction</label>
                      <div className="select-wrapper">
                        <select className="form-control" value={form.construction} onChange={(e) => setForm({ ...form, construction: e.target.value })}>
                          <option value="">Select construction</option>
                          {["Hand Knotted", "Hand Tufted", "Durrie / Flat Weave", "Jute Weave", "Custom"].map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Size(s) Required</label>
                      <input className="form-control" placeholder="e.g. 8×10 ft, 9×12 ft" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Quantity *</label>
                      <input required className="form-control" placeholder="e.g. 100 pieces" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Target Delivery Date</label>
                      <input type="date" className="form-control" value={form.targetDelivery} onChange={(e) => setForm({ ...form, targetDelivery: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Budget Range (Optional)</label>
                      <input className="form-control" placeholder="e.g. $10,000–$50,000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="form-label">Project Details</label>
                    <textarea className="form-control" rows={3} placeholder="Hotel name, project location, room count, design concept..." value={form.projectDetails} onChange={(e) => setForm({ ...form, projectDetails: e.target.value })} style={{ resize: "vertical" }} />
                  </div>
                  <div style={{ marginBottom: "32px" }}>
                    <label className="form-label">Message / Additional Requirements *</label>
                    <textarea required className="form-control" rows={4} placeholder="Tell us about your business, requirements, design preferences, or any questions..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ resize: "vertical" }} />
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2, justifyContent: "center", padding: "16px", fontSize: "13px", borderRadius: "var(--radius-md)", opacity: loading ? 0.7 : 1 }}>
                      {loading ? "Submitting…" : "Submit B2B Inquiry →"}
                    </button>
                    <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: "none" }}>
                      <button type="button" style={{ width: "100%", padding: "15px", background: "#25D366", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        WhatsApp
                      </button>
                    </a>
                  </div>

                  {/* Trust signals under form */}
                  <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", paddingTop: "20px", borderTop: "1px solid var(--border-light)", marginTop: "20px" }}>
                    {["🔒 Confidential", "⏱️ 24hr Response", "📋 No Obligation", "🌍 45+ Countries"].map((item) => (
                      <span key={item} style={{ fontSize: "12px", color: "var(--foreground-muted)", fontWeight: 500 }}>{item}</span>
                    ))}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FACTORY INTRODUCTION
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: "14px" }}>✦ &nbsp; About Our Factory</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em", marginBottom: "20px" }}>
                India&apos;s Premier Rug Manufacturing Facility
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--foreground-muted)", fontWeight: 300, marginBottom: "24px" }}>
                Founded in Jaipur — the rug-weaving capital of India — our factory combines 15+ years of artisan tradition with modern quality standards. We produce over 5,000 rugs annually for clients in 45+ countries, from small boutiques to the world&apos;s finest hotels.
              </p>
              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--foreground-muted)", fontWeight: 300, marginBottom: "32px" }}>
                Every product is made to order — no warehouse stock, no compromises. You work directly with our production team from design approval to door delivery.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {[
                  { num: "15+", label: "Years in Business" },
                  { num: "200+", label: "Master Artisans" },
                  { num: "5,000+", label: "Rugs Exported / Year" },
                  { num: "45+", label: "Countries Served" },
                ].map((stat) => (
                  <div key={stat.label} style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "20px 24px", border: "1px solid var(--border-light)" }}>
                    <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "36px", fontWeight: 300, color: "var(--primary)", lineHeight: 1 }}>{stat.num}</div>
                    <div style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "4px", fontWeight: 500, letterSpacing: "0.04em" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { icon: "🏭", title: "3 Production Units", desc: "Dedicated facilities for hand-knotted, hand-tufted, and flat-weave production." },
                { icon: "🔬", title: "In-House Dye Lab", desc: "Pantone-matched dye baths with D65 lighting verification for colour accuracy." },
                { icon: "📐", title: "Design Studio", desc: "Full CAD design team converts your ideas into technical weave specifications." },
                { icon: "📦", title: "Export Department", desc: "Dedicated export team handles all customs, documentation, and freight logistics." },
                { icon: "🌡️", title: "Climate-Controlled Washing", desc: "Temperature and pH-controlled washing baths protect fibre and colour integrity." },
                { icon: "🔒", title: "Secure Production", desc: "NDAs and confidentiality agreements standard for all private label clients." },
              ].map((item) => (
                <div key={item.title} style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", transition: "all 0.25s ease" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-green)"; el.style.boxShadow = "var(--shadow-sm)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", marginBottom: "6px" }}>{item.title}</h4>
                  <p style={{ fontSize: "12px", color: "var(--foreground-muted)", lineHeight: 1.6, fontWeight: 300 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MANUFACTURING CAPACITY
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "60px 0", background: "var(--primary)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 600, marginBottom: "12px" }}>✦ &nbsp; Production Scale</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>
              Manufacturing Capacity
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden" }}>
            {[
              { label: "Hand Knotted", capacity: "50–80 rugs/month", note: "Premium luxury segment" },
              { label: "Hand Tufted", capacity: "200–300 rugs/month", note: "Commercial & residential" },
              { label: "Flat Weave / Durrie", capacity: "400–600 pieces/month", note: "High-volume bulk orders" },
              { label: "Natural Fibre / Jute", capacity: "300–500 pieces/month", note: "Eco & sustainable range" },
            ].map((cap, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", padding: "28px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 600, marginBottom: "10px" }}>{cap.label}</div>
                <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 500, color: "#fff", marginBottom: "6px" }}>{cap.capacity}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{cap.note}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "20px" }}>
            Rush production available for urgent orders. Contact us for specific timelines.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRADE BENEFITS
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p className="eyebrow" style={{ marginBottom: "14px" }}>✦ &nbsp; Why Partner With Us</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Trade Programme Benefits
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {TRADE_BENEFITS.map((b) => (
              <div key={b.title} style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "32px 28px", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--gold)"; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{b.icon}</div>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 500, color: "var(--foreground)", marginBottom: "10px" }}>{b.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--foreground-muted)", lineHeight: 1.7, fontWeight: 300 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MANUFACTURING PROCESS
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p className="eyebrow" style={{ marginBottom: "14px" }}>✦ &nbsp; Our Factory Process</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              From Design to Your Door
            </h2>
            <p style={{ color: "var(--foreground-muted)", fontSize: "15px", maxWidth: "520px", margin: "16px auto 0", lineHeight: 1.7 }}>
              Full transparency at every production stage. Photo updates sent at each milestone.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {MANUFACTURING_STEPS.map((step, i) => (
              <div key={step.step} style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "28px 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-8px", right: "16px", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "72px", fontWeight: 300, color: "var(--primary-pale)", lineHeight: 1, pointerEvents: "none" }}>{step.step}</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, marginBottom: "14px" }}>{i + 1}</div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>{step.title}</h3>
                  <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>⏱ {step.time}</div>
                  <p style={{ fontSize: "13px", color: "var(--foreground-muted)", lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          QUALITY CONTROL
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p className="eyebrow" style={{ marginBottom: "14px" }}>✦ &nbsp; Our Standards</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Quality Control Process
            </h2>
            <p style={{ color: "var(--foreground-muted)", fontSize: "15px", maxWidth: "520px", margin: "16px auto 0", lineHeight: 1.7 }}>
              Every rug passes a rigorous 6-stage quality inspection before shipment. Photo updates at every milestone.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {QUALITY_CONTROL.map((qc) => (
              <div key={qc.title} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "24px", background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-green)"; el.style.boxShadow = "var(--shadow-md)"; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: "28px", flexShrink: 0, marginTop: "2px" }}>{qc.icon}</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "6px" }}>{qc.title}</h3>
                  <p style={{ fontSize: "13px", color: "var(--foreground-muted)", lineHeight: 1.65, fontWeight: 300 }}>{qc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MOQ INFORMATION (no public prices — inquiry required)
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="eyebrow" style={{ marginBottom: "14px" }}>✦ &nbsp; Production Minimums</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              MOQ & Lead Times
            </h2>
            <p style={{ color: "var(--foreground-muted)", fontSize: "15px", maxWidth: "520px", margin: "16px auto 0", lineHeight: 1.7 }}>
              We offer competitive trade pricing exclusively through direct inquiry. Submit your requirements for a personalised quote.
            </p>
          </div>
          <div style={{ background: "var(--surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--primary)" }}>
                  {["Construction Method", "Min. Order Qty", "Lead Time", "Pricing"].map((h) => (
                    <th key={h} style={{ padding: "14px 20px", color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOQ_INFO.map((row, i) => (
                  <tr key={row.construction} style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--surface-alt)", borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--foreground)", fontSize: "14px" }}>{row.construction}</td>
                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "var(--foreground-muted)" }}>{row.moq}</td>
                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "var(--foreground-muted)" }}>{row.leadTime}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <a href="#b2b-form" style={{ display: "inline-block", padding: "6px 16px", background: "var(--primary-pale)", border: "1px solid var(--border-green)", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>
                        Inquire for Pricing →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, var(--primary-pale) 0%, rgba(184,151,90,0.05) 100%)", borderTop: "1px solid var(--border-green)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <p style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 500 }}>
                ✦ Trade pricing is shared exclusively with registered trade clients after inquiry. Volume discounts apply for 10+, 50+, and 100+ pieces.
              </p>
              <a href="#b2b-form" style={{ textDecoration: "none" }}>
                <button style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Get Trade Pricing →
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CERTIFICATIONS
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p className="eyebrow" style={{ marginBottom: "14px" }}>✦ &nbsp; Quality & Compliance</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Certifications & Standards
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.title} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "24px", background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-green)"; el.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "28px", flexShrink: 0, marginTop: "2px" }}>{cert.icon}</div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "6px" }}>{cert.title}</h3>
                  <p style={{ fontSize: "13px", color: "var(--foreground-muted)", lineHeight: 1.65, fontWeight: 300 }}>{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EXPORT MARKETS
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "var(--charcoal)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "14px" }}>✦ &nbsp; Global Export Network</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>
              We Export to 45+ Countries
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {EXPORT_MARKETS.map((market) => (
              <div key={market.country} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-lg)", padding: "20px", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(184,151,90,0.12)"; el.style.borderColor = "rgba(184,151,90,0.3)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.05)"; el.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{market.flag}</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{market.country}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{market.detail}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>+ 37 more countries · Contact us for your specific shipping requirements</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHO WE SERVE
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="eyebrow" style={{ marginBottom: "14px" }}>✦ &nbsp; Trade Partners</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Who We Work With
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { icon: "🏛️", title: "Interior Designers", desc: "Trade pricing, samples, exclusive collections, and dedicated account managers." },
              { icon: "📐", title: "Architects", desc: "Bespoke specifications, technical drawings, installation support, and project delivery." },
              { icon: "🏨", title: "Hotels & Resorts", desc: "Commercial-grade rugs for high-traffic. Full project management included." },
              { icon: "🏪", title: "Retail Stores", desc: "Wholesale pricing, drop shipping, private label, and exclusive product lines." },
              { icon: "📦", title: "Importers & Distributors", desc: "Factory-direct sourcing, bulk pricing, and full export documentation." },
              { icon: "🏗️", title: "Developers", desc: "Luxury fit-out solutions for residential and commercial development projects." },
              { icon: "💻", title: "Online Retailers", desc: "White-label products, dropshipping partnerships, and exclusive digital catalogues." },
              { icon: "🌍", title: "Exporters", desc: "Back-to-back export arrangements with all customs and documentation handled." },
            ].map((item) => (
              <div key={item.title} style={{ padding: "24px 20px", background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-green)"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{item.icon}</div>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "18px", fontWeight: 500, color: "var(--foreground)", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "var(--foreground-muted)", lineHeight: 1.6, fontWeight: 300 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "80px 0", background: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)", textAlign: "center" }}>
        <div className="container">
          <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 600, marginBottom: "16px" }}>✦ &nbsp; Ready to Start?</p>
          <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em", marginBottom: "20px" }}>
            Let&apos;s Build Something<br />
            <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Extraordinary Together</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "16px", maxWidth: "460px", margin: "0 auto 36px", lineHeight: 1.7 }}>
            Join 500+ trade partners worldwide. Our team is ready to help you source, design, and deliver world-class handmade rugs.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#b2b-form" style={{ textDecoration: "none" }}>
              <button style={{ padding: "16px 40px", background: "var(--gold)", color: "var(--foreground)", border: "none", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 20px rgba(184,151,90,0.4)" }}>
                Submit Trade Inquiry
              </button>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={{ padding: "15px 36px", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                WhatsApp Trade Team
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
