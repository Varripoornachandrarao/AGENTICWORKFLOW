export async function planWorkflow(workflowSnapshot) {
  const nodes = workflowSnapshot.nodes || [];

  return {
    orderedNodeIds: nodes.map((node) => node.id),
    confidence: nodes.length > 0 ? 0.86 : 0.2
  };
}
