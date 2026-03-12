const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    type: { type: String, enum: ['sick', 'casual', 'earned', 'unpaid'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true, min: 0.5 },
    reason: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String, default: '' },
    appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongoose.model('Leave', leaveSchema);
