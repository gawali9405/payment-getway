require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Test Product',
                        },
                        unit_amount: 49900,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:${port}/success.html`,
            cancel_url: `http://localhost:${port}/cancel.html`,
        });
        const qrCodeDataUrl = await QRCode.toDataURL(session.url);
        res.json({ id: session.id, qrCode: qrCodeDataUrl });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/stripe-key', (req, res) => {
  res.json({ key: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
