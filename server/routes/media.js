const express = require('express');
const router = express.Router();
const Media = require('../models/media');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only images, videos and documents are allowed!');
    }
  }
});

// Upload new media
router.post('/', auth('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description } = req.body;
    const fileType = req.file.mimetype.split('/')[0]; // 'image', 'video', etc.

    const media = new Media({
      title,
      description,
      type: fileType === 'image' ? 'image' : fileType === 'video' ? 'video' : 'document',
      url: `/uploads/${req.file.filename}`,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await media.save();
    res.status(201).json(media);
  } catch (err) {
    console.error('Error uploading media:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all media
router.get('/', auth('admin'), async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.error('Error fetching media:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete media
router.delete('/:id', auth('admin'), async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    // In a real app, you'd also delete the file from the filesystem here
    res.json({ message: 'Media deleted successfully' });
  } catch (err) {
    console.error('Error deleting media:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;