export default function NodeConfigPanel({ selectedNode, onChangeNode }) {
  if (!selectedNode) {
    return (
      <aside className="w-full border-t border-line bg-white p-4 lg:w-80 lg:border-l lg:border-t-0">
        <h2 className="text-sm font-semibold text-ink">Configuration</h2>
        <p className="mt-3 text-sm text-slate-500">Select a node to edit its label and configuration.</p>
      </aside>
    );
  }

  const updateLabel = (label) => {
    onChangeNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label
      }
    });
  };

  const updateConfig = (value) => {
    onChangeNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        config: {
          ...selectedNode.data.config,
          note: value
        }
      }
    });
  };

  return (
    <aside className="w-full border-t border-line bg-white p-4 lg:w-80 lg:border-l lg:border-t-0">
      <h2 className="text-sm font-semibold text-ink">Configuration</h2>
      <p className="mt-1 text-xs text-slate-500">{selectedNode.data?.nodeType}</p>

      <label className="mt-5 block text-sm font-medium text-ink" htmlFor="node-label">
        Label
      </label>
      <input
        id="node-label"
        value={selectedNode.data?.label || ""}
        onChange={(event) => updateLabel(event.target.value)}
        className="mt-2 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
      />

      <label className="mt-4 block text-sm font-medium text-ink" htmlFor="node-note">
        Config Note
      </label>
      <textarea
        id="node-note"
        value={selectedNode.data?.config?.note || ""}
        onChange={(event) => updateConfig(event.target.value)}
        rows={5}
        className="mt-2 w-full resize-none rounded-md border border-line px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
      />
    </aside>
  );
}
