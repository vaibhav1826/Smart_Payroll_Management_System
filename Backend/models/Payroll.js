const mongoose = require('mongoose');
const payrollSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    // Attendance Data
    workingDays: { type: Number, default: 0 },
    presentDays: { type: Number, default: 0 },

    // Additions
    basicSalary: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    regularBonuses: { type: Number, default: 0 },

    // Deductions
    pf: { type: Number, default: 0 },
    esi: { type: Number, default: 0 },
    tds: { type: Number, default: 0 },

    // Advances / Loans
    advancePayment: { type: Number, default: 0 },
    emiAdjustments: { type: Number, default: 0 },

    // Totals
    grossPay: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'generated', 'locked'], default: 'draft' },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    generatedAt: { type: Date },
    lockedAt: { type: Date },
}, { timestamps: true });
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
module.exports = mongoose.model('Payroll', payrollSchema);
