// Brief: Built-in + user workout templates: list and create plan from template.
import prisma from "../config/prisma.js";
import { successResponse } from "../utils/responseHelpers.js";
import { WORKOUT_TEMPLATES } from "../data/workoutTemplates.js";
import { createError } from "../utils/createError.js";
import logger from "../utils/logger.js";

export const listTemplates = async (req, res, next) => {
  try {
  const { equipment, goal } = req.query;
    let items = WORKOUT_TEMPLATES;
    if (equipment) {
      items = items.filter((t) => t.equipment === equipment);
    }
    if (goal) {
      items = items.filter((t) => t.goal === goal);
    }
    // Merge user templates for the current user
    if (req.user?.id) {
      const userItems = await prisma.workoutTemplate.findMany({
        where: {
          userId: req.user.id,
          ...(equipment ? { equipment } : {}),
          ...(goal ? { goal } : {}),
        },
        include: { exercises: true },
        orderBy: { createdAt: "desc" },
      });
      const normalizedUser = userItems.map((t) => ({
        id: `user-${t.id}`,
        name: t.name,
        description: t.description || undefined,
        equipment: t.equipment,
        goal: t.goal,
        category: t.category || undefined,
        exercises: t.exercises.map((ex) => ({
          name: ex.name,
          description: ex.description || undefined,
          reps: ex.reps || undefined,
          sets: ex.sets || undefined,
        })),
        isUserTemplate: true,
        userTemplateId: t.id,
      }));
      items = [...normalizedUser, ...items];
    }
    res.json(successResponse(items));
  } catch (error) {
    next(createError("Failed to list templates", 500));
  }
};

export const createFromTemplate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { templateId, userTemplateId, name } = req.body;
    let tpl = null;
    if (userTemplateId) {
      const userTpl = await prisma.workoutTemplate.findFirst({
        where: { id: parseInt(userTemplateId), userId },
        include: { exercises: true },
      });
      if (!userTpl) {
        return res.status(404).json({ status: "error", message: "User template not found" });
      }
      tpl = {
        id: `user-${userTpl.id}`,
        name: userTpl.name,
        description: userTpl.description || undefined,
        equipment: userTpl.equipment,
        goal: userTpl.goal,
        exercises: userTpl.exercises.map((ex) => ({
          name: ex.name,
          description: ex.description || undefined,
          reps: ex.reps || undefined,
          sets: ex.sets || undefined,
        })),
      };
    } else {
      tpl = WORKOUT_TEMPLATES.find((t) => t.id === templateId);
      if (!tpl) {
        return res.status(404).json({ status: "error", message: "Template not found" });
      }
    }

    const plan = await prisma.workoutPlan.create({
      data: {
        name: name || tpl.name,
        description: tpl.description,
        equipment: tpl.equipment,
  goal: tpl.goal,
        userId,
        exercises: {
          create: tpl.exercises.map((ex) => ({
            name: ex.name,
            description: ex.description || null,
            reps: ex.reps || null,
            sets: ex.sets || null,
            userId,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    logger.info("Workout plan created from template", { userId, templateId: tpl.id, planId: plan.id });
    res.status(201).json(successResponse(plan, "Workout plan created from template"));
  } catch (error) {
    logger.error("createFromTemplate failed", { error: error.message, userId: req.user?.id });
    next(createError("Failed to create workout plan from template", 500));
  }
};

export default { listTemplates, createFromTemplate };
