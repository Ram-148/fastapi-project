import React, { useState } from "react";
import "./PageShared.css";

const MOCK_SUPPLIERS = [
  { id: 1, name: "TechSource Ltd",    contact: "tech@source.com",    phone: "+1 555 0101", status: "Active"   },
  { id: 2, name: "Global Parts Inc",  contact: "info@globalparts.io", phone: "+1 555 0202", status: "Active"   },
  { id: 3, name: "QuickShip Co",      contact: "qs@quickship.net",    phone: "+1 555 0303", status: "Inactive" },
];

export default function Suppliers() {
  const [suppliers] = useState(MOCK_SUPPLIERS);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Suppliers</h2>
          <p className="page__sub">Manage your supply chain partners.</p>
        </div>
        <button className="btn btn-primary">+ Add Supplier</button>
      </div>

      <div className="card">
        <div className="pt__scroll">
          <table className="pt">
            <thead>
              <tr>
                <th className="pt__th">ID</th>
                <th className="pt__th">Name</th>
                <th className="pt__th">Contact</th>
                <th className="pt__th">Phone</th>
                <th className="pt__th">Status</th>
                <th className="pt__th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="pt__row">
                  <td className="pt__td pt__id">{s.id}</td>
                  <td className="pt__td pt__name">{s.name}</td>
                  <td className="pt__td">{s.contact}</td>
                  <td className="pt__td">{s.phone}</td>
                  <td className="pt__td">
                    <span className={`badge ${s.status === "Active" ? "badge-green" : "badge-gray"}`}>{s.status}</span>
                  </td>
                  <td className="pt__td">
                    <div className="pt__actions">
                      <button className="btn btn-sm btn-info">Edit</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-placeholder">
        <span>🏭</span>
        <p>Connect your supplier API to manage live supplier data, purchase orders, and lead times.</p>
      </div>
    </div>
  );
}
