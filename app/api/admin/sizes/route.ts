import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SIZES_FILE = path.join(DATA_DIR, "sizes.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

// ── Static fallback (if file missing) ────────────────────────────────────────
const STATIC_SIZES = [
  { id:"r-3x5",   shape:"Rectangular", name:"3 x 5 ft",    cm:"91 x 152 cm",  sqft:15,    active:true },
  { id:"r-4x6",   shape:"Rectangular", name:"4 x 6 ft",    cm:"121 x 182 cm", sqft:24,    active:true },
  { id:"r-5x8",   shape:"Rectangular", name:"5 x 8 ft",    cm:"152 x 243 cm", sqft:40,    active:true },
  { id:"r-8x10",  shape:"Rectangular", name:"8 x 10 ft",   cm:"243 x 304 cm", sqft:80,    active:true },
  { id:"r-9x12",  shape:"Rectangular", name:"9 x 12 ft",   cm:"274 x 365 cm", sqft:108,   active:true },
  { id:"rn-2x8",  shape:"Runner",      name:"2 x 8 ft",    cm:"61 x 243 cm",  sqft:16,    active:true },
  { id:"ro-6",    shape:"Round",       name:"6 ft Round",  cm:"182 cm dia",   sqft:28.3,  active:true },
];

function getAdminToken(): string {
  try { return JSON.parse(fs.readFileSync(ADMIN_FILE,"utf-8")).token; }
  catch { return "fairrugs2026admin"; }
}
function isAuthorized(req: NextRequest): boolean {
  const t = getAdminToken();
  return req.headers.get("x-admin-key") === t || req.cookies.get("admin_token")?.value === t;
}

function loadSizes() {
  try {
    if (!fs.existsSync(SIZES_FILE)) return STATIC_SIZES;
    return JSON.parse(fs.readFileSync(SIZES_FILE,"utf-8")) || STATIC_SIZES;
  } catch { return STATIC_SIZES; }
}
function saveSizes(data: object[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR,{recursive:true});
  fs.writeFileSync(SIZES_FILE, JSON.stringify(data, null, 2));
}

// GET — public, returns all active sizes (or all if admin key provided)
export async function GET(req: NextRequest) {
  const all = loadSizes();
  const admin = isAuthorized(req);
  // Public gets only active; admin gets everything
  return NextResponse.json(admin ? all : all.filter((s:{ active:boolean }) => s.active !== false));
}

// POST — create a new size (admin only)
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error:"Unauthorized" },{status:401});
  const body = await req.json();
  const all = loadSizes();
  const newSize = {
    id: body.id || `custom-${Date.now()}`,
    shape: body.shape || "Rectangular",
    name: body.name,
    cm: body.cm || "",
    sqft: Number(body.sqft) || 0,
    active: body.active !== false,
  };
  all.push(newSize);
  saveSizes(all);
  return NextResponse.json({ success:true, size:newSize });
}

// PUT — update a size (admin only)
export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error:"Unauthorized" },{status:401});
  const body = await req.json();
  const all = loadSizes() as Array<{ id:string; [key:string]:unknown }>;
  const idx = all.findIndex(s => s.id === body.id);
  if (idx === -1) return NextResponse.json({ error:"Not found" },{status:404});
  all[idx] = { ...all[idx], ...body };
  saveSizes(all);
  return NextResponse.json({ success:true, size:all[idx] });
}

// DELETE — remove a size (admin only)
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error:"Unauthorized" },{status:401});
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error:"id required" },{status:400});
  const filtered = (loadSizes() as Array<{ id:string }>).filter(s => s.id !== id);
  saveSizes(filtered);
  return NextResponse.json({ success:true });
}
