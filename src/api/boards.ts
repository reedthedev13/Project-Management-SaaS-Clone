import axios from "axios";
import apiClient from "./api";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export const getBoards = async (token: string) => {
  const res = await axios.get(BASE_URL, {
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
    BASE_URL,
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
    `${BASE_URL}/${boardId}`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteBoard = async (token: string, boardId: number) => {
  await axios.delete(`${BASE_URL}/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
