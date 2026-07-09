import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

function getAdminToken(): string {
  try { return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8")).token; }
  catch { return "fairrugs2026admin"; }
}

function isAuthorized(req: NextRequest): boolean {
  const token = getAdminToken();
  return req.headers.get("x-admin-key") === token || req.cookies.get("admin_token")?.value === token;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(INQUIRIES_FILE)) fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
}

function loadInquiries() {
  ensureDataDir();
  try { return JSON.parse(fs.readFileSync(INQUIRIES_FILE, "utf-8")); }
  catch { return []; }
}

function saveInquiries(data: object[]) {
  ensureDataDir();
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2));
}

// Simple email notification via mailto link stored in log
// Real email sending requires SMTP/API key — we log the intent and provide
// instructions in the admin panel to configure SMTP.
async function sendEmailNotification(inquiry: Record<string, unknown>) {
  // If SMTP env vars are set, attempt to send via fetch to a mail API
  // For now we simply log — owner can connect SendGrid/Nodemailer later
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "thefairrugs@gmail.com";
  const SMTP_API_KEY = process.env.SENDGRID_API_KEY;

  if (SMTP_API_KEY) {
    try {
      const subject = `New ${inquiry.type || "website"} inquiry from ${inquiry.name || "visitor"}`;
      const htmlBody = `
        <h2>New Inquiry — The Fair Rugs</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%">
          ${Object.entries(inquiry).map(([k, v]) =>
            `<tr><td style="font-weight:bold;padding:6px;background:#f5f5f5;border:1px solid #ddd">${k}</td>
             <td style="padding:6px;border:1px solid #ddd">${String(v)}</td></tr>`
          ).join("")}
        </table>
        <p style="margin-top:16px;color:#666">Login to your admin panel at /admin to manage this inquiry.</p>
      `;

      await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SMTP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: NOTIFY_EMAIL }] }],
          from: { email: "noreply@thefairrugs.com", name: "The Fair Rugs Website" },
          subject,
          content: [{ type: "text/html", value: htmlBody }],
        }),
      });
    } catch (e) {
      console.error("Email send failed:", e);
    }
  }
  // Always log to console for debugging
  console.log(`[Inquiry] New ${inquiry.type} from ${inquiry.name} <${inquiry.email}>`);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiries = loadInquiries();

    const entry: Record<string, unknown> = {
      id: Date.now().toString(),
      status: "new",
      createdAt: new Date().toISOString(),
      ...body,
    };

    inquiries.unshift(entry);
    saveInquiries(inquiries);

    // Fire-and-forget email notification
    sendEmailNotification(entry).catch(() => {});

    return NextResponse.json({ success: true, id: entry.id });
  } catch (err) {
    console.error("Inquiry error:", err);
    return NextResponse.json({ success: false, error: "Failed to save inquiry" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search")?.toLowerCase();
  let inquiries = loadInquiries();

  if (type && type !== "all") inquiries = inquiries.filter((i: { type?: string }) => i.type === type);
  if (status && status !== "all") inquiries = inquiries.filter((i: { status?: string }) => i.status === status);
  if (search) {
    inquiries = inquiries.filter((i: Record<string, unknown>) =>
      Object.values(i).some((v) => String(v || "").toLowerCase().includes(search))
    );
  }

  return NextResponse.json(inquiries);
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, status, notes, replies } = body;
  const inquiries = loadInquiries();
  const idx = inquiries.findIndex((i: { id: string }) => i.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status) inquiries[idx].status = status;
  if (notes !== undefined) inquiries[idx].adminNotes = notes;
  if (replies !== undefined) inquiries[idx].replies = replies;
  inquiries[idx].updatedAt = new Date().toISOString();
  saveInquiries(inquiries);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const inquiries = loadInquiries().filter((i: { id: string }) => i.id !== id);
  saveInquiries(inquiries);
  return NextResponse.json({ success: true });
}
