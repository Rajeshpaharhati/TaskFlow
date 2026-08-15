import apiClient from "./client";

export async function getTasks(priority) {
  const params = {};

  if (priority) {
    params.priority = priority;
  }

  const response = await apiClient.get("/tasks", {
    params,
  });

  return response.data;
}

export async function createTask(taskData) {
  const response = await apiClient.post("/tasks", taskData);

  return response.data;
}

export async function updateTask(taskId, taskData) {
  const response = await apiClient.put(
    `/tasks/${taskId}`,
    taskData
  );

  return response.data;
}

export async function deleteTask(taskId) {
  const response = await apiClient.delete(
    `/tasks/${taskId}`
  );

  return response.data;
}