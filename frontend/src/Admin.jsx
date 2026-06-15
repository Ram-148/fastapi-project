import React, { useState } from "react";
import "./PageShared.css";

const USERS = [
  { id: 1, name: "Admin User",  email: "admin@telusko.com",  role: "Administrator", status: "Active"   },
  { id: 2, name: "John Doe",    email: "john@telusko.com",   role: "Manager",       status: "Active"   },
  { id: 3, name: "Jane Smith",  email: "jane@telusko.com",   role: "Viewer",        status: "Inactive" },
];

const ROLE_BADGE = { Administrator: "badge-purple", Manager: "badge-blue", Viewer: "badge-gray" };

export default function Admin() {
  const [users] = useState(USERS);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">🛡️ Admin Panel</h2>
          <p className="page__sub">Manage users, roles, and system configuration.</p>
        </div>
        <button className="btn btn-primary">+ Invite User</button>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {[
          { label: "Total Users",   value: users.length,                              icon: "👥" },
          { label: "Active Users",  value: users.filter(u => u.status === "Active").length, icon: "✅" },
          { label: "Roles",         value: new Set(users.map(u => u.role)).size,       icon: "🎭" },
        ].map((s) => (
          <div key={s.label} className="card admin-stat">
            <span className="admin-stat__icon">{s.icon}</span>
            <div className="admin-stat__value">{s.value}</div>
            <div className="admin-stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="card">
        <h3 className="card__title">User Management</h3>
        <div className="pt__scroll">
          <table className="pt">
            <thead>
              <tr>
                <th className="pt__th">ID</th>
                <th className="pt__th">Name</th>
                <th className="pt__th">Email</th>
                <th className="pt__th">Role</th>
                <th className="pt__th">Status</th>
                <th className="pt__th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="pt__row">
                  <td className="pt__td pt__id">{u.id}</td>
                  <td className="pt__td pt__name">{u.name}</td>
                  <td className="pt__td">{u.email}</td>
                  <td className="pt__td">
                    <span className={`badge ${ROLE_BADGE[u.role] ?? "badge-gray"}`}>{u.role}</span>
                  </td>
                  <td className="pt__td">
                    <span className={`badge ${u.status === "Active" ? "badge-green" : "badge-gray"}`}>{u.status}</span>
                  </td>
                  <td className="pt__td">
                    <div className="pt__actions">
                      <button className="btn btn-sm btn-info">Edit</button>
                      <button className="btn btn-sm btn-danger">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
