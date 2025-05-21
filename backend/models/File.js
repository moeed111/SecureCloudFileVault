const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  filename: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema);