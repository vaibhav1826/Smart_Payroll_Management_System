const express = require('express');
const ctrl = require('../controllers/employeeController');
const { verifyToken, requireRoles } = require('../../../shared/middleware/authMiddleware');
const { auditMiddleware } = require('../../../shared/middleware/auditLogger');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(verifyToken);
router.use(auditMiddleware('employee'));

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', requireRoles('admin', 'supervisor'), ctrl.create);
router.put('/:id', requireRoles('admin', 'supervisor'), ctrl.update);
router.delete('/:id', requireRoles('admin'), ctrl.remove);

module.exports = router;
