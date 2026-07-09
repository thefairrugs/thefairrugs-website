import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

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

function loadInquiries(): Record<string, unknown>[] {
  ensureDataDir();
  try { return JSON.parse(fs.readFileSync(INQUIRIES_FILE, "utf-8")); }
  catch { return []; }
}

function saveInquiries(data: object[]) {
  ensureDataDir();
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thefairrugs.com";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "thefairrugs@gmail.com";
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

/** Send email via SendGrid — fails silently if key not set */
async function sendEmail({
  to, subject, html,
}: { to: string; subject: string; html: string }) {
  if (!SENDGRID_API_KEY) {
    console.log(`[Email] Would send to ${to}: ${subject}`);
    return;
  }
  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "noreply@thefairrugs.com", name: "The Fair Rugs" },
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    });
    if (!res.ok) console.error("SendGrid error:", res.status, await res.text());
  } catch (e) {
    console.error("Email send failed:", e);
  }
}

// ── POST — create new inquiry ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiries = loadInquiries();

    // Every inquiry gets a unique messageToken for the customer inbox
    const messageToken = crypto.randomBytes(24).toString("hex");
    const inboxUrl = `${SITE_URL}/messages/${messageToken}`;

    const entry: Record<string, unknown> = {
      id: Date.now().toString(),
      status: "new",
      createdAt: new Date().toISOString(),
      messageToken,
      thread: [], // conversation thread starts empty — admin replies go here
      ...body,
    };

    inquiries.unshift(entry);
    saveInquiries(inquiries);

    // Email admin notification
    sendEmail({
      to: NOTIFY_EMAIL,
      subject: `New ${entry.type || "website"} inquiry from ${entry.name || "visitor"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#4a5c3a">New Inquiry — The Fair Rugs</h2>
          <table cellpadding="8" style="border-collapse:collapse;width:100%">
            ${Object.entries(entry)
              .filter(([k]) => !["messageToken", "thread", "id"].includes(k))
              .map(([k, v]) => v && typeof v !== "object"
                ? `<tr>
                    <td style="font-weight:bold;padding:6px;background:#f5f5f5;border:1px solid #ddd;width:35%">${k}</td>
                    <td style="padding:6px;border:1px solid #ddd">${String(v)}</td>
                   </tr>`
                : ""
              ).join("")}
          </table>
          <p style="margin-top:16px">
            <a href="${SITE_URL}/admin/dashboard" style="background:#4a5c3a;color:#fff;padding:12px 28px;border-radius:9999px;text-decoration:none;font-weight:bold">
              Open Admin Panel →
            </a>
          </p>
        </div>
      `,
    }).catch(() => {});

    // Email customer — confirm inquiry received + give them their inbox link
    if (entry.email && typeof entry.email === "string") {
      sendEmail({
        to: entry.email,
        subject: "Your inquiry has been received — The Fair Rugs",
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff">
            <div style="background:#4a5c3a;padding:32px;text-align:center">
              <h1 style="color:#fff;font-size:28px;font-weight:300;margin:0">The Fair Rugs</h1>
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;letter-spacing:0.1em">HANDMADE IN JAIPUR</p>
            </div>
            <div style="padding:40px 32px">
              <h2 style="color:#4a5c3a;font-size:22px;font-weight:400;margin:0 0 16px">
                Thank you, ${entry.name || ""}!
              </h2>
              <p style="color:#5c5a52;font-size:15px;line-height:1.7;margin:0 0 24px">
                We've received your inquiry and our team will reply within 24 hours. You can track our reply and continue the conversation using the button below.
              </p>
              <div style="text-align:center;margin:32px 0">
                <a href="${inboxUrl}"
                   style="background:#4a5c3a;color:#fff;padding:16px 40px;border-radius:9999px;text-decoration:none;font-size:14px;font-weight:bold;display:inline-block">
                  View Your Message Inbox →
                </a>
              </div>
              <p style="color:#8a8878;font-size:13px;line-height:1.7;margin:0">
                Or paste this link in your browser:<br/>
                <a href="${inboxUrl}" style="color:#4a5c3a">${inboxUrl}</a>
              </p>
              <hr style="border:none;border-top:1px solid #e8e4dc;margin:32px 0"/>
              <p style="color:#8a8878;font-size:12px;text-align:center;margin:0">
                Questions? WhatsApp us at <a href="https://wa.me/918416919470" style="color:#4a5c3a">+91 8416 919470</a><br/>
                The Fair Rugs · Handmade in Jaipur, India
              </p>
            </div>
          </div>
        `,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, id: entry.id, messageToken });
  } catch (err) {
    console.error("Inquiry error:", err);
    return NextResponse.json({ success: false, error: "Failed to save inquiry" }, { status: 500 });
  }
}

// ── GET — list inquiries (admin only) ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search")?.toLowerCase();
  let inquiries = loadInquiries();

  if (type && type !== "all") inquiries = inquiries.filter((i) => i.type === type);
  if (status && status !== "all") inquiries = inquiries.filter((i) => i.status === status);
  if (search) {
    inquiries = inquiries.filter((i) =>
      Object.values(i).some((v) => String(v || "").toLowerCase().includes(search))
    );
  }

  return NextResponse.json(inquiries);
}

// ── PATCH — update inquiry (admin only) ──────────────────────────────────────
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, status, notes, replies, emailReply } = body;

  const inquiries = loadInquiries();
  const idx = inquiries.findIndex((i) => i.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const inq = inquiries[idx];

  if (status) inq.status = status;
  if (notes !== undefined) inq.adminNotes = notes;
  if (replies !== undefined) inq.replies = replies;
  inq.updatedAt = new Date().toISOString();

  // ── Email Reply: store in thread + email the customer ────────────────────────
  if (emailReply && typeof emailReply === "string" && emailReply.trim()) {
    const thread = Array.isArray(inq.thread)
      ? [...(inq.thread as Record<string, unknown>[])]
      : [];

    const adminMsg = {
      id: Date.now().toString(),
      from: "admin",
      senderName: "The Fair Rugs Team",
      message: emailReply.trim(),
      date: new Date().toISOString(),
      read: false,
    };
    thread.push(adminMsg);
    inq.thread = thread;
    inq.hasUnreadCustomerReply = false;
    // Auto-set status to "contacted" if still new
    if (!status && inq.status === "new") inq.status = "contacted";

    // Ensure this inquiry has a message token
    if (!inq.messageToken) {
      inq.messageToken = crypto.randomBytes(24).toString("hex");
    }

    const inboxUrl = `${SITE_URL}/messages/${inq.messageToken}`;
    const customerEmail = typeof inq.email === "string" ? inq.email : "";
    const customerName = typeof inq.name === "string" ? inq.name : (typeof inq.companyName === "string" ? inq.companyName : "");

    // Email the customer their reply
    if (customerEmail) {
      sendEmail({
        to: customerEmail,
        subject: "You have a new reply from The Fair Rugs",
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff">
            <div style="background:#4a5c3a;padding:32px;text-align:center">
              <h1 style="color:#fff;font-size:28px;font-weight:300;margin:0">The Fair Rugs</h1>
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;letter-spacing:0.1em">HANDMADE IN JAIPUR</p>
            </div>
            <div style="padding:40px 32px">
              <h2 style="color:#4a5c3a;font-size:22px;font-weight:400;margin:0 0 16px">
                Hi ${customerName || "there"}, you have a new reply!
              </h2>
              <p style="color:#5c5a52;font-size:15px;line-height:1.7;margin:0 0 20px">
                Our team has replied to your inquiry. Here's what they said:
              </p>
              <div style="background:#f8f6f0;border-left:4px solid #4a5c3a;padding:20px 24px;margin:0 0 28px;border-radius:0 8px 8px 0">
                <p style="margin:0;font-size:15px;color:#1c1c1a;line-height:1.7">${emailReply.trim().replace(/\n/g, "<br/>")}</p>
                <p style="margin:12px 0 0;font-size:12px;color:#8a8878">— The Fair Rugs Team</p>
              </div>
              <div style="text-align:center;margin:28px 0">
                <a href="${inboxUrl}"
                   style="background:#4a5c3a;color:#fff;padding:16px 40px;border-radius:9999px;text-decoration:none;font-size:14px;font-weight:bold;display:inline-block">
                  View Full Conversation →
                </a>
              </div>
              <p style="color:#8a8878;font-size:13px;text-align:center;line-height:1.7">
                You can reply directly from your message inbox.<br/>
                <a href="${inboxUrl}" style="color:#4a5c3a">${inboxUrl}</a>
              </p>
              <hr style="border:none;border-top:1px solid #e8e4dc;margin:32px 0"/>
              <p style="color:#8a8878;font-size:12px;text-align:center;margin:0">
                WhatsApp: <a href="https://wa.me/918416919470" style="color:#4a5c3a">+91 8416 919470</a><br/>
                The Fair Rugs · Handmade in Jaipur, India
              </p>
            </div>
          </div>
        `,
      }).catch(() => {});
    }
  }

  inquiries[idx] = inq;
  saveInquiries(inquiries);
  return NextResponse.json({ success: true });
}

// ── DELETE — remove inquiry (admin only) ─────────────────────────────────────
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const inquiries = loadInquiries().filter((i) => i.id !== id);
  saveInquiries(inquiries);
  return NextResponse.json({ success: true });
}
