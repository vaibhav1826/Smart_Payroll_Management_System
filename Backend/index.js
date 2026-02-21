const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { authRoutes } = require('./auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Connect MongoDB (same DB as MongoDB Compass when using same MONGO_URI)
connectDB();

// Auth microservice – JWT login/register
app.use('/api/auth', authRoutes);

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form received:', { name, email, message });
  res.json({ ok: true, received: { name, email, message } });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
