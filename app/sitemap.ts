import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { products as staticProducts } from "./data/products";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thefairrugs.com";

function getProductSlugs(): string[] {
  try {
    const dbPath = path.join(process.cwd(), "data", "products.json");
    if (fs.existsSync(dbPath)) {
      const dbProducts = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        return dbProducts.filter((p: { active?: boolean }) => p.active !== false).map((p: { slug: string }) => p.slug);
      }
    }
  } catch {}
  return staticProducts.map((p) => p.slug);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getProductSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/custom-rug`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/b2b`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/care-guide`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/shipping`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/returns`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
