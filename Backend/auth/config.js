/**
 * JWT Auth microservice config
 */
const THIRTY_MIN_MS = 30 * 60 * 1000;

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'shiv-enterprises-jwt-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  SESSION_COOKIE_NAME: 'session',
  SESSION_COOKIE_MAX_AGE: Number(process.env.SESSION_MAX_AGE_MS) || THIRTY_MIN_MS,
};
