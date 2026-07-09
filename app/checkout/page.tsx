import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckoutContent from "./CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout — The Fair Rugs",
  description: "Complete your order for luxury handmade rugs.",
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main>
        <CheckoutContent />
      </main>
      <Footer />
    </>
  );
}
