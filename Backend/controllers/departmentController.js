const Department = require('../models/Department');
const Employee = require('../models/Employee');

exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('headOfDepartment', 'name email');

        // Also get the headcounts for each department
        const departmentsWithCounts = await Promise.all(departments.map(async (dept) => {
            const count = await Employee.countDocuments({ department: dept.name, status: 'active' });
            return {
                ...dept.toObject(),
                employeeCount: count
            };
        }));

        res.json({ ok: true, departments: departmentsWithCounts });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

exports.getDepartmentEmployees = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) return res.status(404).json({ ok: false, error: 'Department not found' });

        const employees = await Employee.find({ department: department.name })
            .select('name email designation branch employmentType status')
            .sort({ name: 1 });

        res.json({ ok: true, departmentName: department.name, employees });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
}

exports.createDepartment = async (req, res) => {
    try {
        const { name, description, headOfDepartment } = req.body;
        const exists = await Department.findOne({ name: new RegExp('^' + name + '$', 'i') });
        if (exists) return res.status(400).json({ ok: false, error: 'Department name already exists.' });

        const dept = await Department.create({
            name,
            description,
            headOfDepartment: headOfDepartment || null
        });
        res.status(201).json({ ok: true, department: dept });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        // Find existing department to capture the old name
        const oldDept = await Department.findById(req.params.id);
        if (!oldDept) return res.status(404).json({ ok: false, error: 'Not found' });

        const { name, description, headOfDepartment } = req.body;

        // If name changes, we must cascade that change to all employees so they don't lose their assignment
        if (name && name !== oldDept.name) {
            const exists = await Department.findOne({ name: new RegExp('^' + name + '$', 'i') });
            if (exists && exists._id.toString() !== oldDept._id.toString()) {
                return res.status(400).json({ ok: false, error: 'Department name already exists.' });
            }
            await Employee.updateMany({ department: oldDept.name }, { department: name });
        }

        const dept = await Department.findByIdAndUpdate(
            req.params.id,
            { name, description, headOfDepartment: headOfDepartment || null },
            { new: true, runValidators: true }
        );
        res.json({ ok: true, department: dept });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const dept = await Department.findById(req.params.id);
        if (!dept) return res.status(404).json({ ok: false, error: 'Not found' });

        // Remove department assignment from Employees
        await Employee.updateMany({ department: dept.name }, { department: '' });

        await Department.findByIdAndDelete(req.params.id);
        res.json({ ok: true, message: 'Deleted and employees unassigned' });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};
