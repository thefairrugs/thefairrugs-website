"use client";

import { useState } from "react";

const WA_URL = "https://wa.me/918416919470?text=Hello%2C%20I%27d%20like%20to%20make%20an%20inquiry%20about%20your%20rugs.";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Italy", "Spain", "Netherlands", "UAE", "Singapore",
  "New Zealand", "India", "Other",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", country: "",
    product: "", size: "", quantity: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...form }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        textAlign: "center", padding: "60px 24px",
        background: "var(--surface)", borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-lg)",
      }}>
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
        <h3 style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "32px", fontWeight: 300, color: "var(--foreground)", marginBottom: "16px",
        }}>
          Message Sent Successfully!
        </h3>
        <p style={{ color: "var(--foreground-muted)", fontSize: "16px", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 28px" }}>
          Thank you for reaching out. Our team will get back to you within 24 hours. For urgent inquiries, please WhatsApp us.
        </p>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary" style={{ padding: "14px 36px", fontSize: "12px" }}>
            Chat on WhatsApp
          </button>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label className="form-label">Full Name *</label>
          <input
            required
            className="form-control"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            required
            className="form-control"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            placeholder="+1 555 000 0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="form-label">Country</label>
          <div className="select-wrapper">
            <select
              className="form-control"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Product Interest</label>
          <div className="select-wrapper">
            <select
              className="form-control"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
            >
              <option value="">Select product type</option>
              <option value="Hand Knotted">Hand Knotted Rug</option>
              <option value="Hand Tufted">Hand Tufted Rug</option>
              <option value="Durrie">Durrie / Flat Weave</option>
              <option value="Jute">Jute Rug</option>
              <option value="Custom">Custom Design</option>
              <option value="B2B">B2B / Wholesale</option>
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Size Required</label>
          <input
            className="form-control"
            placeholder="e.g. 8×10 ft or custom"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
          />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label className="form-label">Quantity</label>
        <input
          className="form-control"
          placeholder="e.g. 1 rug or 50 pieces for wholesale"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <label className="form-label">Message *</label>
        <textarea
          required
          className="form-control"
          rows={5}
          placeholder="Tell us about your project, requirements, budget, timeline, or any questions you have..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ resize: "vertical", fontFamily: "var(--font-jost), system-ui, sans-serif" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{
          width: "100%", justifyContent: "center",
          padding: "18px", fontSize: "13px",
          borderRadius: "var(--radius-md)",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "var(--foreground-muted)" }}>
        We respond within 24 hours · Your information is kept private
      </p>
    </form>
  );
}
