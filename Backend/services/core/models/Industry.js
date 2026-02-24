const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        code: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
        description: { type: String, default: '' },
        address: { type: String, default: '' },
        contactPerson: { type: String, default: '' },
        contactPhone: { type: String, default: '' },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Industry', industrySchema);
