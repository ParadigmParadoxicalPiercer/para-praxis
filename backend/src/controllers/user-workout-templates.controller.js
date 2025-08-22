// Brief: Manage user-defined workout templates (list/create/add/remove).
import prisma from "../config/prisma.js";
import { successResponse } from "../utils/responseHelpers.js";
import { createError, createNotFoundError } from "../utils/createError.js";

export const userTemplatesController = {
  list: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const items = await prisma.workoutTemplate.findMany({
        where: { userId },
        include: { exercises: true },
        orderBy: { createdAt: "desc" },
      });
      res.json(successResponse(items));
    } catch (e) {
      next(createError("Failed to list user templates", 500));
    }
  },
  create: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name, description, equipment, goal, category, exercises = [] } = req.body;
      const tpl = await prisma.workoutTemplate.create({
        data: {
          name,
          description,
          equipment,
          goal,
          category: category || null,
          userId,
          exercises: {
            create: exercises.map((ex, idx) => ({
              name: ex.name,
              description: ex.description || null,
              reps: ex.reps || null,
              sets: ex.sets || null,
              order: ex.order ?? idx,
            })),
          },
        },
        include: { exercises: true },
      });
      res.status(201).json(successResponse(tpl, "Template created"));
    } catch (e) {
      next(createError("Failed to create template", 500));
    }
  },
  addExercise: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const templateId = parseInt(req.params.id);
      const existing = await prisma.workoutTemplate.findFirst({ where: { id: templateId, userId } });
      if (!existing) return next(createNotFoundError("Template not found"));
      const { name, description, reps, sets, order } = req.body;
      const ex = await prisma.workoutTemplateExercise.create({
        data: { name, description, reps, sets, order: order ?? 0, templateId },
      });
      res.status(201).json(successResponse(ex, "Exercise added"));
    } catch (e) {
      next(createError("Failed to add exercise", 500));
    }
  },
  remove: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const templateId = parseInt(req.params.id);
      const existing = await prisma.workoutTemplate.findFirst({ where: { id: templateId, userId } });
      if (!existing) return next(createNotFoundError("Template not found"));
      await prisma.workoutTemplate.delete({ where: { id: templateId } });
      res.json(successResponse(null, "Template deleted"));
    } catch (e) {
      next(createError("Failed to delete template", 500));
    }
  },
};

export default userTemplatesController;
