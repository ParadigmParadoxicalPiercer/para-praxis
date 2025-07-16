import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// TODO: สร้างเส้นทางออกกำลังกาย
// นี่คือตัวอย่างสำหรับฟังก์ชันออกกำลังกายในอนาคต

// GET /api/workouts - ดูการออกกำลังกายทั้งหมดของผู้ใช้ (Private)
router.get("/", requireAuth, (req, res) => {
  res.json({ message: "Workout routes - Coming soon!" });
});

export default router;
