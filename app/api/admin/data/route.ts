import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ADMIN_KEY = "fairrugs2026admin";
const DATA_DIR = path.join(process.cwd(), "data");

function isAuthed(req: NextRequest) {
  const cookie = req.cookies.get("admin_token")?.value;
  const header = req.headers.get("x-admin-key");
  return cookie === ADMIN_KEY || header === ADMIN_KEY;
}

function getFilePath(key: string) {
  const safe = key.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(DATA_DIR, `${safe}.json`);
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = new URL(req.url).searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  ensureDataDir();
  const file = getFilePath(key);

  if (!fs.existsSync(file)) {
    return NextResponse.json([]);
  }

  try {
    return NextResponse.json(JSON.parse(fs.readFileSync(file, "utf-8")));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key, data } = await req.json();
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  ensureDataDir();
  const file = getFilePath(key);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  return NextResponse.json({ success: true });
}
