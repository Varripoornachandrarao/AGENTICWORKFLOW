import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/register", authRateLimiter, registerValidator, validateRequest, register);
router.post("/login", authRateLimiter, loginValidator, validateRequest, login);
router.get("/me", requireAuth, me);

export default router;
