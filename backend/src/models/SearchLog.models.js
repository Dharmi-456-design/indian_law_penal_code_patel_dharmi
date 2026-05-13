const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    query: {
        type: String,
        required: true,
        trim: true
    },
    resultsCount: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

const SearchLog = mongoose.model('SearchLog', searchLogSchema);
module.exports = SearchLog;
