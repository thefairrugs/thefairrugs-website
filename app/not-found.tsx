import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background)",
          padding: "80px 24px",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "120px", fontWeight: 200, lineHeight: 1,
            color: "var(--border)", marginBottom: "8px",
            letterSpacing: "-0.04em",
          }}>
            404
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 300, color: "var(--foreground)",
            letterSpacing: "-0.02em", lineHeight: 1.2,
            marginBottom: "16px",
          }}>
            Page Not Found
          </h1>
          <p style={{
            fontSize: "17px", color: "var(--foreground-muted)",
            maxWidth: "440px", lineHeight: 1.7,
            fontWeight: 300, marginBottom: "40px",
          }}>
            The page you&apos;re looking for may have been moved, renamed, or no longer exists.
            Let&apos;s get you back to something beautiful.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/shop" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary" style={{ padding: "15px 36px", fontSize: "12px", letterSpacing: "0.1em" }}>
                Browse All Rugs
              </button>
            </Link>
            <Link href="/" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "14px 36px",
                background: "transparent",
                color: "var(--primary)",
                border: "1.5px solid var(--primary)",
                borderRadius: "9999px",
                fontSize: "12px", fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer",
              }}>
                Go to Homepage
              </button>
            </Link>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: "60px" }}>
            <p style={{ fontSize: "11px", color: "var(--foreground-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: "20px" }}>
              You might be looking for
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { label: "Custom Rugs", href: "/custom-rug" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "B2B", href: "/b2b" },
                { label: "FAQ", href: "/faq" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: "13px",
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--border-green)",
                    paddingBottom: "2px",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
