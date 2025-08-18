import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller.js";

const router = express.Router();

// TODO: สร้างเส้นทางงาน
// นี่คือตัวอย่างสำหรับฟังก์ชันงานในอนาคต

// List tasks
router.get("/", requireAuth, listTasks);
// Create task
router.post("/", requireAuth, createTask);
// Single task operations
router.get("/:id", requireAuth, getTask);
router.patch("/:id", requireAuth, updateTask);
router.delete("/:id", requireAuth, deleteTask);

export default router;
