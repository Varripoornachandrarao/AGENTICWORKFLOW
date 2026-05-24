export async function validateNodeOutput(node, output) {
  if (!output || output.nodeId !== node.id) {
    return {
      valid: false,
      missingFields: ["nodeId"]
    };
  }

  return {
    valid: true,
    missingFields: []
  };
}
