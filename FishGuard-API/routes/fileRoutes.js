const express = require('express');
const multer = require('multer');
const FileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // Batasi 50MB
});

router.post(
  '/upload', 
  authMiddleware, 
  upload.single('file'), 
  FileController.uploadFile
);

router.get('/list', authMiddleware, FileController.listUserFiles);
router.get('/download/:fileId', authMiddleware, FileController.downloadFile);

module.exports = router;