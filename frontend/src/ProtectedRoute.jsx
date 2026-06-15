import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Stub protected route.
 * Replace `isAuthenticated` with your real auth check (context, token, etc.)
 * when you integrate authentication.
 */
export default function ProtectedRoute({ children }) {
  // TODO: Replace with real auth check, e.g. useAuthContext()
  const isAuthenticated = true; // Always passes for now

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
