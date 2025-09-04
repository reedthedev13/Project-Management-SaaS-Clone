import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "https://project-management-saas-backend-azpf.onrender.com/api"; // make sure no ??

console.log("API_BASE_URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
