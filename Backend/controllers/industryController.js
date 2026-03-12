const Industry = require('../models/Industry');
const { success, fail, serverError } = require('../utils/response');

exports.list = async (req, res) => {
    try {
        const { search, status } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (search) { const r = new RegExp(search, 'i'); filter.$or = [{ name: r }, { code: r }]; }
        const industries = await Industry.find(filter).sort({ createdAt: -1 });
        return success(res, { industries });
    } catch (err) { return serverError(res, err); }
};

exports.getOne = async (req, res) => {
    try {
        const industry = await Industry.findById(req.params.id);
        if (!industry) return fail(res, 'Industry not found.', 404);
        return success(res, { industry });
    } catch (err) { return serverError(res, err); }
};

exports.create = async (req, res) => {
    try {
        const { name, code, description, address, contactPerson, contactPhone } = req.body;
        if (!name) return fail(res, 'Industry name is required.');
        const industry = await Industry.create({ name, code, description, address, contactPerson, contactPhone, createdBy: req.user.userId });
        return success(res, { industry }, 'Industry created.', 201);
    } catch (err) {
        if (err.code === 11000) return fail(res, 'Industry code already exists.', 409);
        return serverError(res, err);
    }
};

exports.update = async (req, res) => {
    try {
        const allowed = ['name', 'code', 'description', 'address', 'contactPerson', 'contactPhone', 'status'];
        const updates = {};
        allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
        const industry = await Industry.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!industry) return fail(res, 'Industry not found.', 404);
        return success(res, { industry }, 'Industry updated.');
    } catch (err) { return serverError(res, err); }
};

exports.remove = async (req, res) => {
    try {
        const industry = await Industry.findByIdAndDelete(req.params.id);
        if (!industry) return fail(res, 'Industry not found.', 404);
        return success(res, {}, 'Industry deleted.');
    } catch (err) { return serverError(res, err); }
};
