// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user|| !(await user.comparePassword(password))) {
      // console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.username, 'role:', user.role, 'isAdmin:', user.isAdmin);

    if (user.role !== 'admin') {
      console.log('Access denied: not admin role');
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // const isMatch = await user.comparePassword(password);
    // console.log('Password match:', isMatch);

    // if (!isMatch) {
    //   return res.status(400).json({ message: 'Invalid credentials' });
    // }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET ,
      { expiresIn: '9d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      username,
      password,
      role: role || 'admin' // Default to admin if not provided
    });

    await user.save();
    res.status(201).json({ message: 'Admin user created successfully' });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
