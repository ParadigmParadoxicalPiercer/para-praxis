import prisma from "../config/prisma.js";
import { createError, createNotFoundError } from "../utils/createError.js";
import { successResponse } from "../utils/responseHelpers.js";
import logger from "../utils/logger.js";

export const focusController = {
  // Create a new focus session
  createFocusSession: async (req, res, next) => {
    try {
      const { duration, task, notes, completedAt } = req.body;
      const userId = req.user.id;

      const focusSession = await prisma.focusSession.create({
        data: {
          userId,
          duration,
          task,
          notes,
          completedAt: completedAt || new Date(),
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

      res
        .status(201)
        .json(
          successResponse(focusSession, "Focus session logged successfully")
        );
    } catch (error) {
      logger.error("Error creating focus session", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to create focus session", 500));
    }
  },

  // Get all focus sessions for user
  getFocusSessions: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const {
        page = 1,
        limit = 10,
        sortBy = "completedAt",
        sortOrder = "desc",
      } = req.query;

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

      const totalPages = Math.ceil(totalCount / take);

      res.json(
        successResponse({
          focusSessions,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNext: parseInt(page) < totalPages,
            hasPrevious: parseInt(page) > 1,
          },
        })
      );
    } catch (error) {
      logger.error("Error getting focus sessions", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to get focus sessions", 500));
    }
  },

  // Get focus statistics
  getFocusStats: async (req, res, next) => {
    try {
      const userId = req.user.id;

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

      res.json(
        successResponse(stats, "Focus statistics retrieved successfully")
      );
    } catch (error) {
      logger.error("Error getting focus stats", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to get focus statistics", 500));
    }
  },
};
