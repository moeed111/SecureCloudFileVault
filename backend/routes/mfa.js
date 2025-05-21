const express = require('express');
const auth = require('../middleware/auth');
const { generateMfa, verifyMfa } = require('../controllers/mfaController');

const router = express.Router();

router.post('/generate', auth, generateMfa);
router.post('/verify', auth, verifyMfa);

module.exports = router;