import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CATS_FILE = path.join(DATA_DIR, "categories.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

function getAdminToken(): string {
  try { return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8")).token; }
  catch { return "fairrugs2026admin"; }
}

function isAuthorized(req: NextRequest): boolean {
  const token = getAdminToken();
  return req.headers.get("x-admin-key") === token || req.cookies.get("admin_token")?.value === token;
}

function loadCategories() {
  try {
    if (!fs.existsSync(CATS_FILE)) return getDefaults();
    const data = JSON.parse(fs.readFileSync(CATS_FILE, "utf-8"));
    return Array.isArray(data) ? data : getDefaults();
  } catch { return getDefaults(); }
}

function getDefaults() {
  return [
    { id: "hand-knotted", name: "Hand Knotted", slug: "hand-knotted", description: "Master artisan hand knotted rugs", image: "/images/rug1.png", active: true },
    { id: "hand-tufted",  name: "Hand Tufted",  slug: "hand-tufted",  description: "Premium hand tufted rugs", image: "/images/rug2.png", active: true },
    { id: "durrie",       name: "Durrie",        slug: "durrie",        description: "Flat weave durrie rugs",   image: "/images/rug6.png", active: true },
    { id: "jute",         name: "Jute",          slug: "jute",          description: "Natural jute rugs",        image: "/images/rug8.jpeg", active: true },
  ];
}

function saveCategories(cats: object[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(CATS_FILE, JSON.stringify(cats, null, 2));
}

export async function GET() {
  return NextResponse.json(loadCategories());
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const cats = loadCategories();
    const newCat = {
      id: body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: body.description || "",
      image: body.image || "/images/rug1.png",
      active: body.active !== undefined ? body.active : true,
    };
    cats.push(newCat);
    saveCategories(cats);
    return NextResponse.json({ success: true, category: newCat });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const cats = loadCategories();
    const idx = cats.findIndex((c: { id: string }) => c.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    cats[idx] = { ...cats[idx], ...body };
    saveCategories(cats);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const cats = loadCategories().filter((c: { id: string }) => c.id !== id);
  saveCategories(cats);
  return NextResponse.json({ success: true });
}
