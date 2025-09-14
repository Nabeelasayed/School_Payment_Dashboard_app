const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Connect to MongoDB
connectDB();


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/payment', require('./routes/payment_gatewayRoute'));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));