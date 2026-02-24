const express = require('express');
const ctrl = require('../controllers/authController');
const { verifyToken, requireRoles } = require('../../../shared/middleware/authMiddleware');

const router = express.Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/logout', ctrl.logout);
router.post('/refresh', verifyToken, ctrl.refresh);
router.get('/me', verifyToken, ctrl.me);
router.get('/users', verifyToken, requireRoles('admin'), ctrl.listUsers);
router.put('/users/:id', verifyToken, requireRoles('admin'), ctrl.updateUser);

module.exports = router;
