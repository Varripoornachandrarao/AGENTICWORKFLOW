import AppShell from "@/components/AppShell";
import MetricGrid from "@/components/MetricGrid";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useEffect } from "react";
import { useWorkflowStore } from "@/store/workflowStore";

export default function DashboardPage() {
  const { dashboard, loadDashboard, isLoading } = useWorkflowStore();

  useEffect(() => {
    loadDashboard().catch(() => {});
  }, [loadDashboard]);

  return (
    <ProtectedRoute>
      <AppShell title="Dashboard">
        <MetricGrid dashboard={dashboard} />

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-lg border border-line bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">Recent Workflows</h2>
              <Link href="/workflows/builder" className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white">
                New Workflow
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {isLoading ? <p className="text-sm text-slate-500">Loading workflows...</p> : null}
              {dashboard?.recentWorkflows?.length ? (
                dashboard.recentWorkflows.map((workflow) => (
                  <Link
                    key={workflow.id}
                    href={`/workflows/${workflow.id}`}
                    className="block rounded-md border border-line px-4 py-3 hover:border-accent"
                  >
                    <p className="text-sm font-medium text-ink">{workflow.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {workflow.status} - version {workflow.version}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-line p-8 text-center text-sm text-slate-500">
                  No workflows yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-base font-semibold text-ink">AI Activity</h2>
            <div className="mt-5 space-y-3">
              {["Planner", "Execution", "Validation"].map((agent) => (
                <div key={agent} className="rounded-md border border-line px-3 py-3">
                  <p className="text-sm font-medium text-ink">{agent} agent</p>
                  <p className="mt-1 text-sm text-slate-500">Waiting for workflow executions.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AppShell>
    </ProtectedRoute>
  );
}
