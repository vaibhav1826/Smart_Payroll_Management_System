/**
 * Auth microservice – JWT-based login/register and protected routes
 */
const authRoutes = require('./routes/authRoutes');
const { verifyToken, requireRoles } = require('./middleware/verifyToken');

module.exports = {
  authRoutes,
  verifyToken,
  requireRoles,
};
