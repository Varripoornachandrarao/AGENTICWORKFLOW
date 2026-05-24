import { create } from "zustand";
import { listIntegrationsRequest, startOAuthRequest } from "@/services/integrationService";

export const useIntegrationStore = create((set) => ({
  integrations: [],
  isLoading: false,
  error: null,

  loadIntegrations: async () => {
    set({ isLoading: true, error: null });
    try {
      const integrations = await listIntegrationsRequest();
      set({ integrations, isLoading: false });
      return integrations;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load integrations";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  startOAuth: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const url = await startOAuthRequest(provider);
      set({ isLoading: false });
      window.location.href = url;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to start OAuth";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  }
}));
