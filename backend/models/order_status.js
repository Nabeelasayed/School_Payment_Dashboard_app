const mongoose = require("mongoose");

const OrderStatusSchema = new mongoose.Schema({
  collect_id: {   // as per company doc = reference to your Order._id
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  pg_collect_request_id: {  // to store gateway's collect_request_id
    type: String,
    required: true
  },
  order_amount: Number,
  transaction_amount: Number,
  payment_mode: String,
  payment_details: String,
  bank_reference: String,
  payment_message: String,
  status: { type: String, default: "PENDING" },
  error_message: String,
  payment_time: Date
});

module.exports = mongoose.model("OrderStatus", OrderStatusSchema);