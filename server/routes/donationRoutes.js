// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const ArifPay = require('arifpay-express-plugin'); // ✅ Import plugin
// const axios = require('axios');
// const router = express.Router();
// const Donation = require('../models/Donation');

// //  POST  method 

// router.post('/met', async(req, res) => {
//   const { name, amount} = req.body;

//   if (!name || !amount) {
//     return res.status(400).json({ message: 'Name , amount and method are required.' });
//   }
//    try {
//     const donationId = new mongoose.Types.ObjectId().toString(); // 👈 generate a custom ID
//     const newDonation = new Donation({
//       name,
//       amount,
//       donationId,
//       // contact: contact || null,
//       method:'pending'
//     });

//     await newDonation.save();
//     res.status(201).json({ message: 'Donation recorded successfully.',  donationId: newDonation._id });
//   } catch (err) {
//     console.error('Error saving donation:', err);
//     res.status(500).json({ message: 'Server error. Try again later.' });
//   }
// });
// // Add a new endpoint to update the payment method
// router.patch('/:id/method', async (req, res) => {
//   try {
//       // Add validation for the ID
//      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ message: 'Invalid donation ID' });
//     }
//     const { method } = req.body;
//     const updatedDonation = await Donation.findByIdAndUpdate(
//       req.params.id,
//       { method },
//       { new: true }
//     );
    
//     if (!updatedDonation) {
//       return res.status(404).json({ message: 'Donation not found' });
//     }
    
//     res.json(updatedDonation);
//   } catch (err) {
//     console.error('Error updating donation method:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/pay', async (req, res) => {
//   const { amount, account, method, name, contact } = req.body;

//   if (!amount || !account || !method || !name) {
//     return res.status(400).json({ error: 'name, amount, account, and method are required' });
//   }

//   try {
//     // Replace with your actual HarifPay credentials if required
//     const harifPayApiUrl = 'https://api.harifpay.et/payment'; // Example endpoint

//     const payload = {
//       cancelUrl: "https://example.com",
//       phone: contact || "251943753120",
//       email: "asre45900@gmail.com",
//       nonce: "AAAa123asds",
//       errorUrl: "http://error.com",
//       notifyUrl: "https://example.com",
//       successUrl: "http://example.com",
//       paymentMethods: [method],
//       expireDate: "2025-02-01T03:45:27",
//       items: [
//         {
//           name: "ሙዝ",
//           quantity: 1,
//           price: amount,
//           description: "Fresh Corner preimuim Banana.",
//           image: "https://4.imimg.com/data4/KK/KK/GLADMIN-/product-8789_bananas_golden-500x500.jpg"
//         }
//       ],
//       beneficiaries: [
//         {
//           accountNumber: account,
//           bank: "Commercial bank of ethiopia",
//           amount: amount
//         }
//       ],
//       lang: "EN"
//     };

//     const response = await axios.post(harifPayApiUrl, payload, {
//       headers: {
//         Authorization: `Bearer ${process.env.HARIFPAY_API_KEY}`, // if required
//         'Content-Type': 'application/json'
//       }
//     });

//     res.status(200).json({
//       message: 'Redirect to complete payment',
//       redirectUrl: response.data?.redirectUrl || null,
//       data: response.data
//     });

//   } catch (err) {
//     console.error('HarifPay Error:', err?.response?.data || err.message);
//     res.status(500).json({ error: 'Failed to initiate payment with HarifPay' });
//   }
// });
// // get method
// router.get('/', async (req, res) => {
//   try {
//     const donations = await Donation.find().sort({ date: -1 });
//     res.status(200).json(donations);
//   } catch (err) {
//     console.error('Error fetching donations:', err);
//     res.status(500).json({ error: 'Failed to retrieve donations' });
//   }
// });

// module.exports = router;





const express = require('express');
const mongoose = require('mongoose');
const ArifPay = require('arifpay-express-plugin');
const crypto = require('crypto');
const router = express.Router();
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

// Initialize ArifPay with API Key from .env
const arifpay = new ArifPay(process.env.ARIFPAY_API_KEY);

