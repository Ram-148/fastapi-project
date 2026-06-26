import React, { useMemo, useState } from "react";
import "./ProductTable.css";

const currency = (n) =>
  typeof n === "number" ? n.toFixed(2) : Number(n || 0).toFixed(2);

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  loading,
  filter,
}) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const thClass = (field) =>
    `pt__th pt__th--sortable${
      sortField === field ? ` pt__th--${sortDirection}` : ""
    }`;

  const rows = useMemo(() => {
    const q = (filter ?? "").trim().toLowerCase();

    let list = q
      ? products.filter(
          (p) =>
            String(p.id).includes(q) ||
            p.name?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        )
      : [...products];

    return list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (["id", "price", "quantity"].includes(sortField)) {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;

      return 0;
    });
  }, [products, filter, sortField, sortDirection]);

  if (loading) {
    return <div className="pt__loader">Loading…</div>;
  }

  return (
    <div className="pt__scroll">
      <table className="pt">
        <thead>
          <tr>
            <th
              className={thClass("id")}
              onClick={() => handleSort("id")}
            >
              ID
            </th>

            <th
              className={thClass("name")}
              onClick={() => handleSort("name")}
            >
              Name
            </th>

            <th className="pt__th">Description</th>

            <th
              className={thClass("price")}
              onClick={() => handleSort("price")}
            >
              Price
            </th>

            <th
              className={thClass("quantity")}
              onClick={() => handleSort("quantity")}
            >
              Qty
            </th>

            {(user?.role === "admin" ||
              user?.role === "manager") && (
              <th className="pt__th">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="pt__row">
              <td className="pt__td pt__id">{p.id}</td>

              <td className="pt__td pt__name">{p.name}</td>

              <td
                className="pt__td pt__desc"
                title={p.description}
              >
                {p.description}
              </td>

              <td className="pt__td pt__price">
                ${currency(p.price)}
              </td>

              <td className="pt__td">
                <span className="pt__qty">
                  {p.quantity}
                </span>
              </td>

              {(user?.role === "admin" ||
                user?.role === "manager") && (
                <td className="pt__td">
                  <div className="pt__actions">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => onEdit(p)}
                    >
                      Edit
                    </button>

                    {user?.role === "admin" && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(p.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={
                  user?.role === "admin" ||
                  user?.role === "manager"
                    ? 6
                    : 5
                }
                className="pt__empty"
              >
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}