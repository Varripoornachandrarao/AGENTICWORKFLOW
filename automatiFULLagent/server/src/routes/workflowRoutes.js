import { Router } from "express";
import {
  create,
  dashboard,
  destroy,
  duplicate,
  execute,
  generate,
  index,
  show,
  update
} from "../controllers/workflowController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  generateWorkflowValidator,
  listWorkflowValidator,
  workflowPayloadValidator
} from "../validators/workflowValidators.js";

const router = Router();

router.use(requireAuth);

router.get("/dashboard", dashboard);
router.get("/", listWorkflowValidator, validateRequest, index);
router.post("/", workflowPayloadValidator, validateRequest, create);
router.post("/generate", generateWorkflowValidator, validateRequest, generate);
router.get("/:id", show);
router.put("/:id", workflowPayloadValidator, validateRequest, update);
router.post("/:id/duplicate", duplicate);
router.post("/:id/execute", execute);
router.delete("/:id", destroy);

export default router;
