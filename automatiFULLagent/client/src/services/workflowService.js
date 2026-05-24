import { api } from "./api";

export async function getDashboardRequest() {
  const { data } = await api.get("/workflows/dashboard");
  return data;
}

export async function listWorkflowsRequest(params = {}) {
  const { data } = await api.get("/workflows", { params });
  return data;
}

export async function createWorkflowRequest(payload) {
  const { data } = await api.post("/workflows", payload);
  return data.workflow;
}

export async function generateWorkflowRequest(prompt) {
  const { data } = await api.post("/workflows/generate", { prompt });
  return data;
}

export async function getWorkflowRequest(id) {
  const { data } = await api.get(`/workflows/${id}`);
  return data.workflow;
}

export async function updateWorkflowRequest(id, payload) {
  const { data } = await api.put(`/workflows/${id}`, payload);
  return data.workflow;
}

export async function duplicateWorkflowRequest(id) {
  const { data } = await api.post(`/workflows/${id}/duplicate`);
  return data.workflow;
}

export async function deleteWorkflowRequest(id) {
  const { data } = await api.delete(`/workflows/${id}`);
  return data;
}
