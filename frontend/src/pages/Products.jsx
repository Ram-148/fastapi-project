import React, { useEffect, useState } from "react";
import ProductTable from "../components/ProductTable";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/api";
import "./Products.css";

const EMPTY_FORM = { id: "", name: "", description: "", price: "", quantity: "" };

export default function Products() {
  const user = JSON.parse(
  localStorage.getItem("user")
);
  const [products, setProducts] = useState([]);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [editId,   setEditId]   = useState(null);
  const [message,  setMessage]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [filter,   setFilter]   = useState("");

  /* Auto-dismiss messages after 5 seconds (preserved from original) */
  useEffect(() => {
    if (message) { const t = setTimeout(() => setMessage(""), 5000); return () => clearTimeout(t); }
  }, [message]);

  useEffect(() => {
    if (error) { const t = setTimeout(() => setError(""), 5000); return () => clearTimeout(t); }
  }, [error]);

  /* Fetch all products */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
      setError("");
    } catch {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  /* Form helpers */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  /* Create or update */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const payload = {
      ...form,
      id:       Number(form.id),
      price:    Number(form.price),
      quantity: Number(form.quantity),
    };
    try {
      if (editId) {
        await updateProduct(editId, payload);
        setMessage("Product updated successfully");
      } else {
        await createProduct(payload);
        setMessage("Product created successfully");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Operation failed");
    }
    setLoading(false);
  };

  /* Edit */
  const handleEdit = (product) => {
    setForm({
      id:          product.id,
      name:        product.name,
      description: product.description,
      price:       product.price,
      quantity:    product.quantity,
    });
    setEditId(product.id);
    setMessage("");
    setError("");
  };

  /* Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await deleteProduct(id);
      setMessage("Product deleted successfully");
      fetchProducts();
    } catch {
      setError("Delete failed");
    }
    setLoading(false);
  };

  return (
    <div className="products-page">
      {/* Toolbar */}
      <div className="products-page__toolbar">
        <input
          className="input products-page__search"
          type="text"
          placeholder="Search by id, name or description…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="products-page__toolbar-right">
          <span className="badge badge-purple">{products.length} products</span>
          <button className="btn btn-ghost btn-sm" onClick={fetchProducts} disabled={loading}>
            ↺ Refresh
          </button>
        </div>
      </div>
      {/* Form card */}
{(user?.role === "admin" ||
  user?.role === "manager") && (

  <div className="card products-page__form-card">

    <h2 className="products-page__form-title">
      {editId ? "✏️ Edit Product" : "➕ Add Product"}
    </h2>

    <form onSubmit={handleSubmit} className="products-page__form">
      <input
        className="input"
        type="number"
        name="id"
        placeholder="ID"
        value={form.id}
        onChange={handleChange}
        required
        disabled={!!editId}
      />

      <input
        className="input"
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        className="input"
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        className="input"
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
        step="0.01"
      />

      <input
        className="input"
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={form.quantity}
        onChange={handleChange}
        required
      />

      <div className="products-page__form-actions">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving…" : editId ? "Update" : "Add Product"}
        </button>

        {editId && (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              resetForm();
              setMessage("");
              setError("");
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>

    {message && (
      <div className="alert alert-success">
        {message}
      </div>
    )}

    {error && (
      <div className="alert alert-error">
        {error}
      </div>
    )}

  </div>
)}
      

      {/* Table card */}
      <div className="card products-page__table-card">
        <h2 className="products-page__table-title">Product List</h2>
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          filter={filter}
        />
      </div>
    </div>
  );
}
