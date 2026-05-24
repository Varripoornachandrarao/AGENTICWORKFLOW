import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const SYSTEM_PROMPT = `Return only valid JSON for a React Flow workflow.
Shape: {"name":string,"description":string,"status":"draft","trigger":object,"nodes":array,"edges":array,"tags":array}.
Each node must include id, type:"default", position:{x:number,y:number}, data:{label:string,nodeType:string,config:object}.
Common nodeType values: manualTrigger, gmailSend, gmailRead, slackPost, discordPost, sheetsAppend, sheetsRead, aiTask, condition.`;

export async function generateWorkflowFromPrompt(prompt) {
  if (env.openRouterApiKey) {
    const generated = await tryOpenRouter(prompt);
    if (generated) {
      return { provider: "openrouter", workflow: generated };
    }
  }

  if (env.geminiApiKey) {
    const generated = await tryGemini(prompt);
    if (generated) {
      return { provider: "gemini", workflow: generated };
    }
  }

  return {
    provider: "deterministic",
    workflow: buildDeterministicWorkflow(prompt)
  };
}

async function tryOpenRouter(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openRouterApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.openRouterModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return parseWorkflowJson(data.choices?.[0]?.message?.content);
  } catch {
    return null;
  }
}

async function tryGemini(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(env.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: env.geminiModel });
    const response = await model.generateContent(`${SYSTEM_PROMPT}\n\nPrompt: ${prompt}`);
    return parseWorkflowJson(response.response.text());
  } catch {
    return null;
  }
}

function parseWorkflowJson(content) {
  if (!content) {
    return null;
  }

  const cleaned = content.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned);
  return normalizeGeneratedWorkflow(parsed);
}

function normalizeGeneratedWorkflow(workflow) {
  return {
    name: workflow.name || "Generated Workflow",
    description: workflow.description || "Generated from an automation prompt.",
    status: "draft",
    trigger: workflow.trigger || { type: "manual" },
    nodes: Array.isArray(workflow.nodes) ? workflow.nodes : [],
    edges: Array.isArray(workflow.edges) ? workflow.edges : [],
    tags: Array.isArray(workflow.tags) ? workflow.tags : ["ai-generated"]
  };
}

function buildDeterministicWorkflow(prompt) {
  const text = prompt.toLowerCase();
  const nodes = [
    makeNode("manual-trigger", "Manual Trigger", "manualTrigger", 80, 160, {
      prompt
    })
  ];
  const edges = [];

  const add = (id, label, nodeType, config = {}) => {
    const index = nodes.length;
    nodes.push(makeNode(id, label, nodeType, 80 + index * 230, 160, config));
    edges.push({
      id: `edge-${nodes[index - 1].id}-${id}`,
      source: nodes[index - 1].id,
      target: id,
      animated: true
    });
  };

  if (text.includes("email") || text.includes("gmail") || text.includes("invoice")) {
    add("read-gmail", "Read Gmail", "gmailRead", { query: text.includes("invoice") ? "invoice" : "" });
  }

  if (text.includes("extract") || text.includes("summarize") || text.includes("classify") || text.includes("invoice")) {
    add("ai-task", "AI Analysis", "aiTask", {
      instruction: text.includes("invoice") ? "Extract invoice fields and detect missing data." : prompt
    });
  }

  if (text.includes("sheet") || text.includes("spreadsheet") || text.includes("row")) {
    add("append-sheet", "Append Sheet Row", "sheetsAppend", { spreadsheetId: "", range: "Sheet1!A:D" });
  }

  if (text.includes("slack")) {
    add("post-slack", "Post Slack Message", "slackPost", { channel: "", message: "Workflow completed." });
  }

  if (text.includes("discord")) {
    add("post-discord", "Post Discord Message", "discordPost", { channelId: "", message: "Workflow completed." });
  }

  if (text.includes("send") && (text.includes("email") || text.includes("gmail"))) {
    add("send-gmail", "Send Gmail", "gmailSend", { to: "", subject: "Automation update", body: "" });
  }

  if (nodes.length === 1) {
    add("ai-task", "AI Task", "aiTask", { instruction: prompt });
  }

  return {
    name: nameFromPrompt(prompt),
    description: prompt,
    status: "draft",
    trigger: { type: "manual" },
    nodes,
    edges,
    tags: ["ai-generated", "deterministic"]
  };
}

function makeNode(id, label, nodeType, x, y, config) {
  return {
    id,
    type: "default",
    position: { x, y },
    data: {
      label,
      nodeType,
      config
    }
  };
}

function nameFromPrompt(prompt) {
  const words = prompt
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .join(" ");

  return words ? `${words[0].toUpperCase()}${words.slice(1)} Workflow` : "Generated Workflow";
}
