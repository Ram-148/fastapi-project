import React from "react";
import "./PageShared.css";

const REPORTS = [
  { icon: "📦", name: "Inventory Summary",    desc: "Full snapshot of current stock levels and values.",    tag: "Inventory" },
  { icon: "📈", name: "Sales Performance",     desc: "Revenue breakdown by product, category, and period.",   tag: "Sales"     },
  { icon: "⚠️",  name: "Low Stock Alert",       desc: "Products approaching or below minimum thresholds.",     tag: "Alerts"    },
  { icon: "🏭", name: "Supplier Performance",  desc: "Delivery times, quality scores, and order history.",    tag: "Suppliers" },
  { icon: "🔄", name: "Stock Movement",        desc: "In/out transactions over a selected date range.",       tag: "Movement"  },
  { icon: "💰", name: "Profit & Loss",         desc: "Estimated P&L based on cost vs. selling price.",       tag: "Finance"   },
];

export default function Reports() {
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Reports</h2>
          <p className="page__sub">Generate and export operational reports.</p>
        </div>
        <button className="btn btn-primary">⬇ Export All</button>
      </div>

      <div className="reports-grid">
        {REPORTS.map((r) => (
          <div key={r.name} className="card report-card">
            <div className="report-card__icon">{r.icon}</div>
            <div className="report-card__body">
              <div className="report-card__top">
                <h3 className="report-card__name">{r.name}</h3>
                <span className="badge badge-purple">{r.tag}</span>
              </div>
              <p className="report-card__desc">{r.desc}</p>
              <div className="report-card__actions">
                <button className="btn btn-sm btn-primary">Generate</button>
                <button className="btn btn-sm btn-ghost">Preview</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