// ---------------------
// @POST /api/donations/met
// Record a donation in MongoDB
// ---------------------
router.post('/met', async (req, res) => {
  const { name, amount, contact } = req.body;

  if (!name || !amount) {
    return res.status(400).json({ message: 'Name and amount are required.' });
  }

  try {
    const donationId = 'DON-' + Date.now();
    const newDonation = new Donation({
      name,
      amount,
      contact: contact || null,
      method: 'pending',
      donationId,
    });

    await newDonation.save();
    res.status(201).json({
      message: 'Donation recorded successfully.',
      donationId: newDonation._id,
    });
  } catch (err) {
    console.error('Error saving donation:', err);
    res.status(500).json({ message: 'Server error. Try again later.' });
  }
});

// ---------------------
// @PATCH /api/donations/:id/method
// Update payment method/status
// ---------------------
router.patch('/:id/method', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid donation ID' });
  }

  const { method } = req.body;

  try {
    const updated = await Donation.findByIdAndUpdate(
      req.params.id,
      { method },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating method:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------
// @POST /api/donations/pay
// Initiate ArifPay payment
// ---------------------
router.post('/pay', async (req, res) => {
  const { amount, phone, email, items, donationId } = req.body;

  if (!amount || !phone || !email || !items) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const paymentRequest = {
      cancelUrl: "https://your-frontend.com/cancel",
      successUrl: "https://your-frontend.com/success",
      errorUrl: "https://your-frontend.com/error",
      notifyUrl: "https://your-backend.com/api/donations/webhook",
      paymentMethods: ["TELEBIRR_USSD"],
      expireDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      nonce: crypto.randomUUID(),
      beneficiaries: [
        {
          accountNumber: '01320811436100',
          bank: "AWINETAA",
          amount: amount,
        },
      ],
      items: items.map((item) => ({
        name: item.name || "Donation",
        quantity: item.quantity || 1,
        price: item.price || amount,
      })),
      lang: "en",
      phone,
      email,
    };

    const session = await arifpay.Make_payment(paymentRequest);

    if (donationId) {
      await Donation.findByIdAndUpdate(donationId, {
        paymentId: session.paymentId,
        paymentStatus: 'pending',
      });
    }

    return res.status(200).json({
      paymentId: session.paymentId,
      redirectUrl: session.redirectUrl,
    });
  } catch (err) {
    console.error('ArifPay error:', err);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// ---------------------
// @POST /api/donations/webhook
// Handle ArifPay payment notifications
// ---------------------
router.post('/webhook', async (req, res) => {
  const signature = req.headers['x-arifpay-signature'];
  const payload = req.body;

  try {
    const isValid = ArifPay.webhooks.verifySignature(
      payload,
      signature,
      process.env.ARIFPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      return res.status(401).send('Invalid signature');
    }

    const { event, paymentId, paymentMethod } = payload;

    if (event === 'payment.success') {
      await Donation.findOneAndUpdate(
        { paymentId },
        { paymentStatus: 'completed', method: paymentMethod }
      );
    } else if (event === 'payment.failed') {
      await Donation.findOneAndUpdate(
        { paymentId },
        { paymentStatus: 'failed' }
      );
    }

    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Webhook processing failed');
  }
});

// ---------------------
// @GET /api/donations/
// Fetch all donations
// ---------------------
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.status(200).json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Failed to retrieve donations' });
  }
});
// Get all donations
router.get('/', auth('admin'), async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update donation status

router.patch('/:id', auth('admin'), async (req, res) => {
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
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



// const express = require('express');
// const mongoose = require('mongoose');
// const ArifPay = require('arifpay-express-plugin');
// const crypto = require('crypto');
// const router = express.Router();
// const Donation = require('../models/Donation');
// const auth = require('../middleware/auth');

// // Initialize ArifPay
// const arifpay = new ArifPay(process.env.ARIFPAY_API_KEY);
// router.post('/met', async (req, res) => {
//   const { name, amount, contact } = req.body;

//   if (!name || !amount) {
//     return res.status(400).json({ message: 'Name and amount are required.' });
//   }

//   try {
//     const donationId = 'DON-' + Date.now();
//     const newDonation = new Donation({
//       name,
//       amount,
//       contact: contact || null,
//       method: 'pending',
//       donationId,
//     });

//     await newDonation.save();
//     res.status(201).json({
//       message: 'Donation recorded successfully.',
//       donationId: newDonation._id,
//     });
//   } catch (err) {
//     console.error('Error saving donation:', err);
//     res.status(500).json({ message: 'Server error. Try again later.' });
//   }
// });
// router.get('/', auth('admin'), async (req, res) => {
//   try {
//     const { status, startDate, endDate } = req.query;
//     const query = {};
    
//     if (status) query.status = status;
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }

//     const donations = await Donation.find(query)
//       .sort({ createdAt: -1 })
//       .limit(req.query.limit ? parseInt(req.query.limit) : 100);
      
//     res.json(donations);
//   } catch (err) {
//     console.error('Error fetching donations:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// // Record a new donation (before payment)
// // router.post('/', async (req, res) => {
// //   const { name, amount, email, phone } = req.body;

// //   try {
// //     const donation = new Donation({
// //       name,
// //       amount,
// //       email,
// //       phone,
// //       status: 'pending',
// //       donationId: `DON-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
// //     });

// //     await donation.save();
// //     res.status(201).json(donation);
// //   } catch (err) {
// //     console.error('Error saving donation:', err);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });

// // Initiate ArifPay payment
// router.post('/pay', auth('admin'), async (req, res) => {
//   const { donationId, phone, email, items } = req.body;

//   try {
//     const donation = await Donation.findById(donationId);
//     if (!donation) return res.status(404).json({ error: 'Donation not found' });

//     const paymentRequest = {
//       cancelUrl: `${process.env.FRONTEND_URL}/donate/cancel`,
//       successUrl: `${process.env.FRONTEND_URL}/donate/success`,
//       errorUrl: `${process.env.FRONTEND_URL}/donate/error`,
//       notifyUrl: `${process.env.BACKEND_URL}/api/donations/webhook`,
//       paymentMethods: ["TELEBIRR_USSD"],
//       expireDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
//       nonce: crypto.randomUUID(),
//       beneficiaries: [{
//         accountNumber: process.env.ARIFPAY_ACCOUNT,
//         bank: "AWINETAA",
//         amount: donation.amount,
//       }],
//       items: items || [{
//         name: "Donation",
//         quantity: 1,
//         price: donation.amount,
//       }],
//       lang: "en",
//       phone,
//       email,
//     };

//     const session = await arifpay.Make_payment(paymentRequest);
    
//     // Update donation with payment ID
//     donation.paymentId = session.paymentId;
//     await donation.save();

//     res.json({
//       paymentId: session.paymentId,
//       redirectUrl: session.redirectUrl,
//       donation
//     });
//   } catch (err) {
//     console.error('Payment error:', err);
//     res.status(500).json({ error: 'Payment processing failed' });
//   }
// });

// // Webhook for payment notifications
// router.post('/webhook', async (req, res) => {
//   const signature = req.headers['x-arifpay-signature'];
//   const payload = req.body;

//   try {
//     const isValid = ArifPay.webhooks.verifySignature(
//       payload,
//       signature,
//       process.env.ARIFPAY_WEBHOOK_SECRET
//     );

//     if (!isValid) return res.status(401).send('Invalid signature');

//     const { event, paymentId, paymentMethod } = payload;
//     const donation = await Donation.findOne({ paymentId });

//     if (!donation) return res.status(404).send('Donation not found');

//     switch (event) {
//       case 'payment.success':
//         donation.status = 'completed';
//         donation.method = paymentMethod;
//         break;
//       case 'payment.failed':
//         donation.status = 'failed';
//         break;
//     }

//     await donation.save();
//     res.status(200).send('Webhook processed');
//   } catch (err) {
//     console.error('Webhook error:', err);
//     res.status(500).send('Webhook processing failed');
//   }
// });

// // Get all donations (admin only)
// router.get('/', auth('admin'), async (req, res) => {
//   try {
//     const donations = await Donation.find().sort({ createdAt: -1 });
//     res.json(donations);
//   } catch (err) {
//     console.error('Error fetching donations:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Update donation status (admin only)
// router.patch('/:id', auth('admin'), async (req, res) => {
//   try {
//     const donation = await Donation.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     );
    
//     if (!donation) return res.status(404).json({ error: 'Donation not found' });
//     res.json(donation);
//   } catch (err) {
//     console.error('Error updating donation:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;

