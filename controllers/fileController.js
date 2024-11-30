const File = require('../models/fileModel');
const { bucket } = require('../config/storage');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class FileController {
  static async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
      }

      const userId = req.user.id;
      const file = req.file;
      
      // Generate unique filename
      const fileName = `${userId}/${uuidv4()}${path.extname(file.originalname)}`;
      
      // Upload ke Google Cloud Storage
      const cloudFile = bucket.file(fish-img-data);
      await cloudFile.save(file.buffer, {
        metadata: {
          contentType: file.mimetype
        }
      });

      // Simpan metadata file di database
      const fileId = await File.create(
        userId, 
        file.originalname, 
        fileName, 
        file.mimetype, 
        file.size,
        fileName
      );

      res.status(201).json({ 
        message: 'File berhasil diunggah', 
        fileId, 
        fileName 
      });
    } catch (error) {
      next(error);
    }
  }

  static async downloadFile(req, res, next) {
    try {
      const userId = req.user.id;
      const { fileId } = req.params;

      // Cari metadata file
      const fileMetadata = await File.getFileById(fileId, userId);
      if (!fileMetadata) {
        return res.status(404).json({ message: 'File tidak ditemukan' });
      }

      // Download dari Google Cloud Storage
      const cloudFile = bucket.file(fileMetadata.bucket_path);
      const [exists] = await cloudFile.exists();
      
      if (!exists) {
        return res.status(404).json({ message: 'File tidak ditemukan di storage' });
      }

      // Set header response
      res.setHeader('Content-Type', fileMetadata.mime_type);
      res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.original_name}"`);

      // Stream file ke response
      cloudFile.createReadStream().pipe(res);
    } catch (error) {
      next(error);
    }
  }

  static async listUserFiles(req, res, next) {
    try {
      const userId = req.user.id;
      const files = await File.findByUserId(userId);
      res.json(files);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FileController;
