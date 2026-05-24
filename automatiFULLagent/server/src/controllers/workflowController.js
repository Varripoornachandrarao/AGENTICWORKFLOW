import {
  createWorkflow,
  deleteWorkflow,
  duplicateWorkflow,
  getDashboardMetrics,
  getWorkflow,
  listWorkflows,
  updateWorkflow
} from "../services/workflowService.js";
import { generateWorkflowFromPrompt } from "../services/aiGenerationService.js";
import { startWorkflowExecution } from "../services/executionService.js";

export async function dashboard(req, res, next) {
  try {
    res.json(await getDashboardMetrics(req.user.id));
  } catch (error) {
    next(error);
  }
}

export async function index(req, res, next) {
  try {
    res.json(await listWorkflows(req.user.id, req.query));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    res.status(201).json({ workflow: await createWorkflow(req.user.id, req.body) });
  } catch (error) {
    next(error);
  }
}

export async function generate(req, res, next) {
  try {
    res.json(await generateWorkflowFromPrompt(req.body.prompt));
  } catch (error) {
    next(error);
  }
}

export async function show(req, res, next) {
  try {
    res.json({ workflow: await getWorkflow(req.user.id, req.params.id) });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    res.json({ workflow: await updateWorkflow(req.user.id, req.params.id, req.body) });
  } catch (error) {
    next(error);
  }
}

export async function duplicate(req, res, next) {
  try {
    res.status(201).json({ workflow: await duplicateWorkflow(req.user.id, req.params.id) });
  } catch (error) {
    next(error);
  }
}

export async function execute(req, res, next) {
  try {
    res.status(202).json({ execution: await startWorkflowExecution(req.user.id, req.params.id, req.body?.input || {}) });
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    res.json(await deleteWorkflow(req.user.id, req.params.id));
  } catch (error) {
    next(error);
  }
}
