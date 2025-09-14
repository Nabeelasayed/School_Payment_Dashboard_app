const mongoose = require("mongoose");

const Order = new mongoose.Schema({
  school_id: {
    type: String,
    required: true
  },
  trustee_id: {
    type: String,
    required: true
  },
  student_info: {
    name: { type: String, required: true },
    id: { type: String, required: true },
    email: { type: String, required: true }
  },
  gateway_name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Order", Order);