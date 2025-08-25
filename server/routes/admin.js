// routes/admin.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Media = require('../models/media');
const User = require('../models/User');
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

// ---------------------
// Dashboard Data Endpoints
// ---------------------

// Get dashboard overview stats
router.get('/dashboard-stats', auth('admin'), async (req, res) => {
  try {
    const [totalDonations, recentDonations, mediaCount, userCount] = await Promise.all([
      Donation.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Donation.aggregate([
        { $match: { 
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } // Last 30 days
        }},
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Media.countDocuments(),
      User.countDocuments()
    ]);

    res.json({
      totalDonations: totalDonations[0]?.total || 0,
      recentDonations: recentDonations[0]?.total || 0,
      mediaCount,
      userCount
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------
// Donations Endpoints
// ---------------------

// Get all donations with filtering
router.get('/donations', auth('admin'), async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Donation.countDocuments(query);

    res.json({
      donations,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit))
    });
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update donation status
router.patch('/donations/:id', auth('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    
    res.json(donation);
  } catch (err) {
    console.error('Error updating donation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donation summary stats
router.get('/donations/summary', auth('admin'), async (req, res) => {
  try {
    const [totalAmount, completedCount, pendingCount, failedCount] = await Promise.all([
      Donation.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Donation.countDocuments({ status: 'completed' }),
      Donation.countDocuments({ status: 'pending' }),
      Donation.countDocuments({ status: 'failed' })
    ]);

    res.json({
      totalAmount: totalAmount[0]?.total || 0,
      completedCount,
      pendingCount,
      failedCount
    });
  } catch (err) {
    console.error('Error fetching donation summary:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------
// Media Endpoints
// ---------------------

// Upload new media
router.post('/media', auth('admin'), upload.single('file'), async (req, res) => {
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
router.get('/media', auth('admin'), async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    const media = await Media.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Media.countDocuments();

    res.json({
      media,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit))
    });
  } catch (err) {
    console.error('Error fetching media:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete media
router.delete('/media/:id', auth('admin'), async (req, res) => {
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

// ---------------------
// Users Endpoints
// ---------------------

// Create new user
router.post('/users', auth('admin'), async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      password,
      role: role || 'editor',
      isAdmin: role === 'admin'
    });

    await user.save();
    
    // Don't return password hash
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', auth('admin'), async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    const users = await User.find({}, '-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await User.countDocuments();

    res.json({
      users,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit))
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', auth('admin'), async (req, res) => {
  try {
    // Prevent deleting own account
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------
// Analytics Endpoints
// ---------------------

// Get donation analytics
router.get('/analytics/donations', auth('admin'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    let days;
    
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      default: days = 30;
    }

    const date = new Date();
    date.setDate(date.getDate() - days);

    // Total donations for period
    const total = await Donation.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: date }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Donations by method
    const byMethod = await Donation.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: date }
        }
      },
      { $group: { _id: '$method', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Daily donations for chart
    const daily = await Donation.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: date }
        }
      },
      { 
        $group: { 
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
          },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalAmount: total[0]?.total || 0,
      byMethod,
      daily
    });
  } catch (err) {
    console.error('Error fetching donation analytics:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;