"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const POSTS = [
  {
    id: 1,
    image: "/images/rug1.png",
    caption: "Vintage Oushak hand-knotted in pure wool — a timeless heirloom for the modern home. ✨",
    likes: "2.4K",
    comments: "86",
    tag: "#TheFairRugs",
  },
  {
    id: 2,
    image: "/images/rug2.png",
    caption: "Moroccan diamond patterns, hand-tufted in a luxurious wool-silk blend. Geometric magic. 🖤",
    likes: "1.8K",
    comments: "64",
    tag: "#HandmadeRugs",
  },
  {
    id: 3,
    image: "/images/rug3.png",
    caption: "Hand knotted by master weavers in Jaipur — 300 knots per square inch of pure artistry.",
    likes: "3.1K",
    comments: "112",
    tag: "#LuxuryRugs",
  },
  {
    id: 4,
    image: "/images/rug4.png",
    caption: "Bold geometry meets soft texture — our Geometric Area Rug transforms any living space. ◼️",
    likes: "1.5K",
    comments: "47",
    tag: "#ModernRugs",
  },
  {
    id: 5,
    image: "/images/rug5.jpg",
    caption: "Modern abstract art beneath your feet. Bamboo silk threads catch the light beautifully. 🌿",
    likes: "2.9K",
    comments: "98",
    tag: "#ArtisanCraft",
  },
  {
    id: 6,
    image: "/images/rug6.png",
    caption: "Scandinavian minimalism meets Indian artisanship. Our Durrie rugs are flat-woven perfection.",
    likes: "1.2K",
    comments: "39",
    tag: "#DurrieRug",
  },
  {
    id: 7,
    image: "/images/rug7.jpg",
    caption: "Free-spirited boho charm. Hand-knotted fringe, natural wool, and earthy tones. Pure warmth. 🌾",
    likes: "2.1K",
    comments: "73",
    tag: "#BohoDecor",
  },
  {
    id: 8,
    image: "/images/rug8.jpeg",
    caption: "100% natural jute — the sustainable choice for the conscious luxury home. Eco-chic. 🌍",
    likes: "1.7K",
    comments: "55",
    tag: "#SustainableLiving",
  },
];

export default function InstagramGallery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section
      style={{
        padding: "100px 0",
        background: "var(--background)",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--primary)",
              fontWeight: 600,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "28px",
                height: "1px",
                background: "var(--primary)",
              }}
            />
            Follow Our Journey
            <span
              style={{
                display: "inline-block",
                width: "28px",
                height: "1px",
                background: "var(--primary)",
              }}
            />
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 300,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            The Artisan{" "}
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
              Instagram
            </em>
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--foreground-muted)",
              maxWidth: "480px",
              margin: "0 auto 24px",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            A behind-the-scenes look at our craft — from loom to living room. Join our community of luxury rug lovers.
          </p>
          <a
            href="https://www.instagram.com/thefairrugs"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--primary)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderBottom: "2px solid var(--primary)",
              paddingBottom: "2px",
              transition: "all 0.2s ease",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="16"
              height="16"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @thefairrugs
          </a>
        </div>

        {/* Instagram Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "3px",
          }}
        >
          {POSTS.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/thefairrugs"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                display: "block",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{
                  objectFit: "cover",
                  transform:
                    hoveredId === post.id ? "scale(1.08)" : "scale(1)",
                  transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                }}
              />

              {/* Hover Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(28,40,20,0.85) 0%, rgba(28,40,20,0.4) 50%, rgba(28,40,20,0.1) 100%)",
                  opacity: hoveredId === post.id ? 1 : 0,
                  transition: "opacity 0.4s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "20px",
                }}
              >
                {/* Tag */}
                <span
                  style={{
                    color: "var(--gold-light)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  {post.tag}
                </span>

                {/* Caption */}
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "12px",
                    lineHeight: 1.5,
                    fontWeight: 400,
                    marginBottom: "14px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.caption}
                </p>

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="white"
                      width="14"
                      height="14"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {post.likes}
                  </span>
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="white"
                      width="14"
                      height="14"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {post.comments}
                  </span>
                </div>
              </div>

              {/* Instagram icon on hover */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  opacity: hoveredId === post.id ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    width="16"
                    height="16"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <a
            href="https://www.instagram.com/thefairrugs"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "16px 40px",
                borderRadius: "9999px",
                border: "1.5px solid var(--primary)",
                background: "transparent",
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "var(--primary)";
                btn.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "transparent";
                btn.style.color = "var(--primary)";
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Follow @thefairrugs
            </button>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .instagram-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .instagram-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
