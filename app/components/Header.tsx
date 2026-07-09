"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/custom-rug", label: "Custom Rugs" },
  { href: "/b2b", label: "B2B / Wholesale" },
  { href: "/about", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const WA_URL = "https://wa.me/918416919470?text=Hello%2C%20I%27m%20interested%20in%20your%20luxury%20handmade%20rugs.";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        style={{
          background: "var(--primary-dark)",
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          padding: "10px 20px",
          fontSize: "11.5px",
          letterSpacing: "0.18em",
          fontWeight: 500,
        }}
      >
        <span style={{ color: "var(--gold-light)", marginRight: "10px" }}>✦</span>
        FREE WORLDWIDE SHIPPING ON ALL ORDERS
        <span style={{ color: "var(--gold-light)", margin: "0 10px" }}>✦</span>
        HANDCRAFTED IN INDIA
        <span style={{ color: "var(--gold-light)", margin: "0 10px" }}>✦</span>
        3–5 WEEK PRODUCTION TIME
        <span style={{ color: "var(--gold-light)", marginLeft: "10px" }}>✦</span>
      </div>

      {/* Main Header */}
      <header
        className="header-blur"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          background: scrolled
            ? "rgba(248,246,240,0.97)"
            : "rgba(248,246,240,0.93)",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: scrolled ? "70px" : "86px",
            transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ textDecoration: "none", color: "var(--foreground)" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: scrolled ? "24px" : "28px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "var(--foreground)",
                  lineHeight: 1,
                  transition: "font-size 0.35s ease",
                }}
              >
                THE FAIR RUGS
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: "var(--primary)",
                  letterSpacing: "0.3em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Handmade &nbsp;·&nbsp; Luxury &nbsp;·&nbsp; Custom
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
            }}
            className="nav-desktop"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: isActive ? "var(--primary)" : "var(--foreground-muted)",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    position: "relative",
                    paddingBottom: "3px",
                    transition: "color 0.2s ease",
                    borderBottom: isActive ? "1.5px solid var(--primary)" : "1.5px solid transparent",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      isActive ? "var(--primary)" : "var(--foreground-muted)")
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
            className="cta-desktop"
          >
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button
                className="btn btn-ghost"
                style={{
                  fontSize: "11px",
                  padding: "10px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1.5px solid var(--border-green)",
                  color: "var(--primary)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </button>
            </a>

            <Link href="/contact" style={{ textDecoration: "none" }}>
              <button
                className="btn btn-primary"
                style={{ fontSize: "11px", padding: "11px 22px" }}
              >
                Get a Quote
              </button>
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" style={{ textDecoration: "none", position: "relative", display: "flex", alignItems: "center" }}>
              <button
                className="btn btn-ghost"
                style={{ fontSize: "11px", padding: "10px 14px", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", gap: "6px", position: "relative" }}
                title="Shopping Cart"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {totalItems > 0 && (
                  <span style={{
                    position: "absolute", top: "-6px", right: "-6px",
                    background: "var(--primary)", color: "#fff",
                    borderRadius: "50%", width: "18px", height: "18px",
                    fontSize: "10px", fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}>{totalItems > 9 ? "9+" : totalItems}</span>
                )}
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              flexDirection: "column",
              gap: "5px",
            }}
            aria-label="Toggle menu"
          >
            <span
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                background: "var(--foreground)",
                transition: "all 0.3s ease",
                transform: mobileOpen ? "rotate(45deg) translate(5px,5px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                background: "var(--foreground)",
                transition: "all 0.3s ease",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                background: "var(--foreground)",
                transition: "all 0.3s ease",
                transform: mobileOpen ? "rotate(-45deg) translate(5px,-5px)" : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              background: "var(--warm-white)",
              borderTop: "1px solid var(--border)",
              padding: "20px 24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: pathname === link.href ? "var(--primary)" : "var(--foreground)",
                  fontWeight: pathname === link.href ? 600 : 500,
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  textDecoration: "none",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  className="btn btn-ghost"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    color: "var(--primary)",
                    borderColor: "var(--border-green)",
                  }}
                >
                  WhatsApp Us
                </button>
              </a>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Get a Quote
                </button>
              </Link>
              <Link href="/cart" style={{ textDecoration: "none" }}>
                <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", borderColor: "var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
                  🛒 Cart {totalItems > 0 && `(${totalItems})`}
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 1100px) {
          .nav-desktop { display: none !important; }
          .cta-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
