import mongoose from "mongoose";
import { Execution } from "../models/Execution.js";
import { Workflow } from "../models/Workflow.js";
import { ApiError } from "../utils/errors.js";

function assertObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Workflow not found");
  }
}

function normalizeWorkflowPayload(payload) {
  return {
    name: payload.name,
    description: payload.description || "",
    status: payload.status || "draft",
    trigger: payload.trigger || {},
    nodes: payload.nodes || [],
    edges: payload.edges || [],
    tags: payload.tags || []
  };
}

export async function getDashboardMetrics(ownerId) {
  const [totalWorkflows, activeWorkflows, recentWorkflows, totalExecutions, activeExecutions, completedExecutions] =
    await Promise.all([
      Workflow.countDocuments({ owner: ownerId }),
      Workflow.countDocuments({ owner: ownerId, status: "active" }),
      Workflow.find({ owner: ownerId }).sort({ updatedAt: -1 }).limit(5),
      Execution.countDocuments({ owner: ownerId }),
      Execution.countDocuments({ owner: ownerId, status: { $in: ["PENDING", "RUNNING", "RETRYING", "PAUSED"] } }),
      Execution.countDocuments({ owner: ownerId, status: "COMPLETED" })
    ]);

  return {
    totalWorkflows,
    activeWorkflows,
    executions: {
      total: totalExecutions,
      active: activeExecutions,
      successRate: totalExecutions ? Math.round((completedExecutions / totalExecutions) * 100) : null
    },
    recentWorkflows: recentWorkflows.map((workflow) => workflow.toClientObject()),
    aiActivity: []
  };
}

export async function listWorkflows(ownerId, query = {}) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
  const filter = { owner: ownerId };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const [items, total] = await Promise.all([
    Workflow.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Workflow.countDocuments(filter)
  ]);

  return {
    items: items.map((workflow) => workflow.toClientObject()),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    }
  };
}

export async function createWorkflow(ownerId, payload) {
  const workflow = await Workflow.create({
    ...normalizeWorkflowPayload(payload),
    owner: ownerId
  });

  return workflow.toClientObject();
}

export async function getWorkflow(ownerId, workflowId) {
  assertObjectId(workflowId);

  const workflow = await Workflow.findOne({ _id: workflowId, owner: ownerId });

  if (!workflow) {
    throw new ApiError(404, "Workflow not found");
  }

  return workflow.toClientObject();
}

export async function updateWorkflow(ownerId, workflowId, payload) {
  assertObjectId(workflowId);

  const workflow = await Workflow.findOne({ _id: workflowId, owner: ownerId });

  if (!workflow) {
    throw new ApiError(404, "Workflow not found");
  }

  const next = normalizeWorkflowPayload({ ...workflow.toObject(), ...payload });

  workflow.set({
    ...next,
    version: workflow.version + 1
  });

  await workflow.save();
  return workflow.toClientObject();
}

export async function duplicateWorkflow(ownerId, workflowId) {
  const source = await getWorkflow(ownerId, workflowId);

  const workflow = await Workflow.create({
    name: `${source.name} Copy`,
    description: source.description,
    owner: ownerId,
    status: "draft",
    trigger: source.trigger,
    nodes: source.nodes,
    edges: source.edges,
    tags: source.tags,
    version: 1
  });

  return workflow.toClientObject();
}

export async function deleteWorkflow(ownerId, workflowId) {
  assertObjectId(workflowId);

  const deleted = await Workflow.findOneAndDelete({ _id: workflowId, owner: ownerId });

  if (!deleted) {
    throw new ApiError(404, "Workflow not found");
  }

  return { id: workflowId };
}
