import { getSocketServer } from "../config/socket.js";
import { ExecutionLog } from "../models/ExecutionLog.js";

export async function emitExecutionEvent(execution, event) {
  const log = await ExecutionLog.create({
    execution: execution._id,
    workflow: execution.workflow,
    owner: execution.owner,
    nodeId: event.nodeId,
    agent: event.agent,
    level: event.level || "info",
    eventType: event.eventType,
    message: event.message,
    metadata: event.metadata || {}
  });

  const payload = log.toClientObject();
  getSocketServer()?.to(`execution:${execution._id.toString()}`).emit("execution:event", payload);
  return payload;
}
