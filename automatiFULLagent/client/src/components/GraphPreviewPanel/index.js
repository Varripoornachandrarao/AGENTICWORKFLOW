export default function GraphPreviewPanel({ workflow }) {
  return (
    <div className="border-b border-line bg-slate-50 px-4 py-3 text-sm text-slate-600">
      <span className="font-medium text-ink">{workflow.nodes.length}</span> nodes,
      {" "}
      <span className="font-medium text-ink">{workflow.edges.length}</span> edges
    </div>
  );
}
