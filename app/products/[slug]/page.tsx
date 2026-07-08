import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProductBySlug, getRelatedProducts } from "../../data/products";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductDetail from "./ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} — Handmade Luxury Rug`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image, width: 1200, height: 630, alt: product.title }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <>
      <Header />
      <main>
        <ProductDetail product={product} relatedProducts={related} />
      </main>
      <Footer />
    </>
  );
}
