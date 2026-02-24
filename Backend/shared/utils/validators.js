/** Common validators */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
    return emailRegex.test(String(email).toLowerCase());
}

function isNonEmptyString(val) {
    return typeof val === 'string' && val.trim().length > 0;
}

function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str.trim();
}

module.exports = { isValidEmail, isNonEmptyString, isValidObjectId, sanitize };
