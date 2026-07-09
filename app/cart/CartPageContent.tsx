"use client";

import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPageContent() {
  const { items, totalItems, subtotal, removeItem, updateQty, clearCart } = useCart();

  if (totalItems === 0) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "60px 20px" }}>
        <div style={{ fontSize: "72px", marginBottom: "24px" }}>🧶</div>
        <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "42px", fontWeight: 300, color: "var(--foreground)", marginBottom: "16px" }}>
          Your cart is empty
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: "16px", marginBottom: "36px", textAlign: "center", maxWidth: "400px", lineHeight: 1.7 }}>
          Explore our handcrafted rug collection and add a piece that speaks to your space.
        </p>
        <Link href="/shop" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary" style={{ padding: "16px 48px", fontSize: "13px", letterSpacing: "0.08em" }}>
            Browse Collection
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "60vh", padding: "60px 0 100px" }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Shopping Cart
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px", marginTop: "8px" }}>
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "40px", alignItems: "start" }}>
          {/* Items */}
          <div>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 48px", gap: "16px", padding: "10px 0", borderBottom: "1px solid var(--border)", marginBottom: "8px" }}>
              {["", "Product", "Price", "Qty", ""].map((h, i) => (
                <span key={i} style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)" }}>{h}</span>
              ))}
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 48px", gap: "16px", alignItems: "center", padding: "20px 0", borderBottom: "1px solid var(--border-light)" }}
              >
                {/* Image */}
                <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", position: "relative", background: "var(--surface-alt)", flexShrink: 0 }}>
                  <Image src={item.productImage} alt={item.productTitle} fill sizes="80px" style={{ objectFit: "cover" }} />
                </div>

                {/* Info */}
                <div>
                  <Link href={`/products/${item.productSlug}`} style={{ textDecoration: "none", color: "var(--foreground)", fontWeight: 600, fontSize: "15px", fontFamily: "var(--font-cormorant), Georgia, serif" }}>
                    {item.productTitle}
                  </Link>
                  <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "4px" }}>
                    {item.construction} · {item.material}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--primary)", marginTop: "2px", fontWeight: 600 }}>
                    Size: {item.sizeLabel}
                  </p>
                </div>

                {/* Unit price */}
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>
                  ${Math.round(item.unitPrice).toLocaleString()}
                </div>

                {/* Qty controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
                  >−</button>
                  <span style={{ fontSize: "15px", fontWeight: 700, minWidth: "24px", textAlign: "center" }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
                  >+</button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  title="Remove"
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid #fca5a5", background: "#fff1f2", color: "#dc2626", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
                >×</button>
              </div>
            ))}

            {/* Clear cart */}
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => { if (confirm("Clear all items from your cart?")) clearCart(); }}
                style={{ background: "none", border: "none", color: "var(--foreground-muted)", fontSize: "13px", cursor: "pointer", textDecoration: "underline", padding: 0 }}
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", padding: "32px", position: "sticky", top: "100px" }}>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "26px", fontWeight: 500, color: "var(--foreground)", marginBottom: "24px", letterSpacing: "-0.01em" }}>
              Order Summary
            </h2>

            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", color: "var(--foreground-muted)" }}>
                <span style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.productTitle} × {item.quantity}
                </span>
                <span style={{ fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", marginLeft: "12px" }}>
                  ${Math.round(item.unitPrice * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div style={{ borderTop: "1px solid var(--border)", margin: "20px 0 16px" }} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "var(--foreground-muted)" }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 700, color: "var(--foreground)" }}>${Math.round(subtotal).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "var(--foreground-muted)" }}>
              <span>Shipping</span>
              <span style={{ color: "#16a34a", fontWeight: 600 }}>Free Worldwide</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "13px", color: "var(--foreground-muted)" }}>
              <span>Production</span>
              <span>3–5 Weeks</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "28px", fontSize: "18px", fontWeight: 800, color: "var(--foreground)" }}>
              <span>Total</span>
              <span>${Math.round(subtotal).toLocaleString()}</span>
            </div>

            <Link href="/checkout" style={{ textDecoration: "none", display: "block" }}>
              <button className="btn btn-primary" style={{ width: "100%", padding: "18px", fontSize: "13px", letterSpacing: "0.08em", justifyContent: "center" }}>
                Proceed to Checkout
              </button>
            </Link>

            {/* WhatsApp order option */}
            <a
              href={`https://wa.me/918416919470?text=${encodeURIComponent(
                "Hi! I'd like to place an order:\n\n" +
                items.map(i => `• ${i.productTitle} | ${i.sizeLabel} | Qty: ${i.quantity} | $${Math.round(i.unitPrice * i.quantity)}`).join("\n") +
                `\n\nTotal: $${Math.round(subtotal)}\n\nPlease confirm availability and payment details.`
              )}`}
              target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginTop: "12px" }}
            >
              <button style={{
                width: "100%", padding: "16px", borderRadius: "9999px",
                border: "1.5px solid #25D366", background: "transparent", color: "#16a34a",
                fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Order via WhatsApp
              </button>
            </a>

            <p style={{ fontSize: "11px", color: "var(--foreground-muted)", textAlign: "center", marginTop: "16px", lineHeight: 1.6 }}>
              🔒 Secure checkout · Custom-made to order<br />
              Free worldwide shipping · 3–5 week production
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
