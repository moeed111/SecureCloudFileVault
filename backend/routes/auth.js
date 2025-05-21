const express = require('express');
const { check } = require('express-validator');
const { register, login, registerUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', [
  check('email', 'Valid email required').isEmail(),
  check('password', 'Password required').exists(),
], login);

module.exports = router;