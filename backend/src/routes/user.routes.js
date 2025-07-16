import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserStats,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { userSchemas, validateBody, validateId } from "../utils/validation.js";

const router = express.Router();

// GET /api/users/profile - ดูข้อมูลส่วนตัวผู้ใช้ (Private)
router.get("/profile", requireAuth, getUserProfile);

// PUT /api/users/profile - แก้ไขข้อมูลส่วนตัวผู้ใช้ (Private)
router.put(
  "/profile",
  requireAuth,
  validateBody(userSchemas.updateProfile),
  updateUserProfile
);

// DELETE /api/users/profile - ลบข้อมูลส่วนตัวผู้ใช้ (Private)
router.delete("/profile", requireAuth, deleteUserProfile);

// GET /api/users/stats - ดูสถิติของผู้ใช้ (Private)
router.get("/stats", requireAuth, getUserStats);

export default router;
