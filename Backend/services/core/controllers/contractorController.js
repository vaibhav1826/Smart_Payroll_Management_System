const Contractor = require('../models/Contractor');
const { success, fail, serverError } = require('../../../shared/utils/response');

exports.list = async (req, res) => {
    try {
        const { search, status, industry } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (industry) filter.industry = industry;
        if (search) { const r = new RegExp(search, 'i'); filter.$or = [{ name: r }, { company: r }, { email: r }]; }
        const contractors = await Contractor.find(filter).populate('industry', 'name code').populate('employees', 'name email').sort({ createdAt: -1 });
        return success(res, { contractors });
    } catch (err) { return serverError(res, err); }
};

exports.getOne = async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id).populate('industry', 'name code').populate('employees', 'name email department');
        if (!contractor) return fail(res, 'Contractor not found.', 404);
        return success(res, { contractor });
    } catch (err) { return serverError(res, err); }
};

exports.create = async (req, res) => {
    try {
        const { name, email, phone, company, industry, status } = req.body;
        if (!name) return fail(res, 'Contractor name is required.');
        const contractor = await Contractor.create({ name, email, phone, company, industry, status, createdBy: req.user.userId });
        return success(res, { contractor }, 'Contractor created.', 201);
    } catch (err) { return serverError(res, err); }
};

exports.update = async (req, res) => {
    try {
        const allowed = ['name', 'email', 'phone', 'company', 'industry', 'status'];
        const updates = {};
        allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
        const contractor = await Contractor.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!contractor) return fail(res, 'Contractor not found.', 404);
        return success(res, { contractor }, 'Contractor updated.');
    } catch (err) { return serverError(res, err); }
};

exports.remove = async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndDelete(req.params.id);
        if (!contractor) return fail(res, 'Contractor not found.', 404);
        return success(res, {}, 'Contractor deleted.');
    } catch (err) { return serverError(res, err); }
};

exports.assignEmployees = async (req, res) => {
    try {
        const { employeeIds } = req.body;
        if (!Array.isArray(employeeIds)) return fail(res, 'employeeIds must be an array.');
        const contractor = await Contractor.findByIdAndUpdate(req.params.id, { employees: employeeIds }, { new: true }).populate('employees', 'name email');
        if (!contractor) return fail(res, 'Contractor not found.', 404);
        return success(res, { contractor }, 'Employees assigned.');
    } catch (err) { return serverError(res, err); }
};
