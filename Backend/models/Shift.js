const mongoose = require('mongoose');
const shiftSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true }, // "17:00"
    breakDuration: { type: Number, default: 60 },     // minutes
    requiredEmployees: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Shift', shiftSchema);
