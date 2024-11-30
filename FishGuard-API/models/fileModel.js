const db = require('../config/database');
const { bucket } = require('../config/storage');

class File {
  static async create(userId, originalName, fileName, mimeType, size, bucketPath) {
    const [result] = await db.execute(
      'INSERT INTO files (user_id, original_name, file_name, mime_type, size, bucket_path) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, originalName, fileName, mimeType, size, bucketPath]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM files WHERE user_id = ?', [userId]);
    return rows;
  }

  static async getFileById(fileId, userId) {
    const [rows] = await db.execute(
      'SELECT * FROM files WHERE id = ? AND user_id = ?', 
      [fileId, userId]
    );
    return rows[0];
  }
}

module.exports = File;