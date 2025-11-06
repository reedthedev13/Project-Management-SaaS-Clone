// src/api/apiClient.ts
import { User } from "../contexts/UserContext";

// Dynamic backend URL
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// Generic API request helper
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
    const err = new Error(message + details);
    (err as any).status = res.status; // attach status code
    throw err;
  }

  return data as T;
}

/* -------------------- User API -------------------- */
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

/* -------------------- Boards API -------------------- */
export type Board = { id: number; title: string; ownerId: number };

export const getBoards = () =>
  apiRequest<Board[]>("/boards", { method: "GET" });
export const createBoard = (title: string) =>
  apiRequest<Board>("/boards", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
export const updateBoard = (boardId: number, title: string) =>
  apiRequest<Board>(`/boards/${boardId}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  });
export const deleteBoard = (boardId: number) =>
  apiRequest<void>(`/boards/${boardId}`, { method: "DELETE" });

/* -------------------- Tasks API -------------------- */
export type Task = { id: number; title: string; completed: boolean };

export const getTasks = (boardId: number) =>
  apiRequest<Task[]>(`/boards/${boardId}/tasks`, { method: "GET" });

export const createTask = (boardId: number, title: string) =>
  apiRequest<Task>(`/boards/${boardId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const updateTask = (
  boardId: number,
  taskId: number,
  payload: Partial<Task>
) =>
  apiRequest<Task>(`/boards/${boardId}/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteTask = (boardId: number, taskId: number) =>
  apiRequest<void>(`/boards/${boardId}/tasks/${taskId}`, { method: "DELETE" });
