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

module.exports = router;
