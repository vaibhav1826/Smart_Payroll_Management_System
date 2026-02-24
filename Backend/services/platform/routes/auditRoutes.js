const express = require('express');
const ctrl = require('../controllers/auditController');
const { verifyToken, requireRoles } = require('../../../shared/middleware/authMiddleware');
const router = express.Router();
router.use(verifyToken);
router.use(requireRoles('admin'));
router.get('/', ctrl.list);
module.exports = router;
