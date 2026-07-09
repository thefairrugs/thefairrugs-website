"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface ThreadMessage {
  id: string;
  from: "admin" | "customer";
  senderName: string;
  message: string;
  date: string;
  read?: boolean;
}

interface InquiryThread {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  createdAt: string;
  thread: ThreadMessage[];
  productTitle?: string;
  notes?: string;
  message?: string;
  selectedSize?: string;
}

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  new: { label: "New", bg: "#fee2e2", color: "#dc2626" },
  contacted: { label: "In Progress", bg: "#dbeafe", color: "#1d4ed8" },
  quotation_sent: { label: "Quotation Sent", bg: "#fef9c3", color: "#854d0e" },
  order_confirmed: { label: "Order Confirmed", bg: "#dcfce7", color: "#15803d" },
  closed: { label: "Closed", bg: "#f3f4f6", color: "#6b7280" },
};

export default function MessageInbox({ token }: { token: string }) {
  const [thread, setThread] = useState<InquiryThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchThread = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?token=${token}`, { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "This inbox link is invalid or has expired.");
        return;
      }
      const data = await res.json();
      setThread(data);
    } catch {
      setError("Could not load your messages. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchThread(); }, [fetchThread]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.thread.length]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, message: reply.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setReply("");
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 3000);
        await fetchThread(); // reload thread
      }
    } catch { /* ignore */ }
    setSending(false);
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>✉️</div>
          <p style={{ color: "var(--foreground-muted)", fontSize: "16px" }}>Loading your inbox…</p>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error || !thread) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "480px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>🔒</div>
          <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "32px", fontWeight: 300, color: "var(--foreground)", marginBottom: "16px" }}>
            Inbox Not Found
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px" }}>
            {error || "This inbox link is invalid or has expired."}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary" style={{ padding: "14px 32px" }}>Back to Home</button>
            </Link>
            <a href="https://wa.me/918416919470" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn btn-ghost" style={{ padding: "14px 32px", borderColor: "#25D366", color: "#16a34a" }}>
                WhatsApp Us
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const st = STATUS_LABELS[thread.status] || STATUS_LABELS.new;
  const summary = thread.productTitle || thread.notes?.slice(0, 80) || thread.message?.slice(0, 80) || "";

  return (
    <div style={{ background: "var(--background)", minHeight: "70vh", padding: "48px 0 80px" }}>
      <div className="container" style={{ maxWidth: "780px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em", margin: 0 }}>
              Your Message Inbox
            </h1>
            <span style={{ padding: "4px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, background: st.bg, color: st.color }}>
              {st.label}
            </span>
          </div>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px" }}>
            Hello, <strong>{thread.name}</strong> · Inquiry type: <strong>{thread.type}</strong> · Opened {new Date(thread.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          {summary && (
            <p style={{ color: "var(--foreground-muted)", fontSize: "13px", marginTop: "4px", fontStyle: "italic" }}>
              "{summary.length > 100 ? summary.slice(0, 100) + "…" : summary}"
            </p>
          )}
        </div>

        {/* Conversation thread */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-xl)", overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* Thread header */}
          <div style={{ background: "var(--primary)", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>✉️</span>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "14px", margin: 0 }}>Conversation with The Fair Rugs</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>
                {thread.thread.length === 0 ? "No messages yet — we'll reply within 24 hours." : `${thread.thread.length} message${thread.thread.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ padding: "24px", minHeight: "300px", maxHeight: "540px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Opening inquiry bubble */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ maxWidth: "75%" }}>
                <p style={{ fontSize: "11px", color: "var(--foreground-muted)", textAlign: "right", marginBottom: "4px" }}>
                  {thread.name} · {new Date(thread.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
                <div style={{
                  background: "var(--primary)", color: "#fff",
                  padding: "14px 18px", borderRadius: "18px 18px 4px 18px",
                  fontSize: "14px", lineHeight: 1.7,
                }}>
                  <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, opacity: 0.8, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                    Initial Inquiry
                  </p>
                  {summary || "Inquiry submitted via website."}
                </div>
              </div>
            </div>

            {/* Thread messages */}
            {thread.thread.length === 0 && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>⏳</div>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "15px", lineHeight: 1.7 }}>
                    Our team is reviewing your inquiry.<br />
                    We'll reply here within 24 hours.
                  </p>
                  <a href="https://wa.me/918416919470?text=Hi!+I+just+submitted+an+inquiry+on+your+website." target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <button style={{ marginTop: "16px", padding: "10px 24px", background: "#25D366", color: "#fff", border: "none", borderRadius: "9999px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
                      💬 WhatsApp us instead
                    </button>
                  </a>
                </div>
              </div>
            )}

            {thread.thread.map((msg) => {
              const isAdmin = msg.from === "admin";
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isAdmin ? "flex-start" : "flex-end" }}>
                  <div style={{ maxWidth: "75%" }}>
                    <p style={{ fontSize: "11px", color: "var(--foreground-muted)", textAlign: isAdmin ? "left" : "right", marginBottom: "4px" }}>
                      {msg.senderName} · {new Date(msg.date).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <div style={{
                      padding: "14px 18px",
                      borderRadius: isAdmin ? "4px 18px 18px 18px" : "18px 18px 4px 18px",
                      fontSize: "14px", lineHeight: 1.7,
                      background: isAdmin ? "var(--surface-alt)" : "var(--primary)",
                      color: isAdmin ? "var(--foreground)" : "#fff",
                      border: isAdmin ? "1px solid var(--border-light)" : "none",
                      whiteSpace: "pre-wrap",
                    }}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* Reply box */}
          <div style={{ borderTop: "1px solid var(--border-light)", padding: "20px 24px", background: "var(--surface-alt)" }}>
            {thread.status === "closed" ? (
              <div style={{ padding: "14px 18px", background: "#f3f4f6", borderRadius: "10px", textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                  This conversation is closed. <a href="https://wa.me/918416919470" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", fontWeight: 600 }}>WhatsApp us</a> if you need further help.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReply}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "8px" }}>
                  Send a reply
                </label>
                <textarea
                  rows={3}
                  placeholder="Type your message here…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  disabled={sending}
                  style={{
                    width: "100%", padding: "12px 14px",
                    border: "1.5px solid var(--border)",
                    borderRadius: "10px", fontSize: "14px", outline: "none",
                    color: "var(--foreground)", background: "#fff",
                    resize: "vertical", fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "10px" }}>
                  <p style={{ fontSize: "12px", color: "var(--foreground-muted)", margin: 0 }}>
                    We typically reply within 24 hours.
                  </p>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {sendSuccess && (
                      <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>✅ Message sent!</span>
                    )}
                    <button
                      type="submit"
                      disabled={sending || !reply.trim()}
                      className="btn btn-primary"
                      style={{ padding: "12px 28px", fontSize: "12px", opacity: (sending || !reply.trim()) ? 0.6 : 1 }}
                    >
                      {sending ? "Sending…" : "Send Reply →"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer trust badges */}
        <div style={{ marginTop: "32px", padding: "20px 24px", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", margin: "0 0 4px" }}>🔒</p>
            <p style={{ fontSize: "11px", color: "var(--foreground-muted)", fontWeight: 600, margin: 0 }}>Secure Inbox</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", margin: "0 0 4px" }}>💬</p>
            <p style={{ fontSize: "11px", color: "var(--foreground-muted)", fontWeight: 600, margin: 0 }}>
              <a href="https://wa.me/918416919470" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                WhatsApp: +91 8416 919470
              </a>
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", margin: "0 0 4px" }}>🌍</p>
            <p style={{ fontSize: "11px", color: "var(--foreground-muted)", fontWeight: 600, margin: 0 }}>Free Worldwide Shipping</p>
          </div>
        </div>

      </div>
    </div>
  );
}
