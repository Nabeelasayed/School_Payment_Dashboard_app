// utils/paymentWatcher.js
const axios = require("axios");
const jwt = require("jsonwebtoken");
const OrderStatus = require("../models/order_status");
const WebhookLog = require("../models/webhook_logs");

async function checkPaymentStatus(collect_request_id) {
  const payload = {
    school_id: process.env.SCHOOL_ID,
    collect_request_id
  };
  const sign = jwt.sign(payload, process.env.PG_SECRET, { algorithm: "HS256" });

  const response = await axios.get(
    `https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}?school_id=${process.env.SCHOOL_ID}&sign=${sign}`,
    { headers: { Authorization: `Bearer ${process.env.PAYMENT_API_KEY}` } }
  );

  return response.data;
}

async function startPaymentWatcher(collect_request_id) {
  console.log(`🔍 Watching Payment ${collect_request_id}...`);

  const interval = setInterval(async () => {
    try {
      const data = await checkPaymentStatus(collect_request_id);

      if (data.status !== "NOT INITIATED") {
        console.log(`✅ Payment ${collect_request_id} finished with status: ${data.status}`);
        const data_update = {
            status : data.status,
            transaction_amount: data.transaction_amount,
            payment_mode: data.details.payment_mode,
            bank_reference: data.details.bank_reference,
            payment_details: JSON.stringify(data.details),
            payment_time: new Date(),
            payment_message: data.status,
            error_message: data.error_message || ""
        }
        await OrderStatus.findOneAndUpdate(
          { pg_collect_request_id: collect_request_id },
          data_update,
          { new: true }
        );

         await WebhookLog.create({
          payload: data,
          receivedAt: new Date()
        });


        clearInterval(interval); // stop watching
      }
    } catch (err) {
      console.error("Watcher error:", err.message);
      clearInterval(interval);
    }
  }, 5000); // check every 15 seconds
}

module.exports = { startPaymentWatcher };