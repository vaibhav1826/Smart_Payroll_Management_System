const mongoose = require('mongoose');
const Payroll = require('../models/Payroll');
const { success, fail, serverError } = require('../../../shared/utils/response');

// Using inline schema definitions to access cross-service collections
function getModel(name, schemaDef) {
    return mongoose.models[name] || mongoose.model(name, new mongoose.Schema(schemaDef, { strict: false }));
}
const Employee = getModel('Employee', {
    name: String, email: String, salary: Number, status: String, department: String, bankDetails: Object, joiningDate: Date, exitDate: Date
});

exports.list = async (req, res) => {
    try {
        const { month, year, employee, status } = req.query;
        const filter = {};
        if (month) filter.month = Number(month);
        if (year) filter.year = Number(year);
        if (employee) filter.employee = employee;
        if (status) filter.status = status;
        const payrolls = await Payroll.find(filter).populate('employee', 'name email department bankDetails').populate('generatedBy', 'name').sort({ year: -1, month: -1 });
        return success(res, { payrolls });
    } catch (err) { return serverError(res, err); }
};

exports.generate = async (req, res) => {
    try {
        const { month, year, employeeId } = req.body;
        if (!month || !year) return fail(res, 'Month and year are required.');

        const isYearly = month === 'all';

        let employeeFilter = {};
        if (employeeId && employeeId !== 'all') {
            employeeFilter._id = employeeId;
        } else {
            // For all, include active, or those who exited IN OR AFTER the start of the year
            employeeFilter = {
                $or: [
                    { status: 'active' },
                    { exitDate: { $gte: new Date(year, 0, 1) } }
                ]
            };
        }

        const employees = await Employee.find(employeeFilter);
        const totalDays = new Date(year, month, 0).getDate();
        const results = [];

        const monthsToProcess = isYearly ? Array.from({ length: 12 }, (_, i) => i + 1) : [Number(month)];

        for (const emp of employees) {
            const salary = Number(emp.salary) || 0;
            if (salary <= 0) continue; // Skip generating zero-salary slips

            for (const processMonth of monthsToProcess) {
                const existing = await Payroll.findOne({ employee: emp._id, month: processMonth, year });
                if (existing && existing.status === 'locked') {
                    if (!isYearly) results.push(existing);
                    continue;
                }

                // ── Proration Logic ──
                const startOfMonth = new Date(year, processMonth - 1, 1);
                const endOfMonth = new Date(year, processMonth, 0);
                const totalDays = endOfMonth.getDate();

                let presentDays = totalDays;

                // If joined this month or later
                if (emp.joiningDate && emp.joiningDate > startOfMonth) {
                    if (emp.joiningDate <= endOfMonth) {
                        presentDays = totalDays - emp.joiningDate.getDate() + 1;
                    } else {
                        continue; // Joined after this month, skip generating for it
                    }
                }

                // If exited this month or earlier
                if (emp.status === 'inactive' && emp.exitDate) {
                    if (emp.exitDate < startOfMonth) {
                        continue; // Left before this month even started
                    } else if (emp.exitDate <= endOfMonth) {
                        presentDays = emp.exitDate.getDate();
                    }
                }

                if (presentDays <= 0) continue;

                // Prorated Multiplier
                const prorationRatio = presentDays / totalDays;
                const proratedBaseSalary = salary * prorationRatio;

                // Simplified ratio for additions
                const basicSalary = proratedBaseSalary * 0.5;
                const hra = proratedBaseSalary * 0.2;
                const da = proratedBaseSalary * 0.1;
                const regularBonuses = proratedBaseSalary * 0.2;

                const grossPay = basicSalary + hra + da + regularBonuses;

                // Deductions
                const pf = basicSalary * 0.12;
                const esi = grossPay <= 21000 ? grossPay * 0.0075 : 0;
                const tds = grossPay > 50000 ? grossPay * 0.1 : 0;

                const advancePayment = 0;
                const emiAdjustments = 0;

                const totalDeductions = pf + esi + tds + advancePayment + emiAdjustments;
                const netPay = grossPay - totalDeductions;

                const data = {
                    employee: emp._id, month: processMonth, year,
                    workingDays: totalDays, presentDays: presentDays,
                    basicSalary: Math.round(basicSalary),
                    hra: Math.round(hra),
                    da: Math.round(da),
                    regularBonuses: Math.round(regularBonuses),
                    pf: Math.round(pf),
                    esi: Math.round(esi),
                    tds: Math.round(tds),
                    advancePayment: Math.round(advancePayment),
                    emiAdjustments: Math.round(emiAdjustments),
                    grossPay: Math.round(grossPay),
                    totalDeductions: Math.round(totalDeductions),
                    netPay: Math.round(netPay),
                    status: 'generated',
                    generatedBy: req.user.userId,
                    generatedAt: new Date(),
                };

                const payroll = await Payroll.findOneAndUpdate({ employee: emp._id, month: processMonth, year }, data, { upsert: true, new: true });
                if (!isYearly) results.push(payroll);
            }
        }

        if (isYearly) {
            // Aggregate all processed months into a single yearly result set per employee
            const yearlyPayrolls = await Payroll.aggregate([
                { $match: { year: Number(year), employee: { $in: employees.map(e => e._id) } } },
                {
                    $group: {
                        _id: "$employee",
                        presentDays: { $sum: "$presentDays" },
                        basicSalary: { $sum: "$basicSalary" },
                        hra: { $sum: "$hra" },
                        da: { $sum: "$da" },
                        regularBonuses: { $sum: "$regularBonuses" },
                        pf: { $sum: "$pf" },
                        esi: { $sum: "$esi" },
                        tds: { $sum: "$tds" },
                        advancePayment: { $sum: "$advancePayment" },
                        emiAdjustments: { $sum: "$emiAdjustments" },
                        grossPay: { $sum: "$grossPay" },
                        totalDeductions: { $sum: "$totalDeductions" },
                        netPay: { $sum: "$netPay" }
                    }
                }
            ]);

            // Populate the aggregated data manually
            const populatedYearly = await Employee.populate(yearlyPayrolls, { path: "_id", select: "name email department bankDetails" });

            // Format to match standard array structure
            const finalResults = populatedYearly.map(p => ({
                ...p,
                employee: p._id,
                _id: "yearly_" + p._id._id, // Pseudo-ID for React keys
                status: 'Yearly Aggregate'
            }));

            return success(res, { payrolls: finalResults, count: finalResults.length, isYearly: true }, `Yearly Payroll aggregated for ${finalResults.length} employees.`);
        }

        // Re-fetch populated payrolls instead of just using the upserted ones, so the frontend gets employee details
        const populatedResults = await Payroll.find({ _id: { $in: results.map(p => p?._id).filter(Boolean) } })
            .populate('employee', 'name email department bankDetails')
            .populate('generatedBy', 'name');

        return success(res, { payrolls: populatedResults, count: populatedResults.length }, `Payroll generated for ${populatedResults.length} employees.`);
    } catch (err) {
        console.error("Payroll generation error:", err);
        return serverError(res, err);
    }
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
