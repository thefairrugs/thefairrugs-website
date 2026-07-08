import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "rgba(255,255,255,.95)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #ebe5dd",
      }}
    >
      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
          padding: "18px 45px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#3B2A1D",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "34px",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              THE FAIR RUGS
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#8B5E3C",
                letterSpacing: "4px",
                marginTop: "2px",
              }}
            >
              HANDMADE • LUXURY • CUSTOM
            </div>
          </div>
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "34px",
          }}
        >
          <Link href="/" style={linkStyle}>
            Home
          </Link>

          <Link href="/shop" style={linkStyle}>
            Shop
          </Link>

          <Link href="/custom-rug" style={linkStyle}>
            Custom Rugs
          </Link>

          <Link href="/about" style={linkStyle}>
            About
          </Link>

          <Link href="/contact" style={linkStyle}>
            Contact
          </Link>
        </nav>

        <div
          style={{
            display: "flex",
            gap: "14px",
          }}
        >
          <a
            href="https://wa.me/"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              style={{
                background: "#fff",
                color: "#8B5E3C",
                border: "1px solid #8B5E3C",
                padding: "13px 22px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              WhatsApp
            </button>
          </a>

          <button
            style={{
              background:
                "linear-gradient(135deg,#8B5E3C,#6E472D)",
              color: "#fff",
              border: "none",
              padding: "13px 28px",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: 700,
              boxShadow:
                "0 12px 25px rgba(139,94,60,.25)",
            }}
          >
            Get Quote
          </button>
        </div>
      </div>
    </header>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "#444",
  fontWeight: 600,
  fontSize: "16px",
};