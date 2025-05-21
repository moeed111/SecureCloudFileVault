const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { listUsers, updateUserRole } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', auth, role('admin'), listUsers);
router.put('/users/:userId/role', auth, role('admin'), updateUserRole);

module.exports = router;
