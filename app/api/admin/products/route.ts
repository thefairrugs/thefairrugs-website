import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

function getAdminToken(): string {
  try {
    return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8")).token;
  } catch { return "fairrugs2026admin"; }
}

function isAuthorized(req: NextRequest): boolean {
  const token = getAdminToken();
  return req.headers.get("x-admin-key") === token || req.cookies.get("admin_token")?.value === token;
}

function ensureProductsFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PRODUCTS_FILE)) {
    // Seed from static data on first run
    try {
      const staticPath = path.join(process.cwd(), "app", "data", "products.ts");
      // We can't require TS directly, so just init empty — admin will add
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
    } catch {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
    }
  }
}

function loadProducts() {
  ensureProductsFile();
  try {
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
    return Array.isArray(data) ? data : [];
  } catch { return []; }
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
