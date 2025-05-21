const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Get file extension
    const ext = file.originalname.split('.').pop().toLowerCase();
    // List of raw file types
    const rawTypes = ['pdf', 'docx', 'pptx', 'ppt', 'txt', 'zip', 'rar', 'csv', 'xlsx'];
    // List of image types
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    // List of video types
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

    let resourceType = 'auto';
    if (rawTypes.includes(ext)) resourceType = 'raw';
    else if (imageTypes.includes(ext)) resourceType = 'image';
    else if (videoTypes.includes(ext)) resourceType = 'video';

    return {
      folder: 'securecloudvault',
      resource_type: resourceType,
      allowed_formats: [...imageTypes, ...rawTypes, ...videoTypes],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;