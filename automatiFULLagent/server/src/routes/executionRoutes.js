import { Router } from "express";
import { cancel, index, pause, resume, show, timeline } from "../controllers/executionController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", index);
router.get("/:id", show);
router.get("/:id/timeline", timeline);
router.post("/:id/pause", pause);
router.post("/:id/resume", resume);
router.post("/:id/cancel", cancel);

export default router;
