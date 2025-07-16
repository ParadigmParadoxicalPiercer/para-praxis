import express from "express";
import {
  register,
  login,
  refreshToken,
  getCurrentUser,
  logout,
  changePassword,
} from "../controllers/auth.controller.js";
import {
  authSchemas,
  validateBody,
  validateQuery,
} from "../utils/validation.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { passwordResetLimiter } from "../middleware/security.middleware.js";

const router = express.Router();

// POST /api/auth/register - ลงทะเบียนผู้ใช้ใหม่ (Public)
router.post("/register", validateBody(authSchemas.register), register);

// POST /api/auth/login - เข้าสู่ระบบ (Public)
router.post("/login", validateBody(authSchemas.login), login);

// POST /api/auth/refresh - ต่ออายุ access token (Private)
router.post("/refresh", requireAuth, refreshToken);

// GET /api/auth/me - ดูข้อมูลส่วนตัวผู้ใช้ปัจจุบัน (Private)
router.get("/me", requireAuth, getCurrentUser);

// POST /api/auth/logout - ออกจากระบบ (Private)
router.post("/logout", requireAuth, logout);

// POST /api/auth/change-password - เปลี่ยนรหัสผ่าน (Private, Rate limited: 3 req/hour)
router.post(
  "/change-password",
  passwordResetLimiter,
  requireAuth,
  validateBody(authSchemas.changePassword),
  changePassword
);

export default router;
