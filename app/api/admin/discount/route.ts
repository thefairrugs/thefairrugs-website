import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DISCOUNT_FILE = path.join(DATA_DIR, "discount.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

interface DiscountConfig {
  enabled: boolean;
  type: "percent" | "fixed";
  value: number;
  label: string;
  startDate: string;
  endDate: string;
}

function getAdminToken(): string {
  try { return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8")).token; }
  catch { return "fairrugs2026admin"; }
}

function isAuthorized(req: NextRequest): boolean {
  const token = getAdminToken();
  return req.headers.get("x-admin-key") === token || req.cookies.get("admin_token")?.value === token;
}

function loadDiscount(): DiscountConfig {
  try {
    if (!fs.existsSync(DISCOUNT_FILE)) return getDefault();
    return JSON.parse(fs.readFileSync(DISCOUNT_FILE, "utf-8"));
  } catch { return getDefault(); }
}

function getDefault(): DiscountConfig {
  return { enabled: false, type: "percent", value: 20, label: "SALE", startDate: "", endDate: "" };
}

function saveDiscount(d: DiscountConfig) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DISCOUNT_FILE, JSON.stringify(d, null, 2));
}

function isDiscountActive(d: DiscountConfig): boolean {
  if (!d.enabled) return false;
  const now = Date.now();
  if (d.startDate && new Date(d.startDate).getTime() > now) return false;
  if (d.endDate && new Date(d.endDate).getTime() < now) return false;
  return true;
}

// GET — public: returns effective discount (enabled only if within date range)
export async function GET() {
  const d = loadDiscount();
  return NextResponse.json({
    ...d,
    active: isDiscountActive(d),
  });
}

// PUT — admin: update discount settings
export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const current = loadDiscount();
    const updated: DiscountConfig = {
      enabled: body.enabled !== undefined ? body.enabled : current.enabled,
      type: body.type || current.type,
      value: body.value !== undefined ? Number(body.value) : current.value,
      label: body.label || current.label,
      startDate: body.startDate !== undefined ? body.startDate : current.startDate,
      endDate: body.endDate !== undefined ? body.endDate : current.endDate,
    };
    saveDiscount(updated);
    return NextResponse.json({ success: true, discount: { ...updated, active: isDiscountActive(updated) } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
