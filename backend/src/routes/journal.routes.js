import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  listJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
} from "../controllers/journal.controller.js";

const router = express.Router();

// List journals
router.get("/", requireAuth, listJournals);
// Create
router.post("/", requireAuth, createJournal);
// Single fetch
router.get("/:id", requireAuth, getJournal);
// Update
router.patch("/:id", requireAuth, updateJournal);
// Delete
router.delete("/:id", requireAuth, deleteJournal);

export default router;
