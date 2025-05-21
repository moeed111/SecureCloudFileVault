const File = require('../models/File');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../utils/cloudinary');
const axios = require('axios');
const util = require('util');

function encryptFile(inputPath, outputPath, key) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.alloc(16, 0));
  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);
  return new Promise((resolve, reject) => {
    input.pipe(cipher).pipe(output);
    output.on('finish', resolve);
    output.on('error', reject);
  });
}

module.exports = {
  // File upload controller
  uploadFile: async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

      // Upload the file to Cloudinary using the local path from Multer
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'auto',
        folder: 'securecloudvault',
        use_filename: true,
        unique_filename: false,
      });

      // Save file metadata to MongoDB
      const file = new File({
        url: result.secure_url,
        public_id: result.public_id,
        filename: req.file.originalname,
        owner: req.user.id,
      });
      await file.save();

      // DO NOT UNLINK ANY FILE HERE

      res.json({ msg: 'File uploaded', file });
    } catch (err) {
      try {
        // Try to print the error as a string
        console.error('Upload error (toString):', err.toString());
      } catch (e) {
        console.error('Upload error (raw):', err);
      }

      // Print all enumerable properties
      for (const key in err) {
        if (Object.prototype.hasOwnProperty.call(err, key)) {
          console.error(`err[${key}]:`, err[key]);
        }
      }

      // Print the error as JSON if possible
      try {
        console.error('Error as JSON:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      } catch (jsonErr) {
        console.error('Error could not be stringified:', jsonErr);
      }

      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  // List files for the logged-in user
  listFiles: async (req, res) => {
    try {
      const files = await File.find({ owner: req.user.id });
      res.json(files);
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  // Download file by ID (returns Cloudinary URL)
  downloadFile: async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) return res.status(404).json({ msg: 'File not found' });
      if (file.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
      }
      res.json({ url: file.url });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  deleteFile: async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) return res.status(404).json({ msg: 'File not found' });

      // Optionally: Delete from Cloudinary
      // await cloudinary.uploader.destroy(file.cloudinaryId);

      await file.remove();
      res.json({ msg: 'File deleted successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  }
};

