const express = require('express');
const ctrl = require('../controllers/managerController');
const { verifyToken, requireRoles } = require('../../../shared/middleware/authMiddleware');
const { auditMiddleware } = require('../../../shared/middleware/auditLogger');
const router = express.Router();

router.use(verifyToken);
router.use(auditMiddleware('manager'));

// Admin can list all; manager can list their own (filtered in controller)
router.get('/', requireRoles('admin', 'manager'), ctrl.list);
router.get('/:id', requireRoles('admin', 'manager'), ctrl.getOne);

// Only admin can create/update/delete managers
router.post('/', requireRoles('admin'), ctrl.create);
router.put('/:id', requireRoles('admin'), ctrl.update);
router.delete('/:id', requireRoles('admin'), ctrl.remove);

module.exports = router;
