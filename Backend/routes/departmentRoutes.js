const express = require('express');
const router = express.Router();
const { verifyToken, requireRoles } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/departmentController');

// All endpoints require robust auth
router.use(verifyToken);

// Available to any authenticated user (e.g. creating dropdowns)
router.get('/', ctrl.getDepartments);
router.get('/:id/employees', ctrl.getDepartmentEmployees);

// Restrict modifications to Admin and Manager
router.use(requireRoles('admin', 'manager'));
router.post('/', ctrl.createDepartment);
router.put('/:id', ctrl.updateDepartment);
router.delete('/:id', ctrl.deleteDepartment);

module.exports = router;
