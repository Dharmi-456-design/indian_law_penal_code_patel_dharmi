const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    action: {
        type: String,
        required: true
    },
    targetCollection: {
        type: String,
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    details: {
        type: String
    },
    ip: {
        type: String
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
