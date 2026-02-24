const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB } = require('../../shared/utils/db');
const { MONGO_URI } = require('../../shared/config');
const errorHandler = require('../../shared/middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 4001;

app.use(express.json());
app.use(cookieParser());

// Health
app.get('/health', (req, res) => res.json({ ok: true, service: 'auth' }));

// Routes — mounted at root because gateway already prefixes /api/auth
app.use('/api/auth', authRoutes);

app.use(errorHandler);

connectDB(MONGO_URI).then(() => {
    // Seed admin user on first run
    const User = require('./models/User');
    User.findOne({ email: 'vaibhavbhatt145@gmail.com' }).then(async (existing) => {
        if (!existing) {
            await User.create({ email: 'vaibhavbhatt145@gmail.com', password: 'Vai@1234', name: 'Vaibhav Bhatt', role: 'admin' });
            console.log('Seeded admin user: vaibhavbhatt145@gmail.com');
        }
    });
    app.listen(PORT, () => console.log(`Auth Service listening on port ${PORT}`));
});
