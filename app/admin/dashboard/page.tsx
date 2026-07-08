"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "../../data/products";

const ADMIN_KEY = "fairrugs2026admin";

const MENU_ITEMS = [
  { label: "Dashboard", icon: "📊", id: "dashboard" },
  { label: "Products", icon: "🧶", id: "products" },
  { label: "Messages", icon: "✉️", id: "messages" },
  { label: "B2B Inquiries", icon: "🤝", id: "b2b" },
  { label: "Custom Requests", icon: "🎨", id: "custom" },
  { label: "All Inquiries", icon: "📋", id: "inquiries" },
  { label: "Testimonials", icon: "⭐", id: "testimonials" },
  { label: "FAQ", icon: "❓", id: "faq" },
  { label: "Newsletter", icon: "📧", id: "newsletter" },
  { label: "SEO Settings", icon: "🔍", id: "seo" },
  { label: "Shipping", icon: "🚚", id: "shipping" },
  { label: "Policies", icon: "📄", id: "policies" },
  { label: "Analytics", icon: "📈", id: "analytics" },
];

interface Inquiry {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  name?: string;
  email?: string;
  message?: string;
  companyName?: string;
  businessType?: string;
  quantity?: string;
  country?: string;
  productTitle?: string;
  selectedSize?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token !== ADMIN_KEY) {
      router.replace("/admin/login");
    }
  }, [router]);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch {
      setInquiries([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (["messages", "b2b", "custom", "inquiries"].includes(activeSection)) {
      fetchInquiries();
    }
  }, [activeSection, fetchInquiries]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify({ id, status }),
    });
    fetchInquiries();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const filterInquiries = (type?: string) => {
    if (!type) return inquiries;
    return inquiries.filter((i) => i.type === type);
  };

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    b2b: inquiries.filter((i) => i.type === "b2b").length,
    contact: inquiries.filter((i) => i.type === "contact").length,
    product: inquiries.filter((i) => i.type === "product").length,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "260px" : "64px",
        background: "#1c2c15",
        minHeight: "100vh",
        position: "fixed",
        left: 0, top: 0,
        zIndex: 100,
        transition: "width 0.3s ease",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#b8975a", fontSize: "18px", flexShrink: 0, lineHeight: 1,
            }}
          >
            ☰
          </button>
          {sidebarOpen && (
            <div>
              <div style={{ color: "#fff", fontSize: "15px", fontWeight: 700, letterSpacing: "0.08em" }}>
                THE FAIR RUGS
              </div>
              <div style={{ color: "#b8975a", fontSize: "10px", letterSpacing: "0.2em" }}>ADMIN PANEL</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 8px", overflow: "auto" }}>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                width: "100%", padding: "11px 12px",
                background: activeSection === item.id ? "rgba(184,151,90,0.15)" : "transparent",
                border: "none", cursor: "pointer",
                borderRadius: "8px", marginBottom: "2px",
                color: activeSection === item.id ? "#b8975a" : "rgba(255,255,255,0.6)",
                fontSize: "13px", fontWeight: activeSection === item.id ? 600 : 400,
                textAlign: "left", transition: "all 0.15s ease",
                borderLeft: activeSection === item.id ? "2px solid #b8975a" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }
              }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: "16px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" target="_blank" style={{ textDecoration: "none" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "12px",
              width: "100%", padding: "10px 12px",
              background: "transparent", border: "none", cursor: "pointer",
              borderRadius: "8px", color: "rgba(255,255,255,0.5)",
              fontSize: "13px", textAlign: "left", whiteSpace: "nowrap",
            }}>
              <span style={{ flexShrink: 0 }}>🌐</span>
              {sidebarOpen && "View Website"}
            </button>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              width: "100%", padding: "10px 12px",
              background: "transparent", border: "none", cursor: "pointer",
              borderRadius: "8px", color: "rgba(255,100,100,0.7)",
              fontSize: "13px", textAlign: "left", whiteSpace: "nowrap",
            }}
          >
            <span style={{ flexShrink: 0 }}>🚪</span>
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? "260px" : "64px",
        flex: 1, background: "#f0ede6",
        minHeight: "100vh",
        transition: "margin-left 0.3s ease",
      }}>
        {/* Top Bar */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #dcd4c5",
          padding: "16px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 50,
          boxShadow: "0 1px 8px rgba(30,40,20,0.06)",
        }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#1c1c1a" }}>
            {MENU_ITEMS.find((m) => m.id === activeSection)?.label}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {stats.new > 0 && (
              <div style={{
                background: "#c1440e", color: "#fff",
                borderRadius: "9999px", padding: "3px 10px",
                fontSize: "12px", fontWeight: 700,
              }}>
                {stats.new} New
              </div>
            )}
            <div style={{ fontSize: "13px", color: "#5c5a52" }}>
              admin@thefairrugs.com
            </div>
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          {/* ── Dashboard ── */}
          {activeSection === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
                {[
                  { label: "Total Inquiries", value: stats.total, icon: "📋", color: "#4a5c3a" },
                  { label: "New Messages", value: stats.new, icon: "🔔", color: "#c1440e" },
                  { label: "B2B Inquiries", value: stats.b2b, icon: "🤝", color: "#6b4f35" },
                  { label: "Products", value: products.length, icon: "🧶", color: "#7a8f6a" },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: "#fff", borderRadius: "16px",
                    padding: "24px 28px", border: "1px solid #ede8de",
                    boxShadow: "0 1px 3px rgba(30,40,20,0.06)",
                  }}>
                    <div style={{ fontSize: "28px", marginBottom: "12px" }}>{stat.icon}</div>
                    <div style={{ fontSize: "32px", fontWeight: 700, color: stat.color, marginBottom: "4px" }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "13px", color: "#8a8878" }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div style={{
                background: "#fff", borderRadius: "16px", padding: "28px",
                border: "1px solid #ede8de", marginBottom: "24px",
              }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a", marginBottom: "20px" }}>
                  Quick Actions
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {[
                    { label: "View All Inquiries", action: () => setActiveSection("inquiries"), color: "#4a5c3a" },
                    { label: "B2B Inquiries", action: () => setActiveSection("b2b"), color: "#6b4f35" },
                    { label: "View Products", action: () => setActiveSection("products"), color: "#7a8f6a" },
                    { label: "Newsletter Subscribers", action: () => setActiveSection("newsletter"), color: "#b8975a" },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.action}
                      style={{
                        padding: "10px 20px",
                        background: btn.color, color: "#fff",
                        border: "none", borderRadius: "9999px",
                        fontSize: "12px", fontWeight: 600,
                        letterSpacing: "0.06em", cursor: "pointer",
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent inquiries summary */}
              <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", border: "1px solid #ede8de" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a", marginBottom: "20px" }}>
                  Inquiry Breakdown
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {[
                    { label: "Contact Messages", value: stats.contact, color: "#4a5c3a" },
                    { label: "Product Inquiries", value: stats.product, color: "#7a8f6a" },
                    { label: "B2B / Wholesale", value: stats.b2b, color: "#6b4f35" },
                  ].map((item) => (
                    <div key={item.label} style={{
                      padding: "20px", background: "#f0ede6",
                      borderRadius: "12px", textAlign: "center",
                    }}>
                      <div style={{ fontSize: "28px", fontWeight: 700, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: "12px", color: "#8a8878", marginTop: "4px" }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Products ── */}
          {activeSection === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <p style={{ color: "#5c5a52", fontSize: "14px" }}>
                  {products.length} products in catalog. To add or edit products, update <code style={{ background: "#f0ede6", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>app/data/products.ts</code>
                </p>
              </div>
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #ede8de", overflow: "hidden" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{
                              width: "48px", height: "48px", borderRadius: "8px",
                              background: "#f0ede6", overflow: "hidden", flexShrink: 0,
                            }}>
                              <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div>
                              <div style={{ fontSize: "14px", fontWeight: 600, color: "#1c1c1a" }}>{p.title}</div>
                              <div style={{ fontSize: "12px", color: "#8a8878" }}>{p.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="status-badge status-replied">{p.category}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: "#4a5c3a" }}>{p.priceDisplay}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${p.inStock ? "status-replied" : "status-closed"}`}>
                            {p.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td>
                          <Link href={`/products/${p.slug}`} target="_blank" style={{
                            color: "#4a5c3a", fontSize: "12px", fontWeight: 600, textDecoration: "none",
                          }}>
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Inquiries ── */}
          {["messages", "b2b", "custom", "inquiries"].includes(activeSection) && (
            <div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#8a8878" }}>Loading inquiries...</div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                    {["all", "new", "pending", "replied"].map((status) => (
                      <button key={status} style={{
                        padding: "8px 20px", borderRadius: "9999px",
                        border: "1.5px solid #dcd4c5",
                        background: "transparent", color: "#5c5a52",
                        fontSize: "12px", fontWeight: 600, cursor: "pointer",
                        textTransform: "capitalize",
                      }}>
                        {status === "all" ? `All (${filterInquiries(activeSection === "b2b" ? "b2b" : activeSection === "messages" ? "contact" : undefined).length})` : status}
                      </button>
                    ))}
                  </div>

                  <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #ede8de", overflow: "hidden" }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Contact</th>
                          <th>Type</th>
                          <th>Details</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterInquiries(
                          activeSection === "b2b" ? "b2b" :
                          activeSection === "messages" ? "contact" :
                          activeSection === "custom" ? "custom" : undefined
                        ).map((inq) => (
                          <tr key={inq.id}>
                            <td>
                              <div style={{ fontSize: "14px", fontWeight: 600, color: "#1c1c1a" }}>
                                {inq.name || inq.companyName || "—"}
                              </div>
                              <div style={{ fontSize: "12px", color: "#8a8878" }}>{inq.email || "—"}</div>
                              <div style={{ fontSize: "11px", color: "#b0a898" }}>{inq.country || ""}</div>
                            </td>
                            <td>
                              <span className={`status-badge ${inq.type === "b2b" ? "status-pending" : inq.type === "product" ? "status-replied" : "status-new"}`}>
                                {inq.type}
                              </span>
                            </td>
                            <td style={{ maxWidth: "220px" }}>
                              <div style={{ fontSize: "12px", color: "#5c5a52", lineHeight: 1.5 }}>
                                {inq.productTitle && <div><strong>Product:</strong> {inq.productTitle}</div>}
                                {inq.selectedSize && <div><strong>Size:</strong> {inq.selectedSize}</div>}
                                {inq.businessType && <div><strong>Business:</strong> {inq.businessType}</div>}
                                {inq.quantity && <div><strong>Qty:</strong> {inq.quantity}</div>}
                                {inq.message && (
                                  <div style={{
                                    marginTop: "4px", fontSize: "11px", color: "#8a8878",
                                    overflow: "hidden", textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical" as const,
                                  }}>
                                    {inq.message}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: "12px", color: "#8a8878" }}>
                                {new Date(inq.createdAt).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", year: "numeric",
                                })}
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge status-${inq.status}`}>
                                {inq.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {inq.email && (
                                  <a href={`mailto:${inq.email}`} style={{
                                    color: "#4a5c3a", fontSize: "11px",
                                    fontWeight: 600, textDecoration: "none",
                                    padding: "4px 10px", border: "1px solid #c8d4b8",
                                    borderRadius: "9999px",
                                  }}>
                                    Reply
                                  </a>
                                )}
                                {inq.status === "new" && (
                                  <button
                                    onClick={() => updateStatus(inq.id, "replied")}
                                    style={{
                                      color: "#7a8f6a", fontSize: "11px",
                                      fontWeight: 600, background: "transparent",
                                      border: "1px solid #c8d4b8",
                                      borderRadius: "9999px", cursor: "pointer",
                                      padding: "4px 10px",
                                    }}
                                  >
                                    Mark Replied
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filterInquiries(
                      activeSection === "b2b" ? "b2b" :
                      activeSection === "messages" ? "contact" : undefined
                    ).length === 0 && (
                      <div style={{ textAlign: "center", padding: "60px", color: "#8a8878" }}>
                        No inquiries found
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Other Sections ── */}
          {["testimonials", "faq", "newsletter", "seo", "shipping", "policies", "analytics"].includes(activeSection) && (
            <div style={{
              background: "#fff", borderRadius: "16px",
              padding: "48px", border: "1px solid #ede8de",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>
                {MENU_ITEMS.find((m) => m.id === activeSection)?.icon}
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#1c1c1a", marginBottom: "12px" }}>
                {MENU_ITEMS.find((m) => m.id === activeSection)?.label}
              </h3>
              <p style={{ color: "#8a8878", fontSize: "15px", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 28px" }}>
                This section allows you to manage {MENU_ITEMS.find((m) => m.id === activeSection)?.label?.toLowerCase()} settings for your website. Content management via the dashboard is coming soon — edit the relevant data files directly for now.
              </p>
              <div style={{
                display: "inline-flex", gap: "8px",
                background: "#f0ede6", borderRadius: "8px",
                padding: "12px 20px", fontSize: "13px",
                color: "#5c5a52", fontFamily: "monospace",
              }}>
                app/data/{activeSection}.json
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #5c5a52; padding: 14px 16px; border-bottom: 2px solid #ede8de; text-align: left; background: #faf8f4; }
        .data-table td { padding: 14px 16px; border-bottom: 1px solid #ede8de; font-size: 14px; color: #1c1c1a; vertical-align: top; }
        .data-table tr:hover td { background: #f8f5ee; }
        .status-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
        .status-new { background: #dbeafe; color: #1d4ed8; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-replied { background: #d1fae5; color: #065f46; }
        .status-closed { background: #e5e7eb; color: #374151; }
      `}</style>
    </div>
  );
}
