import type { Metadata } from "next";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import Categories from "./components/Categories";
import FeaturedRugs from "./components/FeaturedRugs";
import Craftsmanship from "./components/Craftsmanship";
import WhyChooseUs from "./components/WhyChooseUs";
import MaterialsSection from "./components/MaterialsSection";
import ManufacturingProcess from "./components/ManufacturingProcess";
import Testimonials from "./components/Testimonials";
import InstagramGallery from "./components/InstagramGallery";
import WorldwideShipping from "./components/WorldwideShipping";
import HomeFAQ from "./components/HomeFAQ";
import DesignerSection from "./components/DesignerSection";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "The Fair Rugs — Luxury Handmade Rugs & Custom Carpets",
  description:
    "Discover luxury handmade rugs crafted by master artisans in India. Hand knotted, hand tufted, and custom rugs for homes, hotels, and design studios worldwide. Free worldwide shipping.",
  openGraph: {
    title: "The Fair Rugs — Luxury Handmade Rugs & Custom Carpets",
    description:
      "Master artisan rugs crafted in Jaipur, India. Luxury quality, bespoke designs, worldwide delivery.",
    images: ["/og-brand.png"],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedRugs />
        <TrustBadges />
        <Craftsmanship />
        <MaterialsSection />
        <ManufacturingProcess />
        <WhyChooseUs />
        <Testimonials />
        <InstagramGallery />
        <WorldwideShipping />
        <HomeFAQ />
        <DesignerSection />
      </main>
      <Footer />
    </>
  );
}
