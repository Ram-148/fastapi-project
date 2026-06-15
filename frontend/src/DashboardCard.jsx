import React from "react";
import "./DashboardCard.css";

/**
 * Props:
 *   icon      {string}  emoji or SVG string
 *   label     {string}  card title
 *   value     {string|number}
 *   sub       {string}  optional subtitle / delta
 *   accent    {string}  CSS color for top-border accent
 *   onClick   {fn}      optional click handler
 */
export default function DashboardCard({ icon, label, value, sub, accent = "var(--primary-400)", onClick }) {
  return (
    <div
      className={`dash-card ${onClick ? "dash-card--clickable" : ""}`}
      style={{ "--accent-color": accent }}
      onClick={onClick}
    >
      <div className="dash-card__top">
        <span className="dash-card__icon">{icon}</span>
        <span className="dash-card__label">{label}</span>
      </div>
      <div className="dash-card__value">{value ?? "—"}</div>
      {sub && <div className="dash-card__sub">{sub}</div>}
    </div>
  );
}
