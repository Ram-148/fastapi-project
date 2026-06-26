import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";
import "./PageShared.css";

export default function Profile() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: ""
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const res = await getProfile();

      setForm({
        username: res.data.username,
        email: res.data.email,
        role: res.data.role
      });

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

      const res = await updateProfile({
        username: form.username
      });

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      setMessage("Profile updated successfully");

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Profile update failed"
      );
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="page">

      <div className="page__hero">

        <div className="profile-avatar">
          👤
        </div>

        <div>
          <h2 className="page__title">
            {form.username}
          </h2>

          <p className="page__sub">
            {form.email} · {" "}
            <span className="badge badge-purple">
              {form.role}
            </span>
          </p>
        </div>

      </div>

      <div className="card">

        <h3 className="card__title">
          Account Details
        </h3>

        <form
          onSubmit={handleSave}
          className="profile-form"
        >

          <div className="form-field">
            <label className="form-label">
              Username
            </label>

            <input
              className="input"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Email
            </label>

            <input
              className="input"
              value={form.email}
              disabled
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Role
            </label>

            <input
              className="input"
              value={form.role}
              disabled
            />
          </div>

          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
          >
            Save Changes
          </button>

        </form>

      </div>

    </div>
  );
}