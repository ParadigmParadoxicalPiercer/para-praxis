import prisma from "../config/prisma.js";
import { createError } from "../utils/createError.js";
import logger from "../utils/logger.js";

export const focusService = {
  // Create a new focus session
  createFocusSession: async (userId, focusData) => {
    try {
      const focusSession = await prisma.focusSession.create({
        data: {
          userId,
          ...focusData,
        },
        select: {
          id: true,
          duration: true,
          task: true,
          notes: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      logger.info("Focus session created", {
        userId,
        focusSessionId: focusSession.id,
      });
      return focusSession;
    } catch (error) {
      logger.error("Error creating focus session", {
        error: error.message,
        userId,
      });
      throw createError("Failed to create focus session", 500);
    }
  },

  // Get focus sessions for user
  getFocusSessionsByUser: async (userId, options = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "completedAt",
        sortOrder = "desc",
      } = options;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const focusSessions = await prisma.focusSession.findMany({
        where: { userId },
        select: {
          id: true,
          duration: true,
          task: true,
          notes: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take,
      });

      const totalCount = await prisma.focusSession.count({
        where: { userId },
      });

      return {
        focusSessions,
        totalCount,
        totalPages: Math.ceil(totalCount / take),
        currentPage: parseInt(page),
      };
    } catch (error) {
      logger.error("Error getting focus sessions", {
        error: error.message,
        userId,
      });
      throw createError("Failed to get focus sessions", 500);
    }
  },

  // Calculate focus statistics for user
  calculateFocusStats: async (userId) => {
    try {
      // Get total focus time
      const totalFocusTime = await prisma.focusSession.aggregate({
        where: { userId },
        _sum: {
          duration: true,
        },
      });

      // Get session count
      const sessionCount = await prisma.focusSession.count({
        where: { userId },
      });

      // Get today's focus time
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayFocusTime = await prisma.focusSession.aggregate({
        where: {
          userId,
          completedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _sum: {
          duration: true,
        },
      });

      // Get this week's focus time
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const weekFocusTime = await prisma.focusSession.aggregate({
        where: {
          userId,
          completedAt: {
            gte: startOfWeek,
          },
        },
        _sum: {
          duration: true,
        },
      });

      const stats = {
        totalFocusTime: totalFocusTime._sum.duration || 0,
        sessionCount,
        todayFocusTime: todayFocusTime._sum.duration || 0,
        weekFocusTime: weekFocusTime._sum.duration || 0,
        averageSessionTime:
          sessionCount > 0
            ? Math.round((totalFocusTime._sum.duration || 0) / sessionCount)
            : 0,
      };

      return stats;
    } catch (error) {
      logger.error("Error calculating focus stats", {
        error: error.message,
        userId,
      });
      throw createError("Failed to calculate focus statistics", 500);
    }
  },
};
