// Brief: CRUD for workout plans; includes exercises and logs in responses.
import prisma from "../config/prisma.js";
import { createError, createNotFoundError } from "../utils/createError.js";
import { successResponse } from "../utils/responseHelpers.js";
import logger from "../utils/logger.js";

export const workoutPlanController = {
  // Create a new workout plan
  createWorkoutPlan: async (req, res, next) => {
    try {
  const { name, week, description, equipment, goal } = req.body;
      const userId = req.user.id;

      const workoutPlan = await prisma.workoutPlan.create({
        data: {
          name,
          week,
          description,
          userId,
          equipment,
          goal,
        },
        include: {
          exercises: {
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
            },
          },
        },
      });

      logger.info("Workout plan created", {
        userId,
        workoutPlanId: workoutPlan.id,
      });

      res
        .status(201)
        .json(
          successResponse(workoutPlan, "Workout plan created successfully")
        );
    } catch (error) {
      logger.error("Error creating workout plan", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to create workout plan", 500));
    }
  },

  // Get all workout plans for user
  getWorkoutPlans: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const workoutPlans = await prisma.workoutPlan.findMany({
        where: { userId },
        include: {
          exercises: {
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
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take,
      });

      const totalCount = await prisma.workoutPlan.count({
        where: { userId },
      });

      const totalPages = Math.ceil(totalCount / take);

      res.json(
        successResponse({
          workoutPlans,
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
      logger.error("Error getting workout plans", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to get workout plans", 500));
    }
  },

  // Get a specific workout plan
  getWorkoutPlan: async (req, res, next) => {
    try {
      const workoutPlanId = parseInt(req.params.id);
      const userId = req.user.id;

      const workoutPlan = await prisma.workoutPlan.findFirst({
        where: {
          id: workoutPlanId,
          userId,
        },
        include: {
          exercises: {
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
            },
          },
        },
      });

      if (!workoutPlan) {
        return next(createNotFoundError("Workout plan not found"));
      }

      res.json(successResponse(workoutPlan));
    } catch (error) {
      logger.error("Error getting workout plan", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to get workout plan", 500));
    }
  },

  // Update a workout plan
  updateWorkoutPlan: async (req, res, next) => {
    try {
      const workoutPlanId = parseInt(req.params.id);
      const userId = req.user.id;
  const { name, week, description, equipment, goal } = req.body;

      // Check if workout plan exists and belongs to user
      const existingPlan = await prisma.workoutPlan.findFirst({
        where: {
          id: workoutPlanId,
          userId,
        },
      });

      if (!existingPlan) {
        return next(createNotFoundError("Workout plan not found"));
      }

      const workoutPlan = await prisma.workoutPlan.update({
        where: { id: workoutPlanId },
  data: { name, week, description, equipment, goal },
        include: {
          exercises: {
            select: {
              id: true,
              name: true,
              description: true,
              reps: true,
              sets: true,
              completed: true,
            },
          },
        },
      });

      logger.info("Workout plan updated", { userId, workoutPlanId });

      res.json(
        successResponse(workoutPlan, "Workout plan updated successfully")
      );
    } catch (error) {
      logger.error("Error updating workout plan", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to update workout plan", 500));
    }
  },

  // Delete a workout plan
  deleteWorkoutPlan: async (req, res, next) => {
    try {
      const workoutPlanId = parseInt(req.params.id);
      const userId = req.user.id;

      // Check if workout plan exists and belongs to user
      const existingPlan = await prisma.workoutPlan.findFirst({
        where: {
          id: workoutPlanId,
          userId,
        },
      });

      if (!existingPlan) {
        return next(createNotFoundError("Workout plan not found"));
      }

      await prisma.workoutPlan.delete({
        where: { id: workoutPlanId },
      });

      logger.info("Workout plan deleted", { userId, workoutPlanId });

      res.json(successResponse(null, "Workout plan deleted successfully"));
    } catch (error) {
      logger.error("Error deleting workout plan", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to delete workout plan", 500));
    }
  },

  // Add exercise to workout plan
  addExerciseToWorkoutPlan: async (req, res, next) => {
    try {
      const workoutPlanId = parseInt(req.params.id);
      const userId = req.user.id;
      const { name, description, reps, sets } = req.body;

      // Check if workout plan exists and belongs to user
      const existingPlan = await prisma.workoutPlan.findFirst({
        where: {
          id: workoutPlanId,
          userId,
        },
      });

      if (!existingPlan) {
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
        },
      });

      logger.info("Exercise added to workout plan", {
        userId,
        workoutPlanId,
        exerciseId: exercise.id,
      });

      res
        .status(201)
        .json(
          successResponse(
            exercise,
            "Exercise added to workout plan successfully"
          )
        );
    } catch (error) {
      logger.error("Error adding exercise to workout plan", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to add exercise to workout plan", 500));
    }
  },

  // Get exercises for a workout plan
  getWorkoutPlanExercises: async (req, res, next) => {
    try {
      const workoutPlanId = parseInt(req.params.id);
      const userId = req.user.id;

      // Check if workout plan exists and belongs to user
      const existingPlan = await prisma.workoutPlan.findFirst({
        where: {
          id: workoutPlanId,
          userId,
        },
      });

      if (!existingPlan) {
        return next(createNotFoundError("Workout plan not found"));
      }

      const exercises = await prisma.workoutExercise.findMany({
        where: { workoutPlanId },
        select: {
          id: true,
          name: true,
          description: true,
          reps: true,
          sets: true,
          completed: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      res.json(successResponse(exercises));
    } catch (error) {
      logger.error("Error getting workout plan exercises", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to get workout plan exercises", 500));
    }
  },
};
