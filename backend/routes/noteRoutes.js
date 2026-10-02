const express = require("express");

const {
  createNote,
  getNotes,
  getArchivedNotes,
  updateNote,
  togglePinNote,
  toggleArchiveNote,
  deleteNote,
} = require("../controllers/noteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new note
router.post("/", protect, createNote);

// Get active notes
router.get("/", protect, getNotes);

// Get archived notes
router.get("/archived", protect, getArchivedNotes);

// Update a note
router.put("/:id", protect, updateNote);

// Pin / Unpin a note
router.put("/:id/pin", protect, togglePinNote);

// Archive / Unarchive a note
router.put("/:id/archive", protect, toggleArchiveNote);

// Delete a note
router.delete("/:id", protect, deleteNote);

module.exports = router;