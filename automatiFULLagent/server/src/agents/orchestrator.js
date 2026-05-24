import { Execution } from "../models/Execution.js";
import { createNotification } from "../services/notificationService.js";
import { executeWorkflowNode } from "./executionAgent.js";
import { emitExecutionEvent } from "./monitoringAgent.js";
import { planWorkflow } from "./plannerAgent.js";
import { classifyFailure } from "./recoveryAgent.js";
import { validateNodeOutput } from "./validationAgent.js";

export async function getLangGraphStatus() {
  try {
    await import("@langchain/langgraph");
    return "available";
  } catch {
    return "not-installed";
  }
}

export async function runExecution(executionId) {
  const execution = await Execution.findById(executionId);

  if (!execution || ["CANCELLED", "PAUSED"].includes(execution.status)) {
    return;
  }

  const startedAt = new Date();
  execution.status = "RUNNING";
  execution.startedAt = startedAt;
  await execution.save();

  try {
    const langGraph = await getLangGraphStatus();
    await emitExecutionEvent(execution, {
      agent: "monitoring",
      level: "info",
      eventType: "execution_started",
      message: "Execution started",
      metadata: { langGraph }
    });

    const plan = await planWorkflow(execution.workflowSnapshot);
    await emitExecutionEvent(execution, {
      agent: "planner",
      level: "success",
      eventType: "plan_created",
      message: "Planner created node order",
      metadata: plan
    });

    const nodeById = new Map((execution.workflowSnapshot.nodes || []).map((node) => [node.id, node]));
    const output = {};

    for (const nodeId of plan.orderedNodeIds) {
      const latest = await Execution.findById(executionId);

      if (!latest || ["CANCELLED", "PAUSED"].includes(latest.status)) {
        await emitExecutionEvent(execution, {
          agent: "monitoring",
          level: "warning",
          eventType: "execution_interrupted",
          message: `Execution ${latest?.status?.toLowerCase() || "stopped"}`
        });
        return;
      }

      const node = nodeById.get(nodeId);
      execution.currentNodeId = nodeId;
      await execution.save();

      await emitExecutionEvent(execution, {
        agent: "execution",
        nodeId,
        level: "info",
        eventType: "node_started",
        message: `Running ${node?.data?.label || nodeId}`
      });

      const nodeOutput = await executeWorkflowNode(node, { output, ownerId: execution.owner });
      output[nodeId] = nodeOutput;

      await emitExecutionEvent(execution, {
        agent: "execution",
        nodeId,
        level: "success",
        eventType: "node_completed",
        message: `${node?.data?.label || nodeId} completed`,
        metadata: nodeOutput
      });

      const validation = await validateNodeOutput(node, nodeOutput);
      await emitExecutionEvent(execution, {
        agent: "validation",
        nodeId,
        level: validation.valid ? "success" : "error",
        eventType: "node_validated",
        message: validation.valid ? "Output validation passed" : "Output validation failed",
        metadata: validation
      });

      if (!validation.valid) {
        throw new Error(`MISSING_FIELDS: ${validation.missingFields.join(", ")}`);
      }
    }

    execution.status = "COMPLETED";
    execution.output = output;
    execution.completedAt = new Date();
    execution.durationMs = execution.completedAt.getTime() - startedAt.getTime();
    await execution.save();

    await emitExecutionEvent(execution, {
      agent: "monitoring",
      level: "success",
      eventType: "execution_completed",
      message: "Execution completed",
      metadata: { durationMs: execution.durationMs }
    });

    await createNotification({
      owner: execution.owner,
      workflow: execution.workflow,
      execution: execution._id,
      type: "success",
      title: "Workflow completed",
      message: execution.workflowSnapshot.name
    });
  } catch (error) {
    const recovery = classifyFailure(error);
    execution.status = "FAILED";
    execution.error = {
      message: error.message,
      ...recovery
    };
    execution.completedAt = new Date();
    execution.durationMs = execution.completedAt.getTime() - startedAt.getTime();
    await execution.save();

    await emitExecutionEvent(execution, {
      agent: "recovery",
      level: "error",
      eventType: "execution_failed",
      message: error.message,
      metadata: recovery
    });

    await createNotification({
      owner: execution.owner,
      workflow: execution.workflow,
      execution: execution._id,
      type: recovery.action === "escalate" ? "escalation" : "failure",
      title: "Workflow failed",
      message: error.message
    });
  }
}
