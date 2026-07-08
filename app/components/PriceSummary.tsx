type Props = {
  rugType: string;
  category: string;
  shape: string;
  size: string;
  sqft: number;
  price: number;
};

export default function PriceSummary({
  rugType,
  category,
  shape,
  size,
  sqft,
  price,
}: Props) {
  const rows = [
    { label: "Craft Technique", value: rugType },
    { label: "Design Style", value: category },
    { label: "Shape", value: shape },
    { label: "Size", value: size },
    { label: "Area", value: `${sqft.toFixed(2)} sq.ft` },
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello! I'm interested in a custom rug:\n\nMaterial: ${rugType}\nStyle: ${category}\nShape: ${shape}\nSize: ${size}\nArea: ${sqft.toFixed(2)} sq.ft\nEstimated Price: $${price.toFixed(0)}\n\nPlease send me a final quote.`
    );
    window.open(`https://wa.me/919999999999?text=${message}`, "_blank");
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--border-light)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--foreground)",
          padding: "28px 32px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--gold)",
            fontWeight: 600,
            marginBottom: "8px",
          }}
        >
          Your Configuration
        </p>
        <h2
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "28px",
            fontWeight: 400,
            color: "#fff",
            letterSpacing: "-0.01em",
          }}
        >
          Order Summary
        </h2>
      </div>

      {/* Rows */}
      <div style={{ padding: "28px 32px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}
        >
          {rows.map(({ label, value }, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "14px 0",
                borderBottom:
                  i < rows.length - 1 ? "1px solid var(--border-light)" : "none",
                gap: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--foreground-muted)",
                  flexShrink: 0,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  textAlign: "right",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          style={{
            marginTop: "20px",
            padding: "24px",
            background: "rgba(139,94,60,0.06)",
            borderRadius: "var(--radius-lg)",
            border: "1.5px solid rgba(139,94,60,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--foreground-muted)",
              }}
            >
              Estimated Total
            </span>
            <span
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "36px",
                fontWeight: 600,
                color: "var(--primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {price > 0 ? `$${Math.round(price).toLocaleString()}` : "—"}
            </span>
          </div>
          <p
            style={{
              fontSize: "11px",
              color: "var(--foreground-muted)",
              fontWeight: 300,
            }}
          >
            Estimate only. Final price confirmed within 24 hours.
          </p>
        </div>

        {/* Features */}
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "var(--surface-alt)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {[
            { icon: "🌍", text: "Free Worldwide Shipping" },
            { icon: "🕐", text: "3–5 Week Production Time" },
            { icon: "📦", text: "4–7 Day Express Delivery" },
            { icon: "🤲", text: "100% Handmade in India" },
            { icon: "📸", text: "Progress Photos Provided" },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px",
                color: "var(--foreground-muted)",
                fontWeight: 400,
              }}
            >
              <span style={{ fontSize: "15px", flexShrink: 0 }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={handleWhatsApp}
            style={{
              width: "100%",
              padding: "17px",
              background: "#25D366",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-full)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#20b858";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 20px rgba(37,211,102,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#25D366";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(37,211,102,0.3)";
            }}
          >
            <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp Us for Quote
          </button>

          <button
            style={{
              width: "100%",
              padding: "16px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-full)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 16px rgba(139,94,60,0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--primary-dark)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Add to Quote Request
          </button>

          <button
            style={{
              width: "100%",
              padding: "15px",
              background: "transparent",
              color: "var(--primary)",
              border: "1.5px solid var(--primary)",
              borderRadius: "var(--radius-full)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
            }}
          >
            Request Custom Design
          </button>
        </div>

        {/* Trust note */}
        <p
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "var(--foreground-muted)",
            marginTop: "20px",
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          🔒 No payment required at this stage.
          <br />
          We&apos;ll send you a detailed quote within 24 hours.
        </p>
      </div>
    </div>
  );
}
