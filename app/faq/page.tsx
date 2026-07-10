import type { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | The Fair Rugs",
  description:
    "Find answers to common questions about ordering custom handmade rugs, materials, shipping worldwide, care and maintenance. The Fair Rugs experts are here to help.",
  openGraph: {
    title: "FAQ — The Fair Rugs",
    description: "Answers to your questions about handmade rugs, custom orders, shipping & care.",
    type: "website",
  },
};

const faqs = [
  {
    category: "Ordering & Pricing",
    questions: [
      {
        q: "How do I order a custom rug?",
        a: "You can use our Rug Configurator to get an instant price estimate, then contact us via WhatsApp or email to confirm your order. Our team will guide you through the entire process — from design approval to production and delivery.",
      },
      {
        q: "Are your prices negotiable for large orders?",
        a: "Yes. We offer volume discounts for orders of multiple rugs, hotel and commercial projects, and our interior designer trade programme. Please contact us directly for a custom quotation.",
      },
      {
        q: "Is the price on the configurator the final price?",
        a: "The configurator provides an estimated price based on your specifications. Final pricing is confirmed after reviewing your exact design requirements — complex patterns, high knot counts, or specialty fibres may affect the final cost. We always confirm the final price before production begins.",
      },
      {
        q: "Do you require a deposit?",
        a: "Yes, we require a 50% deposit to begin production, with the remaining balance due before shipping. For trade clients, we can arrange purchase order terms.",
      },
    ],
  },
  {
    category: "Materials & Craft",
    questions: [
      {
        q: "What materials do you use?",
        a: "We work with premium New Zealand wool, Himalayan silk, bamboo silk, organic cotton, and natural jute. All materials are ethically sourced and of the highest quality. We also offer luxurious wool-silk blends for an exceptionally soft, lustrous finish.",
      },
      {
        q: "What is the difference between hand knotted and hand tufted?",
        a: "Hand knotted rugs are made by individually tying each knot around the warp threads — a technique that can take months and produces rugs that last for generations. Hand tufted rugs use a tufting gun to push yarn through a backing fabric, resulting in a plush, uniform pile that is quicker to produce and more affordable, without compromising on quality or design.",
      },
      {
        q: "How long does a hand knotted rug last?",
        a: "A properly made hand knotted rug with quality wool can last over 100 years, often being passed down through generations. Our hand knotted rugs are genuine heirloom investments.",
      },
      {
        q: "Do you use natural dyes?",
        a: "We offer both natural and synthetic dye options. Our natural dye collection uses traditional plant-based dyes that create beautifully nuanced tones that soften and deepen with age. Synthetic dyes offer greater colour consistency and Pantone-matching capability.",
      },
    ],
  },
  {
    category: "Custom Orders",
    questions: [
      {
        q: "Can I order any size?",
        a: "Yes — we produce rugs in any size, from small accent rugs to grand room-sized carpets. There are no standard size limitations. Simply tell us your exact dimensions in feet, inches, or centimetres.",
      },
      {
        q: "Can I provide my own design?",
        a: "Absolutely. You can provide a design sketch, a mood board, a floor plan, a photograph of a reference rug, or even a Pantone colour palette. Our design team will translate your vision into a detailed technical specification.",
      },
      {
        q: "How accurate is the colour matching?",
        a: "We can match colours very accurately using Pantone references with our synthetic dye range. Natural dyes produce more organic, nuanced tones that are beautiful but may have slight natural variations. We provide a digital colour preview before production begins.",
      },
      {
        q: "Can you make irregular or custom-shaped rugs?",
        a: "Yes — we specialise in irregular shapes and are experienced in creating rugs that follow architectural floor plans, curved staircases, or entirely unique shapes. Simply share your floor plan or dimensions.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "Do you ship worldwide?",
        a: "Yes — we offer free worldwide shipping to the USA, Canada, UK, Europe, Australia, UAE, and virtually every other country. Your rug is fully insured during transit.",
      },
      {
        q: "How long does production take?",
        a: "Hand tufted rugs typically take 3–4 weeks. Hand knotted rugs take 4–8 weeks depending on the size and knot density. Once shipped, delivery takes 4–7 business days via express courier.",
      },
      {
        q: "How is the rug packaged for shipping?",
        a: "Rugs are professionally cleaned, rolled around a solid tube, wrapped in protective fabric, and then in a waterproof outer wrap. The roll is then crated or placed in a sturdy box appropriate for the rug's size. All international shipments include full insurance.",
      },
      {
        q: "Will I receive updates during production?",
        a: "Yes — we send you photo updates at key stages of production, including the completed design drawing, the started piece, and the finished rug before packaging. You can also contact us at any time for a WhatsApp progress update.",
      },
    ],
  },
  {
    category: "Care & Maintenance",
    questions: [
      {
        q: "How do I care for my handmade rug?",
        a: "For daily care, regular vacuuming (without the beater bar on high pile rugs) is recommended. Rotate the rug periodically to ensure even wear. For spills, blot immediately with a clean cloth — never rub. Professional cleaning every 2–3 years is recommended for wool rugs.",
      },
      {
        q: "Can handmade rugs be professionally cleaned?",
        a: "Yes — all our rugs can be professionally hand-washed. We recommend using a specialist oriental rug cleaning service. Never machine-wash a handmade wool rug.",
      },
    ],
  },
];

// Build flat FAQ list for JSON-LD schema
const allQuestions = faqs.flatMap((section) =>
  section.questions.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  }))
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allQuestions,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://thefairrugs.com" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://thefairrugs.com/faq" },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FAQClient faqs={faqs} />
    </>
  );
}
