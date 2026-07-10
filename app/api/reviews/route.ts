/**
 * /api/reviews — Product Review System
 *
 * GET  /api/reviews?productId=xxx   — public: get reviews for a product
 * GET  /api/reviews?all=1           — admin: get all reviews (requires x-admin-key)
 * POST /api/reviews                 — public: submit a new review (pending approval)
 * PUT  /api/reviews                 — admin: update review (approve/edit/delete)
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

export interface Review {
  id: string;
  productId: string;
  productSlug: string;
  productTitle: string;
  customerName: string;
  customerCountry: string;
  rating: number; // 1-5
  title: string;
  body: string;
  photos: string[]; // URLs
  verifiedPurchase: boolean;
  approved: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  orderId?: string;
  helpful?: number;
}

function getAdminToken(): string {
  try { return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8")).token; }
  catch { return "fairrugs2026admin"; }
}

function isAdmin(req: NextRequest): boolean {
  const token = getAdminToken();
  return req.headers.get("x-admin-key") === token;
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(REVIEWS_FILE)) fs.writeFileSync(REVIEWS_FILE, "[]");
}

function loadReviews(): Review[] {
  ensureFile();
  try { return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8")); }
  catch { return []; }
}

function saveReviews(reviews: Review[]) {
  ensureFile();
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

// GET — fetch reviews
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  const all = url.searchParams.get("all");

  const reviews = loadReviews();

  // Admin: return all reviews
  if (all === "1" && isAdmin(req)) {
    return NextResponse.json(reviews);
  }

  // Public: return approved reviews for a product
  if (productId) {
    const filtered = reviews
      .filter((r) => r.productId === productId && r.approved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(filtered);
  }

  // Public: return all approved reviews (for home page / summary)
  const approved = reviews.filter((r) => r.approved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(approved);
}

// POST — submit a new review
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<Review> & { adminCreate?: boolean };
    const admin = isAdmin(req);

    if (!body.productId || !body.customerName || !body.rating || !body.body) {
      return NextResponse.json({ error: "productId, customerName, rating, and body are required" }, { status: 400 });
    }
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const review: Review = {
      id: crypto.randomBytes(8).toString("hex"),
      productId: body.productId,
      productSlug: body.productSlug || "",
      productTitle: body.productTitle || "",
      customerName: (body.customerName || "").trim(),
      customerCountry: (body.customerCountry || "").trim(),
      rating: Math.round(body.rating),
      title: (body.title || "").trim(),
      body: (body.body || "").trim(),
      photos: Array.isArray(body.photos) ? body.photos : [],
      verifiedPurchase: body.verifiedPurchase === true,
      approved: admin ? true : false, // admin-created reviews auto-approved
      featured: false,
      createdAt: now,
      updatedAt: now,
      orderId: body.orderId || undefined,
      helpful: 0,
    };

    const reviews = loadReviews();
    reviews.unshift(review);
    saveReviews(reviews);

    return NextResponse.json({ success: true, id: review.id, approved: review.approved });
  } catch (err) {
    console.error("[Reviews] POST error:", err);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}

// PUT — admin: update review (approve, edit, feature, delete)
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json() as { id: string; action?: string } & Partial<Review>;

    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const reviews = loadReviews();
    const idx = reviews.findIndex((r) => r.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    if (body.action === "delete") {
      reviews.splice(idx, 1);
      saveReviews(reviews);
      return NextResponse.json({ success: true });
    }

    // Merge fields
    const updated: Review = {
      ...reviews[idx],
      ...(body.approved !== undefined && { approved: body.approved }),
      ...(body.featured !== undefined && { featured: body.featured }),
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.body !== undefined && { body: body.body }),
      ...(body.customerName !== undefined && { customerName: body.customerName }),
      ...(body.customerCountry !== undefined && { customerCountry: body.customerCountry }),
      ...(body.verifiedPurchase !== undefined && { verifiedPurchase: body.verifiedPurchase }),
      ...(body.helpful !== undefined && { helpful: body.helpful }),
      updatedAt: new Date().toISOString(),
    };

    reviews[idx] = updated;
    saveReviews(reviews);
    return NextResponse.json({ success: true, review: updated });
  } catch (err) {
    console.error("[Reviews] PUT error:", err);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}
