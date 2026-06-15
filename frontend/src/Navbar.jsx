import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const PAGE_TITLES = {
  "/dashboard":         "Dashboard",
  "/products":          "Products",
  "/orders":            "Orders",
  "/suppliers":         "Suppliers",
  "/ai-insights":       "AI Insights",
  "/inventory-history": "Inventory History",
  "/reports":           "Reports",
  "/notifications":     "Notifications",
  "/admin":             "Admin Panel",
  "/settings":          "Settings",
  "/profile":           "Profile",
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const title        = PAGE_TITLES[pathname] ?? "Telusko Trac";

  return (
    <header className="navbar">
      {/* Left: hamburger + page title */}
      <div className="navbar__left">
        <button className="navbar__menu-btn btn-icon" onClick={onMenuClick} title="Menu">
          ☰
        </button>
        <h1 className="navbar__title">{title}</h1>
      </div>

      {/* Right: actions */}
      <div className="navbar__right">
        <button
          className="navbar__icon-btn"
          title="Notifications"
          onClick={() => navigate("/notifications")}
        >
          🔔
        </button>
        <button
          className="navbar__avatar"
          title="Profile"
          onClick={() => navigate("/profile")}
        >
          👤
        </button>
      </div>
    </header>
  );
}
