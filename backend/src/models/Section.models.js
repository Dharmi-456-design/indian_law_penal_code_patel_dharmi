const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    section_number: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    punishment: {
        type: String
    },
    bailable: {
        type: String, // Can be "Bailable", "Non-Bailable", or Boolean
        default: "N/A"
    },
    cognizable: {
        type: String, // Can be "Cognizable", "Non-Cognizable"
        default: "N/A"
    },
    triable_by: {
        type: String
    },
    chapter: {
        type: String,
        index: true
    },
    act_name: {
        type: String,
        default: 'IPC', // Indian Penal Code
        index: true
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Full text search index
sectionSchema.index({ title: 'text', description: 'text', section_number: 'text' });

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;
