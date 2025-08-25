const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const donationRoutes = require('./routes/donationRoutes');
const partnerRoutes = require('./routes/partners');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

const app = express();
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
app.use('/api/media', require('./routes/media'));
app.use('/api/admin', require('./routes/admin'));

// --- Serve React frontend ---
app.use(express.static(path.join(__dirname1, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
});

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
