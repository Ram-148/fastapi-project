import axios from "axios";

const api = axios.create({
  baseURL: "https://fastapi-project-ok3r.onrender.com",
});

// ── Products ──────────────────────────────────────────────
export const getProducts   = ()        => api.get("/products");
export const createProduct = (data)    => api.post("/products", data);
export const updateProduct = (id, data)=> api.put(`/products/${id}`, data);
export const deleteProduct = (id)      => api.delete(`/products/${id}`);

export default api;
