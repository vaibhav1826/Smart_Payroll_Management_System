const mongoose = require('mongoose');
const Payroll = require('../models/Payroll');
const { success, fail, serverError } = require('../../../shared/utils/response');

// Using inline schema definitions to access cross-service collections
function getModel(name, schemaDef) {
    return mongoose.models[name] || mongoose.model(name, new mongoose.Schema(schemaDef, { strict: false }));
}
const Employee = getModel('Employee', { name: String, email: String, salary: Number, status: String });

exports.list = async (req, res) => {
    try {
        const { month, year, employee, status } = req.query;
        const filter = {};
        if (month) filter.month = Number(month);
        if (year) filter.year = Number(year);
        if (employee) filter.employee = employee;
        if (status) filter.status = status;
        const payrolls = await Payroll.find(filter).populate('employee', 'name email').populate('generatedBy', 'name').sort({ year: -1, month: -1 });
        return success(res, { payrolls });
    } catch (err) { return serverError(res, err); }
};

exports.generate = async (req, res) => {
    try {
        const { month, year } = req.body;
        if (!month || !year) return fail(res, 'Month and year are required.');

        const employees = await Employee.find({ status: 'active' });
        const totalDays = new Date(year, month, 0).getDate();
        const results = [];

        for (const emp of employees) {
            const existing = await Payroll.findOne({ employee: emp._id, month, year });
            if (existing && existing.status === 'locked') continue;

            const salary = emp.salary || 0;
            // Simplified ratio for additions based on standard structures
            const basicSalary = salary * 0.5;
            const hra = salary * 0.2;
            const da = salary * 0.1;
            const regularBonuses = salary * 0.2; // Making up to 100% of base salary

            const grossPay = basicSalary + hra + da + regularBonuses;

            // Deductions
            const pf = basicSalary * 0.12;
            const esi = grossPay <= 21000 ? grossPay * 0.0075 : 0;
            const tds = grossPay > 50000 ? grossPay * 0.1 : 0; // Simple TDS assumption

            // Advances / Loans (dummy values 0 for automated generation unless fetched from a Loan module)
            const advancePayment = 0;
            const emiAdjustments = 0;

            const totalDeductions = pf + esi + tds + advancePayment + emiAdjustments;
            const netPay = grossPay - totalDeductions;

            const data = {
                employee: emp._id, month, year,
                workingDays: totalDays, presentDays: totalDays, // Placeholder assuming 100% attendance

                // Additions
                basicSalary: Math.round(basicSalary),
                hra: Math.round(hra),
                da: Math.round(da),
                regularBonuses: Math.round(regularBonuses),

                // Deductions
                pf: Math.round(pf),
                esi: Math.round(esi),
                tds: Math.round(tds),

                // Advances
                advancePayment: Math.round(advancePayment),
                emiAdjustments: Math.round(emiAdjustments),

                // Totals
                grossPay: Math.round(grossPay),
                totalDeductions: Math.round(totalDeductions),
                netPay: Math.round(netPay),

                status: 'generated',
                generatedBy: req.user.userId,
                generatedAt: new Date(),
            };

            const payroll = await Payroll.findOneAndUpdate({ employee: emp._id, month, year }, data, { upsert: true, new: true });
            results.push(payroll);
        }

        return success(res, { payrolls: results, count: results.length }, `Payroll generated for ${results.length} employees.`);
    } catch (err) { return serverError(res, err); }
};

exports.lock = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id);
        if (!payroll) return fail(res, 'Payroll not found.', 404);
        if (payroll.status === 'locked') return fail(res, 'Already locked.');
        payroll.status = 'locked';
        payroll.lockedAt = new Date();
        await payroll.save();
        return success(res, { payroll }, 'Payroll locked.');
    } catch (err) { return serverError(res, err); }
};

exports.remove = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id);
        if (!payroll) return fail(res, 'Payroll not found.', 404);
        if (payroll.status === 'locked') return fail(res, 'Cannot delete locked payroll.');
        await payroll.deleteOne();
        return success(res, {}, 'Payroll deleted.');
    } catch (err) { return serverError(res, err); }
};
