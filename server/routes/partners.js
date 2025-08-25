const express = require('express');
const router = express.Router();
const partners = [
  {
    id: "telebirr",
    name: "Telebirr",
    description: "Telebirr is a mobile money service provider in Ethiopia",
    input: "phone number"
  },
  {
    id: "cbebirr",
    name: "Cbe Birr",
    description: "CBE Birr is a mobile money service provider in Ethiopia",
    input: "phone number"
  },
  {
    id: "mpesa",
    name: "Mpesa",
    description: "Mpsea is a mobile money service provider in Ethiopia by Safaricom",
    input: "safaricom"
  },
  {
    id: "Commercial bank",
    name: "Commercial Bank of Ethiopia",
    description: "Commercial Bank of Ethiopia is the largest bank in Ethiopia",
    input: "account number"
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "PayPal is an international digital payment platform",
    input: "email"
  },
  {
    id: "mastercard",
    name: "MasterCard",
    description: "MasterCard is a global payment network for credit/debit cards",
    input: "card number"
  }
];

// GET /api/partners
router.get('/', (req, res) => {
  res.json({ partners });
});

// POST /api/partners/validate
router.post('/validate', (req, res) => {
  const { id, inputValue } = req.body;

  const partner = partners.find(p => p.id === id);
  if (!partner) {
    return res.status(404).json({ error: 'Partner not found' });
  }

  // Define validation regexes
  const phoneRegex = /^(\+251|0)?9\d{8}$/;
  const accountRegex = /^\d{8,16}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cardNumberRegex = /^\d{13,19}$/;
    const safaricomphoneRegex = /^(\+251|0)?7\d{8}$/;

  let valid = false;
  switch (partner.input) {
    case 'phone number':
      valid = phoneRegex.test(inputValue);
      break;
       case 'safaricom':
      valid = safaricomphoneRegex.test(inputValue);
      break;
    case 'account number':
      valid = accountRegex.test(inputValue);
      break;
    case 'email':
      valid = emailRegex.test(inputValue);
      break;
    case 'card number':
      valid = cardNumberRegex.test(inputValue);
      break;
    default:
  return res.status(400).json({ error: 'Unsupported input type' });
  }
  res.json({ valid });
});

module.exports = router;
