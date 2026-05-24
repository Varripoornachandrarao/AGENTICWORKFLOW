import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env, isProduction } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import executionRoutes from "./routes/executionRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import { errorHandler, routeNotFound } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(isProduction ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "agentflow-ai-api",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/workflows", workflowRoutes);
  app.use("/api/executions", executionRoutes);
  app.use("/api/integrations", integrationRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use(routeNotFound);
  app.use(errorHandler);

  return app;
}
