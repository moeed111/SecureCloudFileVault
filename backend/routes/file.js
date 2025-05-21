const express = require('express');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const { uploadFile, listFiles, downloadFile, deleteFile } = require('../controllers/fileController');
const logAction = require('../middleware/logAction');

const router = express.Router();

router.post('/upload', auth, logAction('upload'), upload.single('file'), uploadFile);

// List files for user
router.get('/list', auth, listFiles);

// Download file by ID
router.get('/download/:id', auth, downloadFile);

router.delete('/delete/:id', auth, logAction('delete'), deleteFile);

module.exports = router;