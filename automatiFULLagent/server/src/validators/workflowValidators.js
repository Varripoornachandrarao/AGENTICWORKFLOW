import { body, query } from "express-validator";

export const listWorkflowValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("status").optional().isIn(["draft", "active", "paused", "archived"]).withMessage("Invalid workflow status"),
  query("search").optional().trim().isLength({ max: 120 }).withMessage("Search must be shorter than 120 characters")
];

export const workflowPayloadValidator = [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Name must be between 2 and 120 characters"),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description is too long"),
  body("status").optional().isIn(["draft", "active", "paused", "archived"]).withMessage("Invalid workflow status"),
  body("trigger").optional().isObject().withMessage("Trigger must be an object"),
  body("nodes").optional().isArray().withMessage("Nodes must be an array"),
  body("edges").optional().isArray().withMessage("Edges must be an array"),
  body("tags").optional().isArray().withMessage("Tags must be an array")
];

export const generateWorkflowValidator = [
  body("prompt").trim().isLength({ min: 8, max: 4000 }).withMessage("Prompt must be between 8 and 4000 characters")
];
