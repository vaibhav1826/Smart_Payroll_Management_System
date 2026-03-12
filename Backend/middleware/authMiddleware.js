const jwt = require('jsonwebtoken');
const { JWT_SECRET, SESSION_COOKIE_NAME } = require('../config/config');

/** Extract token from cookie or Authorization header */
function getToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.slice(7);
    return req.cookies?.[SESSION_COOKIE_NAME] || null;
}

/** Verify JWT and attach decoded payload to req.user */
async function verifyToken(req, res, next) {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json({ ok: false, message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { userId, role, email, name }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ ok: false, message: 'Token expired.' });
        }
        return res.status(401).json({ ok: false, message: 'Invalid token.' });
    }
}

/** Require specific role(s) — use after verifyToken */
function requireRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ ok: false, message: 'Not authenticated.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ ok: false, message: 'Insufficient permissions.' });
        }
        next();
    };
}

module.exports = { verifyToken, requireRoles, getToken };
