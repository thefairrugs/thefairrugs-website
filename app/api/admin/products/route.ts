import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

// ─────────────────────────────────────────────────────────────────────────────
// SEED PRODUCTS — hard-coded fallback.
// These 8 products are the canonical production dataset. They are ALSO stored
// in data/products.json (git-tracked). This inline copy ensures that even if
// the server's filesystem is ephemeral (Cloudflare Workers, Vercel serverless),
// products are NEVER lost — the seed is always available from the compiled JS.
//
// HOW THIS WORKS:
//   1. On every fresh deployment, data/products.json is restored from git.
//   2. If for any reason the file is missing at runtime, ensureProductsFile()
//      seeds it from SEED_PRODUCTS (this array) — NOT an empty array.
//   3. Admin-added products are written to data/products.json at runtime.
//      After adding products via admin, COMMIT data/products.json to git before
//      the next deployment so they survive re-deploys.
// ─────────────────────────────────────────────────────────────────────────────
const SEED_PRODUCTS = [
  {
    id: "1", slug: "vintage-oushak-rug", title: "Vintage Oushak Rug",
    subtitle: "Hand Knotted · Pure Wool", category: "Hand Knotted",
    rugType: "hand-knotted", material: "100% New Zealand Wool",
    construction: "Hand Knotted", pile: "Medium Pile (10mm)", shape: "Rectangle",
    origin: "Handmade in Jaipur, India", price: 0, oldPrice: 0,
    priceDisplay: "From $—", oldPriceDisplay: "", priceNote: "Price calculated by sq.ft. See size selector.",
    image: "/images/rug1.png", images: ["/images/rug1.png", "/images/rug2.png", "/images/rug3.png"],
    video: "", badge: "Bestseller", reviews: 245, rating: 5,
    description: "A timeless Oushak-inspired rug hand knotted by master artisans in Jaipur.",
    longDescription: "The Vintage Oushak Rug is a celebration of one of the world's most beloved rug traditions, reimagined for the modern luxury home. Each rug is individually hand knotted by skilled artisans who have honed their craft over generations.",
    features: ["Hand knotted by master artisans", "100% New Zealand wool pile", "Oushak-inspired vintage design", "Natural vegetable dyes", "Cotton warp and weft", "Aged, muted tonal palette", "Available in custom sizes"],
    standardSizes: ["3×5 ft", "4×6 ft", "5×8 ft", "6×9 ft", "8×10 ft", "9×12 ft", "10×14 ft"],
    colors: ["Ivory", "Cream", "Sage", "Dusty Blue", "Soft Terracotta"],
    tags: ["Oushak", "Vintage", "Hand Knotted", "Wool", "Living Room"],
    inStock: true, leadTime: "3–5 weeks", active: true,
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
    priceAdjustment: 0, primaryColor: "Ivory", secondaryColor: "Sage",
    homeStyle: "Traditional", occasion: "Everyday", room: "Living Room",
    rugTypeTags: "Oushak, Vintage, Persian", pileHeight: "Medium Pile",
    keywords: ["Oushak", "Vintage", "Hand Knotted", "Wool", "Living Room"],
  },
  {
    id: "2", slug: "moroccan-wool-rug", title: "Moroccan Wool Rug",
    subtitle: "Hand Tufted · Premium Wool", category: "Hand Tufted",
    rugType: "hand-tufted", material: "Premium Wool Blend",
    construction: "Hand Tufted", pile: "High Pile (15mm)", shape: "Rectangle",
    origin: "Handmade in Jaipur, India", price: 0, oldPrice: 0,
    priceDisplay: "From $—", oldPriceDisplay: "", priceNote: "Price calculated by sq.ft. See size selector.",
    image: "/images/rug2.png", images: ["/images/rug2.png", "/images/rug1.png", "/images/rug4.jpg"],
    video: "", badge: "New", reviews: 198, rating: 5,
    description: "Inspired by the rich geometric traditions of Moroccan Beni Ourain rugs.",
    longDescription: "The Moroccan Wool Rug draws from centuries of North African weaving tradition. Our artisans meticulously recreate the iconic diamond and geometric motifs using premium wool tufted by hand.",
    features: ["Hand tufted by skilled artisans", "Premium wool — extra plush high pile", "Moroccan Beni Ourain-inspired design", "Bold geometric diamond pattern", "Non-slip canvas backing", "Machine washable (spot clean recommended)", "Custom colors available"],
    standardSizes: ["3×5 ft", "4×6 ft", "5×8 ft", "6×9 ft", "8×10 ft", "9×12 ft"],
    colors: ["Black & Ivory", "Charcoal & Cream", "Navy & White", "Sage & Ivory"],
    tags: ["Moroccan", "Geometric", "Hand Tufted", "Wool", "Bedroom"],
    inStock: true, leadTime: "3–4 weeks", active: true,
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
    priceAdjustment: 0, primaryColor: "Black", secondaryColor: "Ivory",
    homeStyle: "Bohemian", occasion: "Everyday", room: "Bedroom",
    rugTypeTags: "Moroccan, Geometric, Beni Ourain", pileHeight: "High Pile",
    keywords: ["Moroccan", "Geometric", "Hand Tufted", "Wool", "Bedroom"],
  },
  {
    id: "3", slug: "hand-knotted-wool-rug", title: "Hand Knotted Wool Rug",
    subtitle: "Hand Knotted · Pure Wool", category: "Hand Knotted",
    rugType: "hand-knotted", material: "100% Pure Wool",
    construction: "Hand Knotted", pile: "Low Pile (7mm)", shape: "Rectangle",
    origin: "Handmade in Jaipur, India", price: 0, oldPrice: 0,
    priceDisplay: "From $—", oldPriceDisplay: "", priceNote: "Price calculated by sq.ft. See size selector.",
    image: "/images/rug3.png", images: ["/images/rug3.png", "/images/rug1.png", "/images/rug7.png"],
    video: "", badge: "Heritage", reviews: 312, rating: 5,
    description: "The pinnacle of rug craftsmanship. Hand knotted over weeks by master weavers.",
    longDescription: "This Hand Knotted Wool Rug represents the highest expression of the weaver's art. Each knot is tied individually by hand, creating a dense, durable pile that only improves with age.",
    features: ["200+ knots per square inch", "100% pure hand-spun wool", "Persian and Central Asian design heritage", "Natural plant-based dyes", "Cotton foundation for stability", "Improves character with age", "Museum-quality craftsmanship"],
    standardSizes: ["4×6 ft", "5×8 ft", "6×9 ft", "8×10 ft", "9×12 ft", "10×14 ft", "12×18 ft"],
    colors: ["Ivory & Navy", "Red & Gold", "Forest & Cream", "Charcoal & Sage"],
    tags: ["Persian", "Heritage", "Hand Knotted", "Wool", "Heirloom"],
    inStock: true, leadTime: "4–6 weeks", active: true,
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
    priceAdjustment: 0, primaryColor: "Navy", secondaryColor: "Ivory",
    homeStyle: "Traditional", occasion: "Special Occasion", room: "Living Room",
    rugTypeTags: "Persian, Heritage, Heirloom", pileHeight: "Low Pile",
    keywords: ["Persian", "Heritage", "Hand Knotted", "Wool", "Heirloom"],
  },
  {
    id: "4", slug: "geometric-area-rug", title: "Geometric Area Rug",
    subtitle: "Hand Tufted · Wool Blend", category: "Hand Tufted",
    rugType: "hand-tufted", material: "Wool-Silk Blend",
    construction: "Hand Tufted", pile: "Medium Pile (12mm)", shape: "Rectangle",
    origin: "Handmade in Jaipur, India", price: 0, oldPrice: 0,
    priceDisplay: "From $—", oldPriceDisplay: "", priceNote: "Price calculated by sq.ft. See size selector.",
    image: "/images/rug4.jpg", images: ["/images/rug4.jpg", "/images/rug2.png", "/images/rug5.jpg"],
    video: "", badge: null, reviews: 156, rating: 5,
    description: "Bold, graphic geometry meets artisan craftsmanship.",
    longDescription: "The Geometric Area Rug is designed for the modern interior that refuses to compromise on quality. Our artisans hand tuft each rug using a premium wool-silk blend.",
    features: ["Hand tufted by artisans", "Wool-silk blend for subtle sheen", "Bold contemporary geometric design", "Medium pile for comfort and durability", "Latex backing for stability", "Rich, saturated color palette", "Custom geometric patterns available"],
    standardSizes: ["3×5 ft", "4×6 ft", "5×8 ft", "6×9 ft", "8×10 ft", "9×12 ft"],
    colors: ["Charcoal & Gold", "Navy & Cream", "Forest & Ivory", "Rust & Sand"],
    tags: ["Geometric", "Modern", "Hand Tufted", "Contemporary", "Living Room"],
    inStock: true, leadTime: "3–4 weeks", active: true,
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
    priceAdjustment: 0, primaryColor: "Charcoal", secondaryColor: "Gold",
    homeStyle: "Modern / Contemporary", occasion: "Everyday", room: "Living Room",
    rugTypeTags: "Geometric, Modern, Contemporary", pileHeight: "Medium Pile",
    keywords: ["Geometric", "Modern", "Hand Tufted", "Contemporary", "Living Room"],
  },
  {
    id: "5", slug: "modern-abstract-rug", title: "Modern Abstract Rug",
    subtitle: "Hand Tufted · New Zealand Wool", category: "Hand Tufted",
    rugType: "hand-tufted", material: "100% New Zealand Wool",
    construction: "Hand Tufted", pile: "High Pile (18mm)", shape: "Rectangle",
    origin: "Handmade in Jaipur, India", price: 0, oldPrice: 0,
    priceDisplay: "From $—", oldPriceDisplay: "", priceNote: "Price calculated by sq.ft. See size selector.",
    image: "/images/rug5.jpg", images: ["/images/rug5.jpg", "/images/rug4.jpg", "/images/rug6.png"],
    video: "", badge: "Featured", reviews: 287, rating: 5,
    description: "Art for your floor. This abstract masterpiece is hand tufted in the finest New Zealand wool.",
    longDescription: "The Modern Abstract Rug blurs the line between rug and art. Designed by our in-house creative team and executed by master tufters, each piece features sweeping abstract forms.",
    features: ["Extra-high pile (18mm) for maximum luxury", "100% New Zealand wool", "Abstract artistic design — each slightly unique", "Rich depth of color", "Durable canvas backing", "Ideal for bedroom or living room", "Available in custom sizes and colors"],
    standardSizes: ["4×6 ft", "5×8 ft", "6×9 ft", "8×10 ft", "9×12 ft"],
    colors: ["Sage & Ivory", "Forest & Cream", "Walnut & Beige", "Charcoal & Gold"],
    tags: ["Abstract", "Modern", "Hand Tufted", "Wool", "Luxury"],
    inStock: true, leadTime: "3–5 weeks", active: true,
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
    priceAdjustment: 0, primaryColor: "Sage", secondaryColor: "Ivory",
    homeStyle: "Scandinavian / Nordic", occasion: "Everyday", room: "Bedroom",
    rugTypeTags: "Abstract, Modern, Luxury", pileHeight: "High Pile",
    keywords: ["Abstract", "Modern", "Hand Tufted", "Wool", "Luxury"],
  },
  {
    id: "6", slug: "scandinavian-wool-rug", title: "Scandinavian Flat Weave",
    subtitle: "Durrie · Flat Weave", category: "Durrie",
    rugType: "durrie", material: "100% Cotton Wool Blend",
    construction: "Flat Weave (Durrie)", pile: "Flat Weave (No Pile)", shape: "Rectangle",
    origin: "Handmade in Jaipur, India", price: 0, oldPrice: 0,
    priceDisplay: "From $—", oldPriceDisplay: "", priceNote: "Price calculated by sq.ft. See size selector.",
    image: "/images/rug6.png", images: ["/images/rug6.png", "/images/rug7.png", "/images/rug8.jpeg"],
    video: "", badge: null, reviews: 175, rating: 5,
    description: "Lightweight, reversible and beautifully minimal. A Scandinavian-inspired flat weave Durrie rug.",
    longDescription: "The Scandinavian Flat Weave represents the perfect marriage of Indian artisan tradition with Nordic design sensibility.",
    features: ["Traditional Indian Durrie flat weave", "Fully reversible — double the lifespan", "Cotton-wool blend for durability", "No pile — easy to clean", "Lightweight and easy to move", "Ideal for high-traffic areas", "Sustainable natural fiber construction"],
    standardSizes: ["3×5 ft", "4×6 ft", "5×8 ft", "6×9 ft", "8×10 ft", "9×12 ft"],
    colors: ["Ivory & Charcoal", "Cream & Sage", "White & Natural", "Beige & Forest"],
    tags: ["Durrie", "Flat Weave", "Scandinavian", "Minimal", "Reversible"],
    inStock: true, leadTime: "2–3 weeks", active: true,
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
    priceAdjustment: 0, primaryColor: "Ivory", secondaryColor: "Charcoal",
    homeStyle: "Scandinavian / Nordic", occasion: "Everyday", room: "Dining Room",
    rugTypeTags: "Durrie, Flat Weave, Scandinavian, Reversible", pileHeight: "Flat Weave",
    keywords: ["Durrie", "Flat Weave", "Scandinavian", "Minimal", "Reversible"],
  },
  {
    id: "7", slug: "boho-handmade-rug", title: "Boho Handmade Rug",
    subtitle: "Hand Tufted · Recycled Fiber", category: "Hand Tufted",
    rugType: "hand-tufted", material: "Recycled Cotton & Wool",
    construction: "Hand Tufted", pile: "Medium Pile (12mm)", shape: "Irregular / Round",
    origin: "Handmade in Jaipur, India", price: 0, oldPrice: 0,
    priceDisplay: "From $—", oldPriceDisplay: "", priceNote: "Price calculated by sq.ft. See size selector.",
    image: "/images/rug7.png", images: ["/images/rug7.png", "/images/rug8.jpeg", "/images/rug5.jpg"],
    video: "", badge: "Eco", reviews: 221, rating: 5,
    description: "Earthy, textured, and soulful. Crafted from recycled cotton and wool fibers.",
    longDescription: "The Boho Handmade Rug embodies conscious luxury. Crafted from recycled cotton and repurposed wool fibers, this rug transforms textile waste into a beautiful, tactile floor covering.",
    features: ["Made from recycled cotton and wool fibers", "Unique organic pattern — each piece one-of-a-kind", "Boho/folk-inspired aesthetic", "Medium pile for comfort", "Available in round and irregular shapes", "Sustainable and eco-conscious production", "Natural, undyed fibers with earth tones"],
    standardSizes: ["3×5 ft", "4×6 ft", "5×8 ft", "Round 4ft", "Round 5ft", "Round 6ft"],
    colors: ["Natural Earth", "Warm Terracotta", "Sage & Cream", "Indigo & Ivory"],
    tags: ["Boho", "Eco", "Round", "Irregular Shape", "Sustainable"],
    inStock: true, leadTime: "3–4 weeks", active: true,
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
    priceAdjustment: 0, primaryColor: "Natural Earth", secondaryColor: "Terracotta",
    homeStyle: "Bohemian", occasion: "Everyday", room: "Living Room",
    rugTypeTags: "Boho, Eco, Sustainable, Organic", pileHeight: "Medium Pile",
    keywords: ["Boho", "Eco", "Round", "Irregular Shape", "Sustainable"],
  },
  {
    id: "8", slug: "jute-natural-rug", title: "Natural Jute Rug",
    subtitle: "Jute · Natural Fiber", category: "Jute",
    rugType: "jute", material: "100% Natural Jute",
    construction: "Hand Woven", pile: "Flat Weave / Textured", shape: "Rectangle",
    origin: "Handmade in Jaipur, India", price: 0, oldPrice: 0,
    priceDisplay: "From $—", oldPriceDisplay: "", priceNote: "Price calculated by sq.ft. See size selector.",
    image: "/images/rug8.jpeg", images: ["/images/rug8.jpeg", "/images/rug6.png", "/images/rug7.png"],
    video: "", badge: "Exclusive", reviews: 268, rating: 5,
    description: "Pure, raw beauty. Hand woven from premium golden jute fibers.",
    longDescription: "The Natural Jute Rug is a statement of sustainable luxury. Woven entirely from premium golden jute — one of the world's most renewable and biodegradable natural fibers.",
    features: ["100% natural golden jute", "Hand woven herringbone pattern", "Completely biodegradable and sustainable", "Rich, golden-warm natural color", "Earthy textural surface", "Ideal for layering with other rugs", "Natural variations add unique character"],
    standardSizes: ["3×5 ft", "4×6 ft", "5×8 ft", "6×9 ft", "8×10 ft", "9×12 ft", "10×14 ft"],
    colors: ["Natural Golden", "Bleached White", "Natural & Black Border"],
    tags: ["Jute", "Natural Fiber", "Eco", "Sustainable", "Coastal"],
    inStock: true, leadTime: "2–3 weeks", active: true,
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
    priceAdjustment: 0, primaryColor: "Natural Golden", secondaryColor: "Warm Beige",
    homeStyle: "Coastal / Nautical", occasion: "Everyday", room: "Living Room",
    rugTypeTags: "Jute, Natural Fiber, Eco, Coastal", pileHeight: "Flat Weave",
    keywords: ["Jute", "Natural Fiber", "Eco", "Sustainable", "Coastal"],
  },
];

