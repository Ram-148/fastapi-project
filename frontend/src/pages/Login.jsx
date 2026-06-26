import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const navigate             = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new URLSearchParams();

    formData.append("username", form.email);
    formData.append("password", form.password);

    const response = await fetch(
      "http://localhost:8000/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Login failed"
      );
    }

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    localStorage.setItem(
      "refresh_token",
      data.refresh_token
    );

    const profileResponse = await fetch(
      "http://localhost:8000/profile",
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );

    const profileData =
      await profileResponse.json();

    localStorage.setItem(
      "user",
      JSON.stringify(profileData)
    );

    navigate("/dashboard");

  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand__icon">📦</span>
          <h1 className="auth-brand__name">Telusko Trac</h1>
        </div>

        <h2 className="auth-title">Sign in to your account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button className="btn btn-primary btn-lg auth-submit" type="submit">
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
