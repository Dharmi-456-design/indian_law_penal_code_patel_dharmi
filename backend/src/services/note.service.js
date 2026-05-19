const Note = require('../models/Note.models');
const Section = require('../models/Section.models');
const ApiError = require('../utils/ApiError');

/**
 * Retrieve all notes belonging to a specific user,
 * populated with sectionId info.
 */
const getNotes = async (userId) => {
    const notes = await Note.find({ userId })
        .populate('sectionId', 'actCode sectionNumber sectionTitle')
        .sort({ createdAt: -1 });

    return notes;
};

/**
 * Add a new note for a user on a given section.
 */
const addNote = async (userId, sectionId, noteText) => {
    // Ensure the referenced section exists
    const sectionExists = await Section.findById(sectionId);
    if (!sectionExists) {
        throw new ApiError(404, 'Section not found');
    }

    const note = await Note.create({ userId, sectionId, noteText });

    // Return populated
    return note.populate('sectionId', 'actCode sectionNumber sectionTitle');
};

/**
 * Edit an existing note — only the owner may edit.
 */
const editNote = async (noteId, userId, noteText) => {
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
        throw new ApiError(404, 'Note not found or you are not the owner');
    }

    note.noteText = noteText;
    await note.save();

    return note.populate('sectionId', 'actCode sectionNumber sectionTitle');
};

/**
 * Delete a note — only the owner may delete.
 */
const deleteNote = async (noteId, userId) => {
    const note = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!note) {
        throw new ApiError(404, 'Note not found or you are not the owner');
    }

    return note;
};

module.exports = {
    getNotes,
    addNote,
    editNote,
    deleteNote
};
