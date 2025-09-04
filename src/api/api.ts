import axios from "axios";

// Base URL from environment variable or fallback to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

console.log("API_BASE_URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach auth token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
