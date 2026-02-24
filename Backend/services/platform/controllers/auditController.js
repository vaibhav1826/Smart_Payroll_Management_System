const { AuditLog } = require('../../../shared/middleware/auditLogger');
const { success, fail, serverError } = require('../../../shared/utils/response');

exports.list = async (req, res) => {
    try {
        const { module, action, userId, limit } = req.query;
        const filter = {};
        if (module) filter.module = module;
        if (action) filter.action = action;
        if (userId) filter.userId = userId;
        const logs = await AuditLog.find(filter).sort({ timestamp: -1 }).limit(Number(limit) || 100);
        return success(res, { logs });
    } catch (err) { return serverError(res, err); }
};
