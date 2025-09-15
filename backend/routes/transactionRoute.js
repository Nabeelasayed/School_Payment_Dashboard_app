const express = require("express");
const { getAllTransactions, getTransactionsBySchool, getTransactionStatus } = require("../controllers/transactionController");
const router = express.Router();
const { authMiddleware, generateToken } = require("../middleware/jwtMiddleware");


router.get("/all-transactions", authMiddleware, getAllTransactions);
router.get("/school/:schoolId", authMiddleware, getTransactionsBySchool);
router.get("/transaction-status/:custom_order_id", authMiddleware, getTransactionStatus);

module.exports = router;