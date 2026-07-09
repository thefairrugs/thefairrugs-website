export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import Header from "../components/Header";
import PriceCalculator from "../components/PriceCalculator";
import Footer from "../components/Footer";
import CustomRugContent from "./CustomRugContent";

export const metadata: Metadata = {
  title: "Custom Rug Design — Bespoke Handmade Rugs",
  description:
    "Design your perfect custom handmade rug with The Fair Rugs. Any size, any shape, any design — hand knotted or hand tufted by master artisans in Jaipur. Free worldwide shipping.",
};

export default function CustomRugPage() {
  return (
    <>
      <Header />
      <main>
        <CustomRugContent />
        {/* Configurator */}
        <div id="configurator">
          <PriceCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
