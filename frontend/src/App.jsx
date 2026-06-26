import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Global styles
import "./styles/globals.css";

// Layout
import MainLayout from "./layouts/MainLayout";

// Auth pages (no sidebar)
import Login    from "./pages/Login";
import Register from "./pages/Register";

// Protected pages
import Dashboard        from "./pages/Dashboard";
import Products         from "./pages/Products";
import Orders           from "./pages/Orders";
import Suppliers        from "./pages/Suppliers";
import AIInsights       from "./pages/AIInsights";
import InventoryHistory from "./pages/InventoryHistory";
import Reports          from "./pages/Reports";
import Notifications    from "./pages/Notifications";
import Admin            from "./pages/Admin";
import Users            from "./pages/Users";
import Settings         from "./pages/Settings";
import Profile          from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public auth routes ─────────────────────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected routes (inside MainLayout) ──────────── */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect root → dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard"         element={<Dashboard />} />
          <Route path="/products"          element={<Products />} />
          <Route path="/orders"            element={<Orders />} />
          <Route path="/suppliers"         element={<Suppliers />} />
          <Route path="/ai-insights"       element={<AIInsights />} />
          <Route path="/inventory-history" element={<InventoryHistory />} />
          <Route path="/reports"           element={<Reports />} />
          <Route path="/notifications"     element={<Notifications />} />
          <Route path="/settings"          element={<Settings />} />
          <Route path="/profile"           element={<Profile />} />

          {/* MODIFIED BY CLAUDE: /admin and /users are admin-only at the
              route level now, not just hidden from the sidebar. A Viewer
              or Manager who navigates here directly is bounced to
              /dashboard instead of seeing the page flash before a 403. */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ── 404 fallback ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
