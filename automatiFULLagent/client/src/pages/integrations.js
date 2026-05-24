import AppShell from "@/components/AppShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Cable, CheckCircle2, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useIntegrationStore } from "@/store/integrationStore";

export default function IntegrationsPage() {
  const { integrations, loadIntegrations, startOAuth, isLoading, error } = useIntegrationStore();

  useEffect(() => {
    loadIntegrations().catch(() => {});
  }, [loadIntegrations]);

  return (
    <ProtectedRoute>
      <AppShell title="Integrations">
        {error ? <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {integrations.map((integration) => (
            <article key={integration.provider} className="rounded-lg border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{integration.providerAccountName}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{integration.provider}</p>
                </div>
                <span
                  className={`grid h-9 w-9 place-items-center rounded-md ${
                    integration.connected ? "bg-teal-50 text-accent" : "bg-panel text-slate-500"
                  }`}
                >
                  {integration.connected ? <CheckCircle2 size={18} /> : <Cable size={18} />}
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-600">
                Status: <span className="font-medium text-ink">{integration.status}</span>
              </p>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">
                {integration.scopes?.slice(0, 2).join(", ")}
              </p>

              <button
                type="button"
                onClick={() => startOAuth(integration.provider)}
                disabled={isLoading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                <RefreshCw size={15} />
                {integration.connected ? "Reconnect" : "Connect"}
              </button>
            </article>
          ))}
        </section>
      </AppShell>
    </ProtectedRoute>
  );
}
