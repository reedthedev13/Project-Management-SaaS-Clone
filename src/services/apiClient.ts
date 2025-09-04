import { User } from "../contexts/UserContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
console.log("BASE_URL:", BASE_URL);

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  if (res.status === 204) return {} as T;

  let data: any = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const message = data?.error || `Request failed: ${res.status}`;
    const details = data?.issues ? `: ${JSON.stringify(data.issues)}` : "";
    throw new Error(message + details);
  }

  return data as T;
}
