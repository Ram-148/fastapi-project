import React, { useState } from "react";
import "./PageShared.css";

const MOCK = [
  { id: 1, type: "warning", icon: "⚠️",  text: "Product 'USB-C Hub' is low on stock (3 units remaining).",   time: "2 min ago",  read: false },
  { id: 2, type: "success", icon: "✅",  text: "Order ORD-003 has been shipped successfully.",                 time: "1 hr ago",   read: false },
  { id: 3, type: "info",    icon: "ℹ️",  text: "Supplier 'TechSource Ltd' updated their price list.",          time: "3 hrs ago",  read: true  },
  { id: 4, type: "error",   icon: "❌",  text: "Order ORD-004 was cancelled by the customer.",                 time: "Yesterday",  read: true  },
  { id: 5, type: "info",    icon: "🤖",  text: "AI Insights generated a new restock recommendation.",          time: "2 days ago", read: true  },
];

const TYPE_BADGE = { warning: "badge-yellow", success: "badge-green", info: "badge-blue", error: "badge-red" };

export default function Notifications() {
  const [notes, setNotes] = useState(MOCK);

  const markAll = () => setNotes((n) => n.map((x) => ({ ...x, read: true })));
  const unread  = notes.filter((n) => !n.read).length;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Notifications</h2>
          <p className="page__sub">{unread} unread notification{unread !== 1 ? "s" : ""}.</p>
        </div>
        {unread > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all as read</button>
        )}
      </div>

      <div className="card">
        <div className="notif-list">
          {notes.map((n) => (
            <div key={n.id} className={`notif-item ${!n.read ? "notif-item--unread" : ""}`}>
              <span className="notif-item__icon">{n.icon}</span>
              <div className="notif-item__body">
                <p className="notif-item__text">{n.text}</p>
                <span className="notif-item__time">{n.time}</span>
              </div>
              <span className={`badge ${TYPE_BADGE[n.type]}`}>{n.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
