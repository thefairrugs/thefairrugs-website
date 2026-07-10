"use client";

import { useState, useEffect } from "react";

interface Props {
  productId: string;
  productTitle: string;
  style?: React.CSSProperties;
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("tfr_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("tfr_visitor_id", id);
  }
  return id;
}

export default function LikeButton({ productId, productTitle, style }: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const visitorId = getVisitorId();
    fetch(`/api/favorites?productId=${productId}&visitorId=${visitorId}`)
      .then((r) => r.json())
      .then((d) => {
        setLiked(!!d.liked);
        setCount(d.count || 0);
      })
      .catch(() => {});
  }, [productId]);

  const toggle = async () => {
    if (loading || !mounted) return;
    setLoading(true);
    const visitorId = getVisitorId();
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productTitle, visitorId }),
      });
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count || 0);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={liked ? "Unlike this rug" : "Save to favorites"}
      title={liked ? "Remove from favorites" : "Save to favorites"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "10px 16px",
        background: liked ? "#fff0f3" : "transparent",
        border: `1.5px solid ${liked ? "#fca5a5" : "var(--border)"}`,
        borderRadius: "var(--radius-full)",
        cursor: loading ? "default" : "pointer",
        fontSize: "13px",
        fontWeight: 600,
        color: liked ? "#dc2626" : "var(--foreground-muted)",
        transition: "all 0.2s ease",
        opacity: loading ? 0.7 : 1,
        ...style,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={liked ? "#dc2626" : "none"}
        stroke={liked ? "#dc2626" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "transform 0.2s ease", transform: liked ? "scale(1.15)" : "scale(1)" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>
        {liked ? "Saved" : "Save"}
        {count > 0 && <span style={{ marginLeft: "4px", opacity: 0.7 }}>({count})</span>}
      </span>
    </button>
  );
}
