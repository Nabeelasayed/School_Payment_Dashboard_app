const express = require('express');
const router = express.Router();
const {authMiddleware, generateToken} = require('../middleware/jwtMiddleware');
const paymentGatewayController = require('../controllers/payment_gatewayControllers');

router.post('/create-payment', authMiddleware, paymentGatewayController.createPayment)


module.exports = router;