import { apiRequest } from "./apiClient";

export type Board = { id: number; title: string; ownerId: number };

const BASE_URL = "http://localhost:5001/api";

export const getBoards = () =>
  apiRequest<Board[]>(`${BASE_URL}/boards`, { method: "GET" });

export const createBoard = (title: string) =>
  apiRequest<Board>(`${BASE_URL}/boards`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const updateBoard = (boardId: number, title: string) =>
  apiRequest<Board>(`${BASE_URL}/boards/${boardId}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  });

export const deleteBoard = (boardId: number) =>
  apiRequest<void>(`${BASE_URL}/boards/${boardId}`, { method: "DELETE" });
