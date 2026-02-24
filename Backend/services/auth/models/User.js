const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true, minlength: 6, select: false },
        name: { type: String, required: true, trim: true },
        role: { type: String, enum: ['admin', 'supervisor', 'employee', 'contractor'], default: 'employee' },
        phone: { type: String, trim: true, default: '' },
        avatar: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
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
