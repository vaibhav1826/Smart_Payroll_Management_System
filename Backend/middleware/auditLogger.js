const mongoose = require('mongoose');

/** AuditLog schema — used by the logger middleware */
const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, default: '' },
    userRole: { type: String, default: '' },
    action: { type: String, required: true }, // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
    module: { type: String, required: true }, // employee, attendance, payroll, etc.
    targetId: { type: String, default: '' },
    details: { type: String, default: '' },
    ip: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

/** Log an audit event */
async function logAudit({ userId, userName, userRole, action, module, targetId, details, ip }) {
    try {
        await AuditLog.create({ userId, userName, userRole, action, module, targetId, details, ip });
    } catch (err) {
        console.error('Audit log failed:', err.message);
    }
}

/** Express middleware that auto-logs mutation requests (POST/PUT/DELETE) */
function auditMiddleware(moduleName) {
    return (req, res, next) => {
        const origSend = res.json.bind(res);
        res.json = function (body) {
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && body?.ok) {
                const actionMap = { POST: 'CREATE', PUT: 'UPDATE', PATCH: 'UPDATE', DELETE: 'DELETE' };
                logAudit({
                    userId: req.user?.userId,
                    userName: req.user?.name || req.user?.email || '',
                    userRole: req.user?.role || '',
                    action: actionMap[req.method] || req.method,
                    module: moduleName,
                    targetId: req.params?.id || body?.employee?._id || body?.industry?._id || '',
                    details: `${req.method} ${req.originalUrl}`,
                    ip: req.ip || req.connection?.remoteAddress || '',
                });
            }
            return origSend(body);
        };
        next();
    };
}

module.exports = { AuditLog, logAudit, auditMiddleware };
