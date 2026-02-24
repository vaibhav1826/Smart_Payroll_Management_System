const mongoose = require('mongoose');
const Payroll = require('../models/Payroll');
const { success, fail, serverError } = require('../../../shared/utils/response');

// We need cross-service data. Since all services share the same MongoDB,
// we register the schemas inline if not already registered.
function getModel(name, schemaDef) {
    return mongoose.models[name] || mongoose.model(name, new mongoose.Schema(schemaDef, { strict: false }));
}
const Employee = getModel('Employee', { name: String, email: String, salary: Number, designation: String, status: String });
const Attendance = getModel('Attendance', { employee: mongoose.Schema.Types.ObjectId, date: Date, status: String, overtime: Number });
const Leave = getModel('Leave', { employee: mongoose.Schema.Types.ObjectId, startDate: Date, endDate: Date, days: Number, status: String });
const SalaryStructure = require('../models/SalaryStructure');

exports.list = async (req, res) => {
    try {
        const { month, year, employee, status } = req.query;
        const filter = {};
        if (month) filter.month = Number(month);
        if (year) filter.year = Number(year);
        if (employee) filter.employee = employee;
        if (status) filter.status = status;
        const payrolls = await Payroll.find(filter).populate('employee', 'name email department designation').populate('generatedBy', 'name').sort({ year: -1, month: -1 });
        return success(res, { payrolls });
    } catch (err) { return serverError(res, err); }
};

exports.generate = async (req, res) => {
    try {
        const { month, year } = req.body;
        if (!month || !year) return fail(res, 'Month and year are required.');

        const employees = await Employee.find({ status: 'active' });
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);
        const totalDays = new Date(year, month, 0).getDate();
        const results = [];

        for (const emp of employees) {
            const existing = await Payroll.findOne({ employee: emp._id, month, year });
            if (existing && existing.status === 'locked') continue;

            const attendance = await Attendance.find({ employee: emp._id, date: { $gte: start, $lte: end } });
            const presentDays = attendance.filter(a => a.status === 'present').length;
            const halfDays = attendance.filter(a => a.status === 'halfDay').length;
            const effectiveDays = presentDays + (halfDays * 0.5);
            const overtimeHours = attendance.reduce((sum, a) => sum + (a.overtime || 0), 0);
            const leaves = await Leave.find({ employee: emp._id, status: 'approved', startDate: { $gte: start }, endDate: { $lte: end } });
            const leaveDays = leaves.reduce((sum, l) => sum + l.days, 0);

            const salary = emp.salary || 0;
            const structure = await SalaryStructure.findOne({ designation: emp.designation }) || { basicPercent: 50, hraPercent: 20, daPercent: 10, pfPercent: 12, otherAllowances: 0 };
            const dailyRate = salary / totalDays;
            const basic = dailyRate * effectiveDays * (structure.basicPercent / 100);
            const hra = dailyRate * effectiveDays * (structure.hraPercent / 100);
            const da = dailyRate * effectiveDays * (structure.daPercent / 100);
            const pf = dailyRate * effectiveDays * (structure.pfPercent / 100);
            const otherAll = structure.otherAllowances || 0;
            const overtimePay = overtimeHours * (dailyRate / 8) * 1.5;
            const gross = basic + hra + da + otherAll + overtimePay;
            const net = gross - pf;

            const data = {
                employee: emp._id, month, year, workingDays: totalDays, presentDays: effectiveDays,
                leaveDays, overtimeHours, basicSalary: Math.round(basic), hra: Math.round(hra),
                da: Math.round(da), pf: Math.round(pf), otherAllowances: Math.round(otherAll),
                overtimePay: Math.round(overtimePay), deductions: Math.round(pf),
                grossPay: Math.round(gross), netPay: Math.round(net),
                status: 'generated', generatedBy: req.user.userId, generatedAt: new Date(),
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
