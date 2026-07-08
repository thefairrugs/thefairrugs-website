import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us — The Fair Rugs",
  description:
    "Get in touch with The Fair Rugs. Request a quote, ask about custom rugs, or chat with us on WhatsApp. We ship to USA, Canada, UK, Australia, Europe and worldwide.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
