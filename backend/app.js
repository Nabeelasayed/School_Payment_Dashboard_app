const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('API is running...');
});




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));