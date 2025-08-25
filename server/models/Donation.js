const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});


const donationSchema = new mongoose.Schema({
  name: { type: String  },  
  amount: { type: Number, required: true },
  contact: { type: String}, // Optional: Legacy field
  phone: { type: Number },
  email: { type: String },
  items: [itemSchema],
  donationId: {type: String,required: true},
  method: { type: String, required: true },
  successUrl: { type: String },
  cancelUrl: { type: String },
  errorUrl: { type: String },
  date: { type: Date, default: Date.now },
   transactionId: String,
  donationId: String
}
);

module.exports = mongoose.model('Donation', donationSchema);
