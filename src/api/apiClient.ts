import { User } from "../contexts/UserContext";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

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
    // Instead of redirecting here, just throw the error
    const message = data?.error || `Request failed: ${res.status}`;
    const details = data?.issues ? `: ${JSON.stringify(data.issues)}` : "";
    const err = new Error(message + details);
    (err as any).status = res.status; // attach status for AuthContext
    throw err;
  }

  return data as T;
}

// User endpoints
export const getUserProfile = (): Promise<User> =>
  apiRequest<User>("/users/me");

export const updateUserProfile = (payload: Partial<User>) =>
  apiRequest<User>("/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteUserAccount = () =>
  apiRequest<void>("/users/me", { method: "DELETE" });

export const getUserPreferences = () =>
  apiRequest<{ theme: "light" | "dark" }>("/users/preferences");

export const updateUserPreferences = (payload: { theme: "light" | "dark" }) =>
  apiRequest("/users/preferences", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
