import { apiRequest } from "../api/apiClient";

export type Task = {
  id: number;
  title: string;
  description?: string | null;
  status: "todo" | "in-progress" | "done";
  boardId: number;
  assigneeId?: number | null;
};

export const getTasksByBoard = (boardId: number) =>
  apiRequest<Task[]>(`/tasks?boardId=${boardId}`, { method: "GET" });

export const createTask = (data: {
  title: string;
  boardId: number;
  description?: string;
}) =>
  apiRequest<Task>("/tasks", { method: "POST", body: JSON.stringify(data) });

export const updateTask = (
  taskId: number,
  data: Partial<Omit<Task, "id" | "boardId">>
) =>
  apiRequest<Task>(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteTask = (taskId: number) =>
  apiRequest<{ message: string }>(`/tasks/${taskId}`, { method: "DELETE" });
