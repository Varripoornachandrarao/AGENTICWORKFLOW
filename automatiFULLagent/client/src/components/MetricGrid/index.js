export default function MetricGrid({ dashboard }) {
  const metrics = [
    { label: "Total Workflows", value: dashboard?.totalWorkflows ?? 0, detail: "Saved automations" },
    { label: "Active Workflows", value: dashboard?.activeWorkflows ?? 0, detail: "Ready to execute" },
    { label: "Active Runs", value: dashboard?.executions?.active ?? 0, detail: "Execution engine pending" },
    {
      label: "Success Rate",
      value: dashboard?.executions?.successRate ? `${dashboard.executions.successRate}%` : "--",
      detail: "No completed runs yet"
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-lg border border-line bg-white p-5">
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{metric.value}</p>
          <p className="mt-2 text-sm text-slate-500">{metric.detail}</p>
        </article>
      ))}
    </section>
  );
}
