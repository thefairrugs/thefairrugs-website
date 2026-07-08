"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1c2c15 0%, #2a3a20 50%, #354430 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: "white", borderRadius: "24px",
        padding: "52px 48px", width: "min(440px, 100%)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: "28px", fontWeight: 700,
            color: "#2a3a20", letterSpacing: "0.1em", marginBottom: "6px",
          }}>
            THE FAIR RUGS
          </div>
          <div style={{
            fontSize: "10px", color: "#7a8f6a",
            letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600,
          }}>
            Admin Panel
          </div>
          <div style={{
            width: "48px", height: "2px",
            background: "linear-gradient(90deg, #b8975a, #d4b47e)",
            margin: "16px auto 0",
          }} />
        </div>

        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1c1c1a", marginBottom: "28px", textAlign: "center" }}>
          Sign In
        </h2>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#5c5a52", marginBottom: "8px",
            }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@thefairrugs.com"
              style={{
                width: "100%", padding: "14px 18px",
                border: "1.5px solid #dcd4c5",
                borderRadius: "8px", fontSize: "15px",
                color: "#1c1c1a", outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "system-ui, sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4a5c3a")}
              onBlur={(e) => (e.target.style.borderColor = "#dcd4c5")}
            />
          </div>
          <div>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#5c5a52", marginBottom: "8px",
            }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%", padding: "14px 18px",
                border: "1.5px solid #dcd4c5",
                borderRadius: "8px", fontSize: "15px",
                color: "#1c1c1a", outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "system-ui, sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4a5c3a")}
              onBlur={(e) => (e.target.style.borderColor = "#dcd4c5")}
            />
          </div>

          {error && (
            <div style={{
              padding: "12px 16px", borderRadius: "8px",
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", fontSize: "13px",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#7a8f6a" : "#4a5c3a",
              color: "#fff", border: "none",
              padding: "16px", borderRadius: "8px",
              fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginTop: "8px",
            }}
          >
            {loading ? "Signing In..." : "Sign In to Admin Panel"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#8a8878" }}>
          Default: admin@thefairrugs.com / FairRugs@2026#Admin
        </p>
      </div>
    </div>
  );
}
