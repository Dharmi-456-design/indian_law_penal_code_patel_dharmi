const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    actCode: {
        type: String,
        required: true,
        enum: ['NIA', 'MVA', 'IEA', 'IPC', 'IDA', 'HMA', 'CrPC'],
        index: true
    },
    actName: {
        type: String,
        required: true
    },
    actYear: {
        type: Number
    },
    chapter: {
        type: Number,
        default: null,
        index: true
    },
    chapterTitle: {
        type: String,
        default: null
    },
    sectionNumber: {
        type: String,
        required: true,
        index: true
    },
    sectionTitle: {
        type: String,
        required: true
    },
    sectionDesc: {
        type: String,
        required: true
    },
    isArchived: {
        type: Boolean,
        default: false,
        index: true
    },
    viewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound unique index
sectionSchema.index({ actCode: 1, sectionNumber: 1 }, { unique: true });

// Full-text search index
sectionSchema.index({ sectionTitle: 'text', sectionDesc: 'text' });

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;
