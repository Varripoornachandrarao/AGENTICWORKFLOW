import { create } from "zustand";
import {
  createWorkflowRequest,
  generateWorkflowRequest,
  getDashboardRequest,
  getWorkflowRequest,
  listWorkflowsRequest,
  updateWorkflowRequest
} from "@/services/workflowService";

export const useWorkflowStore = create((set) => ({
  dashboard: null,
  workflows: [],
  currentWorkflow: null,
  isLoading: false,
  error: null,

  loadDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const dashboard = await getDashboardRequest();
      set({ dashboard, isLoading: false });
      return dashboard;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load dashboard";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  listWorkflows: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const result = await listWorkflowsRequest(params);
      set({ workflows: result.items, isLoading: false });
      return result;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load workflows";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  createWorkflow: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const workflow = await createWorkflowRequest(payload);
      set((state) => ({
        workflows: [workflow, ...state.workflows],
        currentWorkflow: workflow,
        isLoading: false
      }));
      return workflow;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to create workflow";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  generateWorkflow: async (prompt) => {
    set({ isLoading: true, error: null });
    try {
      const result = await generateWorkflowRequest(prompt);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to generate workflow";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  loadWorkflow: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const workflow = await getWorkflowRequest(id);
      set({ currentWorkflow: workflow, isLoading: false });
      return workflow;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load workflow";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateWorkflow: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const workflow = await updateWorkflowRequest(id, payload);
      set({ currentWorkflow: workflow, isLoading: false });
      return workflow;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to save workflow";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  }
}));
