const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    action: {
        type: String,
        required: true,
        enum: ['LOGIN', 'LOGOUT', 'CREATE_NOTE', 'UPDATE_NOTE', 'DELETE_NOTE', 'ADD_BOOKMARK', 'REMOVE_BOOKMARK', 'SEARCH']
    },
    resource: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    ipAddress: {
        type: String
    }
}, {
    timestamps: true
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
