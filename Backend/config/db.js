/**
 * MongoDB connection – use this same URI in MongoDB Compass to view/edit data.
 * Default: mongodb://localhost:27017/shiv_enterprises
 */
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shiv_enterprises';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected at', mongoose.connection.host);
    const { seedUsers } = require('./seed');
    await seedUsers();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

module.exports = { connectDB, MONGO_URI };
