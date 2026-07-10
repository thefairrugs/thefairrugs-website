/**
 * /api/favorites — Product Likes & Favorites
 *
 * GET  /api/favorites?productId=xxx  — get like count for a product
 * GET  /api/favorites?all=1          — admin: get all likes data
 * POST /api/favorites                — toggle like (client sends visitorId + productId)
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FAVORITES_FILE = path.join(DATA_DIR, "favorites.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

interface FavoriteEntry {
  productId: string;
  productSlug: string;
  productTitle: string;
  visitorId: string;
  likedAt: string;
}

function getAdminToken(): string {
  try { return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8")).token; }
  catch { return "fairrugs2026admin"; }
}

function isAdmin(req: NextRequest): boolean {
  return req.headers.get("x-admin-key") === getAdminToken();
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FAVORITES_FILE)) fs.writeFileSync(FAVORITES_FILE, "[]");
}

function loadFavorites(): FavoriteEntry[] {
  ensureFile();
  try { return JSON.parse(fs.readFileSync(FAVORITES_FILE, "utf-8")); }
  catch { return []; }
}

function saveFavorites(data: FavoriteEntry[]) {
  ensureFile();
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(data, null, 2));
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  const visitorId = url.searchParams.get("visitorId");
  const all = url.searchParams.get("all");

  const favorites = loadFavorites();

  if (all === "1" && isAdmin(req)) {
    // Admin: return aggregated stats
    const countByProduct: Record<string, { count: number; productId: string; productSlug: string; productTitle: string; lastLiked: string }> = {};
    for (const f of favorites) {
      if (!countByProduct[f.productId]) {
        countByProduct[f.productId] = { count: 0, productId: f.productId, productSlug: f.productSlug, productTitle: f.productTitle, lastLiked: f.likedAt };
      }
      countByProduct[f.productId].count++;
      if (new Date(f.likedAt) > new Date(countByProduct[f.productId].lastLiked)) {
        countByProduct[f.productId].lastLiked = f.likedAt;
      }
    }
    return NextResponse.json({
      total: favorites.length,
      byProduct: Object.values(countByProduct).sort((a, b) => b.count - a.count),
      recent: favorites.slice().sort((a, b) => new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()).slice(0, 20),
    });
  }

  if (productId) {
    const count = favorites.filter((f) => f.productId === productId).length;
    const liked = visitorId ? favorites.some((f) => f.productId === productId && f.visitorId === visitorId) : false;
    return NextResponse.json({ count, liked });
  }

  return NextResponse.json({ total: favorites.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { productId: string; productSlug?: string; productTitle?: string; visitorId: string };
    if (!body.productId || !body.visitorId) {
      return NextResponse.json({ error: "productId and visitorId required" }, { status: 400 });
    }

    const favorites = loadFavorites();
    const existingIdx = favorites.findIndex((f) => f.productId === body.productId && f.visitorId === body.visitorId);

    if (existingIdx >= 0) {
      // Unlike
      favorites.splice(existingIdx, 1);
      saveFavorites(favorites);
      const count = favorites.filter((f) => f.productId === body.productId).length;
      return NextResponse.json({ liked: false, count });
    } else {
      // Like
      favorites.push({
        productId: body.productId,
        productSlug: body.productSlug || "",
        productTitle: body.productTitle || "",
        visitorId: body.visitorId,
        likedAt: new Date().toISOString(),
      });
      saveFavorites(favorites);
      const count = favorites.filter((f) => f.productId === body.productId).length;
      return NextResponse.json({ liked: true, count });
    }
  } catch (err) {
    console.error("[Favorites] POST error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
