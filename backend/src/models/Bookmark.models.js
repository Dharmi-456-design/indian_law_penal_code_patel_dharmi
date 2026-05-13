const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lawId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    note: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Compound unique index
bookmarkSchema.index({ userId: 1, lawId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;
