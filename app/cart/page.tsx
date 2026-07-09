import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartPageContent from "./CartPageContent";

export const metadata: Metadata = {
  title: "Shopping Cart — The Fair Rugs",
  description: "Review your selected rugs before checkout.",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main>
        <CartPageContent />
      </main>
      <Footer />
    </>
  );
}
