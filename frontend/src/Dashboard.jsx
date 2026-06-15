import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import { getProducts } from "../services/api";
import "./Dashboard.css";

const LOW_STOCK_THRESHOLD = 5;

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((r) => setProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalProducts   = products.length;
  const lowStock        = products.filter((p) => Number(p.quantity) <= LOW_STOCK_THRESHOLD).length;
  const inventoryValue  = products.reduce((sum, p) => sum + Number(p.price) * Number(p.quantity), 0);
  const categories      = new Set(products.map((p) => p.category).filter(Boolean)).size;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Welcome back 👋</h2>
          <p className="dashboard__sub">Here's what's happening with your inventory today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/products")}>
          + Add Product
        </button>
      </div>

      {/* Stat cards */}
      <div className="dashboard__cards">
        <DashboardCard
          icon="📦"
          label="Total Products"
          value={loading ? "…" : totalProducts}
          sub="All tracked items"
          accent="#667eea"
          onClick={() => navigate("/products")}
        />
        <DashboardCard
          icon="⚠️"
          label="Low Stock"
          value={loading ? "…" : lowStock}
          sub={`≤ ${LOW_STOCK_THRESHOLD} units remaining`}
          accent="#ef4444"
        />
        <DashboardCard
          icon="💰"
          label="Inventory Value"
          value={loading ? "…" : `$${inventoryValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="Total stock value"
          accent="#f59e0b"
        />
        <DashboardCard
          icon="🏷️"
          label="Categories"
          value={loading ? "…" : (categories || "—")}
          sub="Distinct product categories"
          accent="#10b981"
        />
      </div>

      {/* Chart placeholders + Quick actions */}
      <div className="dashboard__mid">
        <div className="card dash-chart-placeholder">
          <h3 className="dash-section-title">📈 Sales Over Time</h3>
          <div className="dash-placeholder-body">
            <span>Chart coming soon</span>
            <p>Connect your analytics provider to visualise revenue trends.</p>
          </div>
        </div>

        <div className="card dash-chart-placeholder">
          <h3 className="dash-section-title">🥧 Stock by Category</h3>
          <div className="dash-placeholder-body">
            <span>Chart coming soon</span>
            <p>Category distribution will appear here once categories are configured.</p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card dashboard__ai">
        <h3 className="dash-section-title">🤖 AI Recommendations</h3>
        <div className="dashboard__ai-items">
          <div className="ai-tip ai-tip--info">
            <span className="ai-tip__icon">💡</span>
            <div>
              <strong>Reorder alert:</strong> {lowStock} product{lowStock !== 1 ? "s" : ""} are running low. Consider restocking soon.
            </div>
          </div>
          <div className="ai-tip ai-tip--success">
            <span className="ai-tip__icon">✅</span>
            <div>
              <strong>Inventory health:</strong> Your total stock value is <strong>${inventoryValue.toFixed(2)}</strong>. Keep monitoring for anomalies.
            </div>
          </div>
          <div className="ai-tip ai-tip--warning">
            <span className="ai-tip__icon">🔮</span>
            <div>
              <strong>AI Insights:</strong> Full predictive analytics available on the <button className="link-btn" onClick={() => navigate("/ai-insights")}>AI Insights page</button>.
            </div>
          </div>
        </div>
      </div>

      {/* Recent products table (top 5) */}
      <div className="card">
        <div className="dash-table-header">
          <h3 className="dash-section-title">🗃️ Recent Products</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/products")}>View All →</button>
        </div>
        <div className="pt__scroll">
          <table className="pt">
            <thead>
              <tr>
                <th className="pt__th">ID</th>
                <th className="pt__th">Name</th>
                <th className="pt__th">Price</th>
                <th className="pt__th">Qty</th>
                <th className="pt__th">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="pt__empty">Loading…</td></tr>
              ) : products.slice(0, 5).map((p) => (
                <tr key={p.id} className="pt__row">
                  <td className="pt__td pt__id">{p.id}</td>
                  <td className="pt__td pt__name">{p.name}</td>
                  <td className="pt__td pt__price">${Number(p.price).toFixed(2)}</td>
                  <td className="pt__td">
                    <span className="pt__qty">{p.quantity}</span>
                  </td>
                  <td className="pt__td">
                    {Number(p.quantity) <= LOW_STOCK_THRESHOLD
                      ? <span className="badge badge-red">Low Stock</span>
                      : <span className="badge badge-green">In Stock</span>}
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr><td colSpan={5} className="pt__empty">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
