import { Navigate } from "react-router-dom";

/**
 * Props:
 *   children     - the element to render if access is allowed
 *   allowedRoles - optional array of roles permitted to view this route.
 *                  Omit for "any authenticated user".
 *
 * MODIFIED BY CLAUDE: this previously only checked whether a token existed
 * in localStorage, so a Viewer who typed /users into the address bar would
 * briefly see the page before the API call 403'd. It now also checks the
 * cached user's role (set at login) and redirects to /dashboard if the
 * role isn't allowed, matching the brief's "never show what users can't
 * use" requirement at the route level, not just in the sidebar.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }

    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
