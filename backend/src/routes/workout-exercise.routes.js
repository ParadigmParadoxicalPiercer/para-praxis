import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { workoutExerciseController } from "../controllers/workout-exercise.controller.js";
import {
  createWorkoutExerciseSchema,
  updateWorkoutExerciseSchema,
} from "../validator/workout-exercise.validator.js";

const router = express.Router();

// เส้นทางท่าออกกำลังกายทั้งหมดต้องการการเข้าสู่ระบบ
router.use(requireAuth);

// สร้างท่าออกกำลังกายใหม่
router.post(
  "/",
  validateBody(createWorkoutExerciseSchema),
  workoutExerciseController.createWorkoutExercise
);

// ดูท่าออกกำลังกายทั้งหมดของผู้ใช้
router.get("/", workoutExerciseController.getWorkoutExercises);

// ดูท่าออกกำลังกายแต่ละอัน
router.get("/:id", workoutExerciseController.getWorkoutExercise);

// แก้ไขท่าออกกำลังกาย
router.put(
  "/:id",
  validateBody(updateWorkoutExerciseSchema),
  workoutExerciseController.updateWorkoutExercise
);

// ลบท่าออกกำลังกาย
router.delete("/:id", workoutExerciseController.deleteWorkoutExercise);

// ทำเครื่องหมายท่าออกกำลังกายเป็นเสร็จแล้ว
router.patch("/:id/complete", workoutExerciseController.markExerciseComplete);

// ทำเครื่องหมายท่าออกกำลังกายเป็นยังไม่เสร็จ
router.patch(
  "/:id/incomplete",
  workoutExerciseController.markExerciseIncomplete
);

export default router;
