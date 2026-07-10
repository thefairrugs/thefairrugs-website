import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ErrorContent from "./ErrorContent";

export const metadata: Metadata = {
  title: "Payment Failed — The Fair Rugs",
  description: "An error occurred during payment. No charge was made. Please try again.",
  robots: { index: false, follow: false },
};

export default function PaymentErrorPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Loading…</p></div>}>
          <ErrorContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
