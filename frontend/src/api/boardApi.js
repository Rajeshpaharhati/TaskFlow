import apiClient from "./client";

export async function getBoard(boardId) {
  const response = await apiClient.get(`/boards/${boardId}`);

  return response.data;
}