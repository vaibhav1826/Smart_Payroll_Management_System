const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } = require('../config');
const User = require('../../models/User');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: SESSION_COOKIE_MAX_AGE,
  path: '/',
};

/**
 * POST /api/auth/login
 * Only pre-seeded / allowed users can log in. No public registration.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password required.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password.' });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);
    res.json({
      ok: true,
      message: 'Login successful.',
      user: { _id: user._id, email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message || 'Login failed.' });
  }
});

/**
 * POST /api/auth/logout – clear session cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/', httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true, message: 'Logged out.' });
});

/**
 * POST /api/auth/refresh – extend session (sliding); call when user clicks "Continue" after inactivity
 */
router.post('/refresh', verifyToken, (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id, role: req.user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);
  res.json({ ok: true, user: req.user });
});

/**
 * GET /api/auth/me – current user (protected); supports cookie or Bearer
 */
router.get('/me', verifyToken, (req, res) => {
  res.json({ ok: true, user: req.user });
});

/**
 * GET /api/auth/users – list users by role (admin only)
 */
router.get('/users', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ ok: false, message: 'Admin access required.' });
    }
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    return res.json({ ok: true, users });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
});

/**
 * POST /api/auth/users – admin creates a user account (manager/supervisor)
 */
router.post('/users', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ ok: false, message: 'Admin access required.' });
    }
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ ok: false, message: 'name, email, password, and role are required.' });
    }
    const allowed = ['manager', 'supervisor'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ ok: false, message: `Role must be one of: ${allowed.join(', ')}.` });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ ok: false, message: 'A user with this email already exists.' });
    }
    const user = await User.create({ name, email, password, role });
    return res.status(201).json({
      ok: true,
      message: 'User account created.',
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
});

/**
 * PUT /api/auth/users/:id – admin updates a user account
 */
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ ok: false, message: 'Admin access required.' });
    }
    const { name, email, role, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (role) update.role = role;
    if (password) update.password = password; // pre-save hook will hash it

    // Use findById + save so the password pre-save hook fires
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ ok: false, message: 'User not found.' });
    Object.assign(user, update);
    await user.save();
    return res.json({
      ok: true,
      message: 'User updated.',
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
});

/**
 * DELETE /api/auth/users/:id – admin deletes a user account
 */
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ ok: false, message: 'Admin access required.' });
    }
    await User.findByIdAndDelete(req.params.id);
    return res.json({ ok: true, message: 'User deleted.' });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;

