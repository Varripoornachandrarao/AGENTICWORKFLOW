import { Router } from "express";
import {
  index,
  oauthCallback,
  oauthError,
  oauthStart,
  oauthSuccess,
  status,
  upsert
} from "../controllers/integrationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/oauth/:provider/callback", oauthCallback);
router.get("/oauth/success", oauthSuccess);
router.get("/oauth/error", oauthError);

router.use(requireAuth);

router.get("/", index);
router.get("/status", status);
router.get("/oauth/:provider/start", oauthStart);
router.post("/", upsert);

export default router;
