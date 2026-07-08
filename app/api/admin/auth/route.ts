import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

interface AdminConfig {
  email: string;
  password: string;
  token: string;
}

function loadAdmin(): AdminConfig {
  try {
    if (!fs.existsSync(ADMIN_FILE)) {
      const defaults: AdminConfig = {
        email: "admin@thefairrugs.com",
        password: "FairRugs@2026#Admin",
        token: "fairrugs2026admin",
      };
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaults, null, 2));
      return defaults;
    }
    return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8"));
  } catch {
    return { email: "admin@thefairrugs.com", password: "FairRugs@2026#Admin", token: "fairrugs2026admin" };
  }
}

function saveAdmin(config: AdminConfig) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(config, null, 2));
}

function isAuthorized(req: NextRequest): boolean {
  const admin = loadAdmin();
  const headerKey = req.headers.get("x-admin-key");
  const cookieKey = req.cookies.get("admin_token")?.value;
  return headerKey === admin.token || cookieKey === admin.token;
}

// POST /api/admin/auth — login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Login
    if (body.action === "login" || (!body.action && body.email && body.password)) {
      const admin = loadAdmin();
      if (body.email === admin.email && body.password === admin.password) {
        const res = NextResponse.json({ success: true, token: admin.token });
        res.cookies.set("admin_token", admin.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
        return res;
      }
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Change credentials
    if (body.action === "change-credentials") {
      if (!isAuthorized(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const admin = loadAdmin();
      const updated: AdminConfig = {
        email: body.newEmail || admin.email,
        password: body.newPassword || admin.password,
        token: admin.token,
      };
      saveAdmin(updated);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_token");
  return res;
}

// GET /api/admin/auth — verify token
export async function GET(req: NextRequest) {
  if (isAuthorized(req)) {
    const admin = loadAdmin();
    return NextResponse.json({ valid: true, email: admin.email });
  }
  return NextResponse.json({ valid: false }, { status: 401 });
}
