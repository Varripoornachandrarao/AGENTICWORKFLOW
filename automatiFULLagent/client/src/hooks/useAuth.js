import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const auth = useAuthStore();

  useEffect(() => {
    if (auth.isHydrated && auth.token && !auth.user) {
      auth.loadProfile().catch(() => auth.logout());
    }
  }, [auth.isHydrated, auth.token, auth.user]);

  return auth;
}
