import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/products", icon: "📦", label: "Products" },
  { to: "/orders", icon: "🛒", label: "Orders" },
  { to: "/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/ai-insights", icon: "🤖", label: "AI Insights" },
  { to: "/inventory-history", icon: "📋", label: "Inventory History" },
  { to: "/reports", icon: "📊", label: "Reports" },
  { to: "/notifications", icon: "🔔", label: "Notifications" },
  { to: "/admin", icon: "🛡️", label: "Admin" },
  { to: "/users", icon: "👥", label: "Users" },
  { to: "/settings", icon: "⚙️", label: "Settings" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const user = JSON.parse(
  localStorage.getItem("user")
);
  const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  navigate("/login");
};

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      {/* Brand */}
      <div className="sidebar__brand" onClick={() => navigate("/dashboard")}>
        <span className="sidebar__brand-icon">📦</span>
        {!collapsed && (
          <span className="sidebar__brand-name">Telusko Trac</span>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
       {
NAV_ITEMS
.filter(item => {

 if (
  (item.to === "/admin" ||
   item.to === "/users") &&
   user?.role !== "admin"
) {
  return false;
}

  return true;

})
.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
            title={collapsed ? label : undefined}
          >
            <span className="sidebar__link-icon">{icon}</span>
            {!collapsed && (
              <span className="sidebar__link-label">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <button
  className="sidebar__toggle"
  onClick={logout}
>
  Logout
</button>

      {/* Collapse toggle */}
      <button className="sidebar__toggle" onClick={onToggle} title="Toggle sidebar">
        {collapsed ? "▶" : "◀"}
      </button>
    </aside>
  );
}
