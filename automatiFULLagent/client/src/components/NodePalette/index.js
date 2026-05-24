import { Plus } from "lucide-react";
import { nodeCatalog } from "@/utils/workflowNodes";

export default function NodePalette({ onAddNode }) {
  const groups = nodeCatalog.reduce((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <aside className="w-full border-b border-line bg-white p-4 lg:w-72 lg:border-b-0 lg:border-r">
      <h2 className="text-sm font-semibold text-ink">Node Palette</h2>
      <div className="mt-4 space-y-5">
        {Object.entries(groups).map(([group, items]) => (
          <section key={group}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group}</p>
            <div className="mt-2 space-y-2">
              {items.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => onAddNode(item)}
                  className="flex w-full items-start gap-3 rounded-md border border-line px-3 py-3 text-left hover:border-accent hover:bg-teal-50"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-panel text-accent">
                    <Plus size={15} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
