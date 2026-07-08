import type { Metadata } from "next";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import Categories from "./components/Categories";
import FeaturedRugs from "./components/FeaturedRugs";
import Craftsmanship from "./components/Craftsmanship";
import WhyChooseUs from "./components/WhyChooseUs";
import DesignerSection from "./components/DesignerSection";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "The Fair Rugs — Luxury Handmade Rugs & Custom Carpets",
  description:
    "Discover luxury handmade rugs crafted by master artisans in India. Hand knotted, hand tufted, and custom rugs for homes, hotels, and design studios worldwide. Free worldwide shipping.",
  openGraph: {
    title: "The Fair Rugs — Luxury Handmade Rugs & Custom Carpets",
    description:
      "Master artisan rugs crafted in Jaipur, India. Luxury quality, bespoke designs, worldwide delivery.",
    images: ["/images/rug1.png"],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <Categories />
        <FeaturedRugs />
        <Craftsmanship />
        <WhyChooseUs />
        <DesignerSection />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
