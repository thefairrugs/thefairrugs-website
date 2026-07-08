"use client";

const badges = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path d="M24 4L6 14v12c0 10 7.5 19 18 22 10.5-3 18-12 18-22V14L24 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M16 24l6 6 10-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Quality Guaranteed",
    desc: "Every rug is inspected by our quality team before dispatch.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M14 24h20M24 8v32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M14 14l20 20M34 14L14 34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.3"/>
      </svg>
    ),
    title: "Free Worldwide Shipping",
    desc: "Complimentary door-to-door delivery to 45+ countries.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect x="8" y="14" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 20h32" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="16" cy="28" r="2" fill="currentColor"/>
        <path d="M22 28h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Secure Payment",
    desc: "Bank-level encryption protects every transaction.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path d="M24 8l3 9h9l-7.5 5.5 2.9 9L24 27l-7.4 4.5 2.9-9L12 17h9l3-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M10 42h28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M18 36l6-9 6 9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeOpacity="0.4"/>
      </svg>
    ),
    title: "Artisan Certified",
    desc: "Crafted by certified master weavers in Jaipur, India.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path d="M24 10c-7.7 0-14 6.3-14 14v14h28V24c0-7.7-6.3-14-14-14z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M17 24h14M24 17v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Custom Every Time",
    desc: "Any size, shape, or design — crafted precisely to your specs.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path d="M8 36l7-14 7 8 6-10 9 16H8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="34" cy="16" r="5" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
    title: "Production Updates",
    desc: "Photo updates at every stage — from loom to delivery.",
  },
];

export default function TrustBadges() {
  return (
    <section
      style={{
        padding: "80px 0",
        background: "var(--surface)",
        borderTop: "1px solid var(--border-light)",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "0",
          }}
        >
          {badges.map((badge, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "36px 24px",
                borderRight: i < badges.length - 1 ? "1px solid var(--border-light)" : "none",
                transition: "all 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--surface-alt)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  color: "var(--primary)",
                  marginBottom: "16px",
                  opacity: 0.85,
                }}
              >
                {badge.icon}
              </div>

              <h4
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  letterSpacing: "-0.01em",
                  marginBottom: "8px",
                  lineHeight: 1.3,
                }}
              >
                {badge.title}
              </h4>

              <p
                style={{
                  fontSize: "12px",
                  color: "var(--foreground-muted)",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .trust-badges-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .trust-badges-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
