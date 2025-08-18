import prisma from "../config/prisma.js";
import {
  createNotFoundError,
  createValidationError,
  asyncHandler,
} from "../utils/createError.js";
import responseHandler from "../utils/response.js";

// Helper to parse and validate dueDate
function parseDueDate(d) {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) throw createValidationError("Invalid dueDate");
  return date;
}

// GET /api/tasks - list tasks (optionally filter by status, overdue, upcoming)
export const listTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status, overdue, upcoming, q } = req.query;

  const where = { userId };
  if (status === "completed") where.completed = true;
  if (status === "active") where.completed = false;
  if (q) where.title = { contains: q, mode: "insensitive" };

  const now = new Date();
  if (overdue === "true") {
    where.dueDate = { lt: now };
    where.completed = false;
  }
  if (upcoming === "true") {
    where.dueDate = { gte: now };
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [
      { completed: "asc" },
      { dueDate: "asc" },
      { priority: "asc" },
      { createdAt: "desc" },
    ],
  });
  return responseHandler.success(res, tasks, "Tasks fetched successfully");
});

// POST /api/tasks - create task
export const createTask = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { title, description, dueDate, priority } = req.body;
  if (!title || !title.trim()) throw createValidationError("Title is required");
  let parsedDue = null;
  if (dueDate) parsedDue = parseDueDate(dueDate);
  const prio = priority ? Number(priority) : 2;
  if (![1, 2, 3].includes(prio))
    throw createValidationError("Priority must be 1,2,3");
  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      dueDate: parsedDue,
      priority: prio,
      userId,
    },
  });
  return responseHandler.created(res, task, "Task created");
});

// GET /api/tasks/:id - get single task
export const getTask = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw createNotFoundError("Task not found");
  return responseHandler.success(res, task, "Task fetched");
});

// PATCH /api/tasks/:id - update task
export const updateTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const { title, description, completed, dueDate, priority } = req.body;
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) throw createNotFoundError("Task not found");
  const data = {};
  if (title !== undefined) {
    if (!title.trim()) throw createValidationError("Title cannot be empty");
    data.title = title.trim();
  }
  if (description !== undefined) data.description = description?.trim() || null;
  if (completed !== undefined) data.completed = !!completed;
  if (dueDate !== undefined)
    data.dueDate = dueDate ? parseDueDate(dueDate) : null;
  if (priority !== undefined) {
    const prio = Number(priority);
    if (![1, 2, 3].includes(prio))
      throw createValidationError("Priority must be 1,2,3");
    data.priority = prio;
  }
  const updated = await prisma.task.update({ where: { id }, data });
  return responseHandler.success(res, updated, "Task updated");
});

// DELETE /api/tasks/:id - delete task
export const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) throw createNotFoundError("Task not found");
  await prisma.task.delete({ where: { id } });
  return responseHandler.noContent(res, "Task deleted");
});

export default { listTasks, createTask, getTask, updateTask, deleteTask };
