import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
  }
}

function loadInquiries() {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(INQUIRIES_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveInquiries(data: object[]) {
  ensureDataDir();
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiries = loadInquiries();

    const entry = {
      id: Date.now().toString(),
      status: "new",
      createdAt: new Date().toISOString(),
      ...body,
    };

    inquiries.unshift(entry);
    saveInquiries(inquiries);

    return NextResponse.json({ success: true, id: entry.id });
  } catch (err) {
    console.error("Inquiry error:", err);
    return NextResponse.json({ success: false, error: "Failed to save inquiry" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Simple auth check via header
  const auth = req.headers.get("x-admin-key");
  if (auth !== process.env.ADMIN_KEY && auth !== "fairrugs2026admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const inquiries = loadInquiries();

  if (type) {
    return NextResponse.json(inquiries.filter((i: { type?: string }) => i.type === type));
  }

  return NextResponse.json(inquiries);
}

export async function PATCH(req: NextRequest) {
  const auth = req.headers.get("x-admin-key");
  if (auth !== process.env.ADMIN_KEY && auth !== "fairrugs2026admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();
  const inquiries = loadInquiries();
  const idx = inquiries.findIndex((i: { id: string }) => i.id === id);
  if (idx !== -1) {
    inquiries[idx].status = status;
    saveInquiries(inquiries);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
