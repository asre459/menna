const express = require('express');
const ContactMessage = require('../models/contactMessage');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO;

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS // Use Gmail App Password if 2FA is enabled
      }
    });

    const mailOptions = {
      from: email,
      to: EMAIL_TO,
      subject: `New contact message from ${name}`,
      text: message
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Contact message sent successfully.' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ error: 'Server error. Try again later.' });
  }
});

module.exports = router;
