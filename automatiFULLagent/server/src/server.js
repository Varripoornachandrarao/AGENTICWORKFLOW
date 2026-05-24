import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { registerSocketServer } from "./config/socket.js";
import { getExecutionQueueStatus, startExecutionWorker } from "./queues/executionQueue.js";
import { logger } from "./utils/logger.js";

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  registerSocketServer(io);
  startExecutionWorker();

  httpServer.listen(env.port, () => {
    logger.info(`Agentflow_AI API listening on http://localhost:${env.port}`);
    logger.info(`Execution queue mode: ${getExecutionQueueStatus()}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start API server", error);
  process.exit(1);
});
