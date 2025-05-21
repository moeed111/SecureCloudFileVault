const cloudinary = require('cloudinary').v2;

// Replace these with your actual Cloudinary credentials (in quotes)
cloudinary.config({
  cloud_name: 'duczaxhkd',
  api_key: '738185656481479',
  api_secret: 'CsqylxrKTU_5YUhigNryMQN7zpY',
});

// Place a small image file named 'testfile.png' in your backend folder
cloudinary.uploader.upload('testfile.jpg', { resource_type: 'auto' })
  .then(result => console.log('Upload success:', result))
  .catch(err => console.error('Upload error:', err));
