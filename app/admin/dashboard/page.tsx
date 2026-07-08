"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Inquiry {
  id: string; type: string; status: string; createdAt: string;
  name?: string; email?: string; phone?: string; phone_number?: string;
  message?: string; companyName?: string; businessType?: string;
  quantity?: string; country?: string; productTitle?: string;
  selectedSize?: string; estimatedPrice?: string; adminNotes?: string;
  updatedAt?: string;
}

interface Product {
  id: string; slug: string; title: string; category: string; rugType: string;
  material: string; construction: string; image: string; images: string[];
  video?: string;
  badge?: string; inStock: boolean; reviews: number;
  active: boolean; description?: string; longDescription?: string;
  features: string[]; createdAt?: string; updatedAt?: string;
  pile?: string; shape?: string; origin?: string; subtitle?: string;
  leadTime?: string; processingTime?: string; deliveryTime?: string;
  keywords?: string[];
}

interface Category {
  id: string; name: string; slug: string; description: string;
  image: string; active: boolean;
}

interface DiscountConfig {
  enabled: boolean; type: "percent" | "fixed"; value: number;
  label: string; startDate: string; endDate: string; active?: boolean;
}

// ─── Sidebar sections ────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "dashboard",   label: "Dashboard",        icon: "📊" },
  { id: "products",    label: "Products",          icon: "🧶" },
  { id: "add-product", label: "Add Product",       icon: "➕" },
  { id: "categories",  label: "Categories",        icon: "📂" },
  { id: "sizes",       label: "Size Master",        icon: "📐" },
  { id: "pricing",     label: "Pricing",            icon: "💲" },
  { id: "discount",    label: "Discount / Sale",   icon: "🏷️" },
  { id: "inquiries",   label: "All Inquiries",     icon: "📋" },
  { id: "b2b",         label: "B2B Inquiries",     icon: "🤝" },
  { id: "bulk",        label: "Bulk Import/Export", icon: "📦" },
  { id: "settings",    label: "Settings",          icon: "⚙️" },
];

const ADMIN_KEY_LS = "admin_token";

function getAdminKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ADMIN_KEY_LS) || "";
}

