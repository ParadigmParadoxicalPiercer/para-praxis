import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { workoutPlanController } from "../controllers/workout-plan.controller.js";
import { listTemplates, createFromTemplate } from "../controllers/workout-templates.controller.js";
import {
  createWorkoutPlanSchema,
  updateWorkoutPlanSchema,
  addExerciseToWorkoutPlanSchema,
} from "../validator/workout-plan.validator.js";

const router = express.Router();

// เส้นทางแผนออกกำลังกายทั้งหมดต้องการการเข้าสู่ระบบ
router.use(requireAuth);

// สร้างแผนออกกำลังกายใหม่
router.post(
  "/",
  validateBody(createWorkoutPlanSchema),
  workoutPlanController.createWorkoutPlan
);

// Templates
router.get("/templates", listTemplates);
router.post("/templates", createFromTemplate);

// ดูแผนออกกำลังกายทั้งหมดของผู้ใช้
router.get("/", workoutPlanController.getWorkoutPlans);

// ดูแผนออกกำลังกายแต่ละอัน
router.get("/:id", workoutPlanController.getWorkoutPlan);

// แก้ไขแผนออกกำลังกาย
router.put(
  "/:id",
  validateBody(updateWorkoutPlanSchema),
  workoutPlanController.updateWorkoutPlan
);

// ลบแผนออกกำลังกาย
router.delete("/:id", workoutPlanController.deleteWorkoutPlan);

// เพิ่มท่าออกกำลังกายเข้าแผน
router.post(
  "/:id/exercises",
  validateBody(addExerciseToWorkoutPlanSchema),
  workoutPlanController.addExerciseToWorkoutPlan
);

// ดูท่าออกกำลังกายในแผน
router.get("/:id/exercises", workoutPlanController.getWorkoutPlanExercises);

export default router;
