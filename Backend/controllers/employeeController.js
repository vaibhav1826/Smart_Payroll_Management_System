const Employee = require('../models/Employee');
const { success, fail, serverError } = require('../utils/response');

exports.list = async (req, res) => {
    try {
        const { search, status, department, manager, supervisor } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (department) filter.department = new RegExp(department, 'i');
        if (manager) filter.manager = manager;
        if (supervisor) filter.supervisor = supervisor;
        if (search) { const r = new RegExp(search, 'i'); filter.$or = [{ name: r }, { email: r }, { designation: r }, { department: r }]; }
        const employees = await Employee.find(filter)
            .populate('manager', 'name email')
            .populate('supervisor', 'name email')
            .populate('addedBy', 'name email')
            .sort({ createdAt: -1 });
        return success(res, { employees });
    } catch (err) { return serverError(res, err); }
};

exports.getOne = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('manager', 'name email')
            .populate('supervisor', 'name email')
            .populate('addedBy', 'name email');
        if (!employee) return fail(res, 'Employee not found.', 404);
        return success(res, { employee });
    } catch (err) { return serverError(res, err); }
};

exports.create = async (req, res) => {
    try {
        const {
            name, email, phone, bloodGroup, dob, gender,
            employmentType, branch, location, joiningDate, designation, department, manager, supervisor,
            permanentAddress, currentAddress,
            aadhaarCard, panCard, bankDetails,
            salary, status
        } = req.body;

        if (!name || !email) return fail(res, 'Name and email are required.');
        const existing = await Employee.findOne({ email: email.trim().toLowerCase() });
        if (existing) return fail(res, 'Employee with this email already exists.', 409);

        let parsedBankDetails = bankDetails;
        if (typeof parsedBankDetails === 'string') {
            try { parsedBankDetails = JSON.parse(parsedBankDetails); } catch (e) { }
        }

        // Handle uploaded files
        let photoUrl = '';
        let aadhaarPhotoUrl = '';
        if (req.files) {
            if (req.files['photo']) photoUrl = req.files['photo'][0].path;
            if (req.files['aadhaarPhoto']) aadhaarPhotoUrl = req.files['aadhaarPhoto'][0].path;
        }

        const employee = await Employee.create({
            name, email: email.trim().toLowerCase(), phone, bloodGroup, dob, gender, photo: photoUrl,
            employmentType, branch, location, joiningDate: joiningDate || Date.now(), designation, department, manager, supervisor,
            permanentAddress, currentAddress,
            aadhaarCard, aadhaarPhoto: aadhaarPhotoUrl, panCard, bankDetails: parsedBankDetails,
            salary: salary || 0, status: status || 'active',
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
        const allowed = [
            'name', 'email', 'phone', 'bloodGroup', 'dob', 'gender',
            'employmentType', 'branch', 'location', 'joiningDate', 'designation', 'department', 'manager', 'supervisor',
            'permanentAddress', 'currentAddress',
            'aadhaarCard', 'panCard', 'bankDetails',
            'salary', 'status'
        ];
        const updates = {};
        allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

        // Handle file uploads on update
        if (req.files) {
            if (req.files['photo']) updates.photo = req.files['photo'][0].path;
            if (req.files['aadhaarPhoto']) updates.aadhaarPhoto = req.files['aadhaarPhoto'][0].path;
        }

        if (updates.bankDetails && typeof updates.bankDetails === 'string') {
            try { updates.bankDetails = JSON.parse(updates.bankDetails); } catch (e) { }
        }

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
