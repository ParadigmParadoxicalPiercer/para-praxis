import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/auth.service.js";
import prisma from "../config/prisma.js";
import {
  createError,
  createConflictError,
  createAuthError,
  asyncHandler,
} from "../utils/createError.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../config/constants.js";
import responseHandler from "../utils/response.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * ลงทะเบียนผู้ใช้ใหม่
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  logger.info("พยายามลงทะเบียนผู้ใช้", { email, name });

  // เช็คว่าผู้ใช้มีอยู่แล้วไหม
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    logger.warn("ลงทะเบียนไม่สำเร็จ - อีเมลมีอยู่แล้ว", { email });
    return next(createConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));
  }

  // สร้างผู้ใช้ใหม่
  const user = await createUser({ name, email, password });

  logger.info("ลงทะเบียนผู้ใช้สำเร็จ", { userId: user.id, email });

  // ส่งข้อมูลผู้ใช้โดยไม่มีรหัสผ่าน
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };

  return responseHandler.created(res, userData, SUCCESS_MESSAGES.USER_CREATED);
});

/**
 * เข้าสู่ระบบ
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  logger.info("พยายามเข้าสู่ระบบ", { email });

  // หาผู้ใช้จากอีเมล
  const user = await findUserByEmail(email);
  if (!user) {
    logger.warn("เข้าสู่ระบบไม่สำเร็จ - ไม่พบผู้ใช้", { email });
    return next(createAuthError(ERROR_MESSAGES.INVALID_CREDENTIALS));
  }

  // เช็ครหัสผ่าน
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn("เข้าสู่ระบบไม่สำเร็จ - รหัสผ่านไม่ถูกต้อง", { email });
    return next(createAuthError(ERROR_MESSAGES.INVALID_CREDENTIALS));
  }

  // สร้าง accessToken และ refreshToken
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_SECRET || "access_secret_key",
    { expiresIn: "15s" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_SECRET || "refresh_secret_key",
    { expiresIn: "20s" } // only for demonstration purposes
  );

  // บันทึก refreshToken ในฐานข้อมูล
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 20 * 1000), // 20 seconds
    },
  });

  // ตั้งค่า cookie สำหรับ refreshToken
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, //1 month
  });

  logger.info("เข้าสู่ระบบสำเร็จ", { userId: user.id, email });

  // ส่ง token และข้อมูลผู้ใช้
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };

  return responseHandler.success(
    res,
    {
      user: userData,
      accessToken,
      refreshToken,
    },
    SUCCESS_MESSAGES.LOGIN_SUCCESS
  );
});

/**
 * รีเฟรช access token โดยใช้ refresh token
 */
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(createAuthError("No refresh token provided"));
  }

  // ตรวจสอบ refreshToken ในฐานข้อมูล
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    return next(createAuthError("Invalid or expired refresh token"));
  }

  // ตรวจสอบและถอดรหัส refreshToken
  let payload;
  try {
    payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET || "refresh_secret_key"
    );
  } catch (err) {
    return next(createAuthError("Invalid refresh token"));
  }

  // สร้าง accessToken ใหม่
  const accessToken = jwt.sign(
    { userId: payload.userId },
    process.env.ACCESS_SECRET || "access_secret_key",
    { expiresIn: "15s" }
  );

  return responseHandler.success(
    res,
    { accessToken },
    "Access token refreshed"
  );
});

/**
 * ดูข้อมูลส่วนตัวผู้ใช้ปัจจุบัน
 */
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const { user } = req; // ตั้งค่าจาก requireAuth middleware

  logger.info("ขอข้อมูลส่วนตัวผู้ใช้ปัจจุบัน", { userId: user.id });

  // ดึงข้อมูลผู้ใช้ล่าสุดจากฐานข้อมูล
  const currentUser = await findUserById(user.id);
  if (!currentUser) {
    logger.warn("ไม่พบผู้ใช้ปัจจุบัน", { userId: user.id });
    return next(createError(404, ERROR_MESSAGES.USER_NOT_FOUND));
  }

  return responseHandler.success(
    res,
    currentUser,
    "User profile retrieved successfully"
  );
});

/**
 * ออกจากระบบ (ยกเลิก token)
 * หมายเหตุ: ตอนนี้จัดการที่ฝั่ง client
 * ในอนาคตอาจจะมี blacklist สำหรับ token
 */
export const logout = asyncHandler(async (req, res, next) => {
  const { user } = req; // ตั้งค่าจาก requireAuth middleware

  logger.info("ผู้ใช้ออกจากระบบ", { userId: user.id });

  // ตอนนี้แค่ส่งสำเร็จ
  // ในอนาคตจะเพิ่ม token เข้า blacklist
  return responseHandler.success(res, null, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
});

/**
 * เปลี่ยนรหัสผ่าน
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { user } = req; // ตั้งค่าจาก requireAuth middleware

  logger.info("พยายามเปลี่ยนรหัสผ่าน", { userId: user.id });

  // ดึงข้อมูลผู้ใช้พร้อมรหัสผ่าน
  const userWithPassword = await findUserByEmail(user.email);
  if (!userWithPassword) {
    return next(createError(404, ERROR_MESSAGES.USER_NOT_FOUND));
  }

  // เช็ครหัสผ่านเก่า
  const isMatch = await bcrypt.compare(
    currentPassword,
    userWithPassword.password
  );
  if (!isMatch) {
    logger.warn("เปลี่ยนรหัสผ่านไม่สำเร็จ - รหัสผ่านเก่าไม่ถูกต้อง", {
      userId: user.id,
    });
    return next(createAuthError("Current password is incorrect"));
  }

  // เข้ารหัสรหัสผ่านใหม่
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // อัพเดทรหัสผ่านในฐานข้อมูล
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  logger.info("เปลี่ยนรหัสผ่านสำเร็จ", { userId: user.id });

  return responseHandler.success(res, null, "Password changed successfully");
});

export default {
  register,
  login,
  refreshToken,
  getCurrentUser,
  logout,
  changePassword,
};
