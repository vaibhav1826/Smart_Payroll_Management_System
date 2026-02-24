/**
 * API Gateway — single entry point for the frontend.
 * Proxies requests to individual microservices.
 */
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// Health check
app.get('/api/ping', (req, res) => res.json({ ok: true, service: 'gateway' }));

// Proxy rules — route to microservices
const proxyOpts = (target) => ({
    target,
    changeOrigin: true,
    onError: (err, req, res) => {
        console.error(`Proxy error to ${target}:`, err.message);
        res.status(502).json({ ok: false, message: 'Service unavailable' });
    },
});

app.use('/api/auth', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.AUTH_SERVICE_PORT || 4001}`)));
app.use('/api/employees', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.CORE_SERVICE_PORT || 4002}`)));
app.use('/api/industries', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.CORE_SERVICE_PORT || 4002}`)));
app.use('/api/contractors', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.CORE_SERVICE_PORT || 4002}`)));
app.use('/api/supervisors', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.CORE_SERVICE_PORT || 4002}`)));
app.use('/api/attendance', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.OPS_SERVICE_PORT || 4003}`)));
app.use('/api/leaves', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.OPS_SERVICE_PORT || 4003}`)));
app.use('/api/shifts', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.OPS_SERVICE_PORT || 4003}`)));
app.use('/api/payroll', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.FINANCE_SERVICE_PORT || 4004}`)));
app.use('/api/salary-slips', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.FINANCE_SERVICE_PORT || 4004}`)));
app.use('/api/salary-structures', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.FINANCE_SERVICE_PORT || 4004}`)));
app.use('/api/notifications', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.PLATFORM_SERVICE_PORT || 4005}`)));
app.use('/api/reports', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.PLATFORM_SERVICE_PORT || 4005}`)));
app.use('/api/audit-logs', createProxyMiddleware(proxyOpts(`http://localhost:${process.env.PLATFORM_SERVICE_PORT || 4005}`)));

// Contact form (handled locally)
app.use(express.json());
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log('Contact form:', { name, email, message });
    res.json({ ok: true, received: { name, email, message } });
});

app.listen(PORT, () => console.log(`API Gateway listening on port ${PORT}`));
