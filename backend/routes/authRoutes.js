const express = require('express');
const router = express.Router();
const { handleLogin, handleRegiester, signout } = require('../controllers/authControllers');
const {authMiddleware, generateToken} = require('../middleware/jwtMiddleware');

router.post('/login', handleLogin); // Route to handle user login
router.post('/register', handleRegiester); // Route to handle user sign-in
router.get('/logout',authMiddleware, signout); // Route to handle user logout


module.exports = router;