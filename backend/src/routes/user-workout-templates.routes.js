import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { userTemplatesController } from "../controllers/user-workout-templates.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", userTemplatesController.list);
router.post("/", userTemplatesController.create);
router.post("/:id/exercises", userTemplatesController.addExercise);
router.delete("/:id", userTemplatesController.remove);

export default router;
