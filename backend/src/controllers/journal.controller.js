import prisma from "../config/prisma.js";
import {
  asyncHandler,
  createNotFoundError,
  createValidationError,
} from "../utils/createError.js";
import responseHandler from "../utils/response.js";
import { PAGINATION, VALIDATION_RULES } from "../config/constants.js";

// Helper: sanitize and validate title/content
function normalizeString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const v = String(value).trim();
  return v.length ? v : null;
}

// GET /api/journals
// Supports: ?page=&limit=&q=
export const listJournals = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = Math.max(parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;
  const { q } = req.query;

  const where = { userId };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.journal.count({ where }),
    prisma.journal.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return responseHandler.paginated(
    res,
    items,
    { page, limit, total },
    "Journals fetched"
  );
});

// GET /api/journals/:id
export const getJournal = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const journal = await prisma.journal.findFirst({ where: { id, userId } });
  if (!journal) throw createNotFoundError("Journal entry");
  return responseHandler.success(res, journal, "Journal fetched");
});

// POST /api/journals
export const createJournal = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  let { title, content } = req.body;
  title = normalizeString(title);
  content = normalizeString(content);

  // Require a non-empty title
  if (!title) throw createValidationError("Please enter a title");
  if (title.length > VALIDATION_RULES.TITLE_MAX_LENGTH)
    throw createValidationError("Title too long");
  if (content && content.length > VALIDATION_RULES.CONTENT_MAX_LENGTH)
    throw createValidationError("Content too long");

  const created = await prisma.journal.create({
    data: { title, content: content || "", userId },
  });
  return responseHandler.created(res, created, "Journal created");
});

// PATCH /api/journals/:id
export const updateJournal = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const existing = await prisma.journal.findFirst({ where: { id, userId } });
  if (!existing) throw createNotFoundError("Journal entry");
  const data = {};
  if (req.body.title !== undefined) {
    const t = normalizeString(req.body.title);
    if (!t) throw createValidationError("Please enter a title");
    if (t.length > VALIDATION_RULES.TITLE_MAX_LENGTH)
      throw createValidationError("Title too long");
    data.title = t;
  }
  if (req.body.content !== undefined) {
    const c = req.body.content ?? "";
    if (c.length > VALIDATION_RULES.CONTENT_MAX_LENGTH)
      throw createValidationError("Content too long");
    data.content = c;
  }
  if (Object.keys(data).length === 0)
    return responseHandler.success(res, existing, "No changes");
  const updated = await prisma.journal.update({ where: { id }, data });
  return responseHandler.success(res, updated, "Journal updated");
});

// DELETE /api/journals/:id
export const deleteJournal = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const existing = await prisma.journal.findFirst({ where: { id, userId } });
  if (!existing) throw createNotFoundError("Journal entry");
  await prisma.journal.delete({ where: { id } });
  return responseHandler.noContent(res, "Journal deleted");
});

export default {
  listJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
};
