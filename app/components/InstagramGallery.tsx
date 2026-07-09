"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  title: string;
  image: string;
  images?: string[];
  category: string;
  rugType: string;
  active?: boolean;
}

interface GalleryItem {
  image: string;
  caption: string;
  tag: string;
}

const INSTA_TAGS = [
  "#TheFairRugs",
  "#HandmadeRugs",
  "#LuxuryRugs",
  "#ModernRugs",
  "#ArtisanCraft",
  "#DurrieRug",
  "#BohoDecor",
  "#SustainableLiving",
];

const CAPTIONS = [
  "Handcrafted with love by master artisans in Jaipur — luxury beneath your feet. ✨",
  "Every knot tells a story. Every thread a tradition. Pure artisan luxury. 🤍",
  "From our workshop to your home — handmade rugs with soul. 🌿",
  "Bold patterns, premium fibers, and centuries of craft in every inch. ◼️",
  "Where modern design meets ancient weaving traditions. 🏺",
  "Flat-woven perfection — Durrie rugs for the conscious luxury home.",
  "Natural fibers, timeless texture, and a warmth that only handmade can bring. 🌾",
  "100% natural and sustainable — because beautiful homes deserve responsible choices. 🌍",
];

export default function InstagramGallery() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const active = data.filter((p) => p.active !== false);
        // Collect all images (main + gallery images) from all products
        const allImages: string[] = [];
        for (const product of active) {
          if (product.image) allImages.push(product.image);
          if (product.images && product.images.length > 1) {
            for (let i = 1; i < product.images.length; i++) {
              if (product.images[i] && product.images[i] !== product.image) {
                allImages.push(product.images[i]);
              }
            }
          }
        }
        // Deduplicate
        const unique = Array.from(new Set(allImages));
        // Take up to 8 for the gallery
        const selected = unique.slice(0, 8);
        const items: GalleryItem[] = selected.map((img, idx) => ({
          image: img,
          caption: CAPTIONS[idx % CAPTIONS.length],
          tag: INSTA_TAGS[idx % INSTA_TAGS.length],
        }));
        setGalleryItems(items);
      })
      .catch(() => {});
  }, []);

  if (galleryItems.length === 0) {
    // Render nothing or a minimal placeholder while loading
    return null;
  }

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
              fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase",
              color: "var(--primary)", fontWeight: 600, marginBottom: "16px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "28px", height: "1px", background: "var(--primary)" }} />
            Follow Our Journey
            <span style={{ display: "inline-block", width: "28px", height: "1px", background: "var(--primary)" }} />
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300,
              color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "16px",
            }}
          >
            The Artisan{" "}
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>Instagram</em>
          </h2>
          <p
            style={{
              fontSize: "16px", color: "var(--foreground-muted)",
              maxWidth: "480px", margin: "0 auto 24px", lineHeight: 1.7, fontWeight: 300,
            }}
          >
            A behind-the-scenes look at our craft — from loom to living room. Join our community of luxury rug lovers.
          </p>
          <a
            href="https://www.instagram.com/thefairrugs"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              color: "var(--primary)", fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              textDecoration: "none", borderBottom: "2px solid var(--primary)",
              paddingBottom: "2px", transition: "all 0.2s ease",
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @thefairrugs
          </a>
        </div>

        {/* Instagram Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3px" }}>
          {galleryItems.map((post, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/thefairrugs"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "relative", aspectRatio: "1 / 1",
                overflow: "hidden", display: "block", cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{
                  objectFit: "cover",
                  transform: hoveredIdx === idx ? "scale(1.08)" : "scale(1)",
                  transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                }}
              />

              {/* Hover Overlay */}
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(28,40,20,0.85) 0%, rgba(28,40,20,0.4) 50%, rgba(28,40,20,0.1) 100%)",
                  opacity: hoveredIdx === idx ? 1 : 0,
                  transition: "opacity 0.4s ease",
                  display: "flex", flexDirection: "column",
                  justifyContent: "flex-end", padding: "20px",
                }}
              >
                <span style={{ color: "var(--gold-light)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "8px" }}>
                  {post.tag}
                </span>
                <p style={{
                  color: "rgba(255,255,255,0.9)", fontSize: "12px",
                  lineHeight: 1.5, fontWeight: 400, marginBottom: "0",
                  display: "-webkit-box" as "block",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as "vertical",
                  overflow: "hidden",
                }}>
                  {post.caption}
                </p>
              </div>

              {/* Instagram icon on hover */}
              <div style={{ position: "absolute", top: "14px", right: "14px", opacity: hoveredIdx === idx ? 1 : 0, transition: "opacity 0.3s ease" }}>
                <div style={{
                  width: "32px", height: "32px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
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
                display: "inline-flex", alignItems: "center", gap: "10px",
                padding: "16px 40px", borderRadius: "9999px",
                border: "1.5px solid var(--primary)", background: "transparent",
                color: "var(--primary)", fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.25s ease",
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
    </section>
  );
}
