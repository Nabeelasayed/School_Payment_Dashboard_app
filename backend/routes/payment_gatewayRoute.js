const express = require('express');
const router = express.Router();
const {authMiddleware, generateToken} = require('../middleware/jwtMiddleware');
const paymentGatewayController = require('../controllers/payment_gatewayControllers');

router.post('/create-payment', authMiddleware, paymentGatewayController.createPayment)

router.post("/callback", (req, res) => {
  console.log("Payment callback received:", req.body);

  // Edviron sends: { status: 200, order_info: { status: "SUCCESS" | "FAILED" | "PENDING", ... } }
  const status = req.body?.order_info?.status || req.body?.status || "PENDING";
  console.log("Payment status:", status);
});

router.get("/callback", (req, res) => {
  const status = req.query.status || "UNKNOWN";  // fallback if status is missing
  console.log(status);

  res.send(`
    <html>
      <head><title>Payment Status</title></head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f9fafb;font-family:sans-serif;">
        <div style="background:white;padding:30px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);text-align:center;max-width:400px;">
          <h1 style="color:blue;margin-bottom:16px;">Transaction Outcome </h1>
          <p style="font-size:16px;color:#333;">
            Payment Status: <b style="color:${status === "SUCCESS" ? "green" : "red"};">${status}</b>
          </p>
        </div>
      </body>
    </html>
  `);
});

module.exports = router;