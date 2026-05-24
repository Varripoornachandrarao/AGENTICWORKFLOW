import { Router } from "express";
import { index } from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", index);

export default router;
