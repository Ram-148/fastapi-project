import React, { useState } from "react";
import "./PageShared.css";

const HISTORY = [
  { id: 1, product: "Laptop Pro",     action: "Stock In",  qty: 10, by: "Admin",     date: "2025-06-15 09:12" },
  { id: 2, product: "USB-C Hub",      action: "Stock Out", qty: 3,  by: "System",    date: "2025-06-15 10:45" },
  { id: 3, product: "Wireless Mouse", action: "Adjusted",  qty: 2,  by: "Admin",     date: "2025-06-14 14:30" },
  { id: 4, product: "Mechanical KB",  action: "Stock In",  qty: 5,  by: "Supplier",  date: "2025-06-13 08:00" },
  { id: 5, product: "Monitor 27\"",   action: "Stock Out", qty: 1,  by: "Order",     date: "2025-06-12 16:22" },
];

const ACTION_BADGE = { "Stock In": "badge-green", "Stock Out": "badge-red", "Adjusted": "badge-yellow" };

export default function InventoryHistory() {
  const [history] = useState(HISTORY);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Inventory History</h2>
          <p className="page__sub">Audit trail of all stock movements and adjustments.</p>
        </div>
        <button className="btn btn-ghost btn-sm">⬇ Export CSV</button>
      </div>

      <div className="card">
        <div className="pt__scroll">
          <table className="pt">
            <thead>
              <tr>
                <th className="pt__th">#</th>
                <th className="pt__th">Product</th>
                <th className="pt__th">Action</th>
                <th className="pt__th">Qty Changed</th>
                <th className="pt__th">By</th>
                <th className="pt__th">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="pt__row">
                  <td className="pt__td pt__id">{h.id}</td>
                  <td className="pt__td pt__name">{h.product}</td>
                  <td className="pt__td">
                    <span className={`badge ${ACTION_BADGE[h.action] ?? "badge-gray"}`}>{h.action}</span>
                  </td>
                  <td className="pt__td">{h.qty}</td>
                  <td className="pt__td">{h.by}</td>
                  <td className="pt__td" style={{ fontSize: 13, color: "var(--text-500)" }}>{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-placeholder">
        <span>📋</span>
        <p>Connect your backend audit log endpoint to stream live inventory history events here.</p>
      </div>
    </div>
  );
}
