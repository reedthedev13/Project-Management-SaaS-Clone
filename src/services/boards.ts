import { apiRequest } from "./apiClient";

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
