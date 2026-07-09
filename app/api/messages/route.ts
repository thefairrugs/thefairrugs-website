/**
 * /api/messages — Two-way messaging thread for customer ↔ admin communication.
 *
 * Every inquiry has a unique messageToken generated when the inquiry is created.
 * The token appears in the customer's email notification as a secure link:
 *   https://thefairrugs.com/messages/[token]
 *
 * GET  /api/messages?token=XXX          — customer fetches their thread (public, token-gated)
 * POST /api/messages                    — customer posts a reply to their thread
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

function loadInquiries(): Record<string, unknown>[] {
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function saveInquiries(data: Record<string, unknown>[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2));
}

/** Generate a secure random token if the inquiry doesn't have one yet */
export function ensureToken(inq: Record<string, unknown>): string {
  if (inq.messageToken && typeof inq.messageToken === "string") return inq.messageToken;
  return crypto.randomBytes(24).toString("hex");
}

// ── GET — customer fetches their thread by token ──────────────────────────────
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const inquiries = loadInquiries();
  const inq = inquiries.find((i) => i.messageToken === token);
  if (!inq) return NextResponse.json({ error: "Thread not found. The link may have expired." }, { status: 404 });

  // Return only safe fields for the customer
  return NextResponse.json({
    id: inq.id,
    name: inq.name,
    email: inq.email,
    type: inq.type,
    status: inq.status,
    createdAt: inq.createdAt,
    // The thread: all messages (admin + customer) in chronological order
    thread: Array.isArray(inq.thread) ? inq.thread : [],
    // Summary fields for display
    productTitle: inq.productTitle,
    notes: inq.notes,
    message: inq.message,
    selectedSize: inq.selectedSize,
  });
}

// ── POST — customer posts a reply to their thread ─────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, message } = body;

    if (!token || !message?.trim()) {
      return NextResponse.json({ error: "token and message are required" }, { status: 400 });
    }

    const inquiries = loadInquiries();
    const idx = inquiries.findIndex((i) => i.messageToken === token);
    if (idx === -1) {
      return NextResponse.json({ error: "Thread not found." }, { status: 404 });
    }

    const inq = inquiries[idx];
    const thread = Array.isArray(inq.thread) ? [...(inq.thread as Record<string, unknown>[])] : [];

    thread.push({
      id: Date.now().toString(),
      from: "customer",
      senderName: inq.name || "Customer",
      message: message.trim(),
      date: new Date().toISOString(),
      read: false, // admin hasn't read this yet
    });

    inquiries[idx] = {
      ...inq,
      thread,
      status: inq.status === "new" ? "contacted" : inq.status,
      updatedAt: new Date().toISOString(),
      // Flag that there's an unread customer reply
      hasUnreadCustomerReply: true,
    };

    saveInquiries(inquiries);

    // Notify admin via email if SENDGRID is configured
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "thefairrugs@gmail.com";
    if (SENDGRID_API_KEY) {
      try {
        await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: NOTIFY_EMAIL }] }],
            from: { email: "noreply@thefairrugs.com", name: "The Fair Rugs — Message Center" },
            subject: `Customer Reply from ${inq.name || "customer"} — The Fair Rugs`,
            content: [{
              type: "text/html",
              value: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
                  <h2 style="color:#4a5c3a">New Customer Reply</h2>
                  <p><strong>${inq.name || "A customer"}</strong> has replied to their inquiry.</p>
                  <div style="background:#f8f6f0;border-left:4px solid #4a5c3a;padding:16px;margin:16px 0;border-radius:4px">
                    <p style="margin:0;font-size:15px">${message.trim()}</p>
                  </div>
                  <p style="margin-top:24px">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://thefairrugs.com"}/admin/dashboard"
                       style="background:#4a5c3a;color:#fff;padding:12px 28px;border-radius:9999px;text-decoration:none;font-weight:bold">
                      View in Admin Panel →
                    </a>
                  </p>
                </div>
              `,
            }],
          }),
        });
      } catch { /* silent — don't fail the API call */ }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
