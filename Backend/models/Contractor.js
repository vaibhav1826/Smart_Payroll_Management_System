const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, trim: true, lowercase: true, default: '' },
        phone: { type: String, trim: true, default: '' },
        company: { type: String, trim: true, default: '' },
        industry: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry' },
        employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Contractor', contractorSchema);
