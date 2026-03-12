const Shift = require('../models/Shift');
const { success, fail, serverError } = require('../utils/response');

exports.list = async (req, res) => {
    try { const shifts = await Shift.find().sort({ createdAt: -1 }); return success(res, { shifts }); }
    catch (err) { return serverError(res, err); }
};
exports.create = async (req, res) => {
    try {
        const { name, startTime, endTime, breakDuration } = req.body;
        if (!name || !startTime || !endTime) return fail(res, 'Name, startTime, endTime required.');
        const shift = await Shift.create({ name, startTime, endTime, breakDuration });
        return success(res, { shift }, 'Shift created.', 201);
    } catch (err) { return serverError(res, err); }
};
exports.update = async (req, res) => {
    try {
        const updates = {};
        ['name', 'startTime', 'endTime', 'breakDuration', 'isActive'].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
        const shift = await Shift.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!shift) return fail(res, 'Shift not found.', 404);
        return success(res, { shift }, 'Shift updated.');
    } catch (err) { return serverError(res, err); }
};
exports.remove = async (req, res) => {
    try { const shift = await Shift.findByIdAndDelete(req.params.id); if (!shift) return fail(res, 'Shift not found.', 404); return success(res, {}, 'Shift deleted.'); }
    catch (err) { return serverError(res, err); }
};
