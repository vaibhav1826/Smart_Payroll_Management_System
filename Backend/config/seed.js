/**
 * Seed allowed users. Only these users can log in (no public registration).
 */
const User = require('../services/auth/models/User');

const ALLOWED_USERS = [
  { email: 'vaibhavbhatt145@gmail.com', password: 'Vai@1234', name: 'Vaibhav Bhatt', role: 'admin', phone: '9876543210' },
];

async function seedUsers() {
  for (const u of ALLOWED_USERS) {
    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      await User.create({ email: u.email, password: u.password, name: u.name, role: u.role, phone: u.phone });
      console.log('Seeded user:', u.email);
    }
  }
}

module.exports = { seedUsers };
