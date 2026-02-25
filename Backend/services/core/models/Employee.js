const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        phone: { type: String, trim: true, default: '' },
        department: { type: String, trim: true, default: '' },
        designation: { type: String, trim: true, default: '' },
        salary: { type: Number, default: 0, min: 0 },
        joiningDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        shiftType: { type: String, enum: ['8hr', '12hr', 'custom'], default: '8hr' },
        supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        industry: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry' },
        contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' },
        // Compliance fields
        esicNo: { type: String, trim: true, default: '' },
        pfNo: { type: String, trim: true, default: '' },
        uanNo: { type: String, trim: true, default: '' },
        aadhaarNo: { type: String, trim: true, default: '' },
        panNo: { type: String, trim: true, default: '' },
        bankDetails: {
            bankName: { type: String, default: '' },
            accountNumber: { type: String, default: '' },
            ifscCode: { type: String, default: '' },
        },
        emergencyContact: {
            name: { type: String, default: '' },
            phone: { type: String, default: '' },
            relation: { type: String, default: '' },
        },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
