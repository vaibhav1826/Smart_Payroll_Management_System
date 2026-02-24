const Supervisor = require('../models/Supervisor');
const { success, fail, serverError } = require('../../../shared/utils/response');

exports.list = async (req, res) => {
    try {
        const { industry } = req.query;
        const filter = {};
        if (industry) filter.industry = industry;
        const supervisors = await Supervisor.find(filter).populate('user', 'name email role').populate('industry', 'name code').populate('employees', 'name email department').sort({ createdAt: -1 });
        return success(res, { supervisors });
    } catch (err) { return serverError(res, err); }
};

exports.getOne = async (req, res) => {
    try {
        const supervisor = await Supervisor.findById(req.params.id).populate('user', 'name email role').populate('industry', 'name code').populate('employees', 'name email department designation');
        if (!supervisor) return fail(res, 'Supervisor not found.', 404);
        return success(res, { supervisor });
    } catch (err) { return serverError(res, err); }
};

exports.create = async (req, res) => {
    try {
        const { user, industry, department } = req.body;
        if (!user) return fail(res, 'User ID is required.');
        const existing = await Supervisor.findOne({ user });
        if (existing) return fail(res, 'This user is already a supervisor.', 409);
        const supervisor = await Supervisor.create({ user, industry, department });
        return success(res, { supervisor }, 'Supervisor created.', 201);
    } catch (err) { return serverError(res, err); }
};

exports.update = async (req, res) => {
    try {
        const updates = {};
        ['industry', 'department'].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
        const supervisor = await Supervisor.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!supervisor) return fail(res, 'Supervisor not found.', 404);
        return success(res, { supervisor }, 'Supervisor updated.');
    } catch (err) { return serverError(res, err); }
};

exports.assignEmployees = async (req, res) => {
    try {
        const { employeeIds } = req.body;
        if (!Array.isArray(employeeIds)) return fail(res, 'employeeIds must be an array.');
        const supervisor = await Supervisor.findByIdAndUpdate(req.params.id, { employees: employeeIds }, { new: true }).populate('employees', 'name email');
        if (!supervisor) return fail(res, 'Supervisor not found.', 404);
        return success(res, { supervisor }, 'Employees assigned.');
    } catch (err) { return serverError(res, err); }
};

exports.remove = async (req, res) => {
    try {
        const supervisor = await Supervisor.findByIdAndDelete(req.params.id);
        if (!supervisor) return fail(res, 'Supervisor not found.', 404);
        return success(res, {}, 'Supervisor deleted.');
    } catch (err) { return serverError(res, err); }
};
