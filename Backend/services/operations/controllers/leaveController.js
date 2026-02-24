const Leave = require('../models/Leave');
const { success, fail, serverError } = require('../../../shared/utils/response');

exports.list = async (req, res) => {
    try {
        const { employee, status, type } = req.query;
        const filter = {};
        if (employee) filter.employee = employee;
        if (status) filter.status = status;
        if (type) filter.type = type;
        const leaves = await Leave.find(filter).populate('employee', 'name email department').populate('approvedBy', 'name').sort({ appliedAt: -1 });
        return success(res, { leaves });
    } catch (err) { return serverError(res, err); }
};

exports.apply = async (req, res) => {
    try {
        const { employee, type, startDate, endDate, days, reason } = req.body;
        if (!employee || !type || !startDate || !endDate || !days) return fail(res, 'All leave fields are required.');
        const leave = await Leave.create({ employee, type, startDate, endDate, days, reason });
        return success(res, { leave }, 'Leave applied.', 201);
    } catch (err) { return serverError(res, err); }
};

exports.approve = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return fail(res, 'Leave not found.', 404);
        if (leave.status !== 'pending') return fail(res, 'Leave already processed.');
        leave.status = 'approved';
        leave.approvedBy = req.user.userId;
        await leave.save();
        return success(res, { leave }, 'Leave approved.');
    } catch (err) { return serverError(res, err); }
};

exports.reject = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return fail(res, 'Leave not found.', 404);
        if (leave.status !== 'pending') return fail(res, 'Leave already processed.');
        leave.status = 'rejected';
        leave.rejectionReason = req.body.reason || '';
        leave.approvedBy = req.user.userId;
        await leave.save();
        return success(res, { leave }, 'Leave rejected.');
    } catch (err) { return serverError(res, err); }
};

exports.balance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const year = req.query.year || new Date().getFullYear();
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59, 999);
        const approved = await Leave.find({ employee: employeeId, status: 'approved', startDate: { $gte: start, $lte: end } });
        const totals = { sick: 0, casual: 0, earned: 0, unpaid: 0 };
        approved.forEach(l => { totals[l.type] = (totals[l.type] || 0) + l.days; });
        const limits = { sick: 12, casual: 12, earned: 15, unpaid: 999 };
        const balance = {};
        for (const t of Object.keys(limits)) { balance[t] = { used: totals[t], total: limits[t], remaining: Math.max(0, limits[t] - totals[t]) }; }
        return success(res, { balance, year });
    } catch (err) { return serverError(res, err); }
};

exports.remove = async (req, res) => {
    try {
        const leave = await Leave.findByIdAndDelete(req.params.id);
        if (!leave) return fail(res, 'Leave not found.', 404);
        return success(res, {}, 'Leave deleted.');
    } catch (err) { return serverError(res, err); }
};
