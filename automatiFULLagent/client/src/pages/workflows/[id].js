import AppShell from "@/components/AppShell";
import NodeConfigPanel from "@/components/NodeConfigPanel";
import NodePalette from "@/components/NodePalette";
import ProtectedRoute from "@/components/ProtectedRoute";
import WorkflowCanvas from "@/components/WorkflowCanvas";
import WorkflowToolbar from "@/components/WorkflowToolbar";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { useExecutionStore } from "@/store/executionStore";
import { makeNodeFromCatalogItem } from "@/utils/workflowNodes";

export default function WorkflowEditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const { currentWorkflow, loadWorkflow, updateWorkflow, isLoading } = useWorkflowStore();
  const { executeWorkflow, isLoading: isExecuting } = useExecutionStore();
  const [workflow, setWorkflow] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (id) {
      loadWorkflow(id).catch(() => {});
    }
  }, [id, loadWorkflow]);

  useEffect(() => {
    if (currentWorkflow?.id === id) {
      setWorkflow(currentWorkflow);
    }
  }, [currentWorkflow, id]);

  const handleGraphChange = useCallback((nodes, edges) => {
    setWorkflow((current) => (current ? { ...current, nodes, edges } : current));
  }, []);

  const handleAddNode = (item) => {
    setWorkflow((current) => ({
      ...current,
      nodes: [...current.nodes, makeNodeFromCatalogItem(item, current.nodes.length)]
    }));
  };

  const handleChangeNode = (node) => {
    setWorkflow((current) => ({
      ...current,
      nodes: current.nodes.map((item) => (item.id === node.id ? node : item))
    }));
    setSelectedNode(node);
  };

  const handleSave = async () => {
    await updateWorkflow(id, workflow);
  };

  const handleExecute = async () => {
    const execution = await executeWorkflow(id, {});
    router.push(`/executions?execution=${execution.id}`);
  };

  return (
    <ProtectedRoute>
      <AppShell title="Workflow Editor">
        {!workflow ? (
          <div className="rounded-lg border border-line bg-white p-8 text-center text-sm text-slate-500">
            Loading workflow...
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <WorkflowToolbar
              workflow={workflow}
              onMetadataChange={(patch) => setWorkflow((current) => ({ ...current, ...patch }))}
              onSave={handleSave}
              isSaving={isLoading}
              onExecute={handleExecute}
              isExecuting={isExecuting}
            />
            <div className="flex flex-col lg:flex-row">
              <NodePalette onAddNode={handleAddNode} />
              <WorkflowCanvas
                nodes={workflow.nodes}
                edges={workflow.edges}
                onGraphChange={handleGraphChange}
                onSelectNode={setSelectedNode}
              />
              <NodeConfigPanel selectedNode={selectedNode} onChangeNode={handleChangeNode} />
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
