const mongoose = require('mongoose');
const salaryStructureSchema = new mongoose.Schema({
    designation: { type: String, required: true, trim: true },
    basicPercent: { type: Number, default: 50 },
    hraPercent: { type: Number, default: 20 },
    daPercent: { type: Number, default: 10 },
    pfPercent: { type: Number, default: 12 },
    otherAllowances: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);
