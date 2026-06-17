import React, { useState } from "react";
import "./PageShared.css";

export default function Profile() {
  const [form, setForm] = useState({ name: "Admin User", email: "admin@telusko.com", role: "Administrator" });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page">
      <div className="page__hero">
        <div className="profile-avatar">👤</div>
        <div>
          <h2 className="page__title">{form.name}</h2>
          <p className="page__sub">{form.email} · <span className="badge badge-purple">{form.role}</span></p>
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">Account Details</h3>
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label">Role</label>
            <input className="input" name="role" value={form.role} disabled />
          </div>
          {saved && <div className="alert alert-success">Profile saved successfully.</div>}
          <button className="btn btn-primary" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
