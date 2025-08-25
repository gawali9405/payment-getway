require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const path = require('path');

const app = express();
const port = 3000;

// Initialize Razorpay with keys from .env file
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/get-razorpay-key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

app.post('/create-order', async (req, res) => {
  const options = {
    amount: 49900,  
    currency: 'INR',
    receipt: 'order_rcptid_11',
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
