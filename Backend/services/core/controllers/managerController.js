const Manager = require('../models/Manager');
const { success, fail, serverError } = require('../../../shared/utils/response');

exports.list = async (req, res) => {
    try {
        const { industry } = req.query;
        const filter = {};
        if (industry) filter.industry = industry;
        // Managers can only see their own record
        if (req.user.role === 'manager') filter.user = req.user.userId;
        const managers = await Manager.find(filter)
            .populate('user', 'name email role')
            .populate('industry', 'name code')
            .sort({ createdAt: -1 });
        return success(res, { managers });
    } catch (err) { return serverError(res, err); }
};

exports.getOne = async (req, res) => {
    try {
        const manager = await Manager.findById(req.params.id)
            .populate('user', 'name email role')
            .populate('industry', 'name code');
        if (!manager) return fail(res, 'Manager not found.', 404);
        return success(res, { manager });
    } catch (err) { return serverError(res, err); }
};

exports.create = async (req, res) => {
    try {
        const { user, industry, department, phone, status } = req.body;
        if (!user) return fail(res, 'User ID is required.');
        if (!industry) return fail(res, 'Industry ID is required.');
        const existing = await Manager.findOne({ user });
        if (existing) return fail(res, 'This user is already a manager.', 409);
        const manager = await Manager.create({
            user, industry, department, phone, status,
            assignedBy: req.user.userId,
        });
        const populated = await Manager.findById(manager._id)
            .populate('user', 'name email role')
            .populate('industry', 'name code');
        return success(res, { manager: populated }, 'Manager created.', 201);
    } catch (err) { return serverError(res, err); }
};

exports.update = async (req, res) => {
    try {
        const updates = {};
        ['industry', 'department', 'phone', 'status'].forEach(k => {
            if (req.body[k] !== undefined) updates[k] = req.body[k];
        });
        const manager = await Manager.findByIdAndUpdate(req.params.id, updates, { new: true })
            .populate('user', 'name email role')
            .populate('industry', 'name code');
        if (!manager) return fail(res, 'Manager not found.', 404);
        return success(res, { manager }, 'Manager updated.');
    } catch (err) { return serverError(res, err); }
};

exports.remove = async (req, res) => {
    try {
        const manager = await Manager.findByIdAndDelete(req.params.id);
        if (!manager) return fail(res, 'Manager not found.', 404);
        return success(res, {}, 'Manager deleted.');
    } catch (err) { return serverError(res, err); }
};
