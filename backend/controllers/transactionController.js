const mongoose = require("mongoose");
const Order = require("../models/order");
const OrderStatus = require("../models/order_status");

// GET /transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // sorting params
    const sortField = req.query.sort || "payment_time"; // default field
    const sortOrder = req.query.order === "asc" ? 1 : -1; // default desc

    const transactions = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },
      {
        $project: {
          _id: 0,
          collect_id: "$collect_id",
          school_id: "$order.school_id",
          gateway: "$order.gateway_name",
          order_amount: "$order_amount",
          transaction_amount: "$transaction_amount",
          status: "$status",
          custom_order_id: "$order._id",
          payment_time: "$payment_time" // needed for sorting
        }
      },
      { $sort: { [sortField]: sortOrder } }, // ✅ dynamic sorting
      { $skip: skip },
      { $limit: limit }
    ]);

    return res.json({ success: true, page, limit, transactions });
  } catch (err) {
    console.error("Error in /transactions:", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch transactions" });
  }
};


// GET /transactions/school/:schoolId
exports.getTransactionsBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const sortField = req.query.sort || "payment_time";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const transactions = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },
      { $match: { "order.school_id": schoolId } },
      {
        $project: {
          _id: 0,
          collect_id: "$collect_id",
          school_id: "$order.school_id",
          gateway: "$order.gateway_name",
          order_amount: "$order_amount",
          transaction_amount: "$transaction_amount",
          status: "$status",
          custom_order_id: "$order._id",
          payment_time: "$payment_time"
        }
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit }
    ]);

    return res.json({ success: true, page, limit, transactions });  
  } catch (err) {
    console.error("Error in /transactions/school:", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch school transactions" });
  }
};

// GET /transaction-status/:custom_order_id
exports.getTransactionStatus = async (req, res) => {
  try {
    const { custom_order_id } = req.params;

    const transaction = await OrderStatus.findOne({ collect_id: custom_order_id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    return res.json({
      success: true,
      status: transaction.status
    });
  } catch (err) {
    console.error("Error in /transaction-status:", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch transaction status" });
  }
};