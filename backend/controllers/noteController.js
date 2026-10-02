const Note = require("../models/Note");

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Please provide title and content",
      });
    }

    const note = await Note.create({
      title,
      content,
      user: req.user.userId,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all active notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.userId,
      isArchived: false,
    }).sort({
      isPinned: -1,
      createdAt: -1,
    });

    res.status(200).json({
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get archived notes
const getArchivedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.userId,
      isArchived: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.title = title || note.title;
    note.content = content || note.content;

    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Pin / Unpin a note
const togglePinNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.isPinned = !note.isPinned;

    await note.save();

    res.status(200).json({
      message: note.isPinned
        ? "Note pinned successfully"
        : "Note unpinned successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Archive / Unarchive a note
const toggleArchiveNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.isArchived = !note.isArchived;

    await note.save();

    res.status(200).json({
      message: note.isArchived
        ? "Note archived successfully"
        : "Note unarchived successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  getArchivedNotes,
  updateNote,
  togglePinNote,
  toggleArchiveNote,
  deleteNote,
};