import AppShell from "@/components/AppShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import NodeConfigPanel from "@/components/NodeConfigPanel";
import NodePalette from "@/components/NodePalette";
import GraphPreviewPanel from "@/components/GraphPreviewPanel";
import PromptInputPanel from "@/components/PromptInputPanel";
import WorkflowCanvas from "@/components/WorkflowCanvas";
import WorkflowToolbar from "@/components/WorkflowToolbar";
import { useWorkflowStore } from "@/store/workflowStore";
import { createDefaultWorkflow, makeNodeFromCatalogItem } from "@/utils/workflowNodes";

export default function WorkflowBuilderPage() {
  const router = useRouter();
  const { createWorkflow, generateWorkflow, isLoading } = useWorkflowStore();
  const [workflow, setWorkflow] = useState(createDefaultWorkflow);
  const [selectedNode, setSelectedNode] = useState(null);
  const [provider, setProvider] = useState("");

  const handleAddNode = (item) => {
    setWorkflow((current) => ({
      ...current,
      nodes: [...current.nodes, makeNodeFromCatalogItem(item, current.nodes.length)]
    }));
  };

  const handleGraphChange = useCallback((nodes, edges) => {
    setWorkflow((current) => ({ ...current, nodes, edges }));
  }, []);

  const handleChangeNode = (node) => {
    setWorkflow((current) => ({
      ...current,
      nodes: current.nodes.map((item) => (item.id === node.id ? node : item))
    }));
    setSelectedNode(node);
  };

  const handleSave = async () => {
    const saved = await createWorkflow(workflow);
    router.replace(`/workflows/${saved.id}`);
  };

  const handleGenerate = async (prompt) => {
    const result = await generateWorkflow(prompt);
    setWorkflow(result.workflow);
    setProvider(result.provider);
    setSelectedNode(null);
  };

  return (
    <ProtectedRoute>
      <AppShell title="AI Workflow Builder">
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <PromptInputPanel onGenerate={handleGenerate} isLoading={isLoading} provider={provider} />
          <GraphPreviewPanel workflow={workflow} />
          <WorkflowToolbar
            workflow={workflow}
            onMetadataChange={(patch) => setWorkflow((current) => ({ ...current, ...patch }))}
            onSave={handleSave}
            isSaving={isLoading}
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
      </AppShell>
    </ProtectedRoute>
  );
}
