const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import your routes
const donationRoutes = require('./routes/donationRoutes');
const partnerRoutes = require('./routes/partners');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const adminRoutes = require('./routes/admin');

const app = express();
const __dirname1 = path.resolve();

// --- CORS setup ---
const allowedOrigins = [
  process.env.FRONTEND_URL, // e.g., 'https://asremannas.onrender.com'
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
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// --- Body parser ---
app.use(express.json());

// --- API Routes ---
app.use('/api/donations', donationRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/admin', adminRoutes);

// --- Serve React frontend ---
const clientPath = path.join(__dirname1, 'client-side', 'dist');
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(clientPath, 'index.html'));
});

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
