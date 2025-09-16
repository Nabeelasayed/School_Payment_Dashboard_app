const express = require('express');
const router = express.Router();
const {authMiddleware, generateToken} = require('../middleware/jwtMiddleware');
const paymentGatewayController = require('../controllers/payment_gatewayControllers');

router.post('/create-payment', authMiddleware, paymentGatewayController.createPayment)

router.post("/callback", (req, res) => {
  console.log("Payment callback received:", req.body);

  // Edviron sends: { status: 200, order_info: { status: "SUCCESS" | "FAILED" | "PENDING", ... } }
  const status =
    req.body?.order_info?.status || req.body?.status || "PENDING";

  let title = "";
  let color = "";
  let message = "";

  switch (status.toUpperCase()) {
    case "SUCCESS":
      title = "✅ Payment Successful";
      color = "green";
      message = "Thank you! Your payment has been processed successfully.";
      break;
    case "FAILED":
      title = "❌ Payment Failed";
      color = "red";
      message = "Oops! Something went wrong. Please try again.";
      break;
    default:
      title = "⌛ Payment Pending";
      color = "orange";
      message = "Your payment is still being processed. Please check back later.";
  }

  // Return simple styled HTML page
  res.send(`
    <html>
      <head><title>Payment Status</title></head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f9fafb;font-family:sans-serif;">
        <div style="background:white;padding:30px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);text-align:center;max-width:400px;">
          <h1 style="color:${color};margin-bottom:16px;">${title}</h1>
          <p style="font-size:16px;color:#333;">${message}</p>
        </div>
      </body>
    </html>
  `);
});

router.get("/callback", (req, res) => {
  res.send(`
    <html>
      <head><title>Payment Status</title></head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f9fafb;font-family:sans-serif;">
        <div style="background:white;padding:30px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);text-align:center;max-width:400px;">
          <h1 style="color:blue;margin-bottom:16px;">Payment Callback Endpoint</h1>
          <p style="font-size:16px;color:#333;">This page is for payment gateway callbacks.<br/>If you’re seeing this directly in your browser, no payment payload was sent.</p>
        </div>
      </body>
    </html>
  `);
});

module.exports = router;