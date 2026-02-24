/** Standardized API response helpers */

function success(res, data = {}, message = 'Success', status = 200) {
    return res.status(status).json({ ok: true, message, ...data });
}

function fail(res, message = 'Something went wrong', status = 400, extra = {}) {
    return res.status(status).json({ ok: false, message, ...extra });
}

function serverError(res, err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: err.message || 'Internal server error' });
}

module.exports = { success, fail, serverError };
