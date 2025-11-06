// src/api/apiClient.ts
import { User } from "../contexts/UserContext";

// Dynamically choose API URL
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5001/api"
    : "https://project-management-saas-backend-azpf.onrender.com/api");

// Core fetch helper
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
    (err as any).status = res.status;
    throw err;
  }

  return data as T;
}

// ----------------------
// Auth Endpoints
// ----------------------
export const registerUser = (payload: {
  name: string;
  email: string;
  password: string;
}) =>
  apiRequest<{ token: string; user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload: { email: string; password: string }) =>
  apiRequest<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ----------------------
// User Endpoints
// ----------------------
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

// ----------------------
// Boards Endpoints
// ----------------------
export type Board = { id: number; title: string; ownerId: number };

export const getBoards = () => apiRequest<Board[]>("/boards");

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

// ----------------------
// Tasks Endpoints
// ----------------------
export type Task = {
  id: number;
  title: string;
  completed: boolean;
  boardId: number;
  assignedTo?: number;
};

export const getTasks = (boardId: number) =>
  apiRequest<Task[]>(`/tasks?boardId=${boardId}`);

export const createTask = (boardId: number, title: string) =>
  apiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ boardId, title }),
  });

export const updateTask = (taskId: number, updates: Partial<Task>) =>
  apiRequest<Task>(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

export const deleteTask = (taskId: number) =>
  apiRequest<void>(`/tasks/${taskId}`, { method: "DELETE" });

export const toggleTaskCompletion = (taskId: number, completed: boolean) =>
  apiRequest<Task>(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify({ completed }),
  });
