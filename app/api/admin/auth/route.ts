import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "admin@thefairrugs.com";
const ADMIN_PASSWORD = "FairRugs@2026#Admin";
const ADMIN_KEY = "fairrugs2026admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ success: true, token: ADMIN_KEY });
      res.cookies.set("admin_token", ADMIN_KEY, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return res;
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_token");
  return res;
}
