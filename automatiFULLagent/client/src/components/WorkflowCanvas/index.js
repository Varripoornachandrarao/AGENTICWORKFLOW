import { Background, Controls, MiniMap, ReactFlow, addEdge, useEdgesState, useNodesState } from "@xyflow/react";
import { useEffect } from "react";

export default function WorkflowCanvas({ nodes, edges, onGraphChange, onSelectNode }) {
  const [localNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  useEffect(() => {
    onGraphChange(localNodes, localEdges);
  }, [localNodes, localEdges, onGraphChange]);

  const handleConnect = (connection) => {
    setEdges((current) => addEdge({ ...connection, animated: true }, current));
  };

  return (
    <div className="h-[620px] min-h-[480px] flex-1 bg-slate-50">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={(_event, node) => onSelectNode(node)}
        onPaneClick={() => onSelectNode(null)}
        fitView
      >
        <Background />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
}
