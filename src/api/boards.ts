// src/api/boards.ts
import axios from "axios";
import apiClient from "./api";

const API_URL = "http://localhost:5001/api/boards";

export const getBoards = async (token: string) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const editBoard = async (boardId: number, title: string) => {
  const res = await apiClient.put(`/boards/${boardId}`, { title });
  return res.data;
};

export const createBoard = async (token: string, title: string) => {
  const res = await axios.post(
    API_URL,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateBoard = async (
  token: string,
  boardId: number,
  title: string
) => {
  const res = await axios.put(
    `${API_URL}/${boardId}`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteBoard = async (token: string, boardId: number) => {
  await axios.delete(`${API_URL}/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
