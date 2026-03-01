/**
 * Reset Script — Drops all data from every collection in shiv_enterprises DB.
 * Run: node resetDatabase.js
 */
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shiv_enterprises';

async function resetDatabase() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to:', mongoose.connection.host);

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
        console.log('ℹ️  Database is already empty.');
    } else {
        for (const col of collections) {
            await db.collection(col.name).deleteMany({});
            console.log(`🗑️  Cleared: ${col.name}`);
        }
        console.log('\n✅ All data removed successfully!');
        console.log('You can now add fresh data from your application.');
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
}

resetDatabase().catch((err) => {
    console.error('❌ Error during reset:', err.message);
    process.exit(1);
});
