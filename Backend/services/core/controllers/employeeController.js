const Employee = require('../models/Employee');
const { success, fail, serverError } = require('../../../shared/utils/response');

exports.list = async (req, res) => {
    try {
        const { search, status, department, industry, contractor, supervisor } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (department) filter.department = new RegExp(department, 'i');
        if (industry) filter.industry = industry;
        if (contractor) filter.contractor = contractor;
        if (supervisor) filter.supervisor = supervisor;
        if (search) { const r = new RegExp(search, 'i'); filter.$or = [{ name: r }, { email: r }, { designation: r }, { department: r }]; }
        const employees = await Employee.find(filter)
            .populate('supervisor', 'name email')
            .populate('industry', 'name code')
            .populate('contractor', 'name company')
            .populate('addedBy', 'name email')
            .sort({ createdAt: -1 });
        return success(res, { employees });
    } catch (err) { return serverError(res, err); }
};

exports.getOne = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('supervisor', 'name email')
            .populate('industry', 'name code')
            .populate('contractor', 'name company')
            .populate('addedBy', 'name email');
        if (!employee) return fail(res, 'Employee not found.', 404);
        return success(res, { employee });
    } catch (err) { return serverError(res, err); }
};

exports.create = async (req, res) => {
    try {
        const { name, email, phone, department, designation, salary, joiningDate, status, supervisor, industry, contractor, bankDetails, emergencyContact } = req.body;
        if (!name || !email) return fail(res, 'Name and email are required.');
        const existing = await Employee.findOne({ email: email.trim().toLowerCase() });
        if (existing) return fail(res, 'Employee with this email already exists.', 409);
        const employee = await Employee.create({
            name, email: email.trim().toLowerCase(), phone, department, designation,
            salary: salary || 0, joiningDate: joiningDate || Date.now(), status: status || 'active',
            supervisor, industry, contractor, bankDetails, emergencyContact,
            addedBy: req.user.userId,
        });
        return success(res, { employee }, 'Employee created.', 201);
    } catch (err) {
        if (err.code === 11000) return fail(res, 'Duplicate email.', 409);
        return serverError(res, err);
    }
};

exports.update = async (req, res) => {
    try {
        const allowed = ['name', 'email', 'phone', 'department', 'designation', 'salary', 'joiningDate', 'status', 'supervisor', 'industry', 'contractor', 'bankDetails', 'emergencyContact'];
        const updates = {};
        allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
        if (updates.email) updates.email = updates.email.trim().toLowerCase();
        const employee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!employee) return fail(res, 'Employee not found.', 404);
        return success(res, { employee }, 'Employee updated.');
    } catch (err) {
        if (err.code === 11000) return fail(res, 'Duplicate email.', 409);
        return serverError(res, err);
    }
};

exports.remove = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return fail(res, 'Employee not found.', 404);
        return success(res, {}, 'Employee deleted.');
    } catch (err) { return serverError(res, err); }
};
