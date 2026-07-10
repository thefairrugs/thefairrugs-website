/**
 * /api/analytics — Visitor & Page View Tracking
 *
 * POST /api/analytics         — track a page view / product view
 * GET  /api/analytics         — admin: get analytics summary
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

interface PageViewEntry {
  path: string;
  referrer: string;
  device: string;
  country: string;
  ts: number; // Unix timestamp (seconds)
}

interface AnalyticsData {
  pageViews: PageViewEntry[];
  productViews: Record<string, number>;
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
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({ pageViews: [], productViews: {} }, null, 2));
  }
}

function loadAnalytics(): AnalyticsData {
  ensureFile();
  try { return JSON.parse(fs.readFileSync(ANALYTICS_FILE, "utf-8")); }
  catch { return { pageViews: [], productViews: {} }; }
}

function saveAnalytics(data: AnalyticsData) {
  ensureFile();
  // Keep only last 90 days of page views to prevent file bloat
  const cutoff = Date.now() / 1000 - 90 * 86400;
  data.pageViews = data.pageViews.filter((v) => v.ts > cutoff);
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

function detectDevice(ua: string): string {
  if (/mobile|android|iphone|ipad/i.test(ua)) return "mobile";
  if (/tablet/i.test(ua)) return "tablet";
  return "desktop";
}

// POST — track a page view
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { path?: string; productId?: string; referrer?: string };
    const ua = req.headers.get("user-agent") || "";
    const cfCountry = req.headers.get("cf-ipcountry") || req.headers.get("x-country") || "";

    const data = loadAnalytics();

    const entry: PageViewEntry = {
      path: body.path || "/",
      referrer: (body.referrer || "").slice(0, 200),
      device: detectDevice(ua),
      country: cfCountry.toUpperCase().slice(0, 2),
      ts: Math.floor(Date.now() / 1000),
    };

    data.pageViews.push(entry);

    // Track product view count
    if (body.productId) {
      data.productViews[body.productId] = (data.productViews[body.productId] || 0) + 1;
    }

    saveAnalytics(data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// GET — admin analytics summary
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = loadAnalytics();
  const now = Math.floor(Date.now() / 1000);
  const day = 86400;

  const todayViews    = data.pageViews.filter((v) => v.ts > now - day);
  const last7Views    = data.pageViews.filter((v) => v.ts > now - 7 * day);
  const last30Views   = data.pageViews.filter((v) => v.ts > now - 30 * day);
  const last365Views  = data.pageViews.filter((v) => v.ts > now - 365 * day);

  // Unique visitors (by session — approximate via 30-min windows)
  const uniqueVisitors = (views: PageViewEntry[]) => {
    const sessions = new Set(views.map((v) => `${v.device}-${v.country}-${Math.floor(v.ts / 1800)}`));
    return sessions.size;
  };

  // Device breakdown
  const deviceBreakdown = (views: PageViewEntry[]) => {
    const d: Record<string, number> = {};
    for (const v of views) { d[v.device] = (d[v.device] || 0) + 1; }
    return d;
  };

  // Country breakdown
  const countryBreakdown = (views: PageViewEntry[]) => {
    const d: Record<string, number> = {};
    for (const v of views) {
      const c = v.country || "Unknown";
      d[c] = (d[c] || 0) + 1;
    }
    return Object.entries(d).sort((a, b) => b[1] - a[1]).slice(0, 10);
  };

  // Traffic sources
  const trafficSources = (views: PageViewEntry[]) => {
    const d: Record<string, number> = { direct: 0, google: 0, social: 0, referral: 0 };
    for (const v of views) {
      if (!v.referrer) { d.direct++; }
      else if (/google|bing|yahoo|duckduck/i.test(v.referrer)) { d.google++; }
      else if (/facebook|instagram|twitter|tiktok|pinterest/i.test(v.referrer)) { d.social++; }
      else { d.referral++; }
    }
    return d;
  };

  // Daily breakdown for last 30 days
  const dailyViews: { date: string; views: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const dayStart = now - i * day;
    const dayEnd = now - (i - 1) * day;
    const count = data.pageViews.filter((v) => v.ts >= dayStart && v.ts < dayEnd).length;
    const date = new Date(dayStart * 1000).toISOString().slice(0, 10);
    dailyViews.push({ date, views: count });
  }

  // Top pages
  const topPages = (views: PageViewEntry[]) => {
    const d: Record<string, number> = {};
    for (const v of views) { d[v.path] = (d[v.path] || 0) + 1; }
    return Object.entries(d).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, views]) => ({ path, views }));
  };

  return NextResponse.json({
    today:    { views: todayViews.length,   visitors: uniqueVisitors(todayViews)   },
    last7:    { views: last7Views.length,   visitors: uniqueVisitors(last7Views)   },
    last30:   { views: last30Views.length,  visitors: uniqueVisitors(last30Views)  },
    last365:  { views: last365Views.length, visitors: uniqueVisitors(last365Views) },
    total:    { views: data.pageViews.length },
    devices:  deviceBreakdown(last30Views),
    countries: countryBreakdown(last30Views),
    sources:  trafficSources(last30Views),
    dailyViews,
    topPages: topPages(last30Views),
    topProducts: Object.entries(data.productViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([productId, views]) => ({ productId, views })),
  });
}
