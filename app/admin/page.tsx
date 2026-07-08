"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRoot() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token === "fairrugs2026admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0ede6" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "16px" }}>⌛</div>
        <p style={{ color: "#5c5a52", fontSize: "14px" }}>Redirecting...</p>
      </div>
    </div>
  );
}
