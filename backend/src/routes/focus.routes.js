import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { focusController } from "../controllers/focus.controller.js";
import * as focusValidation from "../validator/focus.validator.js";

const router = express.Router();

// All focus routes require authentication
router.use(requireAuth);

// Focus session routes
router.post(
  "/",
  validateBody(focusValidation.createFocusSchema),
  focusController.createFocusSession
);
router.get("/", focusController.getFocusSessions);
router.get("/stats", focusController.getFocusStats);

export default router;
