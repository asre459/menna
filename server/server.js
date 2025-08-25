const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const donationRoutes = require('./routes/donationRoutes');
const partnerRoutes = require('./routes/partners');
const contactRoutes = require('./routes/contact'); // Only include if implemented
const authRoutes = require('./routes/auth'); // Optional, if you have authenticatio
const app = express();
const path = require('path');

const __dirname1 = path.resolve();
// --- CORS setup ---
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH'],
  credentials: true
}));

app.use(express.json());

// --- Routes ---
app.use('/api/donations', donationRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/contact', contactRoutes); // Optional
app.use('/api/auth', authRoutes); // Optional, if you have authentication
app.use('/api/media', require('./routes/media'));
app.use('/api/admin', require('./routes/admin')); // Admin routes

// Serve static frontend files
app.use(express.static(path.join(__dirname1, "/client/dist")));

// Catch-all: send index.html for SPA routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
});
// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {console.log(`🚀 Server running on http://localhost:${process.env.PORT}`); });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
