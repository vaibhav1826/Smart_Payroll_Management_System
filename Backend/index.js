const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRoutes = require('./services/auth/routes/authRoutes');
const employeeRoutes = require('./services/core/routes/employeeRoutes');
const departmentRoutes = require('./services/core/routes/departmentRoutes');
const payrollRoutes = require('./services/finance/routes/payrollRoutes');
const shiftRoutes = require('./services/operations/routes/shiftRoutes');
const attendanceRoutes = require('./services/operations/routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 4000;
const path = require('path');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect MongoDB (same DB as MongoDB Compass when using same MONGO_URI)
connectDB();

// Auth microservice – JWT login/register
app.use('/api/auth', authRoutes);

// Employee CRUD routes (protected)
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);

// Finance / Payroll routes (protected)
app.use('/api/payroll', payrollRoutes);

// Operations routes (protected)
app.use('/api/shifts', shiftRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/api/ping', (req, res) => res.json({ ok: true }));

// Serve static uploads (for profile photos and documents)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form received:', { name, email, message });
  res.json({ ok: true, received: { name, email, message } });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Shiv Enterprises API is running in development mode...');
  });
}

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
