const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        industry: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry' },
        department: { type: String, trim: true, default: '' },
        employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Supervisor', supervisorSchema);
