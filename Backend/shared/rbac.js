/**
 * RBAC Middleware — requireRole(...roles)
 * Usage: router.get('/route', verifyToken, requireRole('admin'), handler)
 */
const { verifyToken } = require('../auth/middleware/verifyToken');

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ ok: false, message: 'Authentication required.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                ok: false,
                message: `Access denied. Required role: ${roles.join(' or ')}.`
            });
        }
        next();
    };
}

module.exports = { requireRole, verifyToken };
