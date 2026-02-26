require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

module.exports = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/shiv_enterprises',
    JWT_SECRET: process.env.JWT_SECRET || 'shiv-enterprises-jwt-secret-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    SESSION_COOKIE_NAME: 'session',
    SESSION_COOKIE_MAX_AGE: Number(process.env.SESSION_MAX_AGE_MS) || 30 * 60 * 1000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    REGISTRATION_SECRET_KEY: process.env.REGISTRATION_SECRET_KEY || 'SHIV_REQ_2026',
};
