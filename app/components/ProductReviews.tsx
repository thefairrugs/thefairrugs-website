"use client";

import { useState, useEffect, useCallback } from "react";

interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerCountry: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

interface Props {
  productId: string;
  productTitle: string;
}

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ color: "#d4ac0d", fontSize: `${size}px`, letterSpacing: "1px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ opacity: i <= rating ? 1 : 0.2 }}>★</span>
      ))}
    </span>
  );
}

export default function ProductReviews({ productId, productTitle }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerCountry: "",
    rating: 5,
    title: "",
    body: "",
  });

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productTitle,
          productSlug: productId,
          ...form,
          verifiedPurchase: false,
        }),
      });
      setSubmitted(true);
      setShowForm(false);
      setForm({ customerName: "", customerCountry: "", rating: 5, title: "", body: "" });
      // Don't immediately reload — review needs approval
    } catch {
      // Silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rv) => rv.rating === r).length,
  }));

  return (
    <section style={{ padding: "80px 0", background: "var(--background)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "64px", alignItems: "start" }}>
          {/* Summary */}
          <div>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>✦ &nbsp; Customer Reviews</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
              <span style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "56px", fontWeight: 300, color: "var(--foreground)", lineHeight: 1,
              }}>
                {reviews.length > 0 ? avgRating.toFixed(1) : "—"}
              </span>
              <div>
                <StarDisplay rating={Math.round(avgRating)} size={18} />
                <div style={{ fontSize: "13px", color: "var(--foreground-muted)", marginTop: "4px" }}>
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </div>
              </div>
            </div>

            {/* Rating breakdown bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "28px" }}>
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--foreground-muted)", width: "12px", textAlign: "right" }}>{rating}</span>
                  <span style={{ color: "#d4ac0d", fontSize: "11px" }}>★</span>
                  <div style={{ flex: 1, height: "6px", background: "var(--border-light)", borderRadius: "9999px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%",
                      background: "var(--gold)",
                      borderRadius: "9999px",
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--foreground-muted)", width: "20px" }}>{count}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                width: "100%", padding: "14px 20px",
                background: "var(--primary)", color: "#fff",
                border: "none", borderRadius: "var(--radius-full)",
                fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", cursor: "pointer",
              }}
            >
              Write a Review
            </button>

            {submitted && (
              <div style={{ marginTop: "12px", padding: "12px 16px", background: "#d1fae5", borderRadius: "var(--radius-md)", fontSize: "13px", color: "#065f46", fontWeight: 500 }}>
                ✓ Thank you! Your review is pending approval.
              </div>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "14px", background: "var(--surface)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "6px" }}>Your Rating *</label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, rating: s })}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "28px", color: s <= form.rating ? "#d4ac0d" : "#d1d5db", padding: "2px", lineHeight: 1 }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { key: "customerName", label: "Your Name *", placeholder: "Jane D.", required: true },
                  { key: "customerCountry", label: "Country", placeholder: "United States", required: false },
                  { key: "title", label: "Review Title", placeholder: "Excellent quality!", required: false },
                ].map(({ key, label, placeholder, required }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "6px" }}>{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      required={required}
                      value={form[key as keyof typeof form] as string}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "14px", outline: "none", background: "#fff" }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "6px" }}>Your Review *</label>
                  <textarea
                    rows={4}
                    placeholder="Share your experience with this rug..."
                    required
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "14px", outline: "none", resize: "vertical", background: "#fff" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" disabled={submitting} style={{ flex: 1, padding: "12px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 700, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? "Submitting…" : "Submit Review"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: "12px 18px", background: "transparent", color: "var(--foreground-muted)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "13px", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Reviews List */}
          <div>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--foreground-muted)" }}>Loading reviews…</div>
            ) : reviews.length === 0 ? (
              <div style={{ padding: "60px 0", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "28px", fontWeight: 300, color: "var(--foreground)", marginBottom: "8px" }}>
                  No Reviews Yet
                </h3>
                <p style={{ color: "var(--foreground-muted)", fontSize: "15px" }}>
                  Be the first to share your experience with this rug.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      padding: "28px",
                      background: "var(--surface)",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border-light)",
                      transition: "box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <StarDisplay rating={review.rating} size={15} />
                          {review.verifiedPurchase && (
                            <span style={{ fontSize: "11px", background: "#d1fae5", color: "#065f46", padding: "2px 10px", borderRadius: "9999px", fontWeight: 700, letterSpacing: "0.05em" }}>
                              ✓ Verified Purchase
                            </span>
                          )}
                          {review.featured && (
                            <span style={{ fontSize: "11px", background: "var(--primary-pale)", color: "var(--primary)", padding: "2px 10px", borderRadius: "9999px", fontWeight: 700 }}>
                              Featured
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: "linear-gradient(135deg, var(--primary) 0%, var(--gold) 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: "13px", fontWeight: 700, flexShrink: 0,
                          }}>
                            {review.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{review.customerName}</span>
                            {review.customerCountry && (
                              <span style={{ fontSize: "13px", color: "var(--foreground-muted)", marginLeft: "6px" }}>· {review.customerCountry}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>
                        {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    </div>

                    {review.title && (
                      <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "8px" }}>
                        {review.title}
                      </h4>
                    )}
                    <p style={{ fontSize: "15px", color: "var(--foreground-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                      {review.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
