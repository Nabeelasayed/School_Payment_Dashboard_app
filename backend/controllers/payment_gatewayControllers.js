// routes/payment.js
const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Order = require("../models/order");
const OrderStatus = require("../models/order_status");
const { startPaymentWatcher } = require("../utils/payment_watcherUtils");

// helper to generate sign
function createSign(payload) {
  return jwt.sign(payload, process.env.PG_SECRET, { algorithm: "HS256" });
}

// POST /create-payment
exports.createPayment = (async (req, res) => {
  try {
    const {
      school_id,
      trustee_id,
      student_info,
      gateway_name,
      amount
    } = req.body;


    // 2. Store Order in DB
    const order = await Order.create({
      school_id,
      trustee_id,
      student_info,
      gateway_name
    });

    // 3. Prepare PG Payload
    const payload = {
      school_id,
      amount: String(amount),
      callback_url: process.env.CALLBACK_URL 
    };

    // 4. Generate Sign
    const sign = createSign(payload);

    // 5. Call PG API 
    const response = await axios.post(
      "https://dev-vanilla.edviron.com/erp/create-collect-request",
      { ...payload, sign },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("PG Response:", response.data);
    const { collect_request_id, collect_request_url, collect_sign } = response.data;

    // 6. Save OrderStatus
    await OrderStatus.create({
      collect_id: order._id, // linking with our order
      pg_collect_request_id: collect_request_id,
      order_amount: amount,
      status: "PENDING"
    });

    startPaymentWatcher(collect_request_id);

    // 7. Return Payment Link
    return res.json({
      success: true,
      collect_request_id,
      payment_url: collect_request_url
    });

  } catch (error) {
  console.error("Error in /create-payment:", error); // full error object
  return res.status(500).json({ success: false, error: error.message });
}
});