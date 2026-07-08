import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { products as staticProducts, getProductBySlug, getRelatedProducts } from "../../data/products";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductDetail from "./ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

// Load product from JSON DB first, fallback to static data
function getProductFromDB(slug: string) {
  try {
    const dbPath = path.join(process.cwd(), "data", "products.json");
    if (fs.existsSync(dbPath)) {
      const dbProducts = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      const found = dbProducts.find((p: { slug: string }) => p.slug === slug);
      if (found) return found;
    }
  } catch {}
  return getProductBySlug(slug);
}

function getAllProductSlugs(): string[] {
  try {
    const dbPath = path.join(process.cwd(), "data", "products.json");
    if (fs.existsSync(dbPath)) {
      const dbProducts = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        return dbProducts.map((p: { slug: string }) => p.slug);
      }
    }
  } catch {}
  return staticProducts.map((p) => p.slug);
}

function getRelatedFromDB(product: ReturnType<typeof getProductBySlug>, limit = 4) {
  try {
    const dbPath = path.join(process.cwd(), "data", "products.json");
    if (fs.existsSync(dbPath)) {
      const dbProducts = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        return dbProducts
          .filter((p: { id: string; category: string; rugType: string }) =>
            p.id !== product?.id &&
            (p.category === product?.category || p.rugType === product?.rugType)
          )
          .slice(0, limit);
      }
    }
  } catch {}
  if (!product) return [];
  return getRelatedProducts(product, limit);
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductFromDB(slug);
  if (!product) return { title: "Product Not Found" };
  const metaDesc = product.description || product.longDescription || "";
  return {
    title: `${product.title} — The Fair Rugs | Handmade Luxury Rugs`,
    description: metaDesc,
    keywords: [
      product.title,
      product.material,
      product.construction,
      "handmade rug",
      "luxury rug",
      "Jaipur rug",
      "custom rug",
      "artisan rug",
      ...(product.tags || []),
      ...(product.keywords || []),
    ].filter(Boolean).join(", "),
    openGraph: {
      title: `${product.title} — The Fair Rugs`,
      description: metaDesc,
      images: [{ url: product.image, width: 1200, height: 630, alt: product.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: metaDesc,
      images: [product.image],
    },
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thefairrugs.com";

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductFromDB(slug);
  if (!product) notFound();

  const related = getRelatedFromDB(product, 4);

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description || product.longDescription || "",
    "image": product.images || [product.image],
    "brand": {
      "@type": "Brand",
      "name": "The Fair Rugs"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "The Fair Rugs",
      "url": BASE_URL
    },
    "material": product.material,
    "countryOfOrigin": "India",
    "offers": {
      "@type": "Offer",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceCurrency": "USD",
      "seller": {
        "@type": "Organization",
        "name": "The Fair Rugs"
      },
      "url": `${BASE_URL}/products/${product.slug}`,
    },
    "aggregateRating": product.reviews && product.reviews > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 5,
      "reviewCount": product.reviews,
      "bestRating": 5,
      "worstRating": 1,
    } : undefined,
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Construction", "value": product.construction },
      { "@type": "PropertyValue", "name": "Pile Height", "value": product.pile },
      { "@type": "PropertyValue", "name": "Shape", "value": product.shape },
      { "@type": "PropertyValue", "name": "Lead Time", "value": product.leadTime },
    ].filter((p) => p.value),
  };

  return (
    <>
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductDetail product={product} relatedProducts={related} />
      </main>
      <Footer />
    </>
  );
}
