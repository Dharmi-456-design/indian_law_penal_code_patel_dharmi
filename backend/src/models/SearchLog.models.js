const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true
    },
    query: {
        type: String,
        required: true
    },
    actCode: {
        type: String,
        default: null
    },
    resultsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const SearchLog = mongoose.model('SearchLog', searchLogSchema);
module.exports = SearchLog;
