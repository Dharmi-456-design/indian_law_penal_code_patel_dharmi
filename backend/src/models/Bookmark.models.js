const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
        index: true
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate bookmarks for the same section by the same user
bookmarkSchema.index({ userId: 1, sectionId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;
