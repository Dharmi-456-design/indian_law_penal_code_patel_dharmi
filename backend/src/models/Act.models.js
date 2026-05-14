const mongoose = require('mongoose');

const actSchema = new mongoose.Schema({
    actCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    actName: {
        type: String,
        required: true
    },
    actYear: {
        type: Number,
        required: true
    },
    actNo: {
        type: String,
        required: true
    },
    totalSections: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Act = mongoose.model('Act', actSchema);

module.exports = Act;
