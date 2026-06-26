import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

/* -------------------------------
   Request Interceptor
-------------------------------- */

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------------
   Response Interceptor
-------------------------------- */

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem("refresh_token");

        const response = await axios.post(
          "http://localhost:8000/refresh",
          null,
          {
            params: {
              refresh_token: refreshToken
            }
          }
        );

        const newAccessToken =
          response.data.access_token;

        localStorage.setItem(
          "access_token",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/* -------------------------------
   Profile APIs
-------------------------------- */

export const getProfile = () => {
  return api.get("/profile");
};

export const updateProfile = (data) => {
  return api.put("/profile", data);
};

/* -------------------------------
   Product APIs
-------------------------------- */

export const getProducts = () => {
  return api.get("/products");
};

export const createProduct = (data) => {
  return api.post("/products", data);
};

export const updateProduct = (id, data) => {
  return api.put(`/products/${id}`, data);
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

export default api;

/* -------------------------------
   User Management APIs
-------------------------------- */

export const getUsers = () => {
  return api.get("/users");
};

export const getUser = (id) => {
  return api.get(`/users/${id}`);
};

export const updateUserRole = (id, role) => {
  return api.put(`/users/${id}/role`, {
    role,
  });
};

export const disableUser = (id) => {
  return api.put(`/users/${id}/disable`);
};

export const enableUser = (id) => {
  return api.put(`/users/${id}/enable`);
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};