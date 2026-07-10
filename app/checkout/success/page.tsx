import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = {
  title: "Order Confirmed — The Fair Rugs",
  description: "Your order has been placed and payment confirmed. Thank you for shopping with The Fair Rugs.",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Loading…</p></div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
