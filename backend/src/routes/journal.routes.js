import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// TODO: สร้างเส้นทางบันทึกประจำวัน
// นี่คือตัวอย่างสำหรับฟังก์ชันบันทึกประจำวันในอนาคต

// GET /api/journals - ดูบันทึกประจำวันทั้งหมดของผู้ใช้ (Private)
router.get("/", requireAuth, (req, res) => {
  res.json({ message: "Journal routes - Coming soon!" });
});

export default router;
