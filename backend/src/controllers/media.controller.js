import prisma from "../config/prisma.js";
import { createError, createNotFoundError } from "../utils/createError.js";
import { successResponse } from "../utils/responseHelpers.js";
import logger from "../utils/logger.js";

export const mediaController = {
  // Upload media
  uploadMedia: async (req, res, next) => {
    try {
      const { url, publicId, taskId, journalId, workoutExerciseId } = req.body;
      const userId = req.user.id;

      // Validate that only one relation is provided
      const relationCount = [taskId, journalId, workoutExerciseId].filter(
        Boolean
      ).length;
      if (relationCount > 1) {
        return next(
          createError("Media can only be associated with one entity", 400)
        );
      }

      // If taskId is provided, check if task exists and belongs to user
      if (taskId) {
        const task = await prisma.task.findFirst({
          where: { id: taskId, userId },
        });
        if (!task) {
          return next(createNotFoundError("Task not found"));
        }
      }

      // If journalId is provided, check if journal exists and belongs to user
      if (journalId) {
        const journal = await prisma.journal.findFirst({
          where: { id: journalId, userId },
        });
        if (!journal) {
          return next(createNotFoundError("Journal not found"));
        }
      }

      // If workoutExerciseId is provided, check if exercise exists and belongs to user
      if (workoutExerciseId) {
        const exercise = await prisma.workoutExercise.findFirst({
          where: { id: workoutExerciseId, userId },
        });
        if (!exercise) {
          return next(createNotFoundError("Workout exercise not found"));
        }
      }

      const media = await prisma.media.create({
        data: {
          url,
          publicId,
          userId,
          taskId,
          journalId,
          workoutExerciseId,
        },
        select: {
          id: true,
          url: true,
          publicId: true,
          uploadedAt: true,
          Task: taskId
            ? {
                select: {
                  id: true,
                  title: true,
                },
              }
            : undefined,
          Journal: journalId
            ? {
                select: {
                  id: true,
                  title: true,
                },
              }
            : undefined,
          WorkoutExercise: workoutExerciseId
            ? {
                select: {
                  id: true,
                  name: true,
                },
              }
            : undefined,
        },
      });

      logger.info("Media uploaded", { userId, mediaId: media.id });

      res
        .status(201)
        .json(successResponse(media, "Media uploaded successfully"));
    } catch (error) {
      logger.error("Error uploading media", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to upload media", 500));
    }
  },

  // Get all media files for user
  getMediaFiles: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const {
        page = 1,
        limit = 10,
        sortBy = "uploadedAt",
        sortOrder = "desc",
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const mediaFiles = await prisma.media.findMany({
        where: { userId },
        select: {
          id: true,
          url: true,
          publicId: true,
          uploadedAt: true,
          Task: {
            select: {
              id: true,
              title: true,
            },
          },
          Journal: {
            select: {
              id: true,
              title: true,
            },
          },
          WorkoutExercise: {
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

      const totalCount = await prisma.media.count({
        where: { userId },
      });

      const totalPages = Math.ceil(totalCount / take);

      res.json(
        successResponse({
          mediaFiles,
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
      logger.error("Error getting media files", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to get media files", 500));
    }
  },

  // Get specific media file
  getMediaFile: async (req, res, next) => {
    try {
      const mediaId = parseInt(req.params.id);
      const userId = req.user.id;

      const media = await prisma.media.findFirst({
        where: {
          id: mediaId,
          userId,
        },
        select: {
          id: true,
          url: true,
          publicId: true,
          uploadedAt: true,
          Task: {
            select: {
              id: true,
              title: true,
            },
          },
          Journal: {
            select: {
              id: true,
              title: true,
            },
          },
          WorkoutExercise: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!media) {
        return next(createNotFoundError("Media file not found"));
      }

      res.json(successResponse(media));
    } catch (error) {
      logger.error("Error getting media file", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to get media file", 500));
    }
  },

  // Delete media file
  deleteMediaFile: async (req, res, next) => {
    try {
      const mediaId = parseInt(req.params.id);
      const userId = req.user.id;

      // Check if media exists and belongs to user
      const existingMedia = await prisma.media.findFirst({
        where: {
          id: mediaId,
          userId,
        },
      });

      if (!existingMedia) {
        return next(createNotFoundError("Media file not found"));
      }

      await prisma.media.delete({
        where: { id: mediaId },
      });

      logger.info("Media file deleted", { userId, mediaId });

      res.json(successResponse(null, "Media file deleted successfully"));
    } catch (error) {
      logger.error("Error deleting media file", {
        error: error.message,
        userId: req.user?.id,
      });
      next(createError("Failed to delete media file", 500));
    }
  },
};
