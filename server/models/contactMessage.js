const  mongoose = require('mongoose');
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true ,trim: true },
  email: { type: String, required: true ,trim: true, match: /.+\@.+\..+/ }, 
  message: { type: String, required: true ,trim: true, minlength: 10 }, 
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ContactMessage', contactMessageSchema);
// This schema defines a ContactMessage model with fields for name, email, message, and createdAt timestamp.