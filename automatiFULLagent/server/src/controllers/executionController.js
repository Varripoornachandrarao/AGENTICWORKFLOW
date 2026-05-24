import {
  getExecution,
  getExecutionTimeline,
  listExecutions,
  updateExecutionStatus
} from "../services/executionService.js";

export async function index(req, res, next) {
  try {
    res.json(await listExecutions(req.user.id, req.query));
  } catch (error) {
    next(error);
  }
}

export async function show(req, res, next) {
  try {
    res.json({ execution: await getExecution(req.user.id, req.params.id) });
  } catch (error) {
    next(error);
  }
}

export async function timeline(req, res, next) {
  try {
    res.json(await getExecutionTimeline(req.user.id, req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function pause(req, res, next) {
  try {
    res.json({ execution: await updateExecutionStatus(req.user.id, req.params.id, "PAUSED") });
  } catch (error) {
    next(error);
  }
}

export async function resume(req, res, next) {
  try {
    res.json({ execution: await updateExecutionStatus(req.user.id, req.params.id, "RUNNING") });
  } catch (error) {
    next(error);
  }
}

export async function cancel(req, res, next) {
  try {
    res.json({ execution: await updateExecutionStatus(req.user.id, req.params.id, "CANCELLED") });
  } catch (error) {
    next(error);
  }
}
