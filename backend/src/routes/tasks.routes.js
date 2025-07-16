import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// TODO: สร้างเส้นทางงาน
// นี่คือตัวอย่างสำหรับฟังก์ชันงานในอนาคต

// GET /api/tasks - ดูงานทั้งหมดของผู้ใช้ (Private)
router.get("/", requireAuth, (req, res) => {
  res.json({ message: "Task routes - Coming soon!" });
});

export default router;
