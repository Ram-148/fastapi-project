import React, { useState } from "react";
import "./PageShared.css";

export default function Settings() {
  const [settings, setSettings] = useState({
    lowStockThreshold: 5,
    currency: "USD",
    timezone: "UTC",
    emailAlerts: true,
    darkMode: false,
    autoRefresh: true,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));
  const change = (e)   => setSettings((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">⚙️ Settings</h2>
          <p className="page__sub">Configure application preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-sections">
        {/* Inventory */}
        <div className="card">
          <h3 className="card__title">Inventory Settings</h3>
          <div className="settings-rows">
            <div className="settings-row">
              <div>
                <div className="settings-row__label">Low Stock Threshold</div>
                <div className="settings-row__sub">Alert when quantity falls at or below this value.</div>
              </div>
              <input className="input settings-input" type="number" name="lowStockThreshold" value={settings.lowStockThreshold} onChange={change} min={0} />
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-row__label">Currency</div>
                <div className="settings-row__sub">Display currency for prices.</div>
              </div>
              <select className="input settings-input" name="currency" value={settings.currency} onChange={change}>
                <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
              </select>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-row__label">Timezone</div>
                <div className="settings-row__sub">Used for timestamps and reports.</div>
              </div>
              <select className="input settings-input" name="timezone" value={settings.timezone} onChange={change}>
                <option>UTC</option><option>America/New_York</option><option>Asia/Kolkata</option><option>Europe/London</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 className="card__title">Notifications & Display</h3>
          <div className="settings-rows">
            {[
              { key: "emailAlerts", label: "Email Alerts", sub: "Send low-stock and order alerts to your email." },
              { key: "darkMode",    label: "Dark Mode",    sub: "Switch to a dark colour scheme (coming soon)." },
              { key: "autoRefresh", label: "Auto Refresh", sub: "Automatically refresh product data every 60 seconds." },
            ].map(({ key, label, sub }) => (
              <div key={key} className="settings-row">
                <div>
                  <div className="settings-row__label">{label}</div>
                  <div className="settings-row__sub">{sub}</div>
                </div>
                <button type="button" className={`toggle ${settings[key] ? "toggle--on" : ""}`} onClick={() => toggle(key)}>
                  <span className="toggle__knob" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {saved && <div className="alert alert-success">Settings saved successfully.</div>}
        <button className="btn btn-primary" type="submit">Save Settings</button>
      </form>
    </div>
  );
}
