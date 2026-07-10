"use client";

import { useState } from "react";

export default function TariffAnnouncementBar() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #1a2d1a 0%, #243824 50%, #1a2d1a 100%)",
        borderBottom: "1px solid rgba(184,151,90,0.35)",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "11px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        {/* Main text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            position: "relative",
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <span style={{ fontSize: "16px" }}>🇺🇸</span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#e8dfc8",
              textTransform: "uppercase",
            }}
          >
            USA Orders – Tariff-Free Shipping Available
            <sup style={{ fontSize: "8px", color: "var(--gold-light)", marginLeft: "2px" }}>*</sup>
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "rgba(201,169,110,0.7)",
              letterSpacing: "0.06em",
            }}
          >
            Direct from our manufacturing facility
          </span>

          {/* Info icon */}
          <span
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: "1.5px solid rgba(201,169,110,0.6)",
              color: "rgba(201,169,110,0.8)",
              fontSize: "10px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            i
          </span>

          {/* Tooltip */}
          {showTooltip && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#1c2a1c",
                border: "1px solid rgba(184,151,90,0.4)",
                borderRadius: "10px",
                padding: "14px 18px",
                width: "360px",
                maxWidth: "90vw",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                zIndex: 9999,
              }}
            >
              {/* Arrow */}
              <div
                style={{
                  position: "absolute",
                  top: "-6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "12px",
                  height: "6px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#1c2a1c",
                    border: "1px solid rgba(184,151,90,0.4)",
                    transform: "rotate(45deg)",
                    margin: "3px auto 0",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "12.5px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: "1.7",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                Eligible USA orders are shipped according to the latest applicable
                import regulations. Any duties, taxes, or import requirements depend
                on current U.S. customs rules and the specific shipment.
              </p>
            </div>
          )}
        </div>

        {/* Separator */}
        <div
          style={{
            width: "1px",
            height: "16px",
            background: "rgba(201,169,110,0.25)",
          }}
        />

        {/* Secondary info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "11px",
            color: "rgba(201,169,110,0.65)",
            letterSpacing: "0.08em",
          }}
        >
          <span>✦ Factory Direct</span>
          <span>✦ No Hidden Fees</span>
          <span>✦ Fully Insured</span>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          style={{
            position: "absolute",
            right: "48px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.35)",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
            padding: "4px 8px",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)")}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
