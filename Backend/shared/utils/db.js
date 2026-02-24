const mongoose = require('mongoose');

let isConnected = false;

async function connectDB(uri) {
    if (isConnected) return;
    try {
        await mongoose.connect(uri);
        isConnected = true;
        console.log(`MongoDB connected at ${mongoose.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }

    mongoose.connection.on('disconnected', () => {
        isConnected = false;
        console.log('MongoDB disconnected');
    });
    mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
}

module.exports = { connectDB };