function getAdminToken(): string {
  try {
    return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8")).token;
  } catch { return "fairrugs2026admin"; }
}

function isAuthorized(req: NextRequest): boolean {
  const token = getAdminToken();
  return req.headers.get("x-admin-key") === token || req.cookies.get("admin_token")?.value === token;
}

// ─────────────────────────────────────────────────────────────────────────────
// ensureProductsFile — FIXED
// Previously: created an EMPTY products.json if missing → wiped all products.
// Now: seeds from SEED_PRODUCTS (the 8 canonical products) if the file is
// missing OR if it somehow contains an empty array after a fresh deployment.
// ─────────────────────────────────────────────────────────────────────────────
function ensureProductsFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PRODUCTS_FILE)) {
    // File missing — seed from the embedded canonical product list
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2));
  }
}

function loadProducts() {
  ensureProductsFile();
  try {
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
    if (!Array.isArray(data)) return SEED_PRODUCTS;
    // If the file is empty (e.g. after a bad write), return seed products
    if (data.length === 0) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2));
      return SEED_PRODUCTS;
    }
    return data;
  } catch {
    // On parse error, restore from seed
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2));
    return SEED_PRODUCTS;
  }
}

function saveProducts(products: object[]) {
  ensureProductsFile();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// GET — list all products (public) or with admin key for full details
export async function GET(req: NextRequest) {
  const products = loadProducts();
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const id = url.searchParams.get("id");

  if (slug) return NextResponse.json(products.find((p: { slug: string }) => p.slug === slug) || null);
  if (id) return NextResponse.json(products.find((p: { id: string }) => p.id === id) || null);

  return NextResponse.json(products);
}

// POST — create product
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const products = loadProducts();

    // Handle duplicate action
    if (body.action === "duplicate" && body.id) {
      const source = products.find((p: { id: string }) => p.id === body.id);
      if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const duplicate = {
        ...source,
        id: Date.now().toString(),
        title: `${source.title} (Copy)`,
        slug: `${source.slug}-copy-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      products.unshift(duplicate);
      saveProducts(products);
      return NextResponse.json({ success: true, product: duplicate });
    }

    const newProduct = {
      id: Date.now().toString(),
      slug: generateSlug(body.title || "product"),
      title: body.title || "New Product",
      subtitle: body.subtitle || "",
      category: body.category || "Hand Tufted",
      rugType: body.rugType || "hand-tufted",
      material: body.material || "Premium Wool",
      construction: body.construction || "Hand Tufted",
      pile: body.pile || "Medium Pile (10mm)",
      shape: body.shape || "Rectangle",
      origin: "Handmade in Jaipur, India",
      description: body.description || "",
      longDescription: body.longDescription || body.description || "",
      features: body.features || [],
      standardSizes: body.standardSizes || ["3×5 ft","4×6 ft","5×8 ft","6×9 ft","8×10 ft","9×12 ft"],
      colors: body.colors || [],
      tags: body.tags || [],
      image: body.image || body.images?.[0] || "/images/rug1.png",
      images: body.images || [body.image || "/images/rug1.png"],
      video: body.video || "",
      badge: body.badge || null,
      reviews: body.reviews || 0,
      rating: body.rating || 5,
      inStock: body.inStock !== undefined ? body.inStock : true,
      leadTime: body.leadTime || "3–5 weeks",
      active: body.active !== undefined ? body.active : true,
      // Pricing — uses shared engine per sqft, no fixed price
      priceNote: "Price calculated by sq.ft. See size selector.",
      price: 0,
      oldPrice: 0,
      priceDisplay: "From $—",
      oldPriceDisplay: "",
      // Smart pricing — per-product price adjustment (± per sqft on top of category base)
      priceAdjustment: Number(body.priceAdjustment) || 0,
      // Product attributes (Etsy-style)
      primaryColor: body.primaryColor || "",
      secondaryColor: body.secondaryColor || "",
      homeStyle: body.homeStyle || "",
      occasion: body.occasion || "",
      room: body.room || "",
      rugTypeTags: body.rugTypeTags || "",
      pileHeight: body.pileHeight || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.unshift(newProduct);
    saveProducts(products);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PUT — update product
export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const products = loadProducts();
    const idx = products.findIndex((p: { id: string }) => p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    products[idx] = {
      ...products[idx],
      ...body,
      id: products[idx].id,
      updatedAt: new Date().toISOString(),
    };
    saveProducts(products);
    return NextResponse.json({ success: true, product: products[idx] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE — delete product
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const products = loadProducts();
  const filtered = products.filter((p: { id: string }) => p.id !== id);
  saveProducts(filtered);
  return NextResponse.json({ success: true });
}
