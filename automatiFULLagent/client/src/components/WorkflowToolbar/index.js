import { Play, Save } from "lucide-react";

export default function WorkflowToolbar({ workflow, onMetadataChange, onSave, onExecute, isSaving, isExecuting }) {
  return (
    <div className="border-b border-line bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
        <input
          value={workflow.name}
          onChange={(event) => onMetadataChange({ name: event.target.value })}
          className="rounded-md border border-line px-3 py-2 text-sm font-medium outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
          aria-label="Workflow name"
        />
        <input
          value={workflow.description || ""}
          onChange={(event) => onMetadataChange({ description: event.target.value })}
          className="rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
          aria-label="Workflow description"
          placeholder="Description"
        />
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Save size={16} />
          {isSaving ? "Saving" : "Save"}
        </button>
        <button
          type="button"
          onClick={onExecute}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-600"
          disabled={!onExecute || isExecuting}
        >
          <Play size={16} />
          {isExecuting ? "Running" : "Execute"}
        </button>
      </div>
    </div>
  );
}
