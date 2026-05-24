import { api } from "./api";

export async function executeWorkflowRequest(workflowId, input = {}) {
  const { data } = await api.post(`/workflows/${workflowId}/execute`, { input });
  return data.execution;
}

export async function listExecutionsRequest(params = {}) {
  const { data } = await api.get("/executions", { params });
  return data;
}

export async function getExecutionTimelineRequest(executionId) {
  const { data } = await api.get(`/executions/${executionId}/timeline`);
  return data.items;
}

export async function pauseExecutionRequest(executionId) {
  const { data } = await api.post(`/executions/${executionId}/pause`);
  return data.execution;
}

export async function resumeExecutionRequest(executionId) {
  const { data } = await api.post(`/executions/${executionId}/resume`);
  return data.execution;
}

export async function cancelExecutionRequest(executionId) {
  const { data } = await api.post(`/executions/${executionId}/cancel`);
  return data.execution;
}
