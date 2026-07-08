import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

function getAdminToken(): string {
  try { return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8")).token; }
  catch { return "fairrugs2026admin"; }
}

function isAuthorized(req: NextRequest): boolean {
  const token = getAdminToken();
  return req.headers.get("x-admin-key") === token || req.cookies.get("admin_token")?.value === token;
}

function loadProducts() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8")) || [];
  } catch { return []; }
}

function saveProducts(products: object[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// POST — bulk operations
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "import") {
      // Import array of products (CSV/Excel parsed client-side to JSON)
      const rows = body.products;
      if (!Array.isArray(rows)) return NextResponse.json({ error: "products array required" }, { status: 400 });

      const existing = loadProducts();
      let created = 0;
      let updated = 0;

      for (const row of rows) {
        if (!row.title) continue;
        const slug = (row.slug || row.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const existingIdx = existing.findIndex((p: { slug: string }) => p.slug === slug);

        const product = {
          id: row.id || Date.now().toString() + Math.random().toString(36).slice(2),
          slug,
          title: row.title,
          subtitle: row.subtitle || "",
          category: row.category || "Hand Tufted",
          rugType: row.rugType || row.rug_type || "hand-tufted",
          material: row.material || "Premium Wool",
          construction: row.construction || "Hand Tufted",
          pile: row.pile || "Medium Pile",
          shape: row.shape || "Rectangle",
          origin: "Handmade in Jaipur, India",
          description: row.description || "",
          longDescription: row.longDescription || row.long_description || row.description || "",
          features: Array.isArray(row.features) ? row.features : (row.features || "").split("|").filter(Boolean),
          image: row.image || "/images/rug1.png",
          images: Array.isArray(row.images) ? row.images : [row.image || "/images/rug1.png"],
          badge: row.badge || null,
          reviews: Number(row.reviews) || 0,
          rating: Number(row.rating) || 5,
          inStock: row.inStock !== "false" && row.in_stock !== "false",
          leadTime: row.leadTime || row.lead_time || "3–5 weeks",
          active: row.active !== "false",
          price: 0,
          oldPrice: 0,
          priceDisplay: "From $—",
          oldPriceDisplay: "",
          priceNote: "Price calculated by sq.ft.",
          standardSizes: Array.isArray(row.standardSizes) ? row.standardSizes : [],
          colors: Array.isArray(row.colors) ? row.colors : [],
          tags: Array.isArray(row.tags) ? row.tags : [],
          createdAt: row.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (existingIdx !== -1) {
          existing[existingIdx] = { ...existing[existingIdx], ...product };
          updated++;
        } else {
          existing.unshift(product);
          created++;
        }
      }

      saveProducts(existing);
      return NextResponse.json({ success: true, created, updated });
    }

    if (action === "bulk-update") {
      // Update specific fields on multiple products by id
      const { ids, updates } = body;
      if (!Array.isArray(ids) || !updates) return NextResponse.json({ error: "ids and updates required" }, { status: 400 });
      const products = loadProducts();
      let count = 0;
      for (const id of ids) {
        const idx = products.findIndex((p: { id: string }) => p.id === id);
        if (idx !== -1) {
          products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
          count++;
        }
      }
      saveProducts(products);
      return NextResponse.json({ success: true, updated: count });
    }

    if (action === "bulk-delete") {
      const { ids } = body;
      if (!Array.isArray(ids)) return NextResponse.json({ error: "ids array required" }, { status: 400 });
      const products = loadProducts().filter((p: { id: string }) => !ids.includes(p.id));
      saveProducts(products);
      return NextResponse.json({ success: true, deleted: ids.length });
    }

    if (action === "bulk-price-update") {
      // Update pricing multiplier (stored as custom price override per product)
      return NextResponse.json({ success: true, note: "Pricing is dynamic via shared engine" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// GET — export all products as JSON (client converts to CSV/Excel)
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = loadProducts();
  return NextResponse.json(products);
}
