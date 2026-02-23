const express = require('express');
const Employee = require('../models/Employee');
const { verifyToken } = require('../auth');

const router = express.Router();

// All routes below require a valid JWT session
router.use(verifyToken);

/**
 * GET /api/employees
 * List all employees. Supports optional ?search= and ?status= query params.
 */
router.get('/', async (req, res) => {
    try {
        const { search, status } = req.query;
        const filter = {};

        if (status && ['active', 'inactive'].includes(status)) {
            filter.status = status;
        }

        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [
                { name: regex },
                { email: regex },
                { department: regex },
                { designation: regex },
            ];
        }

        const employees = await Employee.find(filter)
            .sort({ createdAt: -1 })
            .populate('addedBy', 'name email');

        res.json({ ok: true, employees });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || 'Failed to fetch employees.' });
    }
});

/**
 * GET /api/employees/:id
 * Get a single employee by ID.
 */
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('addedBy', 'name email');
        if (!employee) {
            return res.status(404).json({ ok: false, message: 'Employee not found.' });
        }
        res.json({ ok: true, employee });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || 'Failed to fetch employee.' });
    }
});

/**
 * POST /api/employees
 * Create a new employee.
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, department, designation, salary, joiningDate, status } = req.body;

        if (!name || !email) {
            return res.status(400).json({ ok: false, message: 'Name and email are required.' });
        }

        // Check for duplicate email
        const existing = await Employee.findOne({ email: email.trim().toLowerCase() });
        if (existing) {
            return res.status(409).json({ ok: false, message: 'An employee with this email already exists.' });
        }

        const employee = await Employee.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone || '',
            department: department || '',
            designation: designation || '',
            salary: salary || 0,
            joiningDate: joiningDate || Date.now(),
            status: status || 'active',
            addedBy: req.user._id,
        });

        res.status(201).json({ ok: true, message: 'Employee created.', employee });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ ok: false, message: 'Duplicate email.' });
        }
        res.status(500).json({ ok: false, message: err.message || 'Failed to create employee.' });
    }
});

/**
 * PUT /api/employees/:id
 * Update an existing employee.
 */
router.put('/:id', async (req, res) => {
    try {
        const updates = {};
        const allowed = ['name', 'email', 'phone', 'department', 'designation', 'salary', 'joiningDate', 'status'];
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (updates.email) {
            updates.email = updates.email.trim().toLowerCase();
        }

        const employee = await Employee.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        if (!employee) {
            return res.status(404).json({ ok: false, message: 'Employee not found.' });
        }

        res.json({ ok: true, message: 'Employee updated.', employee });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ ok: false, message: 'Duplicate email.' });
        }
        res.status(500).json({ ok: false, message: err.message || 'Failed to update employee.' });
    }
});

/**
 * DELETE /api/employees/:id
 * Delete an employee.
 */
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ ok: false, message: 'Employee not found.' });
        }
        res.json({ ok: true, message: 'Employee deleted.' });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || 'Failed to delete employee.' });
    }
});

module.exports = router;
