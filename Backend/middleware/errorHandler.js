/** Global error handler — mount as last middleware */
function errorHandler(err, req, res, _next) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
    const status = err.statusCode || 500;
    res.status(status).json({
        ok: false,
        message: err.message || 'Internal server error',
    });
}

module.exports = errorHandler;
