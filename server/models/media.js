// Media model
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  filename: String,
  size: Number,
  mimetype: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', MediaSchema);