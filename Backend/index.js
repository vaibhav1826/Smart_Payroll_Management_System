const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Optional MongoDB connection
if (process.env.MONGO_URI) {
  const mongoose = require('mongoose');
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error', err));
}

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form received:', { name, email, message });
  // TODO: persist to DB or send email
  res.json({ ok: true, received: { name, email, message } });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
