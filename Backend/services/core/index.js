const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB } = require('../../shared/utils/db');
const { MONGO_URI } = require('../../shared/config');
const errorHandler = require('../../shared/middleware/errorHandler');

const app = express();
const PORT = process.env.CORE_SERVICE_PORT || 4002;

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => res.json({ ok: true, service: 'core' }));

app.use('/api/industries', require('./routes/industryRoutes'));
app.use('/api/contractors', require('./routes/contractorRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/supervisors', require('./routes/supervisorRoutes'));

app.use(errorHandler);

connectDB(MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`Core Service listening on port ${PORT}`));
});
