import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PRICING_FILE = path.join(DATA_DIR, "pricing.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

const DEFAULT_PRICING = [
  { id:"hand-knotted", name:"Hand Knotted", pricePerSqft:16 },
  { id:"hand-tufted",  name:"Hand Tufted",  pricePerSqft:11 },
  { id:"durrie",       name:"Durrie",        pricePerSqft:8  },
  { id:"jute",         name:"Jute",          pricePerSqft:9  },
];

function getAdminToken(): string {
  try { return JSON.parse(fs.readFileSync(ADMIN_FILE,"utf-8")).token; }
  catch { return "fairrugs2026admin"; }
}
function isAuthorized(req: NextRequest): boolean {
  const t = getAdminToken();
  return req.headers.get("x-admin-key") === t || req.cookies.get("admin_token")?.value === t;
}
function loadPricing() {
  try {
    if (!fs.existsSync(PRICING_FILE)) return DEFAULT_PRICING;
    return JSON.parse(fs.readFileSync(PRICING_FILE,"utf-8")) || DEFAULT_PRICING;
  } catch { return DEFAULT_PRICING; }
}
function savePricing(data: object[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR,{recursive:true});
  fs.writeFileSync(PRICING_FILE, JSON.stringify(data, null, 2));
}

// GET — public, returns all pricing
export async function GET() {
  return NextResponse.json(loadPricing());
}

// PUT — update one or all pricing entries (admin only)
export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error:"Unauthorized" },{status:401});
  const body = await req.json();
  // body can be array (replace all) or single { id, pricePerSqft }
  if (Array.isArray(body)) {
    savePricing(body);
    return NextResponse.json({ success:true, pricing:body });
  }
  const all = loadPricing() as Array<{ id:string; pricePerSqft:number; [key:string]:unknown }>;
  const idx = all.findIndex(p => p.id === body.id);
  if (idx === -1) return NextResponse.json({ error:"Not found" },{status:404});
  all[idx] = { ...all[idx], pricePerSqft: Number(body.pricePerSqft) };
  savePricing(all);
  return NextResponse.json({ success:true, pricing:all });
}
