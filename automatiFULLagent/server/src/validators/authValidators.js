import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be between 2 and 80 characters"),
  body("email").trim().isEmail().normalizeEmail().withMessage("A valid email is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role").optional().isIn(["admin", "operator"]).withMessage("Role must be admin or operator")
];

export const loginValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];
