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
  // Quote/Custom inquiry fields
  size?: string; material?: string; primaryColor?: string; secondaryColor?: string;
  style?: string; room?: string; notes?: string; designImage?: string;
  // Order fields
  orderItems?: { product: string; size: string; qty: number; price: number }[];
  totalAmount?: number; paymentMethod?: string;
  // Reply history (legacy log)
  replies?: { date: string; channel: string; message: string; by: string }[];
  // Two-way messaging thread
  messageToken?: string;
  thread?: { id: string; from: "admin" | "customer"; senderName: string; message: string; date: string; read?: boolean }[];
  hasUnreadCustomerReply?: boolean;
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
  // New product attributes
  primaryColor?: string; secondaryColor?: string;
  homeStyle?: string; occasion?: string; room?: string;
  rugTypeTags?: string; pileHeight?: string;
  // Smart pricing adjustment
  priceAdjustment?: number;  // +/- per sqft added on top of base price
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
  { id: "orders",      label: "Orders",           icon: "🛍️" },
  { id: "analytics",   label: "Analytics",        icon: "📈" },
  { id: "products",    label: "Products",          icon: "🧶" },
  { id: "add-product", label: "Add Product",       icon: "➕" },
  { id: "categories",  label: "Categories",        icon: "📂" },
  { id: "sizes",       label: "Size Master",        icon: "📐" },
  { id: "pricing",     label: "Pricing",            icon: "💲" },
  { id: "discount",    label: "Discount / Sale",   icon: "🏷️" },
  { id: "reviews",     label: "Reviews",           icon: "⭐" },
  { id: "favorites",   label: "Favorites",         icon: "❤️" },
  { id: "activity",    label: "Activity Feed",     icon: "⚡" },
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
          {section === "orders" && <OrdersSection />}
          {section === "analytics" && <AnalyticsSection />}
          {section === "reviews" && <ReviewsSection products={products} />}
          {section === "favorites" && <FavoritesSection />}
          {section === "activity" && <ActivityFeedSection inquiries={inquiries} products={products} />}
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
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [favorites, setFavorites] = useState<unknown[]>([]);
  const [reviews, setReviews] = useState<unknown[]>([]);
  const [analyticsRange, setAnalyticsRange] = useState<"today" | "last7" | "last30" | "last365">("today");

  useEffect(() => {
    // Fetch orders
    fetch("/api/admin/data?type=orders", { headers: { "x-admin-key": getAdminKey() } })
      .then((r) => r.json()).then((d) => setOrders(Array.isArray(d) ? d : [])).catch(() => {});
    // Fetch analytics
    fetch("/api/analytics", { headers: { "x-admin-key": getAdminKey() } })
      .then((r) => r.json()).then((d) => setAnalytics(d)).catch(() => {});
    // Fetch favorites
    fetch("/api/favorites", { headers: { "x-admin-key": getAdminKey() } })
      .then((r) => r.json()).then((d) => setFavorites(Array.isArray(d) ? d : [])).catch(() => {});
    // Fetch reviews
    fetch("/api/reviews?all=1", { headers: { "x-admin-key": getAdminKey() } })
      .then((r) => r.json()).then((d) => setReviews(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  // Revenue calculations
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const thisMonth = now.toISOString().slice(0, 7);

  const totalRevenue = orders.reduce((s, o) => s + ((o.totalAmount as number) || 0), 0);
  const todayRevenue = orders.filter((o) => (o.createdAt as string || "").startsWith(todayStr)).reduce((s, o) => s + ((o.totalAmount as number) || 0), 0);
  const monthlyRevenue = orders.filter((o) => (o.createdAt as string || "").startsWith(thisMonth)).reduce((s, o) => s + ((o.totalAmount as number) || 0), 0);

  // Order status counts
  const ordersByStatus = {
    pending: orders.filter((o) => o.status === "pending" || !o.status).length,
    processing: orders.filter((o) => o.status === "processing").length,
    production: orders.filter((o) => o.status === "production").length,
    ready: orders.filter((o) => o.status === "ready").length,
    dispatched: orders.filter((o) => o.status === "dispatched").length,
    "in-transit": orders.filter((o) => o.status === "in-transit").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  // Analytics data
  const rangeData = analytics ? ((analytics[analyticsRange] as Record<string, number>) || { views: 0, visitors: 0 }) : { views: 0, visitors: 0 };
  const totalViews = analytics ? ((analytics.total as Record<string, number>)?.views || 0) : 0;
  const productViews = analytics ? Object.values((analytics.productViews as Record<string, number>) || {}).reduce((s, v) => s + v, 0) : 0;
  const daily = analytics ? ((analytics.dailyViews as { date: string; views: number }[]) || []) : [];
  const maxDailyViews = daily.length > 0 ? Math.max(...daily.map((d) => d.views), 1) : 1;

  // Recent activity (merge orders + inquiries sorted by date)
  type ActivityItem = { type: string; label: string; sub: string; date: string; color: string; icon: string };
  const recentActivity: ActivityItem[] = [
    ...orders.slice(0, 5).map((o) => ({
      type: "order", icon: "🛍️", color: "#4a5c3a",
      label: `Order ${o.orderId as string}`,
      sub: `$${(o.totalAmount as number || 0).toFixed(2)} · ${o.status as string || "pending"}`,
      date: o.createdAt as string || "",
    })),
    ...inquiries.slice(0, 5).map((i) => ({
      type: "inquiry", icon: "📋", color: "#0369a1",
      label: `${i.type?.toUpperCase() || "INQUIRY"} – ${i.name || i.companyName || "Anonymous"}`,
      sub: i.email || i.message?.slice(0, 50) || "",
      date: i.createdAt || "",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const StatCard = ({ icon, label, value, sub, color, onClick }: { icon: string; label: string; value: string | number; sub?: string; color: string; onClick?: () => void }) => (
    <button onClick={onClick} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "18px 20px", textAlign: "left", cursor: onClick ? "pointer" : "default", transition: "all 0.2s", width: "100%" }}
      onMouseEnter={(e) => { if (onClick) { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = color; }}}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: "18px" }}>{icon}</span>
      </div>
      <div style={{ fontSize: "26px", fontWeight: 800, color, letterSpacing: "-0.02em", margin: "8px 0 2px" }}>{value}</div>
      {sub && <div style={{ fontSize: "11px", color: "#9ca3af" }}>{sub}</div>}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── Revenue Row ── */}
      <div>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Revenue</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <StatCard icon="💰" label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} color="#4a5c3a" onClick={() => setSection("orders")} />
          <StatCard icon="📅" label="Today's Revenue" value={`$${todayRevenue.toFixed(2)}`} color="#059669" onClick={() => setSection("orders")} />
          <StatCard icon="📆" label="Monthly Revenue" value={`$${monthlyRevenue.toFixed(2)}`} color="#0369a1" onClick={() => setSection("orders")} />
        </div>
      </div>

      {/* ── Orders Row ── */}
      <div>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Orders</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          <StatCard icon="🛍️" label="Total Orders" value={orders.length} color="#4a5c3a" onClick={() => setSection("orders")} />
          <StatCard icon="⏳" label="Pending" value={ordersByStatus.pending} color="#d97706" onClick={() => setSection("orders")} />
          <StatCard icon="⚙️" label="Processing" value={ordersByStatus.processing + ordersByStatus.production + ordersByStatus.ready} sub="Processing + Production + Ready" color="#0369a1" onClick={() => setSection("orders")} />
          <StatCard icon="✅" label="Delivered" value={ordersByStatus.delivered} color="#059669" onClick={() => setSection("orders")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "12px" }}>
          <StatCard icon="🚚" label="Dispatched" value={ordersByStatus.dispatched + ordersByStatus["in-transit"]} sub="Dispatched + In Transit" color="#7c3aed" onClick={() => setSection("orders")} />
          <StatCard icon="❌" label="Cancelled" value={ordersByStatus.cancelled} color="#dc2626" onClick={() => setSection("orders")} />
          <StatCard icon="🧶" label="Total Products" value={stats.totalProducts} color="#4a5c3a" onClick={() => setSection("products")} />
          <StatCard icon="✅" label="Active Products" value={stats.activeProducts} color="#059669" onClick={() => setSection("products")} />
        </div>
      </div>

      {/* ── Analytics Row ── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Analytics</h2>
          <div style={{ display: "flex", gap: "6px" }}>
            {(["today", "last7", "last30", "last365"] as const).map((r) => (
              <button key={r} onClick={() => setAnalyticsRange(r)} style={{ padding: "5px 10px", borderRadius: "6px", border: "1.5px solid", cursor: "pointer", fontSize: "11px", fontWeight: 600, background: analyticsRange === r ? "#4a5c3a" : "#fff", color: analyticsRange === r ? "#fff" : "#4a5c3a", borderColor: analyticsRange === r ? "#4a5c3a" : "#c8d4b8" }}>
                {r === "today" ? "Today" : r === "last7" ? "7d" : r === "last30" ? "30d" : "12mo"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "12px" }}>
          <StatCard icon="👁" label="Page Views" value={rangeData.views || 0} color="#0369a1" onClick={() => setSection("analytics")} />
          <StatCard icon="👤" label="Visitors" value={rangeData.visitors || 0} color="#7c3aed" onClick={() => setSection("analytics")} />
          <StatCard icon="📊" label="Total Views" value={totalViews} color="#4a5c3a" onClick={() => setSection("analytics")} />
          <StatCard icon="🏷️" label="Product Views" value={productViews} color="#d97706" onClick={() => setSection("analytics")} />
        </div>

        {/* Mini bar chart */}
        {daily.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Daily Views — Last 30 Days</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "60px" }}>
              {daily.slice(-30).map((d, i) => (
                <div key={i} title={`${d.date}: ${d.views}`} style={{ flex: 1, background: "#4a5c3a", borderRadius: "2px 2px 0 0", height: `${Math.max(4, (d.views / maxDailyViews) * 100)}%`, opacity: 0.6 + (d.views / maxDailyViews) * 0.4 }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Inquiries / Favorites / Reviews Row ── */}
      <div>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Engagement</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <StatCard icon="📋" label="Customer Inquiries" value={stats.totalInquiries} sub={`${stats.newInquiries} new`} color="#4a5c3a" onClick={() => setSection("inquiries")} />
          <StatCard icon="❤️" label="Favorites" value={favorites.length} color="#dc2626" onClick={() => setSection("favorites")} />
          <StatCard icon="⭐" label="Reviews" value={reviews.length} color="#d97706" onClick={() => setSection("reviews")} />
        </div>
      </div>

      {/* ── Recent Activity Feed ── */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a" }}>Recent Activity</h2>
          <button onClick={() => setSection("activity")} style={{ background: "none", border: "none", color: "#4a5c3a", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>View all →</button>
        </div>
        {recentActivity.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>No activity yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 0", borderBottom: i < recentActivity.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: item.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "13px", color: "#1c1c1a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</p>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.sub}</p>
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {item.date ? new Date(item.date).toLocaleDateString() : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Recent Inquiries ── */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1c1a" }}>Recent Inquiries</h2>
          <button onClick={() => setSection("inquiries")} style={{ background: "none", border: "none", color: "#4a5c3a", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>View all →</button>
        </div>
        <InquiryTable inquiries={inquiries.slice(0, 5)} onRefresh={() => {}} compact />
      </div>

      {/* ── Recent Products ── */}
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
// Supports:
//  • Multi-select (up to 10 images at once in one click)
//  • Drag-and-drop reorder (HTML5 drag API, no external lib)
//  • Delete any individual image
//  • Replace any individual image
//  • First image = Main Image (auto-promoted when reordered)
//  • Drop-zone for dragging files from OS into the upload area
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
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragSrcIdx, setDragSrcIdx] = useState<number | null>(null);
  const [dropZoneActive, setDropZoneActive] = useState(false);
  // replaceIdx: when set, next upload replaces that slot instead of appending
  const [replaceIdx, setReplaceIdx] = useState<number | null>(null);
  const replaceInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node && replaceIdx !== null) node.click();
  }, [replaceIdx]);

  // ── Upload helper ────────────────────────────────────────────────────────────
  const doUpload = async (files: FileList | File[], type: "images" | "video") => {
    const arr = Array.isArray(files) ? files : Array.from(files);
    if (!arr.length) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("productId", productSlug || "new");
      if (type === "images") {
        const slots = 10 - images.length;
        // If replacing a slot, we always have room for 1
        const toUpload = replaceIdx !== null ? arr.slice(0, 1) : arr.slice(0, Math.max(slots, 0));
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
        if (replaceIdx !== null) {
          // Replace the specific slot
          const next = [...images];
          next[replaceIdx] = data.urls[0];
          onImagesChange(next);
          setReplaceIdx(null);
        } else {
          onImagesChange([...images, ...data.urls].slice(0, 10));
        }
      } else if (type === "video" && data.videoUrl) {
        onVideoChange(data.videoUrl);
      }
    } catch (err) {
      setUploadError(String(err));
    }
    setUploading(false);
  };

  // ── Drag-and-drop reorder ────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragSrcIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(idx);
  };
  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragSrcIdx === null || dragSrcIdx === idx) { setDragOverIdx(null); setDragSrcIdx(null); return; }
    const next = [...images];
    const [moved] = next.splice(dragSrcIdx, 1);
    next.splice(idx, 0, moved);
    onImagesChange(next);
    setDragOverIdx(null);
    setDragSrcIdx(null);
  };
  const handleDragEnd = () => { setDragOverIdx(null); setDragSrcIdx(null); };

  // ── Drop-zone (OS files dragged onto the zone) ───────────────────────────────
  const handleZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDropZoneActive(true);
  };
  const handleZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length > 0) doUpload(files, "images");
  };

  return (
    <div>
      {/* ── Images ── */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <label style={labelStyle}>Product Images — up to 10 &nbsp;<span style={{ fontWeight: 400, color: "#8a8878" }}>({images.length}/10)</span></label>
          {images.length > 1 && (
            <span style={{ fontSize: "11px", color: "#7a8f6a", fontStyle: "italic" }}>
              ↔ Drag thumbnails to reorder &nbsp;·&nbsp; First = Main Image
            </span>
          )}
        </div>

        {/* Drop-zone / Upload button */}
        {images.length < 10 && (
          <label
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: "8px",
              padding: "20px 18px",
              background: dropZoneActive ? "#e4f0d4" : "#f0f4e8",
              border: `2px dashed ${dropZoneActive ? "#4a7c30" : "#7a9a5a"}`,
              borderRadius: "12px",
              cursor: uploading ? "not-allowed" : "pointer",
              fontSize: "14px", color: "#4a5c3a", fontWeight: 600,
              opacity: uploading ? 0.6 : 1,
              transition: "all 0.15s ease",
              textAlign: "center",
            }}
            onDragOver={handleZoneDragOver}
            onDragLeave={() => setDropZoneActive(false)}
            onDrop={handleZoneDrop}
          >
            <span style={{ fontSize: "28px" }}>🖼️</span>
            <span>
              {uploading
                ? "Uploading…"
                : dropZoneActive
                ? "Drop images here"
                : "Click to select or drag & drop images here"}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 400, color: "#7a8f6a" }}>
              Select multiple files at once &nbsp;·&nbsp; JPG, PNG, WebP, AVIF, GIF &nbsp;·&nbsp; Up to {10 - images.length} more image{10 - images.length !== 1 ? "s" : ""}
            </span>
            <input
              type="file" multiple accept="image/*" style={{ display: "none" }}
              disabled={uploading || images.length >= 10}
              onChange={(e) => doUpload(e.target.files!, "images")}
            />
          </label>
        )}

        {uploadError && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px" }}>⚠️ {uploadError}</p>}

        {/* Thumbnails grid — draggable */}
        {images.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
            {images.map((img, i) => (
              <div
                key={img + i}
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                style={{
                  position: "relative", width: "96px", height: "96px",
                  borderRadius: "10px", overflow: "visible",
                  flexShrink: 0,
                  cursor: "grab",
                  outline: dragOverIdx === i && dragSrcIdx !== i
                    ? "3px solid #4a7c30"
                    : i === 0
                    ? "3px solid #b8975a"
                    : "none",
                  outlineOffset: "2px",
                  opacity: dragSrcIdx === i ? 0.45 : 1,
                  transition: "opacity 0.15s, outline 0.1s",
                }}
              >
                {/* Image */}
                <div style={{ width: "96px", height: "96px", borderRadius: "10px", overflow: "hidden", border: "1.5px solid #dcd4c5" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", userSelect: "none", pointerEvents: "none" }} />
                </div>

                {/* "Main" badge on first image */}
                {i === 0 && (
                  <div style={{
                    position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)",
                    background: "#b8975a", color: "#fff", fontSize: "9px", fontWeight: 700,
                    padding: "2px 8px", borderRadius: "9999px", whiteSpace: "nowrap",
                    letterSpacing: "0.06em", boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                  }}>
                    ★ MAIN
                  </div>
                )}

                {/* Drag handle hint top-left */}
                <div style={{
                  position: "absolute", top: "4px", left: "4px",
                  background: "rgba(0,0,0,0.35)", borderRadius: "4px",
                  padding: "2px 4px", fontSize: "10px", color: "#fff",
                  pointerEvents: "none", userSelect: "none",
                }}>
                  ⠿
                </div>

                {/* Index label top-right */}
                <div style={{
                  position: "absolute", top: "4px", right: "26px",
                  background: "rgba(0,0,0,0.38)", borderRadius: "4px",
                  padding: "1px 5px", fontSize: "9px", color: "#fff",
                  pointerEvents: "none",
                }}>
                  {i + 1}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => onImagesChange(images.filter((_, j) => j !== i))}
                  style={{
                    position: "absolute", top: "3px", right: "3px",
                    background: "rgba(220,38,38,0.92)", color: "#fff",
                    border: "none", borderRadius: "50%",
                    width: "20px", height: "20px",
                    fontSize: "13px", lineHeight: "20px", textAlign: "center",
                    cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                  }}
                >
                  ×
                </button>

                {/* Replace input (hidden, triggered by button) */}
                {replaceIdx === i && (
                  <input
                    ref={replaceInputRef}
                    type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => { if (e.target.files?.length) doUpload(e.target.files, "images"); }}
                    onBlur={() => setReplaceIdx(null)}
                  />
                )}

                {/* Replace button (bottom, on hover via title) */}
                <button
                  type="button"
                  title="Replace image"
                  onClick={() => setReplaceIdx(i)}
                  style={{
                    position: "absolute", bottom: i === 0 ? "16px" : "3px", right: "3px",
                    background: "rgba(74,92,58,0.88)", color: "#fff",
                    border: "none", borderRadius: "4px",
                    padding: "2px 5px", fontSize: "9px", fontWeight: 700,
                    cursor: "pointer", letterSpacing: "0.04em",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  ↺
                </button>
              </div>
            ))}

            {/* Add-more mini button if there's already at least 1 image and slots remain */}
            {images.length >= 1 && images.length < 10 && (
              <label style={{
                width: "96px", height: "96px", borderRadius: "10px",
                border: "2px dashed #c8d4b8", background: "#f8faf4",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", cursor: "pointer", color: "#7a8f6a",
                fontSize: "11px", fontWeight: 600, gap: "4px", flexShrink: 0,
              }}>
                <span style={{ fontSize: "24px", lineHeight: 1 }}>+</span>
                Add more
                <input
                  type="file" multiple accept="image/*" style={{ display: "none" }}
                  disabled={uploading}
                  onChange={(e) => doUpload(e.target.files!, "images")}
                />
              </label>
            )}
          </div>
        )}

        {/* Tip row */}
        {images.length > 1 && (
          <p style={{ fontSize: "11px", color: "#8a8878", marginTop: "14px" }}>
            💡 Drag any thumbnail left to make it the Main Image. Click <strong>×</strong> to delete, <strong>↺</strong> to replace.
          </p>
        )}
      </div>

      {/* ── Video ── */}
      <div>
        <label style={labelStyle}>Product Video &nbsp;<span style={{ fontWeight: 400, color: "#8a8878" }}>(optional — shown on product page)</span></label>
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
            onChange={(e) => doUpload(e.target.files!, "video")}
          />
        </label>
        <p style={{ fontSize: "11px", color: "#8a8878", marginTop: "4px" }}>Supported: MP4, WebM, MOV.</p>
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
  const [draft, setDraft] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");

  // Parse textarea: split by comma, trim, dedupe, cap at MAX
  const parseDraft = () => {
    if (!draft.trim()) return;
    const incoming = draft
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    const merged = [...keywords];
    for (const kw of incoming) {
      if (merged.length >= MAX) break;
      if (!merged.includes(kw)) merged.push(kw);
    }
    onChange(merged);
    setDraft("");
  };

  const removeKeyword = (i: number) => {
    const next = [...keywords];
    next.splice(i, 1);
    onChange(next);
  };

  const startEdit = (i: number) => {
    setEditIdx(i);
    setEditVal(keywords[i]);
  };

  const commitEdit = () => {
    if (editIdx === null) return;
    const trimmed = editVal.trim();
    if (trimmed && !keywords.some((k, idx) => k === trimmed && idx !== editIdx)) {
      const next = [...keywords];
      next[editIdx] = trimmed;
      onChange(next);
    }
    setEditIdx(null);
    setEditVal("");
  };

  const remaining = MAX - keywords.length;

  return (
    <div>
      <label style={labelStyle}>
        SEO Tags / Keywords{" "}
        <span style={{ fontWeight: 400, color: keywords.length >= MAX ? "#c0392b" : "#8a8878" }}>
          ({keywords.length}/{MAX})
        </span>
      </label>
      <p style={{ fontSize: "11px", color: "#8a8878", marginBottom: "10px" }}>
        Paste all keywords separated by commas, then click <strong>Add Tags</strong>. Click any tag to edit it; × to remove.
      </p>

      {/* Paste textarea */}
      {remaining > 0 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); parseDraft(); }
            }}
            placeholder={`Paste keywords here, e.g.: hand tufted rug, wool rug, moroccan rug, area rug…\n(up to ${remaining} more tag${remaining === 1 ? "" : "s"} can be added)`}
            rows={3}
            style={{
              ...inputStyle,
              flex: 1,
              resize: "vertical",
              fontSize: "12px",
              lineHeight: "1.5",
              fontFamily: "inherit",
            }}
          />
          <button
            type="button"
            onClick={parseDraft}
            disabled={!draft.trim()}
            style={{
              alignSelf: "flex-end",
              padding: "9px 16px",
              background: draft.trim() ? "#2c2c27" : "#444",
              color: "#d4af7a",
              border: "1px solid #d4af7a",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: draft.trim() ? "pointer" : "not-allowed",
              whiteSpace: "nowrap",
              letterSpacing: "0.03em",
            }}
          >
            Add Tags
          </button>
        </div>
      )}
      {remaining === 0 && (
        <p style={{ fontSize: "11px", color: "#c0392b", marginBottom: "10px" }}>
          Maximum {MAX} keywords reached. Remove a tag to add more.
        </p>
      )}

      {/* Tag chips */}
      {keywords.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {keywords.map((kw, i) =>
            editIdx === i ? (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <input
                  autoFocus
                  type="text"
                  value={editVal}
                  maxLength={50}
                  onChange={(e) => setEditVal(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit();
                    if (e.key === "Escape") { setEditIdx(null); setEditVal(""); }
                  }}
                  style={{
                    padding: "4px 8px",
                    background: "#1a1a16",
                    color: "#f0ebe0",
                    border: "1px solid #d4af7a",
                    borderRadius: "20px",
                    fontSize: "12px",
                    outline: "none",
                    width: `${Math.max(editVal.length + 2, 10)}ch`,
                  }}
                />
              </div>
            ) : (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px 4px 12px",
                  background: "#2c2c27",
                  color: "#d4af7a",
                  border: "1px solid #3a3a30",
                  borderRadius: "20px",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                title="Click to edit"
                onClick={() => startEdit(i)}
              >
                {kw}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeKeyword(i); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#8a8878",
                    cursor: "pointer",
                    padding: "0",
                    lineHeight: 1,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </span>
            )
          )}
        </div>
      )}

      {keywords.length === 0 && (
        <p style={{ fontSize: "12px", color: "#555", fontStyle: "italic" }}>
          No keywords yet — paste some above and click Add Tags.
        </p>
      )}
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
    // New attributes
    primaryColor: "", secondaryColor: "",
    homeStyle: "", occasion: "", room: "", rugTypeTags: "", pileHeight: "",
    priceAdjustment: 0,
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
      images: images.length > 0 ? images : [],
      image: images[0] || "",
      video: video || "",
      keywords: keywords.filter(Boolean),
      // Keep leadTime for backward compatibility
      leadTime: form.processingTime,
      priceAdjustment: Number(form.priceAdjustment) || 0,
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

          {/* Product Attributes */}
          <div style={{ borderTop: "1px solid #f0ece4", paddingTop: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5c5a52", marginBottom: "14px" }}>Product Attributes (Etsy-style)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Primary Color</label>
                <input type="text" placeholder="e.g. Ivory, Navy, Terracotta" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Secondary Color</label>
                <input type="text" placeholder="e.g. Gold, Sage, Cream" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Home Style</label>
                <select value={form.homeStyle} onChange={(e) => setForm({ ...form, homeStyle: e.target.value })} style={selectStyle}>
                  <option value="">Select…</option>
                  {["Traditional", "Modern", "Bohemian", "Scandinavian", "Moroccan", "Industrial", "Farmhouse", "Coastal", "Minimalist", "Transitional", "Art Deco", "Mid-Century Modern"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Occasion</label>
                <select value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} style={selectStyle}>
                  <option value="">Select…</option>
                  {["Everyday Use", "Gift", "Wedding", "Housewarming", "Holiday", "Commercial / Hotel", "Special Occasion"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Room</label>
                <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} style={selectStyle}>
                  <option value="">Select…</option>
                  {["Living Room", "Bedroom", "Dining Room", "Hallway / Entryway", "Home Office", "Kitchen", "Bathroom", "Kids Room", "Outdoor / Patio", "Commercial"].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Pile Height</label>
                <select value={form.pileHeight} onChange={(e) => setForm({ ...form, pileHeight: e.target.value })} style={selectStyle}>
                  <option value="">Select…</option>
                  {["Flat Weave (0mm)", "Low Pile (5mm)", "Medium Pile (10mm)", "High Pile (15mm)", "Shaggy (20mm+)"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Rug Type Tags (comma separated)</label>
                <input type="text" placeholder="e.g. Oushak, Vintage, Persian, Geometric" value={form.rugTypeTags} onChange={(e) => setForm({ ...form, rugTypeTags: e.target.value })} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Smart Price Adjustment */}
          <div style={{ padding: "16px 20px", background: "#f0f4e8", borderRadius: "8px", border: "1px solid #c8d4b8" }}>
            <p style={{ fontSize: "13px", color: "#4a5c3a", fontWeight: 700, marginBottom: "10px" }}>💲 Smart Pricing — Price Adjustment</p>
            <p style={{ fontSize: "12px", color: "#5c5a52", marginBottom: "12px" }}>Base price is set per category in Pricing Settings. Add an adjustment (+/-) for this specific product.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "#5c5a52" }}>Adjustment: $</span>
              <input
                type="number" step="0.5" min="-50" max="200"
                value={form.priceAdjustment}
                onChange={(e) => setForm({ ...form, priceAdjustment: parseFloat(e.target.value) || 0 })}
                style={{ ...inputStyle, width: "100px", fontWeight: 700 }}
                placeholder="0"
              />
              <span style={{ fontSize: "13px", color: "#5c5a52" }}>/sq.ft (0 = use base price exactly)</span>
            </div>
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
    // New attributes
    primaryColor: product.primaryColor || "", secondaryColor: product.secondaryColor || "",
    homeStyle: product.homeStyle || "", occasion: product.occasion || "",
    room: product.room || "", rugTypeTags: product.rugTypeTags || "",
    pileHeight: product.pileHeight || "",
    priceAdjustment: product.priceAdjustment || 0,
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

          {/* Product Attributes */}
          <div style={{ borderTop: "1px solid #f0ece4", paddingTop: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5c5a52", marginBottom: "14px" }}>Product Attributes (Etsy-style)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Primary Color</label>
                <input type="text" placeholder="e.g. Ivory, Navy, Terracotta" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Secondary Color</label>
                <input type="text" placeholder="e.g. Gold, Sage, Cream" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Home Style</label>
                <select value={form.homeStyle} onChange={(e) => setForm({ ...form, homeStyle: e.target.value })} style={selectStyle}>
                  <option value="">Select…</option>
                  {["Traditional", "Modern", "Bohemian", "Scandinavian", "Moroccan", "Industrial", "Farmhouse", "Coastal", "Minimalist", "Transitional", "Art Deco", "Mid-Century Modern"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Occasion</label>
                <select value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} style={selectStyle}>
                  <option value="">Select…</option>
                  {["Everyday Use", "Gift", "Wedding", "Housewarming", "Holiday", "Commercial / Hotel", "Special Occasion"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Room</label>
                <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} style={selectStyle}>
                  <option value="">Select…</option>
                  {["Living Room", "Bedroom", "Dining Room", "Hallway / Entryway", "Home Office", "Kitchen", "Bathroom", "Kids Room", "Outdoor / Patio", "Commercial"].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Pile Height</label>
                <select value={form.pileHeight} onChange={(e) => setForm({ ...form, pileHeight: e.target.value })} style={selectStyle}>
                  <option value="">Select…</option>
                  {["Flat Weave (0mm)", "Low Pile (5mm)", "Medium Pile (10mm)", "High Pile (15mm)", "Shaggy (20mm+)"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Rug Type Tags (comma separated)</label>
                <input type="text" placeholder="e.g. Oushak, Vintage, Persian, Geometric" value={form.rugTypeTags} onChange={(e) => setForm({ ...form, rugTypeTags: e.target.value })} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Smart Price Adjustment */}
          <div style={{ padding: "16px 20px", background: "#f0f4e8", borderRadius: "8px", border: "1px solid #c8d4b8" }}>
            <p style={{ fontSize: "13px", color: "#4a5c3a", fontWeight: 700, marginBottom: "10px" }}>💲 Smart Pricing — Price Adjustment</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "#5c5a52" }}>Adjustment: $</span>
              <input
                type="number" step="0.5" min="-50" max="200"
                value={form.priceAdjustment}
                onChange={(e) => setForm({ ...form, priceAdjustment: parseFloat(e.target.value) || 0 })}
                style={{ ...inputStyle, width: "100px", fontWeight: 700 }}
              />
              <span style={{ fontSize: "13px", color: "#5c5a52" }}>/sq.ft (0 = category base price)</span>
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
const INQUIRY_STATUSES = [
  { value: "new", label: "New", bg: "#fee2e2", color: "#dc2626" },
  { value: "contacted", label: "Contacted", bg: "#fef9c3", color: "#92400e" },
  { value: "quotation_sent", label: "Quotation Sent", bg: "#dbeafe", color: "#1d4ed8" },
  { value: "order_confirmed", label: "Order Confirmed", bg: "#d1fae5", color: "#065f46" },
  { value: "closed", label: "Closed", bg: "#f1f5f9", color: "#64748b" },
];

function getStatusStyle(status: string) {
  return INQUIRY_STATUSES.find((s) => s.value === status) || INQUIRY_STATUSES[0];
}

function InquiriesSection({ inquiries, loading, onRefresh, filter }: { inquiries: Inquiry[]; loading: boolean; onRefresh: () => void; filter: string }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = inquiries.filter((i) => {
    const matchType = !filter || filter === "all" || i.type === filter;
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    const matchSearch = !search || JSON.stringify(i).toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <input type="text" placeholder="Search name, email, product…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, minWidth: "200px", flex: 1 }} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...selectStyle, width: "auto", minWidth: "160px" }}>
          <option value="all">All Status</option>
          {INQUIRY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <span style={{ fontSize: "13px", color: "#5c5a52", whiteSpace: "nowrap" }}>{filtered.length} inquiries</span>
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
  const [replyMsg, setReplyMsg] = useState("");
  const [replyChannel, setReplyChannel] = useState("whatsapp");
  const [saving, setSaving] = useState(false);

  const updateStatus = async (id: string, status: string) => {
    setSaving(true);
    await fetch("/api/inquiries", { method: "PATCH", headers: adminHeaders(), body: JSON.stringify({ id, status }) });
    onRefresh();
    setSaving(false);
  };

  const saveNotes = async (id: string) => {
    setSaving(true);
    await fetch("/api/inquiries", { method: "PATCH", headers: adminHeaders(), body: JSON.stringify({ id, notes }) });
    onRefresh();
    setSaving(false);
  };

  const addReply = async (inq: Inquiry) => {
    if (!replyMsg.trim()) return;
    setSaving(true);

    if (replyChannel === "email") {
      // Send actual email + store in thread[] via emailReply field
      await fetch("/api/inquiries", {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ id: inq.id, emailReply: replyMsg.trim(), status: "contacted" }),
      });
    } else {
      // Non-email channels: WhatsApp, Phone, Note — log to replies[] array only
      const reply = { date: new Date().toISOString(), channel: replyChannel, message: replyMsg.trim(), by: "Admin" };
      const replies = [...(inq.replies || []), reply];
      await fetch("/api/inquiries", {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ id: inq.id, replies, status: "contacted" }),
      });
    }

    setReplyMsg("");
    onRefresh();
    setSaving(false);
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    await fetch(`/api/inquiries?id=${id}`, { method: "DELETE", headers: { "x-admin-key": getAdminKey() } });
    onRefresh();
  };

  const typeColors: Record<string, string> = {
    contact: "#4a5c3a", product: "#7a8f6a", b2b: "#6b4f35", custom: "#b8975a",
    order: "#1d4ed8", quote: "#7c3aed",
  };

  if (inquiries.length === 0) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#5c5a52", background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb" }}>No inquiries yet</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {inquiries.map((inq, i) => {
        const st = getStatusStyle(inq.status);
        const isExpanded = expanded === inq.id;
        const phone = inq.phone || inq.phone_number || "";
        const waPhone = phone.replace(/\D/g, "");
        const waText = encodeURIComponent(`Hello ${inq.name || inq.companyName || ""},\n\nThank you for your inquiry to The Fair Rugs.\n\n`);

        return (
          <div key={inq.id} style={{ background: inq.status === "new" ? "#fffbeb" : i % 2 === 0 ? "#fff" : "#fafaf8", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
            {/* Row */}
            <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr auto auto auto" : "1fr 110px 160px 130px auto", gap: "12px", alignItems: "center", padding: "14px 16px", cursor: "pointer" }}
              onClick={() => { setExpanded(isExpanded ? null : inq.id); setNotes(inq.adminNotes || ""); setReplyMsg(""); }}>
              {/* From */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#1c1c1a" }}>{inq.name || inq.companyName || "—"}</p>
                  <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", background: `${typeColors[inq.type] || "#7a8f6a"}20`, color: typeColors[inq.type] || "#7a8f6a" }}>{inq.type}</span>
                  {inq.status === "new" && <span style={{ padding: "2px 8px", background: "#fee2e2", color: "#dc2626", borderRadius: "9999px", fontSize: "9px", fontWeight: 800, textTransform: "uppercase" }}>NEW</span>}
                  {inq.hasUnreadCustomerReply && <span style={{ padding: "2px 8px", background: "#fef3c7", color: "#92400e", borderRadius: "9999px", fontSize: "9px", fontWeight: 800, textTransform: "uppercase" }}>⚡ REPLY</span>}
                </div>
                <p style={{ fontSize: "12px", color: "#5c5a52", marginTop: "2px" }}>{inq.email} {phone ? `· ${phone}` : ""}</p>
                {!compact && <p style={{ fontSize: "12px", color: "#8a8878", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inq.productTitle || inq.notes?.slice(0, 60) || inq.message?.slice(0, 60) || inq.businessType || ""}</p>}
              </div>
              {/* Date */}
              {!compact && <p style={{ fontSize: "12px", color: "#8a8878", textAlign: "center" }}>{new Date(inq.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}</p>}
              {/* Status */}
              {!compact && (
                <div onClick={(e) => e.stopPropagation()}>
                  <select value={inq.status} onChange={(e) => updateStatus(inq.id, e.target.value)}
                    style={{ padding: "5px 10px", borderRadius: "9999px", border: "none", fontSize: "11px", fontWeight: 700, background: st.bg, color: st.color, cursor: "pointer", outline: "none" }}>
                    {INQUIRY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              )}
              {/* Quick Actions */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
                {inq.email && <a href={`mailto:${inq.email}?subject=Re: Your Inquiry — The Fair Rugs`} style={{ padding: "5px 10px", background: "#e0f2fe", color: "#0369a1", borderRadius: "6px", fontSize: "10px", fontWeight: 700, textDecoration: "none" }}>✉ Email</a>}
                {waPhone && <a href={`https://wa.me/${waPhone}?text=${waText}`} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 10px", background: "#dcfce7", color: "#16a34a", borderRadius: "6px", fontSize: "10px", fontWeight: 700, textDecoration: "none" }}>💬 WA</a>}
                <button onClick={() => deleteInquiry(inq.id)} style={{ padding: "5px 8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "10px", cursor: "pointer" }}>×</button>
                <span style={{ fontSize: "16px", color: "#8a8878", cursor: "pointer" }}>{isExpanded ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Expanded detail panel */}
            {isExpanded && !compact && (
              <div style={{ borderTop: "1px solid #f0ece4", padding: "20px", background: "#f8f6f0" }}>
                {/* All fields */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
                  {Object.entries(inq)
                    .filter(([k]) => !["id", "status", "createdAt", "updatedAt", "adminNotes", "replies", "orderItems", "messageToken", "thread", "hasUnreadCustomerReply"].includes(k))
                    .map(([k, v]) => v && typeof v !== "object" ? (
                      <div key={k} style={{ background: "#fff", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                        <span style={{ fontSize: "9px", color: "#8a8878", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>{k.replace(/([A-Z])/g, " $1").trim()}</span>
                        <p style={{ fontSize: "13px", color: "#1c1c1a", marginTop: "4px", wordBreak: "break-word" }}>{String(v)}</p>
                      </div>
                    ) : null)}
                </div>

                {/* Design image if present */}
                {inq.designImage && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#5c5a52", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Design Reference Image</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={inq.designImage} alt="Design reference" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                  </div>
                )}

                {/* Order items if present */}
                {inq.orderItems && inq.orderItems.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#5c5a52", marginBottom: "8px", textTransform: "uppercase" }}>Order Items</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
                      <thead><tr style={{ background: "#f0ece4" }}>{["Product","Size","Qty","Price"].map((h) => <th key={h} style={{ padding: "8px 12px", fontSize: "10px", fontWeight: 700, textAlign: "left", textTransform: "uppercase", color: "#5c5a52" }}>{h}</th>)}</tr></thead>
                      <tbody>{inq.orderItems.map((oi, idx) => (
                        <tr key={idx} style={{ borderTop: "1px solid #f0ece4" }}>
                          <td style={{ padding: "8px 12px", fontSize: "13px" }}>{oi.product}</td>
                          <td style={{ padding: "8px 12px", fontSize: "13px" }}>{oi.size}</td>
                          <td style={{ padding: "8px 12px", fontSize: "13px" }}>{oi.qty}</td>
                          <td style={{ padding: "8px 12px", fontSize: "13px", fontWeight: 700 }}>${oi.price}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                    {inq.totalAmount && <p style={{ fontSize: "14px", fontWeight: 800, color: "#4a5c3a", marginTop: "8px" }}>Total: ${inq.totalAmount}</p>}
                  </div>
                )}

                {/* ── Email Conversation Thread ─────────────────────────────── */}
                {inq.email && (
                  <div style={{ marginBottom: "16px", background: "#fff", border: "2px solid #4a5c3a", borderRadius: "12px", overflow: "hidden" }}>
                    {/* Thread header */}
                    <div style={{ background: "#4a5c3a", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px" }}>✉️</span>
                        <div>
                          <p style={{ color: "#fff", fontWeight: 700, fontSize: "13px", margin: 0 }}>Email Conversation with {inq.name || inq.companyName || "Customer"}</p>
                          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", margin: 0 }}>{inq.email}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        {inq.hasUnreadCustomerReply && (
                          <span style={{ padding: "3px 10px", background: "#fef3c7", color: "#92400e", borderRadius: "9999px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase" }}>⚡ New Reply</span>
                        )}
                        {inq.messageToken && (
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Inbox: /messages/{inq.messageToken.slice(0, 8)}…</span>
                        )}
                      </div>
                    </div>

                    {/* Conversation bubbles */}
                    <div style={{ padding: "16px", maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "#fafaf8" }}>
                      {/* Opening inquiry bubble */}
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{ maxWidth: "75%" }}>
                          <p style={{ fontSize: "10px", color: "#8a8878", textAlign: "right", marginBottom: "3px" }}>
                            {inq.name || "Customer"} · {new Date(inq.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <div style={{ background: "#4a5c3a", color: "#fff", padding: "10px 14px", borderRadius: "14px 14px 3px 14px", fontSize: "13px", lineHeight: 1.6 }}>
                            <p style={{ margin: 0, fontSize: "9px", fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Initial Inquiry</p>
                            {inq.productTitle || inq.notes?.slice(0, 120) || inq.message?.slice(0, 120) || "Inquiry submitted via website."}
                          </div>
                        </div>
                      </div>

                      {/* Thread messages */}
                      {(!inq.thread || inq.thread.length === 0) && (
                        <div style={{ textAlign: "center", padding: "20px 0", color: "#8a8878", fontSize: "13px" }}>
                          No replies yet — use the form below to send the first reply.
                        </div>
                      )}
                      {inq.thread && inq.thread.map((msg) => {
                        const isAdmin = msg.from === "admin";
                        return (
                          <div key={msg.id} style={{ display: "flex", justifyContent: isAdmin ? "flex-start" : "flex-end" }}>
                            <div style={{ maxWidth: "75%" }}>
                              <p style={{ fontSize: "10px", color: "#8a8878", textAlign: isAdmin ? "left" : "right", marginBottom: "3px" }}>
                                {msg.senderName} · {new Date(msg.date).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </p>
                              <div style={{
                                padding: "10px 14px",
                                borderRadius: isAdmin ? "3px 14px 14px 14px" : "14px 14px 3px 14px",
                                fontSize: "13px", lineHeight: 1.6,
                                background: isAdmin ? "#fff" : "#4a5c3a",
                                color: isAdmin ? "#1c1c1a" : "#fff",
                                border: isAdmin ? "1px solid #e5e7eb" : "none",
                                whiteSpace: "pre-wrap",
                              }}>
                                {msg.message}
                                {!msg.read && !isAdmin && (
                                  <span style={{ display: "inline-block", marginLeft: "6px", fontSize: "9px", fontWeight: 800, background: "#fef3c7", color: "#92400e", padding: "1px 6px", borderRadius: "9999px", verticalAlign: "middle" }}>UNREAD</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Email Reply Compose */}
                    <div style={{ padding: "14px 18px", borderTop: "1px solid #e5e7eb", background: "#fff" }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: "#5c5a52", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        📧 Send Email Reply — will appear in customer's inbox at <em style={{ fontStyle: "normal", color: "#4a5c3a" }}>/messages/[token]</em>
                      </p>
                      <textarea
                        rows={3}
                        placeholder={`Type your reply to ${inq.email}…`}
                        value={replyChannel === "email" ? replyMsg : ""}
                        onChange={(e) => { setReplyChannel("email"); setReplyMsg(e.target.value); }}
                        style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #4a5c3a", borderRadius: "8px", fontSize: "13px", resize: "vertical", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" }}
                      />
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <button
                          onClick={() => { setReplyChannel("email"); addReply(inq); }}
                          disabled={saving || !replyMsg.trim() || replyChannel !== "email"}
                          style={{ padding: "9px 22px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "12px", cursor: "pointer", opacity: (saving || !replyMsg.trim() || replyChannel !== "email") ? 0.5 : 1 }}
                        >
                          {saving && replyChannel === "email" ? "Sending…" : "📧 Send Email Reply"}
                        </button>
                        <span style={{ fontSize: "11px", color: "#8a8878" }}>Customer will receive an email notification + can reply from their inbox</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Two columns: Notes + Activity Log ─────────────────────── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Internal Notes */}
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#5c5a52", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Internal Notes</p>
                    <textarea rows={3} placeholder="Private notes (not sent to customer)…" value={notes} onChange={(e) => setNotes(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #dcd4c5", borderRadius: "8px", fontSize: "13px", resize: "vertical", background: "#fff" }} />
                    <button onClick={() => saveNotes(inq.id)} disabled={saving} style={{ marginTop: "8px", padding: "8px 18px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>
                      {saving ? "Saving…" : "Save Notes"}
                    </button>
                  </div>

                  {/* Activity Log (WhatsApp / Phone / Note only) */}
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#5c5a52", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Log Activity</p>
                    <select value={replyChannel === "email" ? "whatsapp" : replyChannel} onChange={(e) => setReplyChannel(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #dcd4c5", borderRadius: "8px", fontSize: "13px", marginBottom: "8px", background: "#fff" }}>
                      <option value="whatsapp">💬 WhatsApp</option>
                      <option value="phone">📞 Phone Call</option>
                      <option value="note">📝 Internal Note</option>
                    </select>
                    <textarea rows={2} placeholder="Summarise the activity (not emailed)…" value={replyChannel !== "email" ? replyMsg : ""}
                      onChange={(e) => { setReplyChannel(replyChannel === "email" ? "whatsapp" : replyChannel); setReplyMsg(e.target.value); }}
                      style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #dcd4c5", borderRadius: "8px", fontSize: "13px", resize: "none", background: "#fff" }} />
                    <button onClick={() => addReply(inq)} disabled={saving || !replyMsg.trim() || replyChannel === "email"} style={{ marginTop: "8px", padding: "8px 18px", background: "#6b7280", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "12px", cursor: "pointer", opacity: (saving || !replyMsg.trim() || replyChannel === "email") ? 0.5 : 1 }}>
                      Log Activity
                    </button>
                    {/* Quick contact buttons */}
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {waPhone && <a href={`https://wa.me/${waPhone}?text=${waText}`} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", background: "#dcfce7", color: "#16a34a", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textDecoration: "none" }}>Open WhatsApp →</a>}
                      {inq.phone && <a href={`tel:${inq.phone}`} style={{ padding: "6px 12px", background: "#f0f9ff", color: "#0369a1", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textDecoration: "none" }}>Call {inq.phone}</a>}
                    </div>
                  </div>
                </div>

                {/* Activity Log History (WhatsApp/Phone/Note only) */}
                {inq.replies && inq.replies.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#5c5a52", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Activity Log ({inq.replies.length})</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[...inq.replies].reverse().map((r, idx) => (
                        <div key={idx} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px 14px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "16px" }}>{r.channel === "whatsapp" ? "💬" : r.channel === "phone" ? "📞" : "📝"}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "13px", color: "#1c1c1a" }}>{r.message}</p>
                            <p style={{ fontSize: "11px", color: "#8a8878", marginTop: "4px" }}>{r.by} · {new Date(r.date).toLocaleString()} · {r.channel}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
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

// ─── Orders Section ──────────────────────────────────────────────────────────
function OrdersSection() {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [editFields, setEditFields] = useState<{
    status: string; adminNotes: string; courierCompany: string;
    trackingNumber: string; dispatchDate: string; estimatedDelivery: string; deliveredDate: string;
  } | null>(null);

  const ALL_STATUSES = ["pending", "processing", "production", "ready", "dispatched", "in-transit", "delivered", "cancelled"];
  const STATUS_COLORS: Record<string, string> = {
    pending: "#d97706", processing: "#0369a1", production: "#7c3aed",
    ready: "#059669", dispatched: "#0891b2", "in-transit": "#6366f1",
    delivered: "#16a34a", cancelled: "#dc2626",
  };
  const STATUS_LABELS: Record<string, string> = {
    pending: "Pending", processing: "Processing", production: "Production",
    ready: "Ready", dispatched: "Dispatched", "in-transit": "In Transit",
    delivered: "Delivered", cancelled: "Cancelled",
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/data?type=orders", { headers: { "x-admin-key": getAdminKey() } })
      .then((r) => r.json())
      .then((d) => { setOrders(Array.isArray(d) ? d : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openOrder = (o: Record<string, unknown>) => {
    setSelected(o);
    setEditFields({
      status: (o.status as string) || "pending",
      adminNotes: (o.adminNotes as string) || "",
      courierCompany: (o.courierCompany as string) || "",
      trackingNumber: (o.trackingNumber as string) || "",
      dispatchDate: (o.dispatchDate as string) || "",
      estimatedDelivery: (o.estimatedDelivery as string) || "",
      deliveredDate: (o.deliveredDate as string) || "",
    });
  };

  const saveOrder = async () => {
    if (!selected || !editFields) return;
    setSaving(true);
    const orderId = selected.orderId as string;
    try {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify({ orderId, ...editFields }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...selected, ...editFields, updatedAt: new Date().toISOString() };
        setOrders((prev) => prev.map((o) => o.orderId === orderId ? updated : o));
        setSelected(updated);
      }
    } catch {}
    setSaving(false);
  };

  const exportCSV = () => {
    const headers = ["Order ID", "Customer", "Email", "Phone", "Total", "Status", "Payment", "Date", "Courier", "Tracking", "Dispatch Date", "Est. Delivery", "Delivered Date"];
    const rows = filtered.map((o) => {
      const customer = o.customer as Record<string, string> || {};
      const shipping = o.shippingAddress as Record<string, string> || {};
      return [
        o.orderId as string,
        `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
        customer.email || "",
        customer.phone || shipping.phone || "",
        `$${o.totalAmount || 0}`,
        o.status as string || "pending",
        o.paymentMethod as string || "PayPal",
        new Date(o.createdAt as string).toLocaleDateString(),
        o.courierCompany as string || "",
        o.trackingNumber as string || "",
        o.dispatchDate as string || "",
        o.estimatedDelivery as string || "",
        o.deliveredDate as string || "",
      ];
    });
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const customer = o.customer as Record<string, string> || {};
    const matchSearch = !q || (o.orderId as string || "").toLowerCase().includes(q) ||
      (customer.email || "").toLowerCase().includes(q) || (customer.firstName || "").toLowerCase().includes(q) ||
      (customer.lastName || "").toLowerCase().includes(q) || (o.trackingNumber as string || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders.reduce((s, o) => s + ((o.totalAmount as number) || 0), 0);

  // ── Order Detail View ──────────────────────────────────────────────
  if (selected && editFields) {
    const o = selected;
    const customer = o.customer as Record<string, string> || {};
    const shipping = o.shippingAddress as Record<string, string> || {};
    const items = o.items as { productTitle: string; sizeLabel: string; quantity: number; unitPrice: number; lineTotal: number; construction: string }[] || [];

    const inputSt: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1.5px solid #dcd4c5", borderRadius: "6px", fontSize: "13px", outline: "none", boxSizing: "border-box" };
    const labelSt: React.CSSProperties = { display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "4px" };

    return (
      <div>
        <button onClick={() => { setSelected(null); setEditFields(null); }} style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", color: "#4a5c3a", fontWeight: 600, fontSize: "14px" }}>
          ← Back to Orders
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>

          {/* Left: Order items + status workflow */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Order Header */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Order ID</p>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1c1c1a", fontFamily: "monospace" }}>{o.orderId as string}</h2>
                  <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Placed: {new Date(o.createdAt as string).toLocaleString()}</p>
                  {(o.updatedAt as string) && <p style={{ fontSize: "11px", color: "#9ca3af" }}>Updated: {new Date(o.updatedAt as string).toLocaleString()}</p>}
                </div>
                <span style={{ padding: "8px 18px", borderRadius: "9999px", fontSize: "13px", fontWeight: 700, background: (STATUS_COLORS[editFields.status] || "#6b7280") + "20", color: STATUS_COLORS[editFields.status] || "#6b7280" }}>
                  {STATUS_LABELS[editFields.status] || editFields.status}
                </span>
              </div>

              {/* 7-step status workflow */}
              <div style={{ marginBottom: "8px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Update Order Status</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditFields((f) => f ? { ...f, status: s } : f)}
                      style={{
                        padding: "7px 14px", borderRadius: "9999px", border: `1.5px solid ${editFields.status === s ? STATUS_COLORS[s] : "#e5e7eb"}`,
                        background: editFields.status === s ? STATUS_COLORS[s] + "20" : "#fff",
                        color: editFields.status === s ? STATUS_COLORS[s] : "#6b7280",
                        fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                        textTransform: "capitalize",
                      }}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "16px" }}>Ordered Products</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#f9fafb" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>Product</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontSize: "11px", color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>Qty</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontSize: "11px", color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>Total</th>
                </tr></thead>
                <tbody>{items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px" }}>
                      <p style={{ fontWeight: 600, fontSize: "14px", color: "#1c1c1a", margin: 0 }}>{item.productTitle}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{item.sizeLabel} · {item.construction}</p>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", fontSize: "14px" }}>{item.quantity}</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, fontSize: "14px", color: "#4a5c3a" }}>${item.lineTotal?.toFixed(2)}</td>
                  </tr>
                ))}</tbody>
                <tfoot><tr style={{ borderTop: "2px solid #e5e7eb" }}>
                  <td colSpan={2} style={{ padding: "12px", fontWeight: 700, textAlign: "right", fontSize: "14px" }}>Order Total</td>
                  <td style={{ padding: "12px", fontWeight: 800, fontSize: "20px", textAlign: "right", color: "#4a5c3a" }}>${(o.totalAmount as number)?.toFixed(2)}</td>
                </tr></tfoot>
              </table>
            </div>

            {/* Shipping / Tracking — editable */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "16px" }}>Shipping & Tracking</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelSt}>Courier Company</label>
                  <input value={editFields.courierCompany} onChange={(e) => setEditFields((f) => f ? { ...f, courierCompany: e.target.value } : f)} style={inputSt} placeholder="e.g. FedEx, DHL, UPS" />
                </div>
                <div>
                  <label style={labelSt}>Tracking Number</label>
                  <input value={editFields.trackingNumber} onChange={(e) => setEditFields((f) => f ? { ...f, trackingNumber: e.target.value } : f)} style={inputSt} placeholder="e.g. 1Z999AA1..." />
                </div>
                <div>
                  <label style={labelSt}>Dispatch Date</label>
                  <input type="date" value={editFields.dispatchDate} onChange={(e) => setEditFields((f) => f ? { ...f, dispatchDate: e.target.value } : f)} style={inputSt} />
                </div>
                <div>
                  <label style={labelSt}>Estimated Delivery</label>
                  <input type="date" value={editFields.estimatedDelivery} onChange={(e) => setEditFields((f) => f ? { ...f, estimatedDelivery: e.target.value } : f)} style={inputSt} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelSt}>Delivered Date</label>
                  <input type="date" value={editFields.deliveredDate} onChange={(e) => setEditFields((f) => f ? { ...f, deliveredDate: e.target.value } : f)} style={inputSt} />
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
              <label style={labelSt}>Admin Notes (Internal)</label>
              <textarea rows={3} value={editFields.adminNotes} onChange={(e) => setEditFields((f) => f ? { ...f, adminNotes: e.target.value } : f)}
                placeholder="Internal notes about this order…" style={{ ...inputSt, resize: "vertical", fontFamily: "inherit", width: "100%", marginTop: "4px" }} />
            </div>

            {/* Save Button */}
            <button onClick={saveOrder} disabled={saving} style={{ padding: "15px 32px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : "💾 Save Changes"}
            </button>
          </div>

          {/* Right: Customer info sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Customer */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "12px" }}>Customer</h3>
              <p style={{ fontWeight: 600, color: "#1c1c1a", marginBottom: "4px" }}>{customer.firstName} {customer.lastName}</p>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>📧 {customer.email}</p>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>📞 {customer.phone || "—"}</p>
            </div>

            {/* Shipping Address */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "12px" }}>Shipping Address</h3>
              <p style={{ fontSize: "13px", color: "#1c1c1a", lineHeight: 1.9 }}>
                {shipping.address || "—"}<br />
                {shipping.city || ""} {shipping.postalCode || ""}<br />
                {shipping.country || ""}
              </p>
            </div>

            {/* Payment */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "12px" }}>Payment</h3>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#16a34a", marginBottom: "4px" }}>✓ {o.paymentMethod as string || "PayPal"}</p>
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>TXN: {(o.paypalTransactionId as string) || (o.paymentId as string) || "—"}</p>
            </div>

            {/* Tracking summary */}
            {(editFields.trackingNumber || editFields.courierCompany) && (
              <div style={{ background: "#f0fdf4", borderRadius: "12px", border: "1px solid #86efac", padding: "20px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#166534", marginBottom: "12px" }}>Tracking Info</h3>
                {editFields.courierCompany && <p style={{ fontSize: "13px", color: "#166534", marginBottom: "4px" }}>🚚 {editFields.courierCompany}</p>}
                {editFields.trackingNumber && <p style={{ fontSize: "13px", color: "#166534", fontFamily: "monospace", fontWeight: 700, marginBottom: "4px" }}>{editFields.trackingNumber}</p>}
                {editFields.dispatchDate && <p style={{ fontSize: "12px", color: "#4ade80" }}>Dispatched: {editFields.dispatchDate}</p>}
                {editFields.estimatedDelivery && <p style={{ fontSize: "12px", color: "#4ade80" }}>Est. Delivery: {editFields.estimatedDelivery}</p>}
                {editFields.deliveredDate && <p style={{ fontSize: "12px", color: "#4ade80", fontWeight: 700 }}>✅ Delivered: {editFields.deliveredDate}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Orders List View ───────────────────────────────────────────────
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1c1c1a" }}>Orders Management</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>{orders.length} orders · ${totalRevenue.toFixed(2)} total revenue</p>
        </div>
        <button onClick={exportCSV} style={{ padding: "10px 18px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Total", value: orders.length, color: "#4a5c3a" },
          { label: "Pending", value: orders.filter((o) => o.status === "pending" || !o.status).length, color: "#d97706" },
          { label: "In Progress", value: orders.filter((o) => ["processing","production","ready","dispatched","in-transit"].includes(o.status as string)).length, color: "#0369a1" },
          { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length, color: "#16a34a" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb", padding: "16px 18px" }}>
            <p style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 800, color: s.color, margin: "4px 0 0" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID, email, name, or tracking…"
          style={{ flex: 1, minWidth: "220px", padding: "10px 14px", border: "1.5px solid #dcd4c5", borderRadius: "8px", fontSize: "14px", outline: "none" }} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "10px 14px", border: "1.5px solid #dcd4c5", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? <p style={{ color: "#6b7280", padding: "40px", textAlign: "center" }}>Loading orders…</p> : (
        filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛍️</div>
            <p style={{ fontSize: "16px", fontWeight: 600 }}>No orders yet</p>
            <p style={{ fontSize: "13px" }}>Orders appear after customers complete payment.</p>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Order ID", "Customer", "Products", "Total", "Payment", "Status", "Tracking", "Date", ""].map((h, i) => (
                  <th key={i} style={{ padding: "12px 14px", textAlign: "left", fontSize: "11px", color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((o, i) => {
                  const customer = o.customer as Record<string, string> || {};
                  const items = o.items as { productTitle: string; quantity: number }[] || [];
                  const status = (o.status as string) || "pending";
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      onClick={() => openOrder(o)}>
                      <td style={{ padding: "14px", fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "#4a5c3a" }}>{o.orderId as string}</td>
                      <td style={{ padding: "14px" }}>
                        <p style={{ fontWeight: 600, fontSize: "13px", color: "#1c1c1a", margin: 0 }}>{customer.firstName} {customer.lastName}</p>
                        <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>{customer.email}</p>
                      </td>
                      <td style={{ padding: "14px", fontSize: "12px", color: "#6b7280" }}>
                        {items.length > 0 ? `${items[0].productTitle?.slice(0, 20)}${items.length > 1 ? ` +${items.length - 1}` : ""}` : "–"}
                      </td>
                      <td style={{ padding: "14px", fontWeight: 700, color: "#1c1c1a", fontSize: "13px" }}>${(o.totalAmount as number)?.toFixed(2) || "0.00"}</td>
                      <td style={{ padding: "14px", fontSize: "12px", color: "#6b7280" }}>{o.paymentMethod as string || "PayPal"}</td>
                      <td style={{ padding: "14px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, background: (STATUS_COLORS[status] || "#6b7280") + "20", color: STATUS_COLORS[status] || "#6b7280", whiteSpace: "nowrap" }}>
                          {STATUS_LABELS[status] || status}
                        </span>
                      </td>
                      <td style={{ padding: "14px", fontSize: "11px", color: "#6b7280", fontFamily: "monospace" }}>
                        {(o.trackingNumber as string) ? (
                          <span style={{ color: "#059669", fontWeight: 600 }}>{(o.trackingNumber as string).slice(0, 16)}</span>
                        ) : "—"}
                      </td>
                      <td style={{ padding: "14px", fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap" }}>
                        {o.createdAt ? new Date(o.createdAt as string).toLocaleDateString() : "—"}
                      </td>
                      <td style={{ padding: "14px" }}>
                        <button onClick={(e) => { e.stopPropagation(); openOrder(o); }}
                          style={{ padding: "6px 12px", background: "#f0f4e8", border: "1px solid #c8d4b8", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "#4a5c3a", fontWeight: 600 }}>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

// ─── Analytics Section ───────────────────────────────────────────────────────
function AnalyticsSection() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"today" | "last7" | "last30" | "last365">("last30");

  useEffect(() => {
    fetch("/api/analytics", { headers: { "x-admin-key": getAdminKey() } })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading analytics…</div>;
  if (!data) return <div style={{ padding: "40px", textAlign: "center" }}>No analytics data yet. Analytics are collected as visitors browse the website.</div>;

  const rangeData = (data[range] as Record<string, number>) || { views: 0, visitors: 0 };
  const devices = (data.devices as Record<string, number>) || {};
  const countries = (data.countries as [string, number][]) || [];
  const sources = (data.sources as Record<string, number>) || {};
  const daily = (data.dailyViews as { date: string; views: number }[]) || [];
  const topPages = (data.topPages as { path: string; views: number }[]) || [];
  const maxViews = daily.length > 0 ? Math.max(...daily.map((d) => d.views), 1) : 1;

  const deviceTotal = Object.values(devices).reduce((s, v) => s + v, 0) || 1;
  const sourceTotal = Object.values(sources).reduce((s, v) => s + v, 0) || 1;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1c1c1a" }}>Analytics Dashboard</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["today", "last7", "last30", "last365"] as const).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              style={{ padding: "8px 14px", borderRadius: "8px", border: "1.5px solid", cursor: "pointer", fontSize: "12px", fontWeight: 600,
                background: range === r ? "#4a5c3a" : "#fff", color: range === r ? "#fff" : "#4a5c3a", borderColor: range === r ? "#4a5c3a" : "#c8d4b8" }}>
              {r === "today" ? "Today" : r === "last7" ? "7 Days" : r === "last30" ? "30 Days" : "12 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Page Views", value: rangeData.views || 0, icon: "👁" },
          { label: "Visitors", value: rangeData.visitors || 0, icon: "👤" },
          { label: "Total Views (All)", value: (data.total as Record<string, number>)?.views || 0, icon: "📊" },
          { label: "Top Country", value: countries[0]?.[0] || "–", icon: "🌍" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{s.label}</p>
              <span style={{ fontSize: "20px" }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "#1c1c1a", margin: "8px 0 0" }}>{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>
        {/* Chart */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1c1c1a", marginBottom: "20px" }}>Daily Page Views (Last 30 Days)</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "120px" }}>
            {daily.slice(-30).map((d, i) => (
              <div key={i} title={`${d.date}: ${d.views} views`} style={{ flex: 1, background: "#4a5c3a", borderRadius: "3px 3px 0 0", opacity: 0.7 + (d.views / maxViews) * 0.3,
                height: `${Math.max(4, (d.views / maxViews) * 100)}%`, transition: "all 0.2s ease", cursor: "default" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = `${0.7 + (d.views / maxViews) * 0.3}`)}
              />
            ))}
          </div>
          {daily.length === 0 && <p style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}>No data yet. Analytics tracked as visitors browse.</p>}
        </div>

        {/* Devices */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1c1c1a", marginBottom: "16px" }}>Devices</h3>
          {Object.entries(devices).map(([device, count]) => (
            <div key={device} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", textTransform: "capitalize", color: "#374151" }}>{device}</span>
                <span style={{ fontSize: "13px", fontWeight: 700 }}>{Math.round((count / deviceTotal) * 100)}%</span>
              </div>
              <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "3px" }}>
                <div style={{ height: "100%", width: `${(count / deviceTotal) * 100}%`, background: "#4a5c3a", borderRadius: "3px" }} />
              </div>
            </div>
          ))}
          {Object.keys(devices).length === 0 && <p style={{ color: "#9ca3af", fontSize: "13px" }}>No device data yet.</p>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
        {/* Countries */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1c1c1a", marginBottom: "16px" }}>Top Countries</h3>
          {countries.slice(0, 8).map(([country, count], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: "13px" }}>
              <span style={{ color: "#374151" }}>{country || "Unknown"}</span>
              <span style={{ fontWeight: 700, color: "#4a5c3a" }}>{count}</span>
            </div>
          ))}
          {countries.length === 0 && <p style={{ color: "#9ca3af", fontSize: "13px" }}>No country data yet.</p>}
        </div>

        {/* Traffic Sources */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1c1c1a", marginBottom: "16px" }}>Traffic Sources</h3>
          {Object.entries(sources).map(([src, count]) => (
            <div key={src} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", textTransform: "capitalize", color: "#374151" }}>{src}</span>
                <span style={{ fontSize: "13px", fontWeight: 700 }}>{Math.round((count / sourceTotal) * 100)}%</span>
              </div>
              <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "3px" }}>
                <div style={{ height: "100%", width: `${(count / sourceTotal) * 100}%`, background: "#0369a1", borderRadius: "3px" }} />
              </div>
            </div>
          ))}
          {Object.keys(sources).length === 0 && <p style={{ color: "#9ca3af", fontSize: "13px" }}>No source data yet.</p>}
        </div>

        {/* Top Pages */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1c1c1a", marginBottom: "16px" }}>Top Pages</h3>
          {topPages.slice(0, 8).map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: "12px" }}>
              <span style={{ color: "#374151", fontFamily: "monospace" }}>{p.path.slice(0, 24)}</span>
              <span style={{ fontWeight: 700, color: "#4a5c3a" }}>{p.views}</span>
            </div>
          ))}
          {topPages.length === 0 && <p style={{ color: "#9ca3af", fontSize: "13px" }}>No page data yet.</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Reviews Section ─────────────────────────────────────────────────────────
interface ReviewItem {
  id: string; productId: string; productTitle: string; customerName: string;
  customerCountry: string; rating: number; title: string; body: string;
  verifiedPurchase: boolean; approved: boolean; featured: boolean; createdAt: string;
}

function ReviewsSection({ products }: { products: Product[] }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ productId: "", customerName: "", customerCountry: "", rating: 5, title: "", body: "", verifiedPurchase: false });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/reviews?all=1", { headers: { "x-admin-key": getAdminKey() } })
      .then((r) => r.json()).then((d) => setReviews(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, fields: Partial<ReviewItem> & { action?: string }) => {
    await fetch("/api/reviews", { method: "PUT", headers: { ...adminHeaders() }, body: JSON.stringify({ id, ...fields }) }).catch(() => {});
    if (fields.action === "delete") { setReviews((r) => r.filter((x) => x.id !== id)); }
    else { setReviews((r) => r.map((x) => x.id === id ? { ...x, ...fields } : x)); }
  };

  const addReview = async () => {
    if (!form.productId || !form.customerName || !form.body) return;
    setSaving(true);
    const prod = products.find((p) => p.id === form.productId);
    await fetch("/api/reviews", { method: "POST", headers: { ...adminHeaders() }, body: JSON.stringify({ ...form, productSlug: prod?.slug || "", productTitle: prod?.title || "" }) });
    setSaving(false); setShowAdd(false); load();
  };

  const filtered = reviews.filter((r) => filter === "all" || (filter === "pending" ? !r.approved : r.approved));
  const avgRating = reviews.filter((r) => r.approved).reduce((s, r, _, a) => s + r.rating / a.length, 0);

  const StarDisplay = ({ rating }: { rating: number }) => (
    <span>{[1,2,3,4,5].map((i) => <span key={i} style={{ color: i <= rating ? "#f59e0b" : "#d1d5db", fontSize: "14px" }}>★</span>)}</span>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1c1c1a" }}>Reviews Management</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
            {reviews.filter((r) => r.approved).length} approved · {reviews.filter((r) => !r.approved).length} pending · Avg {avgRating.toFixed(1)} ⭐
          </p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ padding: "10px 18px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
          + Add Review
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "#f0f4e8", borderRadius: "12px", border: "1px solid #c8d4b8", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "16px" }}>Add Review</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Product *</label>
              <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} style={selectStyle}>
                <option value="">Select product…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Customer Name *</label>
              <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input value={form.customerCountry} onChange={(e) => setForm({ ...form, customerCountry: e.target.value })} style={inputStyle} placeholder="United States" />
            </div>
            <div>
              <label style={labelStyle}>Rating</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setForm({ ...form, rating: n })}
                    style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer", color: n <= form.rating ? "#f59e0b" : "#d1d5db" }}>★</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Review Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "20px" }}>
              <input type="checkbox" id="vp" checked={form.verifiedPurchase} onChange={(e) => setForm({ ...form, verifiedPurchase: e.target.checked })} />
              <label htmlFor="vp" style={{ fontSize: "13px" }}>Verified Purchase</label>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Review Body *</label>
              <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button onClick={addReview} disabled={saving} style={{ padding: "10px 20px", background: "#4a5c3a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
              {saving ? "Saving…" : "Add Review"}
            </button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "10px 20px", background: "#fff", color: "#6b7280", border: "1px solid #dcd4c5", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {(["all", "pending", "approved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid", cursor: "pointer", fontSize: "13px", fontWeight: 600,
            background: filter === f ? "#4a5c3a" : "#fff", color: filter === f ? "#fff" : "#4a5c3a", borderColor: filter === f ? "#4a5c3a" : "#c8d4b8" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({filter === f ? filtered.length : reviews.filter((r) => f === "all" || (f === "pending" ? !r.approved : r.approved)).length})
          </button>
        ))}
      </div>

      {loading ? <p style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>Loading…</p> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
          <p style={{ fontWeight: 600 }}>No reviews {filter !== "all" ? `(${filter})` : ""}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((r) => (
            <div key={r.id} style={{ background: "#fff", borderRadius: "12px", border: `1px solid ${r.approved ? "#e5e7eb" : "#fde68a"}`, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <StarDisplay rating={r.rating} />
                    {r.verifiedPurchase && <span style={{ fontSize: "11px", background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: "9999px", fontWeight: 700 }}>✓ Verified</span>}
                    {!r.approved && <span style={{ fontSize: "11px", background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: "9999px", fontWeight: 700 }}>Pending</span>}
                    {r.featured && <span style={{ fontSize: "11px", background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: "9999px", fontWeight: 700 }}>Featured</span>}
                  </div>
                  {r.title && <p style={{ fontWeight: 700, fontSize: "15px", color: "#1c1c1a", marginBottom: "4px" }}>{r.title}</p>}
                  <p style={{ fontSize: "14px", color: "#374151", marginBottom: "8px", lineHeight: 1.6 }}>{r.body}</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                    {r.customerName} · {r.customerCountry} · {r.productTitle} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                  {!r.approved && <button onClick={() => update(r.id, { approved: true })} style={{ padding: "6px 12px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "#16a34a" }}>Approve</button>}
                  {r.approved && <button onClick={() => update(r.id, { approved: false })} style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "#6b7280" }}>Hide</button>}
                  <button onClick={() => update(r.id, { featured: !r.featured })} style={{ padding: "6px 12px", background: r.featured ? "#ede9fe" : "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: r.featured ? "#7c3aed" : "#6b7280" }}>
                    {r.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button onClick={() => update(r.id, { action: "delete" })} style={{ padding: "6px 12px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "#dc2626" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Favorites Section ───────────────────────────────────────────────────────
function FavoritesSection() {
  const [data, setData] = useState<{ total: number; byProduct: { productId: string; productTitle: string; count: number; lastLiked: string }[]; recent: { productId: string; productTitle: string; visitorId: string; likedAt: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites?all=1", { headers: { "x-admin-key": getAdminKey() } })
      .then((r) => r.json()).then((d) => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading favorites…</div>;
  if (!data) return <div style={{ padding: "40px", textAlign: "center" }}>Failed to load favorites data.</div>;

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1c1c1a" }}>Likes &amp; Favorites</h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>{data.total} total likes across all products</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Most liked */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1c1c1a", marginBottom: "16px" }}>Most Liked Products</h3>
          {data.byProduct.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}>No likes yet. Customers can like products by clicking the ♡ heart button on product pages.</p>
          ) : data.byProduct.slice(0, 10).map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#1c1c1a", margin: 0 }}>{p.productTitle || p.productId}</p>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Last liked {new Date(p.lastLiked).toLocaleDateString()}</p>
              </div>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#ef4444" }}>❤ {p.count}</span>
            </div>
          ))}
        </div>

        {/* Recent likes */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1c1c1a", marginBottom: "16px" }}>Recent Likes</h3>
          {data.recent.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}>No recent likes.</p>
          ) : data.recent.slice(0, 12).map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: "13px" }}>
              <span style={{ color: "#374151" }}>❤ {r.productTitle || r.productId}</span>
              <span style={{ color: "#9ca3af" }}>{new Date(r.likedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Activity Feed Section ────────────────────────────────────────────────────
function ActivityFeedSection({ inquiries, products }: { inquiries: Inquiry[]; products: Product[] }) {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/admin/data?type=orders", { headers: { "x-admin-key": getAdminKey() } })
      .then((r) => r.json()).then((d) => setOrders(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  // Build unified activity feed
  const activities: { type: string; title: string; subtitle: string; ts: number; icon: string; color: string }[] = [];

  for (const o of orders.slice(0, 20)) {
    activities.push({
      type: "order", icon: "🛍️", color: "#16a34a",
      title: `New Order — ${o.orderId as string || ""}`,
      subtitle: `$${(o.totalAmount as number)?.toFixed(2) || "0"} · ${((o.customer as Record<string, string>)?.firstName || "")} ${((o.customer as Record<string, string>)?.lastName || "")}`,
      ts: new Date(o.createdAt as string || 0).getTime(),
    });
  }
  for (const inq of inquiries.slice(0, 20)) {
    activities.push({
      type: "inquiry", icon: inq.type === "b2b" ? "🤝" : "📋", color: "#0369a1",
      title: `${inq.type === "b2b" ? "B2B Inquiry" : "New Inquiry"} — ${inq.name || inq.email || ""}`,
      subtitle: inq.type === "b2b" ? (inq.companyName || "") : (inq.message || "").slice(0, 60),
      ts: new Date(inq.createdAt || 0).getTime(),
    });
  }
  activities.sort((a, b) => b.ts - a.ts);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1c1c1a" }}>Activity Feed</h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>Recent orders, inquiries, and events across your store</p>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {activities.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
            <p style={{ fontWeight: 600 }}>No activity yet</p>
            <p style={{ fontSize: "13px" }}>Orders and inquiries will appear here as they come in.</p>
          </div>
        ) : activities.slice(0, 50).map((a, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px 20px", borderBottom: i < activities.length - 1 ? "1px solid #f3f4f6" : "none",
            transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: a.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
              {a.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "14px", color: "#1c1c1a", margin: 0 }}>{a.title}</p>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: "2px 0 0" }}>{a.subtitle}</p>
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>
              {new Date(a.ts).toLocaleDateString()} {new Date(a.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
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
