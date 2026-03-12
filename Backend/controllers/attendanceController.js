const Attendance = require('../models/Attendance');
const { success, fail, serverError } = require('../utils/response');

exports.list = async (req, res) => {
    try {
        const { employee, date, month, year, status } = req.query;
        const filter = {};
        if (employee) filter.employee = employee;
        if (status) filter.status = status;
        if (date) {
            const d = new Date(date);
            filter.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
        } else if (month && year) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0, 23, 59, 59, 999);
            filter.date = { $gte: start, $lte: end };
        }
        const records = await Attendance.find(filter).populate('employee', 'name email department').populate('shift', 'name startTime endTime').populate('markedBy', 'name').sort({ date: -1 });
        return success(res, { attendance: records });
    } catch (err) { return serverError(res, err); }
};

exports.mark = async (req, res) => {
    try {
        const { employee, date, status, checkIn, checkOut, shift, overtime, notes } = req.body;
        if (!employee || !date) return fail(res, 'Employee and date are required.');
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        const existing = await Attendance.findOne({ employee, date: dateObj });
        if (existing) {
            Object.assign(existing, { status, checkIn, checkOut, shift, overtime, notes, markedBy: req.user.userId });
            await existing.save();
            return success(res, { attendance: existing }, 'Attendance updated.');
        }
        const record = await Attendance.create({ employee, date: dateObj, status: status || 'present', checkIn, checkOut, shift, overtime, notes, markedBy: req.user.userId });
        return success(res, { attendance: record }, 'Attendance marked.', 201);
    } catch (err) {
        if (err.code === 11000) return fail(res, 'Attendance already marked for this date.', 409);
        return serverError(res, err);
    }
};

exports.bulkMark = async (req, res) => {
    try {
        const { entries } = req.body; // [{ employee, date, status, checkIn, checkOut }]
        if (!Array.isArray(entries) || entries.length === 0) return fail(res, 'Entries array is required.');
        const results = [];
        for (const entry of entries) {
            const dateObj = new Date(entry.date); dateObj.setHours(0, 0, 0, 0);
            const record = await Attendance.findOneAndUpdate(
                { employee: entry.employee, date: dateObj },
                { status: entry.status || 'present', checkIn: entry.checkIn, checkOut: entry.checkOut, overtime: entry.overtime || 0, markedBy: req.user.userId },
                { upsert: true, new: true, runValidators: true }
            );
            results.push(record);
        }
        return success(res, { attendance: results, count: results.length }, `${results.length} records processed.`);
    } catch (err) { return serverError(res, err); }
};

exports.remove = async (req, res) => {
    try {
        const record = await Attendance.findByIdAndDelete(req.params.id);
        if (!record) return fail(res, 'Record not found.', 404);
        return success(res, {}, 'Attendance record deleted.');
    } catch (err) { return serverError(res, err); }
};
