export const nodeCatalog = [
  {
    type: "manualTrigger",
    group: "Triggers",
    label: "Manual Trigger",
    description: "Starts a workflow on demand"
  },
  {
    type: "gmailSend",
    group: "Actions",
    label: "Send Gmail",
    description: "Sends an email through Gmail"
  },
  {
    type: "slackPost",
    group: "Actions",
    label: "Slack Message",
    description: "Posts a message to Slack"
  },
  {
    type: "discordPost",
    group: "Actions",
    label: "Discord Message",
    description: "Posts a message to Discord"
  },
  {
    type: "sheetsAppend",
    group: "Actions",
    label: "Append Sheet Row",
    description: "Adds a row to Google Sheets"
  },
  {
    type: "aiTask",
    group: "AI Nodes",
    label: "AI Task",
    description: "Runs model reasoning over input"
  },
  {
    type: "condition",
    group: "Logic",
    label: "Condition",
    description: "Branches based on a rule"
  }
];

export function createDefaultWorkflow() {
  return {
    name: "Untitled Workflow",
    description: "",
    status: "draft",
    trigger: { type: "manual" },
    nodes: [
      {
        id: "manual-trigger",
        type: "default",
        position: { x: 120, y: 120 },
        data: {
          label: "Manual Trigger",
          nodeType: "manualTrigger",
          config: {}
        }
      }
    ],
    edges: [],
    tags: []
  };
}

export function makeNodeFromCatalogItem(item, index = 0) {
  return {
    id: `${item.type}-${Date.now()}`,
    type: "default",
    position: { x: 280 + index * 40, y: 160 + index * 32 },
    data: {
      label: item.label,
      nodeType: item.type,
      config: {}
    }
  };
}
