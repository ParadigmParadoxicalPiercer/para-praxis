import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { mediaController } from "../controllers/media.controller.js";
import { uploadMediaSchema } from "../validator/media.validator.js";

const router = express.Router();

// เส้นทางไฟล์สื่อทั้งหมดต้องการการเข้าสู่ระบบ
router.use(requireAuth);

// อัพโหลดไฟล์สื่อ
router.post(
  "/upload",
  validateBody(uploadMediaSchema),
  mediaController.uploadMedia
);

// ดูไฟล์สื่อทั้งหมดของผู้ใช้
router.get("/", mediaController.getMediaFiles);

// ดูไฟล์สื่อแต่ละอัน
router.get("/:id", mediaController.getMediaFile);

// ลบไฟล์สื่อ
router.delete("/:id", mediaController.deleteMediaFile);

export default router;
