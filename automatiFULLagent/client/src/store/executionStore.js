import { create } from "zustand";
import {
  cancelExecutionRequest,
  executeWorkflowRequest,
  getExecutionTimelineRequest,
  listExecutionsRequest,
  pauseExecutionRequest,
  resumeExecutionRequest
} from "@/services/executionService";

export const useExecutionStore = create((set) => ({
  executions: [],
  timeline: [],
  isLoading: false,
  error: null,

  executeWorkflow: async (workflowId, input) => {
    set({ isLoading: true, error: null });
    try {
      const execution = await executeWorkflowRequest(workflowId, input);
      set((state) => ({ executions: [execution, ...state.executions], isLoading: false }));
      return execution;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to execute workflow";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  listExecutions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const result = await listExecutionsRequest(params);
      set({ executions: result.items, isLoading: false });
      return result;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load executions";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  loadTimeline: async (executionId) => {
    const timeline = await getExecutionTimelineRequest(executionId);
    set({ timeline });
    return timeline;
  },

  pauseExecution: async (executionId) => {
    const execution = await pauseExecutionRequest(executionId);
    set((state) => ({
      executions: state.executions.map((item) => (item.id === execution.id ? execution : item))
    }));
    return execution;
  },

  resumeExecution: async (executionId) => {
    const execution = await resumeExecutionRequest(executionId);
    set((state) => ({
      executions: state.executions.map((item) => (item.id === execution.id ? execution : item))
    }));
    return execution;
  },

  cancelExecution: async (executionId) => {
    const execution = await cancelExecutionRequest(executionId);
    set((state) => ({
      executions: state.executions.map((item) => (item.id === execution.id ? execution : item))
    }));
    return execution;
  }
}));
