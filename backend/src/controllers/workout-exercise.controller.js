// Brief: Toggle exercise complete/incomplete and log completions.
import prisma from "../config/prisma.js";
import { createError, createNotFoundError } from "../utils/createError.js";
import { successResponse } from "../utils/responseHelpers.js";
import logger from "../utils/logger.js";

export const workoutExerciseController = {
  // Create a new workout exercise
  createWorkoutExercise: async (req, res, next) => {
    try {
      const { name, description, reps, sets, workoutPlanId } = req.body;
      const userId = req.user.id;

      // Check if workout plan exists and belongs to user
      const workoutPlan = await prisma.workoutPlan.findFirst({
        where: {
          id: workoutPlanId,
          userId,
        },
      });

      if (!workoutPlan) {
        return next(createNotFoundError("Workout plan not found"));
      }

      const exercise = await prisma.workoutExercise.create({
        data: {
          name,
          description,
          reps,
          sets,
          workoutPlanId,
          userId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          reps: true,
          sets: true,
          completed: true,
          workoutPlan: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      logger.info("Workout exercise created", {
        userId,
        exerciseId: exercise.id,
      });

      res
        .status(201)
        .json(
          successResponse(exercise, "Workout exercise created successfully")
        );
    } catch (error) {
      logger.error("Error creating workout exercise", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to create workout exercise", 500));
    }
  },

  // Get all workout exercises for user
  getWorkoutExercises: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        workoutPlanId,
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const whereCondition = { userId };
      if (workoutPlanId) {
        whereCondition.workoutPlanId = parseInt(workoutPlanId);
      }

      const exercises = await prisma.workoutExercise.findMany({
        where: whereCondition,
        select: {
          id: true,
          name: true,
          description: true,
          reps: true,
          sets: true,
          completed: true,
          workoutPlan: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take,
      });

      const totalCount = await prisma.workoutExercise.count({
        where: whereCondition,
      });

      const totalPages = Math.ceil(totalCount / take);

      res.json(
        successResponse({
          exercises,
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
      logger.error("Error getting workout exercises", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to get workout exercises", 500));
    }
  },

  // Get a specific workout exercise
  getWorkoutExercise: async (req, res, next) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const userId = req.user.id;

      const exercise = await prisma.workoutExercise.findFirst({
        where: {
          id: exerciseId,
          userId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          reps: true,
          sets: true,
          completed: true,
          workoutPlan: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!exercise) {
        return next(createNotFoundError("Workout exercise not found"));
      }

      res.json(successResponse(exercise));
    } catch (error) {
      logger.error("Error getting workout exercise", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to get workout exercise", 500));
    }
  },

  // Update a workout exercise
  updateWorkoutExercise: async (req, res, next) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const userId = req.user.id;
      const { name, description, reps, sets, completed } = req.body;

      // Check if exercise exists and belongs to user
      const existingExercise = await prisma.workoutExercise.findFirst({
        where: {
          id: exerciseId,
          userId,
        },
      });

      if (!existingExercise) {
        return next(createNotFoundError("Workout exercise not found"));
      }

      const exercise = await prisma.workoutExercise.update({
        where: { id: exerciseId },
        data: {
          name,
          description,
          reps,
          sets,
          completed,
        },
        select: {
          id: true,
          name: true,
          description: true,
          reps: true,
          sets: true,
          completed: true,
          workoutPlan: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      logger.info("Workout exercise updated", { userId, exerciseId });

      res.json(
        successResponse(exercise, "Workout exercise updated successfully")
      );
    } catch (error) {
      logger.error("Error updating workout exercise", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to update workout exercise", 500));
    }
  },

  // Delete a workout exercise
  deleteWorkoutExercise: async (req, res, next) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const userId = req.user.id;

      // Check if exercise exists and belongs to user
      const existingExercise = await prisma.workoutExercise.findFirst({
        where: {
          id: exerciseId,
          userId,
        },
      });

      if (!existingExercise) {
        return next(createNotFoundError("Workout exercise not found"));
      }

      await prisma.workoutExercise.delete({
        where: { id: exerciseId },
      });

      logger.info("Workout exercise deleted", { userId, exerciseId });

      res.json(successResponse(null, "Workout exercise deleted successfully"));
    } catch (error) {
      logger.error("Error deleting workout exercise", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to delete workout exercise", 500));
    }
  },

  // Mark exercise as completed
  markExerciseComplete: async (req, res, next) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const userId = req.user.id;

      // Check if exercise exists and belongs to user
      const existingExercise = await prisma.workoutExercise.findFirst({
        where: {
          id: exerciseId,
          userId,
        },
      });

      if (!existingExercise) {
        return next(createNotFoundError("Workout exercise not found"));
      }

      const exercise = await prisma.workoutExercise.update({
        where: { id: exerciseId },
        data: { completed: true },
        select: {
          id: true,
          name: true,
          description: true,
          reps: true,
          sets: true,
          completed: true,
          logs: {
            select: { id: true, completedAt: true },
            orderBy: { completedAt: "desc" },
          },
          workoutPlan: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Add a completion log entry
      await prisma.workoutExerciseLog.create({
        data: {
          workoutExerciseId: exerciseId,
          userId,
          completedAt: new Date(),
        },
      });

      logger.info("Workout exercise marked as complete", {
        userId,
        exerciseId,
      });

      res.json(successResponse(exercise, "Exercise marked as completed"));
    } catch (error) {
      logger.error("Error marking exercise as complete", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to mark exercise as complete", 500));
    }
  },

  // Mark exercise as incomplete
  markExerciseIncomplete: async (req, res, next) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const userId = req.user.id;

      // Check if exercise exists and belongs to user
      const existingExercise = await prisma.workoutExercise.findFirst({
        where: {
          id: exerciseId,
          userId,
        },
      });

      if (!existingExercise) {
        return next(createNotFoundError("Workout exercise not found"));
      }

      const exercise = await prisma.workoutExercise.update({
        where: { id: exerciseId },
        data: { completed: false },
        select: {
          id: true,
          name: true,
          description: true,
          reps: true,
          sets: true,
          completed: true,
          logs: {
            select: { id: true, completedAt: true },
            orderBy: { completedAt: "desc" },
          },
          workoutPlan: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      logger.info("Workout exercise marked as incomplete", {
        userId,
        exerciseId,
      });

      res.json(successResponse(exercise, "Exercise marked as incomplete"));
    } catch (error) {
      logger.error("Error marking exercise as incomplete", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to mark exercise as incomplete", 500));
    }
  },
};
