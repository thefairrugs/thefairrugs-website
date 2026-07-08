import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
  title: "Shop Luxury Handmade Rugs — Hand Knotted, Hand Tufted, Jute & More",
  description:
    "Browse our complete collection of luxury handmade rugs. Hand knotted, hand tufted, durrie and jute rugs crafted by master artisans. Custom sizes available. Free worldwide shipping.",
};

function ShopFallback() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🧶</div>
        <p style={{ color: "var(--foreground-muted)", fontSize: "16px" }}>Loading collection...</p>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<ShopFallback />}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
