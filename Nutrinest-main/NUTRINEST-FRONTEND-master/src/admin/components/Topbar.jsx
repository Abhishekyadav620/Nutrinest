import React from "react";
import { Menu, Bell } from "lucide-react";
import Navbar from "./Navbar";

export default function Topbar({ onToggleSidebar }) {
  const savedData = JSON.parse(localStorage.getItem("adminData")) || {};
  const avatarUrl = savedData.avatar || "/profile.jpg";

  return (
    <header className="topbar bg-light border-bottom d-flex align-items-center justify-content-between p-3">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-sm d-lg-none" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>

        {/* New minimalist brand: circular icon + styled text */}
        <div className="d-flex align-items-center" style={{ gap: 12 }}>
          <div
            className="brand-icon"
            style={{
              background: "linear-gradient(135deg,#82D173,#5F9E4A)",
              color: "#fff",
              borderRadius: 12,
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            NN
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#2b6a2b" }}>
              Admin Panel
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: -2 }}>
              NutriNest
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-3">
        <button className="btn btn-light position-relative">
          <Bell size={20} />
        </button>
        <Navbar avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
