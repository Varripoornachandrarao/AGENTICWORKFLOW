import { Integration } from "../models/Integration.js";

const INTEGRATION_NODE_TYPES = new Set(["gmailSend", "gmailRead", "slackPost", "discordPost", "sheetsAppend", "sheetsRead"]);

const NODE_PROVIDER = {
  gmailSend: "gmail",
  gmailRead: "gmail",
  slackPost: "slack",
  discordPost: "discord",
  sheetsAppend: "google-sheets",
  sheetsRead: "google-sheets"
};

export async function executeWorkflowNode(node, context) {
  const nodeType = node.data?.nodeType || "unknown";

  if (INTEGRATION_NODE_TYPES.has(nodeType)) {
    const provider = NODE_PROVIDER[nodeType];
    const integration = await Integration.findOne({ owner: context.ownerId, provider });

    if (!integration || integration.status !== "connected") {
      throw new Error(`INTEGRATION_NOT_CONNECTED: ${provider}`);
    }

    if (integration.expiresAt && integration.expiresAt.getTime() < Date.now()) {
      throw new Error(`AUTH_EXPIRED: ${provider}`);
    }

    return {
      nodeId: node.id,
      nodeType,
      provider,
      status: "simulated",
      message: "Provider credential is connected; live provider action adapter is ready for implementation"
    };
  }

  if (nodeType === "condition") {
    return {
      nodeId: node.id,
      nodeType,
      branch: "true",
      inputKeys: Object.keys(context.output || {})
    };
  }

  return {
    nodeId: node.id,
    nodeType,
    result: node.data?.config?.instruction || node.data?.config?.note || "Node completed"
  };
}
