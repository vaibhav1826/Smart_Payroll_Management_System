const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        industry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Industry',
            required: true,
        },
        department: {
            type: String,
            trim: true,
            default: '',
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Manager', managerSchema);
