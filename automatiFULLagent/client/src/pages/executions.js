import AppShell from "@/components/AppShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Pause, Play, Square } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useExecutionStore } from "@/store/executionStore";

export default function ExecutionsPage() {
  const router = useRouter();
  const selectedExecutionId = router.query.execution;
  const {
    executions,
    timeline,
    listExecutions,
    loadTimeline,
    pauseExecution,
    resumeExecution,
    cancelExecution,
    isLoading
  } = useExecutionStore();
  const socket = useSocket();

  useEffect(() => {
    listExecutions().catch(() => {});
  }, [listExecutions]);

  useEffect(() => {
    if (selectedExecutionId) {
      loadTimeline(selectedExecutionId).catch(() => {});
    }
  }, [selectedExecutionId, loadTimeline]);

  useEffect(() => {
    if (!socket || !selectedExecutionId) {
      return undefined;
    }

    const handleEvent = () => {
      loadTimeline(selectedExecutionId).catch(() => {});
      listExecutions().catch(() => {});
    };

    socket.connect();
    socket.emit("execution:subscribe", selectedExecutionId);
    socket.on("execution:event", handleEvent);

    return () => {
      socket.emit("execution:unsubscribe", selectedExecutionId);
      socket.off("execution:event", handleEvent);
    };
  }, [socket, selectedExecutionId, loadTimeline, listExecutions]);

  return (
    <ProtectedRoute>
      <AppShell title="Executions">
        <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-base font-semibold text-ink">Execution History</h2>
            <div className="mt-5 space-y-3">
              {isLoading ? <p className="text-sm text-slate-500">Loading executions...</p> : null}
              {executions.length ? (
                executions.map((execution) => (
                  <article key={execution.id} className="rounded-md border border-line p-4">
                    <button
                      type="button"
                      onClick={() => router.push(`/executions?execution=${execution.id}`)}
                      className="block w-full text-left"
                    >
                      <p className="text-sm font-semibold text-ink">{execution.workflowSnapshot?.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {execution.status} - {new Date(execution.createdAt).toLocaleString()}
                      </p>
                    </button>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => pauseExecution(execution.id)}
                        className="grid h-8 w-8 place-items-center rounded-md border border-line text-slate-600"
                        title="Pause"
                      >
                        <Pause size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => resumeExecution(execution.id)}
                        className="grid h-8 w-8 place-items-center rounded-md border border-line text-slate-600"
                        title="Resume"
                      >
                        <Play size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelExecution(execution.id)}
                        className="grid h-8 w-8 place-items-center rounded-md border border-line text-slate-600"
                        title="Cancel"
                      >
                        <Square size={15} />
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-line p-8 text-center text-sm text-slate-500">
                  No executions yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-base font-semibold text-ink">Timeline</h2>
            <div className="mt-5 space-y-3">
              {timeline.length ? (
                timeline.map((event) => (
                  <article key={event.id} className="rounded-md border border-line p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-md bg-panel px-2 py-1 text-xs font-semibold text-accent">{event.agent}</span>
                      <span className="text-xs text-slate-500">{event.level}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-ink">{event.message}</p>
                    <p className="mt-1 text-xs text-slate-500">{event.eventType}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-line p-8 text-center text-sm text-slate-500">
                  Select an execution to view its timeline.
                </div>
              )}
            </div>
          </section>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
