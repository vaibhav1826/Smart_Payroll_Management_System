const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
    {
        // ── Personal Details ──
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        phone: { type: String, trim: true, default: '' },
        bloodGroup: { type: String, trim: true, default: '' },
        dob: { type: Date },
        gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },

        // ── Company Details Info ──
        registrationDate: { type: Date, default: Date.now },
        employmentType: { type: String, trim: true, default: '' },
        branch: { type: String, trim: true, default: '' },
        location: { type: String, trim: true, default: '' },
        joiningDate: { type: Date, default: Date.now },
        designation: { type: String, trim: true, default: '' },
        department: { type: String, trim: true, default: '' },
        manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

        // ── Address Details ──
        permanentAddress: { type: String, trim: true, default: '' },
        currentAddress: { type: String, trim: true, default: '' },

        // ── Document Management System ──
        aadhaarCard: { type: String, trim: true, default: '' },
        panCard: { type: String, trim: true, default: '' },
        bankDetails: {
            bankName: { type: String, default: '' },
            accountNumber: { type: String, default: '' },
            ifscCode: { type: String, default: '' },
        },

        // ── Salary / Meta ──
        salary: { type: Number, default: 0, min: 0 },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
