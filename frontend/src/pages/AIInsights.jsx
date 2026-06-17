import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageShared.css";

const INSIGHTS = [
  { icon: "🔮", title: "Demand Forecasting",   desc: "Predict stock requirements for the next 30/60/90 days based on historical movement.",       status: "Coming soon" },
  { icon: "💡", title: "Restock Suggestions",   desc: "AI automatically flags products that need reordering before they go out of stock.",          status: "Coming soon" },
  { icon: "📉", title: "Dead Stock Detection",  desc: "Identify slow-moving inventory that's tying up capital and warehouse space.",                status: "Coming soon" },
  { icon: "💰", title: "Pricing Intelligence",  desc: "Optimal pricing recommendations based on cost, competition, and demand elasticity.",         status: "Coming soon" },
  { icon: "🏭", title: "Supplier Risk Score",   desc: "Score suppliers by delivery reliability, quality incidents, and lead time variance.",        status: "Coming soon" },
  { icon: "📊", title: "Anomaly Detection",     desc: "Catch unusual inventory spikes or drops before they impact operations.",                     status: "Coming soon" },
];

export default function AIInsights() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">🤖 AI Insights</h2>
          <p className="page__sub">Intelligent inventory recommendations powered by machine learning.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/products")}>View Products</button>
      </div>

      <div className="card ai-hero">
        <div className="ai-hero__inner">
          <span className="ai-hero__icon">🧠</span>
          <div>
            <h3>AI Engine — Integration Ready</h3>
            <p>Connect your ML model or LLM provider to unlock predictive analytics, automated alerts, and intelligent suggestions tailored to your inventory data.</p>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        {INSIGHTS.map((ins) => (
          <div key={ins.title} className="card report-card">
            <div className="report-card__icon">{ins.icon}</div>
            <div className="report-card__body">
              <div className="report-card__top">
                <h3 className="report-card__name">{ins.title}</h3>
                <span className="badge badge-gray">{ins.status}</span>
              </div>
              <p className="report-card__desc">{ins.desc}</p>
              <div className="report-card__actions">
                <button className="btn btn-sm btn-ghost" disabled>Configure</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
