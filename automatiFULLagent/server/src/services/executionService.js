import mongoose from "mongoose";
import { Execution } from "../models/Execution.js";
import { ExecutionLog } from "../models/ExecutionLog.js";
import { Workflow } from "../models/Workflow.js";
import { emitExecutionEvent } from "../agents/monitoringAgent.js";
import { enqueueExecution } from "../queues/executionQueue.js";
import { ApiError } from "../utils/errors.js";

function assertObjectId(id, label = "Resource") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, `${label} not found`);
  }
}

export async function startWorkflowExecution(ownerId, workflowId, input = {}) {
  assertObjectId(workflowId, "Workflow");

  const workflow = await Workflow.findOne({ _id: workflowId, owner: ownerId });

  if (!workflow) {
    throw new ApiError(404, "Workflow not found");
  }

  const execution = await Execution.create({
    workflow: workflow._id,
    owner: ownerId,
    workflowSnapshot: workflow.toClientObject(),
    status: "PENDING",
    input
  });

  workflow.lastExecutionAt = new Date();
  await workflow.save();

  await enqueueExecution(execution._id);

  return execution.toClientObject();
}

export async function listExecutions(ownerId, query = {}) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
  const filter = { owner: ownerId };

  if (query.status) {
    filter.status = query.status;
  }

  const [items, total] = await Promise.all([
    Execution.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Execution.countDocuments(filter)
  ]);

  return {
    items: items.map((execution) => execution.toClientObject()),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    }
  };
}

export async function getExecution(ownerId, executionId) {
  assertObjectId(executionId, "Execution");

  const execution = await Execution.findOne({ _id: executionId, owner: ownerId });

  if (!execution) {
    throw new ApiError(404, "Execution not found");
  }

  return execution.toClientObject();
}

export async function getExecutionTimeline(ownerId, executionId) {
  await getExecution(ownerId, executionId);

  const logs = await ExecutionLog.find({ execution: executionId, owner: ownerId }).sort({ createdAt: 1 });
  return {
    items: logs.map((log) => log.toClientObject())
  };
}

export async function updateExecutionStatus(ownerId, executionId, nextStatus) {
  assertObjectId(executionId, "Execution");

  const execution = await Execution.findOne({ _id: executionId, owner: ownerId });

  if (!execution) {
    throw new ApiError(404, "Execution not found");
  }

  execution.status = nextStatus;
  await execution.save();

  await emitExecutionEvent(execution, {
    agent: "monitoring",
    level: nextStatus === "CANCELLED" ? "warning" : "info",
    eventType: `execution_${nextStatus.toLowerCase()}`,
    message: `Execution ${nextStatus.toLowerCase()}`
  });

  if (nextStatus === "RUNNING") {
    await enqueueExecution(execution._id);
  }

  return execution.toClientObject();
}
