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

const trade_benefits = [
  {
    icon: "💰",
    title: "Trade Pricing",
    desc: "Exclusive wholesale and trade pricing for registered businesses. Save 20–40% compared to retail.",
  },
  {
    icon: "🎨",
    title: "Private Label",
    desc: "Launch your own rug brand. We manufacture to your specifications, labels, and packaging.",
  },
  {
    icon: "🏭",
    title: "OEM Manufacturing",
    desc: "Custom manufacturing with your designs, materials, and construction specifications.",
  },
  {
    icon: "📦",
    title: "Bulk Orders",
    desc: "From 10 to 10,000 rugs. Consistent quality across large orders with dedicated QC.",
  },
  {
    icon: "🏨",
    title: "Hotel & Hospitality",
    desc: "Specialist solutions for hotels, resorts, and commercial spaces. Project management included.",
  },
  {
    icon: "🧾",
    title: "Sample Programme",
    desc: "Request samples before committing to bulk orders. Trade clients receive samples at cost.",
  },
];

export default function B2BContent() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    businessType: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    website: "",
    // Order details
    inquiryType: "",
    material: "",
    construction: "",
    size: "",
    quantity: "",
    targetDelivery: "",
    budget: "",
    projectDetails: "",
    message: "",
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
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #1c2c15 0%, #2a3a20 50%, #354430 100%)",
        padding: "100px 0 110px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 60%, rgba(184,151,90,0.12) 0%, transparent 55%), radial-gradient(circle at 80% 40%, rgba(122,143,106,0.1) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "680px" }}>
            <p style={{
              fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase",
              color: "var(--gold-light)", fontWeight: 600, marginBottom: "20px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
              Trade & Wholesale Programme
            </p>
            <h1 style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(44px, 6vw, 76px)",
              fontWeight: 300, color: "#fff",
              letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: "28px",
            }}>
              Partner with the<br />
              <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>World&apos;s Best</em><br />
              Rug Manufacturers
            </h1>
            <p style={{
              fontSize: "18px", lineHeight: 1.8,
              color: "rgba(255,255,255,0.65)", fontWeight: 300, maxWidth: "560px",
            }}>
              The Fair Rugs offers comprehensive B2B solutions for interior designers, architects, hotels, retailers, and importers worldwide. Factory-direct quality, trade pricing, and dedicated support.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "40px", flexWrap: "wrap" }}>
              <a href="#b2b-form">
                <button className="btn btn-gold" style={{ padding: "17px 40px", fontSize: "12px", letterSpacing: "0.1em" }}>
                  Submit B2B Inquiry
                </button>
              </a>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                <button style={{
                  background: "transparent", color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  padding: "16px 36px", borderRadius: "9999px",
                  fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer",
                }}>
                  WhatsApp Trade Team
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "60px 0", background: "var(--charcoal)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
            {[
              { value: "500+", label: "Trade Clients" },
              { value: "45+", label: "Countries Served" },
              { value: "15+", label: "Years Experience" },
              { value: "5,000+", label: "Rugs Delivered" },
            ].map((stat) => (
              <div key={stat.label} style={{
                textAlign: "center", padding: "32px 20px",
                borderRight: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "48px", fontWeight: 300, color: "var(--gold-light)",
                  letterSpacing: "-0.02em", lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "8px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section style={{ padding: "100px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; Trade Partners</p>
            <h2 style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 300,
              color: "var(--foreground)", letterSpacing: "-0.02em",
            }}>
              Who We Work With
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {[
              { icon: "🏛️", title: "Interior Designers", desc: "Trade pricing, samples, exclusive collections, and dedicated account managers." },
              { icon: "📐", title: "Architects", desc: "Bespoke specifications, technical drawings, installation support, and project delivery." },
              { icon: "🏨", title: "Hotels & Resorts", desc: "Commercial-grade rugs built for high-traffic. Full project from concept to installation." },
              { icon: "🏪", title: "Retail Stores", desc: "Wholesale pricing, drop shipping, private label, and exclusive product lines." },
              { icon: "📦", title: "Importers & Distributors", desc: "Factory-direct sourcing, bulk pricing, custom packaging, and export documentation." },
              { icon: "🏗️", title: "Developers", desc: "Luxury fit-out solutions for residential and commercial development projects." },
              { icon: "🎭", title: "Event Companies", desc: "Temporary and permanent event installations, themed collections, and quick turnaround." },
              { icon: "🌍", title: "Online Retailers", desc: "White-label products, dropshipping partnerships, and exclusive digital catalogues." },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "28px 24px",
                  background: "var(--surface)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-lg)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-green)";
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-light)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{item.icon}</div>
                <h3 style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "22px", fontWeight: 500,
                  color: "var(--foreground)", marginBottom: "10px",
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--foreground-muted)", lineHeight: 1.65, fontWeight: 300 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trade Benefits */}
      <section style={{ padding: "100px 0", background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; Trade Benefits</p>
            <h2 style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 300,
              color: "var(--foreground)", letterSpacing: "-0.02em",
            }}>
              What We Offer
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {trade_benefits.map((benefit) => (
              <div
                key={benefit.title}
                style={{
                  padding: "36px 32px",
                  background: "var(--surface)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-xl)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--gold)";
                  el.style.boxShadow = "0 0 0 1px var(--gold-pale), var(--shadow-lg)";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-light)";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "20px" }}>{benefit.icon}</div>
                <h3 style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "26px", fontWeight: 500,
                  color: "var(--foreground)", marginBottom: "12px",
                }}>
                  {benefit.title}
                </h3>
                <p style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Form */}
      <section id="b2b-form" style={{ padding: "100px 0", background: "var(--background)" }}>
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; Get Started</p>
              <h2 style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 300,
                color: "var(--foreground)", letterSpacing: "-0.02em", marginBottom: "16px",
              }}>
                Submit Your B2B Inquiry
              </h2>
              <p style={{ color: "var(--foreground-muted)", fontSize: "16px", lineHeight: 1.7 }}>
                Fill in the form below and our trade team will get back to you within 24 hours with pricing and availability.
              </p>
            </div>

            <div style={{
              background: "var(--surface)", border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-xl)", padding: "52px",
              boxShadow: "var(--shadow-lg)",
            }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "64px", marginBottom: "24px" }}>🤝</div>
                  <h3 style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "36px", fontWeight: 300, color: "var(--foreground)", marginBottom: "16px",
                  }}>
                    Inquiry Received!
                  </h3>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "16px", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 32px" }}>
                    Thank you for your interest in The Fair Rugs trade programme. Our team will contact you within 24 hours with pricing and next steps.
                  </p>
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary" style={{ padding: "15px 40px", fontSize: "12px" }}>
                      Also Chat on WhatsApp
                    </button>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Company Info */}
                  <h4 style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "24px", fontWeight: 500, color: "var(--foreground)",
                    marginBottom: "24px", paddingBottom: "12px",
                    borderBottom: "1px solid var(--border-light)",
                  }}>
                    Company Information
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                    <div>
                      <label className="form-label">Company Name *</label>
                      <input required className="form-control" placeholder="Your company name"
                        value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Business Type *</label>
                      <div className="select-wrapper">
                        <select required className="form-control"
                          value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })}>
                          <option value="">Select business type</option>
                          {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Contact Name *</label>
                      <input required className="form-control" placeholder="Your full name"
                        value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Email *</label>
                      <input required type="email" className="form-control" placeholder="business@company.com"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Phone *</label>
                      <input required type="tel" className="form-control" placeholder="+1 555 000 0000"
                        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Country *</label>
                      <div className="select-wrapper">
                        <select required className="form-control"
                          value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                          <option value="">Select country</option>
                          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "36px" }}>
                    <label className="form-label">Website / Instagram (Optional)</label>
                    <input className="form-control" placeholder="https://yourcompany.com"
                      value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                  </div>

                  {/* Order Details */}
                  <h4 style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "24px", fontWeight: 500, color: "var(--foreground)",
                    marginBottom: "24px", paddingBottom: "12px",
                    borderBottom: "1px solid var(--border-light)",
                  }}>
                    Inquiry Details
                  </h4>
                  <div style={{ marginBottom: "20px" }}>
                    <label className="form-label">Type of Inquiry *</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
                      {[
                        "Bulk Order", "Sample Request", "Trade Pricing",
                        "Become Dealer", "Private Label / OEM", "Hotel Project",
                        "Custom Design", "Wholesale Catalogue",
                      ].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setForm({ ...form, inquiryType: type })}
                          style={{
                            padding: "8px 18px",
                            border: `1.5px solid ${form.inquiryType === type ? "var(--primary)" : "var(--border)"}`,
                            borderRadius: "9999px",
                            background: form.inquiryType === type ? "var(--primary)" : "transparent",
                            color: form.inquiryType === type ? "#fff" : "var(--foreground-muted)",
                            fontSize: "12px", fontWeight: 500, cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                    <div>
                      <label className="form-label">Material Preference</label>
                      <div className="select-wrapper">
                        <select className="form-control"
                          value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}>
                          <option value="">Select material</option>
                          <option>100% Wool</option>
                          <option>Wool-Silk Blend</option>
                          <option>New Zealand Wool</option>
                          <option>Jute</option>
                          <option>Cotton</option>
                          <option>Bamboo Silk</option>
                          <option>Recycled Fiber</option>
                          <option>Custom / Mix</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Construction</label>
                      <div className="select-wrapper">
                        <select className="form-control"
                          value={form.construction} onChange={(e) => setForm({ ...form, construction: e.target.value })}>
                          <option value="">Select construction</option>
                          <option>Hand Knotted</option>
                          <option>Hand Tufted</option>
                          <option>Durrie / Flat Weave</option>
                          <option>Jute Weave</option>
                          <option>Custom</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Size(s) Required</label>
                      <input className="form-control" placeholder="e.g. 8×10 ft, 9×12 ft"
                        value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Quantity *</label>
                      <input required className="form-control" placeholder="e.g. 100 pieces"
                        value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Target Delivery Date</label>
                      <input type="date" className="form-control"
                        value={form.targetDelivery} onChange={(e) => setForm({ ...form, targetDelivery: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Budget (Optional)</label>
                      <input className="form-control" placeholder="e.g. $10,000–$50,000"
                        value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label className="form-label">Project Details</label>
                    <textarea
                      className="form-control" rows={3}
                      placeholder="Hotel name, project location, room count, design concept..."
                      value={form.projectDetails}
                      onChange={(e) => setForm({ ...form, projectDetails: e.target.value })}
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  <div style={{ marginBottom: "36px" }}>
                    <label className="form-label">Additional Message *</label>
                    <textarea
                      required className="form-control" rows={4}
                      placeholder="Tell us about your business, your requirements, design preferences, or any questions..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "16px" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{
                        flex: 2, justifyContent: "center",
                        padding: "18px", fontSize: "13px",
                        borderRadius: "var(--radius-md)",
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      {loading ? "Submitting..." : "Submit B2B Inquiry"}
                    </button>
                    <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: "none" }}>
                      <button type="button" style={{
                        width: "100%", padding: "17px",
                        background: "#25D366", color: "#fff",
                        border: "none", borderRadius: "var(--radius-md)",
                        fontSize: "13px", fontWeight: 600,
                        letterSpacing: "0.06em", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </button>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