function adminHeaders() {
  return { "x-admin-key": getAdminKey(), "Content-Type": "application/json" };
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  // Data state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [discount, setDiscount] = useState<DiscountConfig>({ enabled: false, type: "percent", value: 20, label: "SALE", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(false);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem(ADMIN_KEY_LS);
    if (!token) { router.replace("/admin/login"); return; }
    // Verify token
    fetch("/api/admin/auth", { headers: { "x-admin-key": token } })
      .then((r) => r.json())
      .then((d) => {
        if (!d.valid) { router.replace("/admin/login"); }
        else setAdminEmail(d.email || "");
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/inquiries", { headers: { "x-admin-key": getAdminKey() } });
      const d = await r.json();
      setInquiries(Array.isArray(d) ? d : []);
    } catch { setInquiries([]); }
    setLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/products", { headers: { "x-admin-key": getAdminKey() } });
      const d = await r.json();
      setProducts(Array.isArray(d) ? d : []);
    } catch { setProducts([]); }
    setLoading(false);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/categories", { headers: { "x-admin-key": getAdminKey() } });
      const d = await r.json();
      setCategories(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  const fetchDiscount = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/discount");
      const d = await r.json();
      setDiscount(d);
    } catch {}
  }, []);

  useEffect(() => {
    if (["dashboard", "inquiries", "b2b"].includes(section)) fetchInquiries();
    if (["dashboard", "products", "add-product"].includes(section)) fetchProducts();
    if (["dashboard", "categories", "add-product", "products"].includes(section)) fetchCategories();
    if (section === "discount") fetchDiscount();
  }, [section, fetchInquiries, fetchProducts, fetchCategories, fetchDiscount]);

  // ─── Section-level label lookup (include new sections) ─────────────────────
  const sectionLabel = SECTIONS.find((s) => s.id === section)?.label ?? "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY_LS);
    router.push("/admin/login");
  };

  const stats = {
    totalProducts: products.length,
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter((i) => i.status === "new").length,
    b2bInquiries: inquiries.filter((i) => i.type === "b2b").length,
    activeProducts: products.filter((p) => p.active !== false).length,
  };

  // ── Sidebar ──────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{
      width: sidebarOpen ? "240px" : "64px", flexShrink: 0,
      background: "linear-gradient(180deg, #1c2c15 0%, #2a3a20 100%)",
      display: "flex", flexDirection: "column",
      transition: "width 0.3s ease", overflow: "hidden",
      minHeight: "100vh", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: sidebarOpen ? "24px 20px 16px" : "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {sidebarOpen ? (
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>THE FAIR RUGS</div>
            <div style={{ fontSize: "9px", color: "#7a8f6a", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "3px" }}>Admin Panel</div>
          </div>
        ) : (
          <div style={{ width: "32px", height: "32px", background: "rgba(184,151,90,0.3)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🧶</div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: sidebarOpen ? "11px 14px" : "11px 0", justifyContent: sidebarOpen ? "flex-start" : "center",
              background: section === s.id ? "rgba(184,151,90,0.25)" : "transparent",
              border: section === s.id ? "1px solid rgba(184,151,90,0.3)" : "1px solid transparent",
              borderRadius: "8px", cursor: "pointer", width: "100%",
              color: section === s.id ? "#d4b47e" : "rgba(255,255,255,0.65)",
              fontSize: "13px", fontWeight: section === s.id ? 600 : 400, textAlign: "left",
              transition: "all 0.15s ease", whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "16px", flexShrink: 0 }}>{s.icon}</span>
            {sidebarOpen && s.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {sidebarOpen && (
          <div style={{ padding: "8px 14px 10px", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
            {adminEmail}
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: "10px", padding: "10px 14px", background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", width: "100%", fontSize: "12px" }}
        >
          {sidebarOpen ? "◀ Collapse" : "▶"}
        </button>
        <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: "10px", padding: "10px 14px", color: "rgba(255,255,255,0.5)", fontSize: "12px", textDecoration: "none" }}>
          🌐 {sidebarOpen && "View Website"}
        </Link>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: "10px", padding: "10px 14px", background: "transparent", border: "none", color: "rgba(239,68,68,0.7)", cursor: "pointer", width: "100%", fontSize: "12px" }}>
          🚪 {sidebarOpen && "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f6f0", fontFamily: "system-ui, sans-serif" }}>
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#1c1c1a", letterSpacing: "-0.01em" }}>
            {sectionLabel}
          </h1>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {stats.newInquiries > 0 && (
              <span style={{ background: "#dc2626", color: "#fff", padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700 }}>
                {stats.newInquiries} new
              </span>
            )}
            <span style={{ fontSize: "13px", color: "#5c5a52" }}>{adminEmail}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {section === "dashboard" && <DashboardSection stats={stats} inquiries={inquiries} products={products} setSection={setSection} />}
          {section === "products" && <ProductsSection products={products} categories={categories} onRefresh={fetchProducts} />}
          {section === "add-product" && <AddProductSection categories={categories} onSaved={() => { setSection("products"); fetchProducts(); }} />}
          {section === "categories" && <CategoriesSection categories={categories} onRefresh={fetchCategories} />}
          {section === "sizes"    && <SizeMasterSection />}
          {section === "pricing"  && <PricingSection />}
          {section === "discount" && <DiscountSection discount={discount} onSaved={fetchDiscount} />}
          {section === "inquiries" && <InquiriesSection inquiries={inquiries} loading={loading} onRefresh={fetchInquiries} filter="all" />}
          {section === "b2b" && <InquiriesSection inquiries={inquiries.filter((i) => i.type === "b2b")} loading={loading} onRefresh={fetchInquiries} filter="b2b" />}
          {section === "bulk" && <BulkSection onRefresh={fetchProducts} />}
          {section === "settings" && <SettingsSection adminEmail={adminEmail} onEmailChange={setAdminEmail} />}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Section ────────────────────────────────────────────────────────
function DashboardSection({ stats, inquiries, products, setSection }: {
  stats: Record<string, number>;
  inquiries: Inquiry[];
  products: Product[];
  setSection: (s: string) => void;
}) {
  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: "🧶", color: "#4a5c3a", link: "products" },
    { label: "Active Products", value: stats.activeProducts, icon: "✅", color: "#059669", link: "products" },
    { label: "Total Inquiries", value: stats.totalInquiries, icon: "📋", color: "#7a8f6a", link: "inquiries" },
    { label: "New Inquiries", value: stats.newInquiries, icon: "🔔", color: "#dc2626", link: "inquiries" },
    { label: "B2B Inquiries", value: stats.b2bInquiries, icon: "🤝", color: "#6b4f35", link: "b2b" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {statCards.map((c) => (
          <button key={c.label} onClick={() => setSection(c.link)} style={{
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px",
            padding: "20px", textAlign: "left", cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = c.color; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{c.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: c.color, letterSpacing: "-0.02em" }}>{c.value}</div>
            <div style={{ fontSize: "12px", color: "#5c5a52", marginTop: "4px" }}>{c.label}</div>
          </button>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a" }}>Recent Inquiries</h2>
          <button onClick={() => setSection("inquiries")} style={{ background: "none", border: "none", color: "#4a5c3a", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>View all →</button>
        </div>
        <InquiryTable inquiries={inquiries.slice(0, 5)} onRefresh={() => {}} compact />
      </div>

      {/* Recent Products */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a" }}>Products ({products.length})</h2>
          <button onClick={() => setSection("products")} style={{ background: "none", border: "none", color: "#4a5c3a", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Manage →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {products.slice(0, 4).map((p) => (
            <div key={p.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ position: "relative", height: "120px" }}>
                <Image src={p.image} alt={p.title} fill style={{ objectFit: "cover" }} sizes="200px" />
              </div>
              <div style={{ padding: "10px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#1c1c1a", marginBottom: "2px", lineHeight: 1.3 }}>{p.title}</p>
                <p style={{ fontSize: "11px", color: "#7a8f6a" }}>{p.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Products Section ─────────────────────────────────────────────────────────
function ProductsSection({ products, categories, onRefresh }: { products: Product[]; categories: Category[]; onRefresh: () => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.rugType === filter || (filter === "active" ? p.active !== false : filter === "inactive" ? p.active === false : true);
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", headers: { "x-admin-key": getAdminKey() } });
    setConfirmDelete(null);
    onRefresh();
  };

  const handleDuplicate = async (id: string) => {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({ action: "duplicate", id }),
    });
    onRefresh();
  };

  const handleToggleActive = async (p: Product) => {
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify({ id: p.id, active: !p.active }),
    });
    onRefresh();
  };

  if (editProduct) {
    return <EditProductSection product={editProduct} categories={categories} onSaved={() => { setEditProduct(null); onRefresh(); }} onCancel={() => setEditProduct(null)} />;
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "200px", padding: "10px 14px", border: "1.5px solid #dcd4c5", borderRadius: "8px", fontSize: "14px", outline: "none" }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "10px 14px", border: "1.5px solid #dcd4c5", borderRadius: "8px", fontSize: "13px", outline: "none" }}>
          <option value="all">All Types</option>
          <option value="hand-knotted">Hand Knotted</option>
          <option value="hand-tufted">Hand Tufted</option>
          <option value="durrie">Durrie</option>
          <option value="jute">Jute</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive</option>
        </select>
        <span style={{ alignSelf: "center", fontSize: "13px", color: "#5c5a52" }}>{filtered.length} products</span>
      </div>

      {/* Products Table */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f6f0", borderBottom: "1px solid #e5e7eb" }}>
              {["Image", "Product", "Category", "Material", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5c5a52", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f0ece4", background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ width: "56px", height: "44px", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                    <Image src={p.image} alt={p.title} fill style={{ objectFit: "cover" }} sizes="56px" />
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#1c1c1a", marginBottom: "2px" }}>{p.title}</p>
                  <p style={{ fontSize: "11px", color: "#7a8f6a" }}>{p.construction}</p>
                </td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "#5c5a52" }}>{p.category}</td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "#5c5a52" }}>{p.material}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, background: p.inStock ? "#d1fae5" : "#fee2e2", color: p.inStock ? "#065f46" : "#dc2626" }}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button onClick={() => handleToggleActive(p)} style={{ padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, background: p.active !== false ? "#d1fae5" : "#f1f5f9", color: p.active !== false ? "#065f46" : "#64748b", border: "none", cursor: "pointer" }}>
                    {p.active !== false ? "Active" : "Hidden"}
                  </button>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => setEditProduct(p)} style={{ padding: "5px 12px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDuplicate(p.id)} style={{ padding: "5px 12px", background: "#7a8f6a", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Copy</button>
                    <Link href={`/products/${p.slug}`} target="_blank" style={{ padding: "5px 12px", background: "#f0ece4", color: "#5c5a52", borderRadius: "6px", fontSize: "11px", fontWeight: 600, textDecoration: "none" }}>View</Link>
                    <button onClick={() => setConfirmDelete(p.id)} style={{ padding: "5px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#5c5a52", fontSize: "14px" }}>No products found. <button style={{ color: "#4a5c3a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Add your first product →</button></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", width: "min(400px, 90%)", textAlign: "center" }}>
            <p style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Delete Product?</p>
            <p style={{ fontSize: "14px", color: "#5c5a52", marginBottom: "24px" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => handleDelete(confirmDelete)} style={{ padding: "11px 28px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>Yes, Delete</button>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "11px 28px", background: "#f0ece4", color: "#1c1c1a", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared: Processing Time options ─────────────────────────────────────────
const PROCESSING_TIME_PRESETS = [
  "2–3 Weeks", "3–4 Weeks", "3–5 Weeks", "4–5 Weeks",
  "4–6 Weeks", "6–8 Weeks", "8–10 Weeks",
];
const DELIVERY_TIME_PRESETS = [
  "Ready to Ship",
  "2–4 Business Days",
  "3–5 Business Days",
  "4–6 Business Days",
  "5–7 Business Days",
  "7–10 Business Days",
];

// ─── Shared: File Upload UI ───────────────────────────────────────────────────
function FileUploadSection({
  images, video, onImagesChange, onVideoChange, productSlug,
}: {
  images: string[];
  video: string;
  onImagesChange: (imgs: string[]) => void;
  onVideoChange: (v: string) => void;
  productSlug?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const uploadFiles = async (files: FileList | null, type: "images" | "video") => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("productId", productSlug || "new");
      const arr = Array.from(files);
      if (type === "images") {
        const toUpload = arr.slice(0, 10 - images.length);
        toUpload.forEach((f) => fd.append("images", f));
      } else {
        fd.append("video", arr[0]);
      }
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-key": getAdminKey() },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (type === "images" && data.urls?.length) {
        onImagesChange([...images, ...data.urls].slice(0, 10));
      } else if (type === "video" && data.videoUrl) {
        onVideoChange(data.videoUrl);
      }
    } catch (err) {
      setUploadError(String(err));
    }
    setUploading(false);
  };

  return (
    <div>
      {/* Images */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Product Images (up to 10)</label>
        <label style={{
          display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px",
          background: "#f0f4e8", border: "2px dashed #7a9a5a", borderRadius: "10px",
          cursor: uploading ? "not-allowed" : "pointer", fontSize: "14px", color: "#4a5c3a", fontWeight: 600,
          opacity: uploading ? 0.6 : 1,
        }}>
          <span style={{ fontSize: "22px" }}>🖼️</span>
          {uploading ? "Uploading…" : `Upload Images from Computer (${images.length}/10)`}
          <input
            type="file" multiple accept="image/*" style={{ display: "none" }} disabled={uploading || images.length >= 10}
            onChange={(e) => uploadFiles(e.target.files, "images")}
          />
        </label>
        <p style={{ fontSize: "11px", color: "#8a8878", marginTop: "4px" }}>
          Supported: JPG, PNG, WebP, AVIF, GIF. Max 10 images. Click to select multiple.
        </p>
        {uploadError && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>⚠️ {uploadError}</p>}
        {images.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "2px solid #dcd4c5" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "rgba(0,0,0,0.45)", padding: "2px 4px", fontSize: "9px", color: "#fff", textAlign: "center" }}>
                  {i === 0 ? "Main" : `#${i + 1}`}
                </div>
                <button type="button" onClick={() => onImagesChange(images.filter((_, j) => j !== i))}
                  style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(220,38,38,0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video */}
      <div>
        <label style={labelStyle}>Product Video (1 video, optional)</label>
        <label style={{
          display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px",
          background: "#f8f6f0", border: "2px dashed #c4b49a", borderRadius: "10px",
          cursor: uploading ? "not-allowed" : "pointer", fontSize: "14px", color: "#6b4f35", fontWeight: 600,
          opacity: uploading ? 0.6 : 1,
        }}>
          <span style={{ fontSize: "22px" }}>🎬</span>
          {uploading ? "Uploading…" : video ? "Replace Video" : "Upload Video from Computer"}
          <input
            type="file" accept="video/*" style={{ display: "none" }} disabled={uploading}
            onChange={(e) => uploadFiles(e.target.files, "video")}
          />
        </label>
        <p style={{ fontSize: "11px", color: "#8a8878", marginTop: "4px" }}>Supported: MP4, WebM, MOV. Shown on the product page.</p>
        {video && (
          <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "#5c5a52", flex: 1, wordBreak: "break-all" }}>📹 {video.split("/").pop()}</span>
            <button type="button" onClick={() => onVideoChange("")}
              style={{ padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Remove</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared: Inline Add Category ──────────────────────────────────────────────
function CategoryDropdown({
  value, onChange, categories,
}: {
  value: string;
  onChange: (catName: string, rugTypeId: string) => void;
  categories: Category[];
}) {
  const [showNew, setShowNew] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [saving, setSaving] = useState(false);

  // Core rug types always present
  const CORE_RUG_TYPES = [
    { id: "hand-knotted", name: "Hand Knotted" },
    { id: "hand-tufted", name: "Hand Tufted" },
    { id: "durrie", name: "Durrie" },
    { id: "jute", name: "Jute" },
  ];

  // Build merged list: core first, then extra categories
  const coreIds = new Set(CORE_RUG_TYPES.map((r) => r.id));
  const extraCats = categories.filter((c) => !coreIds.has(c.id) && !coreIds.has(c.slug));

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ name: newCatName.trim(), description: "", image: "", active: true }),
      });
      // Select new category immediately
      onChange(newCatName.trim(), newCatName.trim().toLowerCase().replace(/\s+/g, "-"));
      setNewCatName("");
      setShowNew(false);
    } catch {}
    setSaving(false);
  };

  return (
    <div>
      <label style={labelStyle}>Category *</label>
      <select
        required
        value={value}
        onChange={(e) => {
          const sel = e.target.value;
          if (sel === "__add_new__") { setShowNew(true); return; }
          const core = CORE_RUG_TYPES.find((r) => r.id === sel || r.name === sel);
          onChange(core?.name || sel, core?.id || sel);
        }}
        style={selectStyle}
      >
        {CORE_RUG_TYPES.map((rt) => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
        {extraCats.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        <option value="__add_new__">➕ Add New Category…</option>
      </select>

      {showNew && (
        <div style={{ marginTop: "10px", padding: "12px 14px", background: "#f0f4e8", borderRadius: "8px", border: "1px solid #c8d4b8" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#4a5c3a", marginBottom: "8px" }}>New Category Name</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text" placeholder="e.g. Silk Rugs" value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCategory(); } }}
              autoFocus
            />
            <button type="button" onClick={handleAddCategory} disabled={saving || !newCatName.trim()}
              style={{ padding: "10px 16px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              {saving ? "…" : "Add"}
            </button>
            <button type="button" onClick={() => { setShowNew(false); setNewCatName(""); }}
              style={{ padding: "10px 14px", background: "#f0ece4", border: "none", borderRadius: "8px", cursor: "pointer" }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared: Processing Time Field ───────────────────────────────────────────
function ProcessingTimeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const isCustom = value !== "" && !PROCESSING_TIME_PRESETS.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);

  return (
    <div>
      <label style={labelStyle}>Processing Time</label>
      <select
        value={showCustom ? "__custom__" : (value || PROCESSING_TIME_PRESETS[2])}
        onChange={(e) => {
          if (e.target.value === "__custom__") { setShowCustom(true); onChange(""); }
          else { setShowCustom(false); onChange(e.target.value); }
        }}
        style={selectStyle}
      >
        {PROCESSING_TIME_PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
        <option value="__custom__">Custom…</option>
      </select>
      {showCustom && (
        <input
          type="text" placeholder="e.g. 7–10 Days, 10–15 Days, 4–5 Weeks…"
          value={value} onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, marginTop: "8px" }} autoFocus
        />
      )}
    </div>
  );
}

// ─── Shared: Delivery Time Field ─────────────────────────────────────────────
function DeliveryTimeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const isCustom = value !== "" && !DELIVERY_TIME_PRESETS.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);

  return (
    <div>
      <label style={labelStyle}>Delivery Time</label>
      <select
        value={showCustom ? "__custom__" : (value || "")}
        onChange={(e) => {
          if (e.target.value === "__custom__") { setShowCustom(true); onChange(""); }
          else { setShowCustom(false); onChange(e.target.value); }
        }}
        style={selectStyle}
      >
        <option value="">— Select delivery time —</option>
        {DELIVERY_TIME_PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
        <option value="__custom__">Custom…</option>
      </select>
      {showCustom && (
        <input
          type="text" placeholder="e.g. 1–2 Business Days, Same Day…"
          value={value} onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, marginTop: "8px" }} autoFocus
        />
      )}
    </div>
  );
}

// ─── Shared: SEO Keywords Field ───────────────────────────────────────────────
function KeywordsField({ keywords, onChange }: { keywords: string[]; onChange: (kw: string[]) => void }) {
  const MAX = 25;
  // Pad to at least 5 visible slots, up to MAX
  const slots = Math.max(keywords.length + 1, 5);
  const padded = [...keywords, ...Array(Math.max(0, slots - keywords.length)).fill("")].slice(0, MAX);

  const handleChange = (i: number, val: string) => {
    const next = [...padded];
    next[i] = val;
    // Trim trailing empty slots (keep at least 1)
    let last = next.length - 1;
    while (last > 0 && next[last] === "") last--;
    onChange(next.slice(0, last + 1).filter((_, idx) => idx <= last));
  };

  return (
    <div>
      <label style={labelStyle}>SEO Tags / Keywords (up to {MAX})</label>
      <p style={{ fontSize: "11px", color: "#8a8878", marginBottom: "10px" }}>
        Enter keywords for search and SEO. Each keyword up to 30 characters. They are saved with the product.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
        {Array.from({ length: MAX }).map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={30}
            placeholder={i === 0 ? "e.g. hand knotted rug" : i < 3 ? `keyword ${i + 1}` : ""}
            value={padded[i] ?? ""}
            onChange={(e) => handleChange(i, e.target.value)}
            style={{ ...inputStyle, fontSize: "12px", padding: "8px 10px" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Add Product Section ──────────────────────────────────────────────────────
function AddProductSection({ categories, onSaved }: { categories: Category[]; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: "", category: "Hand Tufted", rugType: "hand-tufted",
    material: "", construction: "Hand Tufted", pile: "Medium Pile (10mm)",
    shape: "Rectangle", longDescription: "", features: "",
    badge: "", processingTime: "3–5 Weeks", deliveryTime: "", inStock: true,
  });
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slugForUpload] = useState(() => `new-${Date.now()}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      images: images.length > 0 ? images : ["/images/rug1.png"],
      image: images[0] || "/images/rug1.png",
      video: video || "",
      keywords: keywords.filter(Boolean),
      // Keep leadTime for backward compatibility
      leadTime: form.processingTime,
    };
    try {
      await fetch("/api/admin/products", { method: "POST", headers: adminHeaders(), body: JSON.stringify(payload) });
      setSaved(true);
      setTimeout(() => onSaved(), 1200);
    } catch {}
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: "860px" }}>
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1c1c1a", marginBottom: "24px" }}>Add New Product</h2>
        {saved && <div style={{ padding: "12px 16px", background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: "8px", color: "#065f46", fontSize: "14px", fontWeight: 600, marginBottom: "20px" }}>✅ Product saved! Redirecting…</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* 1. Images & Video */}
          <FileUploadSection
            images={images} video={video}
            onImagesChange={setImages} onVideoChange={setVideo}
            productSlug={slugForUpload}
          />

          {/* 2. Product Title */}
          <div>
            <label style={labelStyle}>Product Title *</label>
            <input required type="text" placeholder="e.g. Vintage Oushak Rug" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          </div>

          {/* 3. Category + Material */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <CategoryDropdown
              value={form.rugType}
              categories={categories}
              onChange={(catName, rugTypeId) => setForm({ ...form, category: catName, rugType: rugTypeId, construction: catName })}
            />
            <div>
              <label style={labelStyle}>Material *</label>
              <input
                required type="text"
                placeholder="e.g. 100% New Zealand Wool, Wool & Silk, Jute…"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* 5. Full Description only */}
          <div>
            <label style={labelStyle}>Full Description</label>
            <textarea rows={5} placeholder="Detailed description for the product page…"
              value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div>
            <label style={labelStyle}>Features (one per line)</label>
            <textarea rows={5} placeholder={"Hand knotted by master artisans\n100% New Zealand wool\nNatural vegetable dyes"}
              value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* 6. SEO Keywords */}
          <KeywordsField keywords={keywords} onChange={setKeywords} />

          {/* 7+8. Processing Time, Delivery Time, Badge, Stock */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <ProcessingTimeField value={form.processingTime} onChange={(v) => setForm({ ...form, processingTime: v })} />
            <DeliveryTimeField value={form.deliveryTime} onChange={(v) => setForm({ ...form, deliveryTime: v })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Badge</label>
              <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} style={selectStyle}>
                <option value="">None</option>
                {["Bestseller", "New", "Heritage", "Featured", "Eco", "Exclusive"].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Stock Status</label>
              <select value={form.inStock ? "true" : "false"} onChange={(e) => setForm({ ...form, inStock: e.target.value === "true" })} style={selectStyle}>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>

          <div style={{ padding: "16px", background: "#f0f4e8", borderRadius: "8px", border: "1px solid #c8d4b8" }}>
            <p style={{ fontSize: "13px", color: "#4a5c3a", fontWeight: 600 }}>✅ Pricing handled automatically</p>
            <p style={{ fontSize: "12px", color: "#5c5a52", marginTop: "4px" }}>All sizes and prices are calculated automatically by the shared pricing engine. No need to enter prices manually.</p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="submit" disabled={saving} style={{ padding: "14px 32px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
              {saving ? "Saving…" : "Save Product"}
            </button>
            <button type="button" onClick={onSaved} style={{ padding: "14px 24px", background: "#f0ece4", color: "#1c1c1a", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Product Section ─────────────────────────────────────────────────────
function EditProductSection({ product, categories, onSaved, onCancel }: {
  product: Product; categories: Category[]; onSaved: () => void; onCancel: () => void;
}) {
  // Resolve processingTime: prefer processingTime, fall back to leadTime
  const initProcessingTime = product.processingTime || product.leadTime || "3–5 Weeks";
  const initDeliveryTime = product.deliveryTime || "";
  const initKeywords = product.keywords || [];

  const [form, setForm] = useState({
    title: product.title, category: product.category,
    rugType: product.rugType, material: product.material, construction: product.construction,
    pile: product.pile || "", shape: product.shape || "",
    longDescription: product.longDescription || "", features: (product.features || []).join("\n"),
    badge: product.badge || "", processingTime: initProcessingTime,
    deliveryTime: initDeliveryTime, inStock: product.inStock,
    active: product.active !== false,
  });
  const [images, setImages] = useState<string[]>(
    (product.images && product.images.length > 0) ? product.images : [product.image].filter(Boolean)
  );
  const [video, setVideo] = useState(product.video || "");
  const [keywords, setKeywords] = useState<string[]>(initKeywords);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      id: product.id, ...form,
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      images: images.length > 0 ? images : [product.image],
      image: images[0] || product.image,
      video: video || "",
      keywords: keywords.filter(Boolean),
      // Keep leadTime for backward compatibility
      leadTime: form.processingTime,
    };
    await fetch("/api/admin/products", { method: "PUT", headers: adminHeaders(), body: JSON.stringify(payload) });
    setSaving(false);
    onSaved();
  };

  return (
    <div style={{ maxWidth: "860px" }}>
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1c1c1a" }}>Edit: {product.title}</h2>
          <button onClick={onCancel} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#5c5a52" }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* 1. Images & Video */}
          <FileUploadSection
            images={images} video={video}
            onImagesChange={setImages} onVideoChange={setVideo}
            productSlug={product.slug || product.id}
          />

          {/* 2. Product Title */}
          <div>
            <label style={labelStyle}>Product Title *</label>
            <input required type="text" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          </div>

          {/* 3. Category + Material */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <CategoryDropdown
              value={form.rugType}
              categories={categories}
              onChange={(catName, rugTypeId) => setForm({ ...form, category: catName, rugType: rugTypeId, construction: catName })}
            />
            <div>
              <label style={labelStyle}>Material *</label>
              <input
                required type="text"
                placeholder="e.g. 100% New Zealand Wool, Wool & Silk, Jute…"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* 5. Full Description only */}
          <div>
            <label style={labelStyle}>Full Description</label>
            <textarea rows={5} value={form.longDescription}
              onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div>
            <label style={labelStyle}>Features (one per line)</label>
            <textarea rows={5} value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* 6. SEO Keywords */}
          <KeywordsField keywords={keywords} onChange={setKeywords} />

          {/* 7+8. Processing Time + Delivery Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <ProcessingTimeField value={form.processingTime} onChange={(v) => setForm({ ...form, processingTime: v })} />
            <DeliveryTimeField value={form.deliveryTime} onChange={(v) => setForm({ ...form, deliveryTime: v })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Badge</label>
              <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} style={selectStyle}>
                <option value="">None</option>
                {["Bestseller", "New", "Heritage", "Featured", "Eco", "Exclusive"].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Stock</label>
              <select value={form.inStock ? "true" : "false"} onChange={(e) => setForm({ ...form, inStock: e.target.value === "true" })} style={selectStyle}>
                <option value="true">In Stock</option><option value="false">Out of Stock</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.active ? "true" : "false"} onChange={(e) => setForm({ ...form, active: e.target.value === "true" })} style={selectStyle}>
                <option value="true">Active</option><option value="false">Hidden</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="submit" disabled={saving} style={{ padding: "14px 32px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button type="button" onClick={onCancel} style={{ padding: "14px 24px", background: "#f0ece4", color: "#1c1c1a", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Categories Section ───────────────────────────────────────────────────────
function CategoriesSection({ categories, onRefresh }: { categories: Category[]; onRefresh: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "", active: true });

  const handleAdd = async () => {
    await fetch("/api/admin/categories", { method: "POST", headers: adminHeaders(), body: JSON.stringify(form) });
    setForm({ name: "", description: "", image: "", active: true }); setShowAdd(false); onRefresh();
  };

  const handleUpdate = async (cat: Category, updates: Partial<Category>) => {
    await fetch("/api/admin/categories", { method: "PUT", headers: adminHeaders(), body: JSON.stringify({ ...cat, ...updates }) });
    setEditCat(null); onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE", headers: { "x-admin-key": getAdminKey() } });
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "14px", color: "#5c5a52" }}>{categories.length} categories · New categories appear automatically on the website</p>
        <button onClick={() => setShowAdd(!showAdd)} style={{ padding: "10px 20px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>+ New Category</button>
      </div>

      {showAdd && (
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Add Category</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div><label style={labelStyle}>Name *</label><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g. Silk Rugs" /></div>
            <div><label style={labelStyle}>Image URL</label><input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={inputStyle} placeholder="/images/rug1.png" /></div>
          </div>
          <div style={{ marginBottom: "12px" }}><label style={labelStyle}>Description</label><input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} placeholder="Short category description" /></div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleAdd} style={{ padding: "10px 24px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>Save</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "10px 20px", background: "#f0ece4", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ position: "relative", height: "140px" }}>
              <Image src={cat.image || "/images/rug1.png"} alt={cat.name} fill style={{ objectFit: "cover" }} sizes="300px" />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
              <div style={{ position: "absolute", bottom: "12px", left: "12px", color: "#fff", fontWeight: 700, fontSize: "18px" }}>{cat.name}</div>
            </div>
            <div style={{ padding: "16px" }}>
              {editCat?.id === cat.id ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input type="text" defaultValue={cat.name} onBlur={(e) => setEditCat({ ...cat, name: e.target.value })} style={inputStyle} />
                  <input type="text" defaultValue={cat.description} onBlur={(e) => setEditCat({ ...cat, description: e.target.value })} style={inputStyle} placeholder="Description" />
                  <input type="text" defaultValue={cat.image} onBlur={(e) => setEditCat({ ...cat, image: e.target.value })} style={inputStyle} placeholder="Image URL" />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleUpdate(cat, editCat)} style={{ flex: 1, padding: "8px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer" }}>Save</button>
                    <button onClick={() => setEditCat(null)} style={{ flex: 1, padding: "8px", background: "#f0ece4", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "12px", color: "#5c5a52", marginBottom: "10px" }}>{cat.description || "No description"}</p>
                  <p style={{ fontSize: "11px", color: "#7a8f6a", marginBottom: "12px" }}>Slug: /{cat.slug}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setEditCat(cat)} style={{ flex: 1, padding: "7px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(cat.id)} style={{ flex: 1, padding: "7px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Discount Section ─────────────────────────────────────────────────────────
function DiscountSection({ discount, onSaved }: { discount: DiscountConfig; onSaved: () => void }) {
  const [form, setForm] = useState(discount);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(discount); }, [discount]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/discount", { method: "PUT", headers: adminHeaders(), body: JSON.stringify(form) });
    setSaving(false); setSaved(true); onSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1c1c1a", marginBottom: "8px" }}>Discount / Sale Settings</h2>
        <p style={{ fontSize: "14px", color: "#5c5a52", marginBottom: "24px" }}>Control sale prices across the entire website. When disabled, only normal prices are shown.</p>

        {saved && <div style={{ padding: "12px 16px", background: "#d1fae5", borderRadius: "8px", color: "#065f46", fontWeight: 600, marginBottom: "20px" }}>✅ Settings saved!</div>}

        {/* Enable/Disable */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: form.enabled ? "#f0f4e8" : "#f8f6f0", borderRadius: "12px", border: `2px solid ${form.enabled ? "#4a5c3a" : "#dcd4c5"}`, marginBottom: "24px", cursor: "pointer" }}
          onClick={() => setForm({ ...form, enabled: !form.enabled })}>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a" }}>Discount {form.enabled ? "ENABLED" : "DISABLED"}</p>
            <p style={{ fontSize: "13px", color: "#5c5a52", marginTop: "2px" }}>{form.enabled ? "Sale prices are shown across the website" : "Only normal prices are shown"}</p>
          </div>
          <div style={{ width: "52px", height: "28px", borderRadius: "14px", background: form.enabled ? "#4a5c3a" : "#dcd4c5", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: form.enabled ? "27px" : "3px", transition: "left 0.2s" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={labelStyle}>Discount Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })} style={selectStyle}>
              <option value="percent">Percentage (e.g. 20%)</option>
              <option value="fixed">Fixed Amount (e.g. $50 off)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Discount Value</label>
            <input type="number" min="0" max={form.type === "percent" ? 100 : 10000}
              value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              style={inputStyle} placeholder={form.type === "percent" ? "20" : "50"} />
            <p style={{ fontSize: "11px", color: "#8a8878", marginTop: "4px" }}>{form.type === "percent" ? `${form.value}% off all prices` : `$${form.value} off all prices`}</p>
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Sale Label (shown on product badges)</label>
          <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} style={inputStyle} placeholder="SALE" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div>
            <label style={labelStyle}>Sale Start Date (optional)</label>
            <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Sale End Date (optional)</label>
            <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={inputStyle} />
          </div>
        </div>

        <div style={{ padding: "16px", background: "#f8f6f0", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#4a5c3a", marginBottom: "4px" }}>Preview</p>
          <p style={{ fontSize: "13px", color: "#5c5a52" }}>
            For a 5×8 ft Hand Tufted rug (40 sq.ft @ $11/sq.ft = $440):{" "}
            {form.enabled
              ? form.type === "percent"
                ? `Sale price: $${Math.round(440 - (440 * form.value) / 100)} (${form.value}% off)`
                : `Sale price: $${Math.round(440 - form.value)} ($${form.value} off)`
              : "Normal price: $440"}
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} style={{ padding: "14px 32px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
          {saving ? "Saving..." : "Save Discount Settings"}
        </button>
      </div>
    </div>
  );
}

// ─── Inquiries Section ────────────────────────────────────────────────────────
function InquiriesSection({ inquiries, loading, onRefresh, filter }: { inquiries: Inquiry[]; loading: boolean; onRefresh: () => void; filter: string }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = inquiries.filter((i) => {
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    const matchSearch = !search || JSON.stringify(i).toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, minWidth: "200px", flex: 1 }} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
        <span style={{ fontSize: "13px", color: "#5c5a52" }}>{filtered.length} inquiries</span>
        <button onClick={onRefresh} style={{ padding: "9px 16px", background: "#f0ece4", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>↻ Refresh</button>
      </div>
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#5c5a52" }}>Loading...</div>
      ) : (
        <InquiryTable inquiries={filtered} onRefresh={onRefresh} />
      )}
    </div>
  );
}

function InquiryTable({ inquiries, onRefresh, compact = false }: { inquiries: Inquiry[]; onRefresh: () => void; compact?: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/inquiries", { method: "PATCH", headers: adminHeaders(), body: JSON.stringify({ id, status }) });
    onRefresh();
  };

  const updateNotes = async (id: string) => {
    await fetch("/api/inquiries", { method: "PATCH", headers: adminHeaders(), body: JSON.stringify({ id, notes }) });
    onRefresh();
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/inquiries?id=${id}`, { method: "DELETE", headers: { "x-admin-key": getAdminKey() } });
    onRefresh();
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    new: { bg: "#fee2e2", color: "#dc2626" },
    replied: { bg: "#d1fae5", color: "#065f46" },
    closed: { bg: "#f1f5f9", color: "#64748b" },
  };

  const typeColors: Record<string, string> = {
    contact: "#4a5c3a", product: "#7a8f6a", b2b: "#6b4f35", custom: "#b8975a",
  };

  if (inquiries.length === 0) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#5c5a52", background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb" }}>No inquiries yet</div>;
  }

  return (
    <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f6f0", borderBottom: "1px solid #e5e7eb" }}>
            {(compact ? ["From", "Type", "Status", "Date"] : ["From", "Type", "Subject", "Status", "Date", "Actions"]).map((h) => (
              <th key={h} style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#5c5a52", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inq, i) => (
            <>
              <tr key={inq.id} style={{ borderBottom: "1px solid #f0ece4", background: inq.status === "new" ? "#fffbeb" : i % 2 === 0 ? "#fff" : "#fafaf8", cursor: "pointer" }}
                onClick={() => { setExpanded(expanded === inq.id ? null : inq.id); setNotes(inq.adminNotes || ""); }}>
                <td style={{ padding: "12px 14px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#1c1c1a" }}>{inq.name || inq.companyName || "—"}</p>
                  <p style={{ fontSize: "11px", color: "#7a8f6a" }}>{inq.email}</p>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ padding: "3px 9px", borderRadius: "9999px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", background: `${typeColors[inq.type] || "#7a8f6a"}20`, color: typeColors[inq.type] || "#7a8f6a" }}>
                    {inq.type}
                  </span>
                </td>
                {!compact && (
                  <td style={{ padding: "12px 14px", fontSize: "13px", color: "#5c5a52", maxWidth: "220px" }}>
                    <p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {inq.productTitle || inq.message?.slice(0, 50) || inq.businessType || "—"}
                    </p>
                  </td>
                )}
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ padding: "3px 9px", borderRadius: "9999px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", ...statusColors[inq.status] || statusColors.new }}>
                    {inq.status}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: "12px", color: "#8a8878", whiteSpace: "nowrap" }}>
                  {new Date(inq.createdAt).toLocaleDateString()}
                </td>
                {!compact && (
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => updateStatus(inq.id, "replied")} style={{ padding: "4px 10px", background: "#d1fae5", color: "#065f46", border: "none", borderRadius: "6px", fontSize: "10px", fontWeight: 700, cursor: "pointer" }}>✓ Replied</button>
                      <a href={`mailto:${inq.email}`} style={{ padding: "4px 10px", background: "#f0ece4", color: "#4a5c3a", borderRadius: "6px", fontSize: "10px", fontWeight: 700, textDecoration: "none" }}>Email</a>
                      {inq.phone || inq.phone_number ? (
                        <a href={`https://wa.me/${(inq.phone || inq.phone_number || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ padding: "4px 10px", background: "#dcfce7", color: "#16a34a", borderRadius: "6px", fontSize: "10px", fontWeight: 700, textDecoration: "none" }}>WhatsApp</a>
                      ) : null}
                      <button onClick={() => deleteInquiry(inq.id)} style={{ padding: "4px 8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "10px", cursor: "pointer" }}>×</button>
                    </div>
                  </td>
                )}
              </tr>
              {expanded === inq.id && !compact && (
                <tr key={`${inq.id}-detail`} style={{ background: "#f8f6f0", borderBottom: "1px solid #e5e7eb" }}>
                  <td colSpan={6} style={{ padding: "16px 20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                      {Object.entries(inq).filter(([k]) => !["id", "status", "createdAt", "updatedAt", "adminNotes"].includes(k)).map(([k, v]) => (
                        v ? <div key={k}><span style={{ fontSize: "10px", color: "#8a8878", textTransform: "uppercase", fontWeight: 700 }}>{k}</span><p style={{ fontSize: "13px", color: "#1c1c1a", marginTop: "2px" }}>{String(v)}</p></div> : null
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <textarea rows={2} placeholder="Admin notes..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #dcd4c5", borderRadius: "8px", fontSize: "13px", resize: "none" }} />
                      <button onClick={() => updateNotes(inq.id)} style={{ padding: "8px 16px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Save Notes</button>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Bulk Import/Export ───────────────────────────────────────────────────────
function BulkSection({ onRefresh }: { onRefresh: () => void }) {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState("");
  const [csvText, setCsvText] = useState("");
  const [activeTab, setActiveTab] = useState<"csv" | "excel">("csv");

  const EXPORT_HEADERS = ["id", "title", "subtitle", "category", "rugType", "material", "construction", "pile", "shape", "description", "badge", "inStock", "leadTime", "image", "reviews", "tags", "colors"];

  const handleExportCSV = async () => {
    const r = await fetch("/api/admin/bulk", { headers: { "x-admin-key": getAdminKey() } });
    const products = await r.json();
    if (!products.length) { alert("No products to export."); return; }
    const csvRows = [
      EXPORT_HEADERS.join(","),
      ...products.map((p: Record<string, unknown>) =>
        EXPORT_HEADERS.map((h) => {
          const v = p[h];
          const str = Array.isArray(v) ? v.join("|") : String(v ?? "");
          return `"${str.replace(/"/g, '""')}"`;
        }).join(",")
      )
    ];
    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `thefairrugs-products-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    // Export as TSV (Tab-Separated Values) — opens natively in Excel
    const r = await fetch("/api/admin/bulk", { headers: { "x-admin-key": getAdminKey() } });
    const products = await r.json();
    if (!products.length) { alert("No products to export."); return; }
    const tsvRows = [
      EXPORT_HEADERS.join("\t"),
      ...products.map((p: Record<string, unknown>) =>
        EXPORT_HEADERS.map((h) => {
          const v = p[h];
          return Array.isArray(v) ? v.join("|") : String(v ?? "");
        }).join("\t")
      )
    ];
    const blob = new Blob(["\uFEFF" + tsvRows.join("\n")], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `thefairrugs-products-${new Date().toISOString().slice(0,10)}.xls`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = async () => {
    const r = await fetch("/api/admin/bulk", { headers: { "x-admin-key": getAdminKey() } });
    const products = await r.json();
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `thefairrugs-products-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  function parseCSV(text: string): Record<string, string>[] {
    const lines = text.trim().split(/\r?\n/);
    const rawHeaders = lines[0];
    // Auto-detect delimiter: tab or comma
    const delim = rawHeaders.includes("\t") ? "\t" : ",";
    const headers = rawHeaders.split(delim).map((h) => h.trim().replace(/^"|"$/g, "").trim());
    return lines.slice(1).filter((l) => l.trim()).map((line) => {
      let vals: string[] = [];
      if (delim === ",") {
        vals = [];
        let inQ = false, cur = "";
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"' && !inQ) { inQ = true; }
          else if (line[i] === '"' && inQ && line[i+1] === '"') { cur += '"'; i++; }
          else if (line[i] === '"' && inQ) { inQ = false; }
          else if (line[i] === ',' && !inQ) { vals.push(cur); cur = ""; }
          else { cur += line[i]; }
        }
        vals.push(cur);
      } else {
        vals = line.split("\t");
      }
      return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || "").trim()]));
    });
  }

  const handleImport = async () => {
    if (!csvText.trim()) { alert("Paste CSV or TSV data first"); return; }
    setImporting(true);
    try {
      const products = parseCSV(csvText);
      if (!products.length) { setResult("❌ No rows found. Check format."); setImporting(false); return; }
      const r = await fetch("/api/admin/bulk", { method: "POST", headers: adminHeaders(), body: JSON.stringify({ action: "import", products }) });
      const d = await r.json();
      if (d.success) {
        setResult(`✅ Import complete: ${d.created || 0} created, ${d.updated || 0} updated`);
        onRefresh();
      } else {
        setResult(`❌ Import failed: ${d.error || "Unknown error"}`);
      }
    } catch (e) {
      setResult(`❌ Import error: ${e}`);
    }
    setImporting(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvText(ev.target?.result as string || "");
      setActiveTab("csv");
    };
    reader.readAsText(file, "UTF-8");
  };

  return (
    <div style={{ maxWidth: "960px" }}>
      {/* Export Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1c1c1a", marginBottom: "8px" }}>📊 Export Products</h3>
          <p style={{ fontSize: "12px", color: "#5c5a52", marginBottom: "16px" }}>Download all products for editing or backup.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={handleExportCSV} style={{ padding: "10px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}>⬇ Export CSV</button>
            <button onClick={handleExportExcel} style={{ padding: "10px", background: "#1d6f42", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}>⬇ Export Excel (.xls)</button>
            <button onClick={handleExportJSON} style={{ padding: "10px", background: "#f0ece4", color: "#1c1c1a", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}>⬇ Export JSON</button>
          </div>
        </div>

        <div style={{ background: "#f0f4e8", borderRadius: "12px", border: "1px solid #c8d4b8", padding: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#4a5c3a", marginBottom: "8px" }}>📋 CSV / Excel Format</h3>
          <p style={{ fontSize: "11px", color: "#5c5a52", lineHeight: 1.9 }}>
            <strong>Required:</strong> title, category, material<br />
            <strong>Optional:</strong> subtitle, rugType, badge, description, inStock, leadTime, image, pile, shape, tags, colors<br /><br />
            Pricing is <strong>automatic</strong> — no price columns needed.<br />
            <strong>Excel tip:</strong> Open exported .xls, edit, Save As → CSV, then re-import.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1c1c1a", marginBottom: "8px" }}>📁 Upload File</h3>
          <p style={{ fontSize: "12px", color: "#5c5a52", marginBottom: "12px" }}>Upload a .csv or .xls/.xlsx file directly. File content will appear in the import box below.</p>
          <label style={{ display: "block", padding: "12px", background: "#f8f6f0", border: "2px dashed #c8d4b8", borderRadius: "8px", textAlign: "center", cursor: "pointer", fontSize: "12px", color: "#5c5a52" }}>
            📂 Click to select CSV / Excel file
            <input type="file" accept=".csv,.tsv,.txt,.xls,.xlsx" onChange={handleFileUpload} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      {/* Import */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a" }}>Import Products</h3>
          <div style={{ display: "flex", gap: "4px" }}>
            {(["csv", "excel"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "5px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer", border: "none",
                background: activeTab === tab ? "#4a5c3a" : "#f0ece4",
                color: activeTab === tab ? "#fff" : "#5c5a52",
              }}>{tab === "csv" ? "CSV / Paste" : "Excel / TSV"}</button>
            ))}
          </div>
        </div>

        {result && (
          <div style={{ padding: "10px 14px", background: result.startsWith("✅") ? "#d1fae5" : "#fee2e2", borderRadius: "8px", marginBottom: "12px", fontSize: "13px", fontWeight: 600, color: result.startsWith("✅") ? "#065f46" : "#dc2626" }}>
            {result}
          </div>
        )}

        <p style={{ fontSize: "12px", color: "#5c5a52", marginBottom: "10px" }}>
          {activeTab === "csv"
            ? "Paste comma-separated CSV data below. First row = headers."
            : "Paste tab-separated data (from Excel copy-paste or TSV). First row = headers."}
        </p>

        <textarea
          rows={12}
          placeholder={activeTab === "csv"
            ? "title,category,material,description,badge\nPersian Garden Rug,Hand Knotted,100% Wool,Beautiful hand knotted rug,New\nModern Geo Rug,Hand Tufted,Wool Blend,Contemporary geometric design,Bestseller"
            : "title\tcategory\tmaterial\tdescription\nbadge\nPersian Garden Rug\tHand Knotted\t100% Wool\tBeautiful rug"}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #dcd4c5", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace", resize: "vertical", outline: "none", lineHeight: 1.6 }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center" }}>
          <button onClick={handleImport} disabled={importing} style={{ padding: "11px 28px", background: importing ? "#9ca3af" : "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: importing ? "not-allowed" : "pointer" }}>
            {importing ? "Importing..." : "⬆ Import Products"}
          </button>
          <button onClick={() => { setCsvText(""); setResult(""); }} style={{ padding: "11px 20px", background: "#f0ece4", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>Clear</button>
          {csvText && <span style={{ fontSize: "12px", color: "#5c5a52" }}>{csvText.trim().split("\n").length - 1} rows detected</span>}
        </div>
      </div>

      {/* Bulk Operations Info */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a", marginBottom: "12px" }}>Bulk Operations Guide</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            { icon: "📥", title: "Bulk Import", desc: "Use CSV/Excel import above to add or update hundreds of products at once. Duplicate titles will update existing products." },
            { icon: "📤", title: "Bulk Export", desc: "Export to CSV or Excel, edit in your spreadsheet app, then re-import to update all products at once." },
            { icon: "✏️", title: "Bulk Price Update", desc: "Pricing is dynamic and automatic based on rug type. Use the Discount section to apply global price discounts." },
            { icon: "🗑️", title: "Bulk Delete", desc: "Export products, remove rows you want to delete, then use the API endpoint POST /api/admin/bulk with action: bulk-delete and ids array." },
            { icon: "📂", title: "Duplicate Product", desc: "In the Products section, click the Copy button next to any product to instantly duplicate it with all its details." },
            { icon: "🔍", title: "Advanced Search", desc: "In the Products section, use the search bar + filter dropdown to find products by title, category, or status." },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", gap: "12px", padding: "16px", background: "#f8f6f0", borderRadius: "8px" }}>
              <span style={{ fontSize: "22px" }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1c1c1a", marginBottom: "4px" }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "#5c5a52", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Settings Section ─────────────────────────────────────────────────────────
function SettingsSection({ adminEmail, onEmailChange }: { adminEmail: string; onEmailChange: (e: string) => void }) {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("thefairrugs@gmail.com");
  const [waNumber, setWaNumber] = useState("+91 8416919470");

  const handleSaveCredentials = async () => {
    if (newPassword && newPassword !== confirmPassword) { setMsg("❌ Passwords do not match"); return; }
    if (!newEmail && !newPassword) { setMsg("❌ Enter new email or password"); return; }
    setSaving(true);
    try {
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ action: "change-credentials", newEmail: newEmail || undefined, newPassword: newPassword || undefined }),
      });
      const d = await r.json();
      if (d.success) {
        setMsg("✅ Credentials updated! Please log in again.");
        if (newEmail) onEmailChange(newEmail);
        setNewEmail(""); setNewPassword(""); setConfirmPassword("");
      } else setMsg("❌ Failed to update credentials");
    } catch { setMsg("❌ Error updating credentials"); }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: "700px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Change Credentials */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1c1c1a", marginBottom: "6px" }}>Admin Credentials</h2>
        <p style={{ fontSize: "13px", color: "#5c5a52", marginBottom: "24px" }}>Current admin: <strong>{adminEmail}</strong></p>
        {msg && <div style={{ padding: "10px 14px", background: msg.startsWith("✅") ? "#d1fae5" : "#fee2e2", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", fontWeight: 600, color: msg.startsWith("✅") ? "#065f46" : "#dc2626" }}>{msg}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>New Email Address</label>
            <input type="email" placeholder="new@email.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input type="password" placeholder="Leave blank to keep current" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={handleSaveCredentials} disabled={saving} style={{ padding: "13px 28px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", alignSelf: "flex-start" }}>
            {saving ? "Saving..." : "Update Credentials"}
          </button>
        </div>
      </div>

      {/* Business Info */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1c1c1a", marginBottom: "6px" }}>Business Settings</h2>
        <p style={{ fontSize: "13px", color: "#5c5a52", marginBottom: "20px" }}>Contact & notification settings</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Inquiry Notification Email</label>
            <input type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} style={inputStyle} placeholder="thefairrugs@gmail.com" />
            <p style={{ fontSize: "11px", color: "#8a8878", marginTop: "4px" }}>To enable email notifications, set SENDGRID_API_KEY environment variable and NOTIFY_EMAIL in your hosting settings (e.g. Vercel / Netlify env vars).</p>
          </div>
          <div>
            <label style={labelStyle}>WhatsApp Number</label>
            <input type="text" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} style={inputStyle} placeholder="+91 8416919470" />
            <p style={{ fontSize: "11px", color: "#8a8878", marginTop: "4px" }}>Update in code: app/lib/pricing.ts and Header.tsx · WhatsApp: +91 8416919470</p>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div style={{ background: "#f0f4e8", borderRadius: "12px", border: "1px solid #c8d4b8", padding: "24px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#4a5c3a", marginBottom: "8px" }}>🔒 Security Notes</h3>
        <ul style={{ fontSize: "13px", color: "#5c5a52", lineHeight: 1.9, paddingLeft: "16px" }}>
          <li>Admin credentials are stored in <code>data/admin.json</code> in your repository</li>
          <li>Admin token is validated on every protected request</li>
          <li>Sessions expire after 7 days (re-login required)</li>
          <li>All admin APIs require the x-admin-key header or cookie</li>
          <li>Change your password immediately after deployment</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Size Master Section ────────────────────────────────────────────────────
interface SizeMasterItem {
  id: string; shape: string; name: string; cm: string; sqft: number; active: boolean;
}

const SHAPE_ORDER_ADMIN = ["Rectangular", "Runner", "Round"];

function SizeMasterSection() {
  const [sizes, setSizes] = useState<SizeMasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeShape, setActiveShape] = useState("Rectangular");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItem, setEditItem] = useState<SizeMasterItem | null>(null);
  const [form, setForm] = useState({ shape: "Rectangular", name: "", cm: "", sqft: "" });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSizes = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/sizes", { headers: { "x-admin-key": getAdminKey() } });
      const d = await r.json();
      setSizes(Array.isArray(d) ? d : []);
    } catch { setSizes([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSizes(); }, [fetchSizes]);

  const handleToggleActive = async (item: SizeMasterItem) => {
    await fetch("/api/admin/sizes", {
      method: "PUT", headers: adminHeaders(),
      body: JSON.stringify({ ...item, active: !item.active }),
    });
    fetchSizes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this size? It will be removed everywhere.")) return;
    await fetch(`/api/admin/sizes?id=${id}`, { method: "DELETE", headers: { "x-admin-key": getAdminKey() } });
    fetchSizes();
  };

  const handleSave = async () => {
    if (!form.name || !form.cm || !form.sqft) { setMsg("❌ Please fill in all fields"); return; }
    setSaving(true);
    const payload: Partial<SizeMasterItem> & { shape: string; name: string; cm: string; sqft: number; active: boolean } = {
      shape: form.shape, name: form.name, cm: form.cm,
      sqft: parseFloat(form.sqft), active: true,
    };
    try {
      if (editItem) {
        await fetch("/api/admin/sizes", { method: "PUT", headers: adminHeaders(), body: JSON.stringify({ ...editItem, ...payload }) });
        setMsg("✅ Size updated!");
      } else {
        await fetch("/api/admin/sizes", { method: "POST", headers: adminHeaders(), body: JSON.stringify(payload) });
        setMsg("✅ Size added!");
      }
      setForm({ shape: "Rectangular", name: "", cm: "", sqft: "" });
      setShowAddForm(false); setEditItem(null);
      fetchSizes();
    } catch { setMsg("❌ Error saving size"); }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const startEdit = (item: SizeMasterItem) => {
    setEditItem(item);
    setForm({ shape: item.shape, name: item.name, cm: item.cm, sqft: String(item.sqft) });
    setShowAddForm(true);
    setActiveShape(item.shape);
  };

  const grouped = SHAPE_ORDER_ADMIN.reduce<Record<string, SizeMasterItem[]>>((acc, sh) => {
    acc[sh] = sizes.filter((s) => s.shape === sh);
    return acc;
  }, {});

  const SHAPE_ICONS_ADM: Record<string, string> = { Rectangular: "▬", Runner: "▰", Round: "●" };

  return (
    <div style={{ maxWidth: "960px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <p style={{ fontSize: "14px", color: "#5c5a52", marginBottom: "4px" }}>
            {sizes.length} total sizes · {sizes.filter((s) => s.active).length} active
          </p>
          <p style={{ fontSize: "12px", color: "#8a8878" }}>Changes apply instantly across the entire website (Product pages + Custom Rugs page)</p>
        </div>
        <button onClick={() => { setShowAddForm(!showAddForm); setEditItem(null); setForm({ shape: activeShape, name: "", cm: "", sqft: "" }); }}
          style={{ padding: "10px 20px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
          + Add Size
        </button>
      </div>

      {msg && (
        <div style={{ padding: "10px 14px", background: msg.startsWith("✅") ? "#d1fae5" : "#fee2e2", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", fontWeight: 600, color: msg.startsWith("✅") ? "#065f46" : "#dc2626" }}>{msg}</div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div style={{ background: "#fff", borderRadius: "12px", border: "2px solid #4a5c3a", padding: "24px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1c1c1a", marginBottom: "16px" }}>
            {editItem ? `Edit: ${editItem.name}` : "Add New Size"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={labelStyle}>Shape</label>
              <select value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} style={selectStyle}>
                {SHAPE_ORDER_ADMIN.map((sh) => <option key={sh} value={sh}>{sh}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Size Label (ft) *</label>
              <input type="text" placeholder="e.g. 8 x 10 ft" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Size (cm) *</label>
              <input type="text" placeholder="e.g. 243 x 304 cm" value={form.cm} onChange={(e) => setForm({ ...form, cm: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sq.ft *</label>
              <input type="number" step="0.1" min="1" placeholder="e.g. 80" value={form.sqft} onChange={(e) => setForm({ ...form, sqft: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleSave} disabled={saving} style={{ padding: "10px 24px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
              {saving ? "Saving..." : editItem ? "Update Size" : "Add Size"}
            </button>
            <button onClick={() => { setShowAddForm(false); setEditItem(null); }}
              style={{ padding: "10px 20px", background: "#f0ece4", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Shape Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {SHAPE_ORDER_ADMIN.map((sh) => (
          <button key={sh} onClick={() => setActiveShape(sh)}
            style={{ padding: "9px 20px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer", background: activeShape === sh ? "#4a5c3a" : "#f0ece4", color: activeShape === sh ? "#fff" : "#5c5a52" }}>
            {SHAPE_ICONS_ADM[sh]} {sh} ({grouped[sh]?.length ?? 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#5c5a52" }}>Loading...</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f6f0", borderBottom: "1px solid #e5e7eb" }}>
                {["Size (ft)", "Size (cm)", "Sq.ft", "Shape", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5c5a52", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(grouped[activeShape] ?? []).map((item, i) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f0ece4", background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
                  <td style={{ padding: "11px 16px", fontSize: "14px", fontWeight: 700, color: "#1c1c1a" }}>{item.name}</td>
                  <td style={{ padding: "11px 16px", fontSize: "13px", color: "#5c5a52" }}>{item.cm}</td>
                  <td style={{ padding: "11px 16px", fontSize: "13px", fontWeight: 700, color: "#4a5c3a" }}>{item.sqft} sq.ft</td>
                  <td style={{ padding: "11px 16px", fontSize: "12px", color: "#7a8f6a" }}>{item.shape}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <button onClick={() => handleToggleActive(item)}
                      style={{ padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer", background: item.active ? "#d1fae5" : "#f1f5f9", color: item.active ? "#065f46" : "#64748b" }}>
                      {item.active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => startEdit(item)} style={{ padding: "5px 12px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ padding: "5px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {(grouped[activeShape] ?? []).length === 0 && (
                <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#5c5a52" }}>No {activeShape} sizes yet. Click "+ Add Size" to add one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Info */}
      <div style={{ marginTop: "20px", padding: "16px 20px", background: "#f0f4e8", borderRadius: "12px", border: "1px solid #c8d4b8" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#4a5c3a", marginBottom: "6px" }}>📐 About the Size Master</p>
        <p style={{ fontSize: "12px", color: "#5c5a52", lineHeight: 1.7 }}>
          All sizes here appear on both <strong>Product Detail pages</strong> and the <strong>Custom Rugs calculator</strong>.
          Toggling a size to Hidden removes it from customer view. Deleting a size is permanent.
          Adding a new size makes it instantly available for customers to select.
        </p>
      </div>
    </div>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────────
interface PricingItemAdmin {
  id: string; name: string; pricePerSqft: number;
}

function PricingSection() {
  const [pricing, setPricing] = useState<PricingItemAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const fetchPricing = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/pricing", { headers: { "x-admin-key": getAdminKey() } });
      const d = await r.json();
      if (Array.isArray(d)) {
        setPricing(d);
        const init: Record<string, string> = {};
        d.forEach((p: PricingItemAdmin) => { init[p.id] = String(p.pricePerSqft); });
        setEditValues(init);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchPricing(); }, [fetchPricing]);

  const handleSave = async (id: string) => {
    const newPrice = parseFloat(editValues[id]);
    if (isNaN(newPrice) || newPrice <= 0) { setMsg("❌ Enter a valid price"); return; }
    setSaving(id);
    try {
      await fetch("/api/admin/pricing", {
        method: "PUT", headers: adminHeaders(),
        body: JSON.stringify({ id, pricePerSqft: newPrice }),
      });
      setMsg(`✅ ${pricing.find((p) => p.id === id)?.name} price updated to $${newPrice}/sq.ft`);
      fetchPricing();
    } catch { setMsg("❌ Error saving price"); }
    setSaving(null);
    setTimeout(() => setMsg(""), 3000);
  };

  const PREVIEW_SIZES = [15, 35, 80, 120];
  const PREVIEW_LABELS = ["3×5 ft", "5×7 ft", "8×10 ft", "10×12 ft"];

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "14px", color: "#5c5a52" }}>Set the base price per square foot for each rug type. All product prices update automatically.</p>
      </div>

      {msg && (
        <div style={{ padding: "10px 14px", background: msg.startsWith("✅") ? "#d1fae5" : "#fee2e2", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", fontWeight: 600, color: msg.startsWith("✅") ? "#065f46" : "#dc2626" }}>{msg}</div>
      )}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#5c5a52" }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {pricing.map((item) => (
            <div key={item.id} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a" }}>{item.name}</h3>
                  <p style={{ fontSize: "12px", color: "#7a8f6a", marginTop: "2px" }}>Current: ${item.pricePerSqft}/sq.ft</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 700, color: "#5c5a52" }}>$</span>
                    <input
                      type="number" step="0.5" min="1" max="500"
                      value={editValues[item.id] ?? item.pricePerSqft}
                      onChange={(e) => setEditValues({ ...editValues, [item.id]: e.target.value })}
                      style={{ ...inputStyle, width: "100px", fontWeight: 700, fontSize: "16px" }}
                    />
                    <span style={{ fontSize: "13px", color: "#5c5a52", whiteSpace: "nowrap" }}>/sq.ft</span>
                  </div>
                  <button onClick={() => handleSave(item.id)} disabled={saving === item.id}
                    style={{ padding: "10px 20px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {saving === item.id ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              {/* Price Preview */}
              <div style={{ borderTop: "1px solid #f0ece4", paddingTop: "14px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a8878", marginBottom: "10px" }}>Price Preview at ${parseFloat(editValues[item.id] ?? String(item.pricePerSqft)).toFixed(2)}/sq.ft</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {PREVIEW_SIZES.map((sqft, i) => (
                    <div key={sqft} style={{ padding: "12px", background: "#f8f6f0", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#1c1c1a", marginBottom: "2px" }}>{PREVIEW_LABELS[i]}</p>
                      <p style={{ fontSize: "11px", color: "#7a8f6a", marginBottom: "4px" }}>{sqft} sq.ft</p>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#4a5c3a" }}>
                        ${Math.round(sqft * parseFloat(editValues[item.id] ?? String(item.pricePerSqft))).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div style={{ marginTop: "20px", padding: "16px 20px", background: "#f0f4e8", borderRadius: "12px", border: "1px solid #c8d4b8" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#4a5c3a", marginBottom: "6px" }}>💲 How Pricing Works</p>
        <p style={{ fontSize: "12px", color: "#5c5a52", lineHeight: 1.7 }}>
          <strong>Price = Sq.ft × Price/sq.ft × Pile Multiplier × (1 - Discount%)</strong><br />
          Change a price here → every product page and the Custom Rugs calculator instantly reflect the new price.
          Pile height adjustments: Flat Weave ×0.85, Low ×0.95, Medium ×1.00, High ×1.15, Shaggy ×1.25.
          Use the <strong>Discount / Sale</strong> section to apply a global sitewide discount on top.
        </p>
      </div>
    </div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  color: "#5c5a52", marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  border: "1.5px solid #dcd4c5", borderRadius: "8px",
  fontSize: "14px", outline: "none", color: "#1c1c1a",
  background: "#fff",
};

const selectStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  border: "1.5px solid #dcd4c5", borderRadius: "8px",
  fontSize: "14px", outline: "none", color: "#1c1c1a",
  background: "#fff", cursor: "pointer",
};
