const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const noteService = require('../services/note.service');

/**
 * GET /api/v1/notes
 * Retrieve all notes for the currently authenticated user.
 */
const getUserNotes = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const notes = await noteService.getNotes(userId);

    return res.status(200).json(
        new ApiResponse(200, notes, 'Notes retrieved successfully')
    );
});

/**
 * POST /api/v1/notes
 * Create a new note on a section for the authenticated user.
 */
const createNote = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { sectionId, noteText } = req.body;

    const note = await noteService.addNote(userId, sectionId, noteText);

    return res.status(201).json(
        new ApiResponse(201, note, 'Note created successfully')
    );
});

/**
 * PUT /api/v1/notes/:id
 * Replace the noteText of an existing note (owner only).
 */
const updateNote = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const noteId = req.params.id;
    const { noteText } = req.body;

    const note = await noteService.editNote(noteId, userId, noteText);

    return res.status(200).json(
        new ApiResponse(200, note, 'Note updated successfully')
    );
});

/**
 * DELETE /api/v1/notes/:id
 * Delete a note (owner only).
 */
const removeNote = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const noteId = req.params.id;

    const note = await noteService.deleteNote(noteId, userId);

    return res.status(200).json(
        new ApiResponse(200, note, 'Note deleted successfully')
    );
});

module.exports = {
    getUserNotes,
    createNote,
    updateNote,
    removeNote
};
