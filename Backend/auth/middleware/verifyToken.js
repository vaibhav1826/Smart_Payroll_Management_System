const jwt = require('jsonwebtoken');
const { JWT_SECRET, SESSION_COOKIE_NAME } = require('../config');
const User = require('../../models/User');

/**
 * Get token from Authorization header or from session cookie.
 */
function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.slice(7);
  return req.cookies && req.cookies[SESSION_COOKIE_NAME] ? req.cookies[SESSION_COOKIE_NAME] : null;
}

/**
 * Verify JWT and attach user to req. Use on protected routes.
 */
async function verifyToken(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ ok: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ ok: false, message: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ ok: false, message: 'Token expired.' });
    }
    return res.status(401).json({ ok: false, message: 'Invalid token.' });
  }
}

/**
 * Optional: require specific role(s)
 */
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

module.exports = { verifyToken, requireRoles };
