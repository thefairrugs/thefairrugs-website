import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import B2BContent from "./B2BContent";

export const metadata: Metadata = {
  title: "B2B & Wholesale — The Fair Rugs | Trade Programme",
  description:
    "The Fair Rugs B2B wholesale programme for interior designers, architects, hotels, retailers, and importers. Trade pricing, private label, OEM manufacturing, and bulk orders available. Worldwide shipping.",
};

export default function B2BPage() {
  return (
    <>
      <Header />
      <main>
        <B2BContent />
      </main>
      <Footer />
    </>
  );
}
