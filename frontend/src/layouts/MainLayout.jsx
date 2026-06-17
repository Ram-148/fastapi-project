import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import "./MainLayout.css";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`layout ${collapsed ? "layout--collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="layout__body">
        <Navbar onMenuClick={() => setCollapsed((c) => !c)} />
        <main className="layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
