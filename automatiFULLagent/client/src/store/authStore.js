import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginRequest, meRequest, registerRequest } from "@/services/authService";
import { setAuthToken } from "@/services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isHydrated: false,
      isLoading: false,
      error: null,

      setHydrated: () => {
        const token = get().token;
        setAuthToken(token);
        set({ isHydrated: true });
      },

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const result = await loginRequest(payload);
          setAuthToken(result.token);
          set({ token: result.token, user: result.user, isLoading: false });
          return result;
        } catch (error) {
          const message = error.response?.data?.message || "Unable to sign in";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const result = await registerRequest(payload);
          setAuthToken(result.token);
          set({ token: result.token, user: result.user, isLoading: false });
          return result;
        } catch (error) {
          const message = error.response?.data?.message || "Unable to create account";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      loadProfile: async () => {
        const token = get().token;

        if (!token) {
          return null;
        }

        setAuthToken(token);
        const result = await meRequest();
        set({ user: result.user });
        return result.user;
      },

      logout: () => {
        setAuthToken(null);
        set({ token: null, user: null, error: null });
      }
    }),
    {
      name: "agentflow-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      }
    }
  )
);
