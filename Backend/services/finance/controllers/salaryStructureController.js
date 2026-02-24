const SalaryStructure = require('../models/SalaryStructure');
const { success, fail, serverError } = require('../../../shared/utils/response');

exports.list = async (req, res) => {
    try { return success(res, { structures: await SalaryStructure.find().sort({ designation: 1 }) }); }
    catch (err) { return serverError(res, err); }
};
exports.create = async (req, res) => {
    try {
        const { designation, basicPercent, hraPercent, daPercent, pfPercent, otherAllowances } = req.body;
        if (!designation) return fail(res, 'Designation is required.');
        const s = await SalaryStructure.create({ designation, basicPercent, hraPercent, daPercent, pfPercent, otherAllowances });
        return success(res, { structure: s }, 'Salary structure created.', 201);
    } catch (err) { return serverError(res, err); }
};
exports.update = async (req, res) => {
    try {
        const updates = {};
        ['designation', 'basicPercent', 'hraPercent', 'daPercent', 'pfPercent', 'otherAllowances'].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
        const s = await SalaryStructure.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!s) return fail(res, 'Not found.', 404);
        return success(res, { structure: s }, 'Updated.');
    } catch (err) { return serverError(res, err); }
};
exports.remove = async (req, res) => {
    try { const s = await SalaryStructure.findByIdAndDelete(req.params.id); if (!s) return fail(res, 'Not found.', 404); return success(res, {}, 'Deleted.'); }
    catch (err) { return serverError(res, err); }
};
