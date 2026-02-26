const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        // Personal Details
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true, minlength: 6, select: false },
        name: { type: String, required: true, trim: true },
        role: { type: String, enum: ['admin', 'supervisor', 'employee', 'contractor'], default: 'employee' },
        phone: { type: String, trim: true, default: '' },
        bloodGroup: { type: String, default: '' },
        dob: { type: Date },
        gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
        isActive: { type: Boolean, default: true },

        // Company Details Info
        registrationDate: { type: Date, default: Date.now },
        employmentType: { type: String, default: '' },
        branch: { type: String, default: '' },
        location: { type: String, default: '' },
        dateOfJoining: { type: Date },
        designation: { type: String, default: '' },
        department: { type: String, default: '' },
        assignManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        assignSupervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

        // Address Details
        permanentAddress: { type: String, default: '' },
        currentAddress: { type: String, default: '' },

        // Document Management System
        aadhaarCard: { type: String, default: '' }, // File URL or number
        panCard: { type: String, default: '' }, // File URL or number
        bankDetails: {
            accountNumber: { type: String, default: '' },
            ifscCode: { type: String, default: '' },
            bankName: { type: String, default: '' },
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
