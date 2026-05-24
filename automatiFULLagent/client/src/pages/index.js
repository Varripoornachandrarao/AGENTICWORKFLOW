import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { isHydrated, token } = useAuth();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    router.replace(token ? "/dashboard" : "/login");
  }, [isHydrated, token, router]);

  return (
    <main className="grid min-h-screen place-items-center bg-panel px-6">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-accent" />
    </main>
  );
}
