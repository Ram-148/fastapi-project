import React, { useState } from "react";
import "./PageShared.css";

const MOCK_ORDERS = [
  { id: "ORD-001", product: "Laptop Pro",     qty: 2, total: 2598.00, status: "Delivered", date: "2025-06-10" },
  { id: "ORD-002", product: "Wireless Mouse",  qty: 10, total:  299.90, status: "Pending",   date: "2025-06-13" },
  { id: "ORD-003", product: "USB-C Hub",       qty: 5,  total:  224.95, status: "Shipped",   date: "2025-06-14" },
  { id: "ORD-004", product: "Mechanical KB",   qty: 3,  total:  449.97, status: "Cancelled", date: "2025-06-15" },
];

const STATUS_BADGE = {
  Delivered: "badge-green",
  Pending:   "badge-yellow",
  Shipped:   "badge-blue",
  Cancelled: "badge-red",
};

export default function Orders() {
  const [orders] = useState(MOCK_ORDERS);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Orders</h2>
          <p className="page__sub">Track purchase and sales orders.</p>
        </div>
        <button className="btn btn-primary">+ New Order</button>
      </div>

      <div className="card">
        <div className="pt__scroll">
          <table className="pt">
            <thead>
              <tr>
                <th className="pt__th">Order ID</th>
                <th className="pt__th">Product</th>
                <th className="pt__th">Qty</th>
                <th className="pt__th">Total</th>
                <th className="pt__th">Date</th>
                <th className="pt__th">Status</th>
                <th className="pt__th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="pt__row">
                  <td className="pt__td pt__id">{o.id}</td>
                  <td className="pt__td pt__name">{o.product}</td>
                  <td className="pt__td">{o.qty}</td>
                  <td className="pt__td pt__price">${o.total.toFixed(2)}</td>
                  <td className="pt__td">{o.date}</td>
                  <td className="pt__td">
                    <span className={`badge ${STATUS_BADGE[o.status] ?? "badge-gray"}`}>{o.status}</span>
                  </td>
                  <td className="pt__td">
                    <div className="pt__actions">
                      <button className="btn btn-sm btn-ghost">View</button>
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
