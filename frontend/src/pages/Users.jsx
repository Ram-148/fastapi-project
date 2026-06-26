import React, { useEffect, useMemo, useState } from "react";
import {
  getUsers,
  updateUserRole,
  disableUser,
  enableUser,
  deleteUser,
} from "../services/api";
import "./Users.css";

// Roles available from the role selector. Must match the backend Userrole
// enum values exactly (viewer / manager / admin) or the PUT will 422.
const ROLES = ["viewer", "manager", "admin"];

const ROLE_BADGE = {
  admin: "badge-purple",
  manager: "badge-blue",
  viewer: "badge-gray",
  employee: "badge-gray", // legacy alias, in case old rows still have it
};

function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Users() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null); // disables buttons on the row being acted on

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      // Surfaces the real backend message (e.g. 403 Access denied) instead
      // of a generic "axios error" with no explanation.
      setError(
        err.response?.data?.detail ||
          "Failed to load users. Please try again."
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const runAction = async (id, fn, successMsg) => {
    setBusyId(id);
    setActionError("");
    try {
      await fn();
      await loadUsers();
    } catch (err) {
      setActionError(err.response?.data?.detail || "Action failed.");
    }
    setBusyId(null);
  };

  const handleRoleChange = (id, role) =>
    runAction(id, () => updateUserRole(id, role));

  const handleDisable = (id) => runAction(id, () => disableUser(id));
  const handleEnable = (id) => runAction(id, () => enableUser(id));

  const handleDelete = (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    runAction(id, () => deleteUser(id));
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">👥 User Management</h2>
          <p className="page__sub">
            {loading ? "Loading users…" : `${filtered.length} of ${users.length} users`}
          </p>
        </div>
        <input
          className="input users-search"
          type="text"
          placeholder="Search by name, email, or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {actionError && <div className="alert alert-error">{actionError}</div>}

      {/* Loading state */}
      {loading && (
        <div className="users-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card user-card user-card--skeleton">
              <div className="skeleton-avatar" />
              <div className="skeleton-line" style={{ width: "70%" }} />
              <div className="skeleton-line" style={{ width: "50%" }} />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="card users-error-card">
          <span className="users-error-icon">⚠️</span>
          <div>
            <div className="users-error-title">Couldn't load users</div>
            <div className="users-error-detail">{error}</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadUsers}>
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="page-placeholder">
          <span>{search ? "🔍" : "👥"}</span>
          <p>
            {search
              ? `No users match "${search}".`
              : "No users yet."}
          </p>
        </div>
      )}

      {/* User cards */}
      {!loading && !error && filtered.length > 0 && (
        <div className="users-grid">
          {filtered.map((u) => {
            const isSelf = u.id === currentUser?.id;
            const isBusy = busyId === u.id;

            return (
              <div key={u.id} className="card user-card">
                <div className="user-card__top">
                  <div className="user-card__avatar">{initials(u.username)}</div>
                  <div className="user-card__identity">
                    <div className="user-card__name">
                      {u.username}
                      {isSelf && <span className="user-card__you">you</span>}
                    </div>
                    <div className="user-card__email">{u.email}</div>
                  </div>
                </div>

                <div className="user-card__meta">
                  <span className={`badge ${ROLE_BADGE[u.role] ?? "badge-gray"}`}>
                    {u.role}
                  </span>
                  <span className={`badge ${u.is_active ? "badge-green" : "badge-red"}`}>
                    {u.is_active ? "Active" : "Disabled"}
                  </span>
                  <span className="user-card__id">ID #{u.id}</span>
                </div>

                <div className="user-card__role-select">
                  <label className="user-card__role-label">Role</label>
                  <select
                    className="input"
                    value={u.role}
                    disabled={isBusy}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="user-card__actions">
                  {u.is_active ? (
                    <button
                      className="btn btn-sm btn-secondary"
                      disabled={isBusy || isSelf}
                      title={isSelf ? "You cannot disable your own account" : undefined}
                      onClick={() => handleDisable(u.id)}
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-success"
                      disabled={isBusy}
                      onClick={() => handleEnable(u.id)}
                    >
                      Enable
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-danger"
                    disabled={isBusy || isSelf}
                    title={isSelf ? "You cannot delete your own account" : undefined}
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
