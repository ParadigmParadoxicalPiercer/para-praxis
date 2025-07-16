import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import config from "../config/env.js";
import { handleDatabaseError } from "../utils/createError.js";
import logger from "../utils/logger.js";

// สร้างผู้ใช้ใหม่ (รับ name, email, password)
export const createUser = async (userData) => {
  try {
    const { name, email, password } = userData;

    logger.info("กำลังสร้างผู้ใช้ใหม่", { email, name });

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(
      password,
      config.security.bcryptRounds
    );

    // สร้างผู้ใช้ในฐานข้อมูล
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info("สร้างผู้ใช้สำเร็จ", { userId: newUser.id, email });

    return newUser;
  } catch (error) {
    logger.error("สร้างผู้ใช้ไม่สำเร็จ", {
      error: error.message,
      email: userData.email,
    });
    throw handleDatabaseError(error);
  }
};

// หาผู้ใช้จากอีเมล
export const findUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    logger.debug("ค้นหาผู้ใช้จากอีเมล", { email, found: !!user });

    return user;
  } catch (error) {
    logger.error("ค้นหาผู้ใช้จากอีเมลไม่สำเร็จ", {
      error: error.message,
      email,
    });
    throw handleDatabaseError(error);
  }
};

// หาผู้ใช้จาก ID
export const findUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.debug("ค้นหาผู้ใช้จาก ID", { userId, found: !!user });

    return user;
  } catch (error) {
    logger.error("ค้นหาผู้ใช้จาก ID ไม่สำเร็จ", {
      error: error.message,
      userId,
    });
    throw handleDatabaseError(error);
  }
};

// แก้ไขข้อมูลผู้ใช้
export const updateUserById = async (userId, updateData) => {
  try {
    logger.info("กำลังแก้ไขข้อมูลผู้ใช้", {
      userId,
      fields: Object.keys(updateData),
    });

    // เตรียมข้อมูลที่จะแก้ไข
    const dataToUpdate = {};

    if (updateData.name) {
      dataToUpdate.name = updateData.name.trim();
    }

    if (updateData.email) {
      dataToUpdate.email = updateData.email.toLowerCase().trim();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info("แก้ไขข้อมูลผู้ใช้สำเร็จ", { userId });

    return updatedUser;
  } catch (error) {
    logger.error("แก้ไขข้อมูลผู้ใช้ไม่สำเร็จ", {
      error: error.message,
      userId,
    });
    throw handleDatabaseError(error);
  }
};

// ลบผู้ใช้
export const deleteUserById = async (userId) => {
  try {
    logger.info("กำลังลบผู้ใช้", { userId });

    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info("ลบผู้ใช้สำเร็จ", { userId });

    return true;
  } catch (error) {
    logger.error("ลบผู้ใช้ไม่สำเร็จ", { error: error.message, userId });
    throw handleDatabaseError(error);
  }
};

// ดูสถิติของผู้ใช้ (จำนวน journals, tasks, workouts ต่างๆ)
export const getUserStats = async (userId) => {
  try {
    const stats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            journals: true,
            tasks: true,
            workoutPlans: true,
            workouts: true,
          },
        },
      },
    });

    logger.debug("ดูสถิติของผู้ใช้", { userId });

    return (
      stats?._count || {
        journals: 0,
        tasks: 0,
        workoutPlans: 0,
        workouts: 0,
      }
    );
  } catch (error) {
    logger.error("ดูสถิติของผู้ใช้ไม่สำเร็จ", { error: error.message, userId });
    throw handleDatabaseError(error);
  }
};

// เช็คว่าอีเมลนี้ใช้ได้ไหม (ยังไม่มีคนใช้)
export const isEmailAvailable = async (email, excludeUserId = null) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
      select: { id: true },
    });

    // ถ้าไม่มีผู้ใช้ อีเมลว่าง
    if (!existingUser) {
      return true;
    }

    // ถ้าเจอผู้ใช้ แต่เป็นคนเดียวกันที่เราไม่นับรวม อีเมลว่าง
    if (excludeUserId && existingUser.id === excludeUserId) {
      return true;
    }

    return false;
  } catch (error) {
    logger.error("เช็คว่าอีเมลว่างไหมไม่สำเร็จ", {
      error: error.message,
      email,
    });
    throw handleDatabaseError(error);
  }
};

export default {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  deleteUserById,
  getUserStats,
  isEmailAvailable,
};
