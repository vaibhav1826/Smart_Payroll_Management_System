const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
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

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,           // explicit production URL
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (Postman, mobile apps, curl)
    if (!origin) return cb(null, true);
    // Allow any vercel.app subdomain  
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    // Allow localhost in development
    if (origin.startsWith('http://localhost')) return cb(null, true);
    // Allow exact matches from env
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
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

// Configure Nodemailer transporter based on .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, message: 'All fields are required.' });
  }

  // If SMTP is not configured, just log to console to prevent crashing in dev
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('⚠️ [Mock Email] Contact form received:', { name, email, message });
    console.log('Please configure SMTP_USER and SMTP_PASS in your .env file to enable real emails.');
    return res.json({ ok: true, message: 'Message logged locally (SMTP not configured).' });
  }

  try {
    const mailOptions = {
      from: `"${name}" <${email}>`, // sender address 
      to: process.env.SMTP_USER, // list of receivers (the site owner)
      subject: `New Contact Inquiry from ${name}`, // Subject line
      text: `You have a new message from ${name} (${email}):\n\n${message}`, // plain text body
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #CC0000; border-bottom: 2px solid #CC0000; padding-bottom: 10px;">New Contact Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message:</strong></p>
                <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #CC0000; border-radius: 4px; white-space: pre-wrap;">${message}</div>
                <p style="margin-top: 30px; font-size: 12px; color: #888;">This email was automatically generated from the Shiv Enterprises website contact form.</p>
            </div>
          `, // html body
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent from ${email}`);
    res.json({ ok: true, message: 'Contact email sent successfully!' });

  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    res.status(500).json({ ok: false, message: 'Failed to send email. Please try again later.' });
  }
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
