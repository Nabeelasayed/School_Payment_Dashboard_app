const mongoose = require("mongoose");

const WebhookLog = new mongoose.Schema({
  payload: {
    type: Object,   // store webhook body
    required: true
  },
  receivedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("WebhookLog", WebhookLog);