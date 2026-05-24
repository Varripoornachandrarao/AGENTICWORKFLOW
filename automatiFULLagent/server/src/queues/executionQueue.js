import { Queue, Worker } from "bullmq";
import { getRedisConnection } from "../config/redis.js";
import { runExecution } from "../agents/orchestrator.js";
import { logger } from "../utils/logger.js";

let queue;
let worker;

export function getExecutionQueueStatus() {
  return getRedisConnection() ? "bullmq" : "in-memory";
}

export async function enqueueExecution(executionId) {
  const connection = getRedisConnection();

  if (!connection) {
    setTimeout(() => {
      runExecution(executionId).catch((error) => logger.error("In-memory execution failed", error));
    }, 0);
    return { mode: "in-memory" };
  }

  queue = queue || new Queue("workflow-executions", { connection });
  await queue.add(
    "run",
    { executionId: executionId.toString() },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000
      },
      removeOnComplete: 100,
      removeOnFail: 250
    }
  );

  return { mode: "bullmq" };
}

export function startExecutionWorker() {
  const connection = getRedisConnection();

  if (!connection || worker) {
    return;
  }

  worker = new Worker(
    "workflow-executions",
    async (job) => {
      await runExecution(job.data.executionId);
    },
    { connection }
  );

  worker.on("failed", (job, error) => {
    logger.error(`Execution job ${job?.id} failed`, error);
  });
}
