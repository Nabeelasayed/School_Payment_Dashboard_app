const User = require('../models/user'); // Importing the User model
const {authMiddleware, generateToken} = require('../middleware/jwtMiddleware'); // Importing the JWT middleware for authentication
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing

   

// logic to implement login feature 
exports.handleLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password.trim();
    const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      //const isMatch= await User.comparePassword(password);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken({ userId: user._id }); // Generate a JWT token for the user
      
      res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax", // or "strict"
  maxAge: 7 * 24 * 60 * 60 * 1000
});
      
      res.json({
        message: "Login successful",
        user: { username: user.username, email: user.email, id: user._id },
        token: token
      });

  } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
  }
}


// Logic to handle user sign-in
exports.handleRegiester = async (req, res) => {
  try
  {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password.trim();
    const existingUser = await User.findOne({
  $or: [{ email: email }, { username: username }]
});

      if(existingUser) 
        {
          return res.status(400).json({ error: "Username or email already exists" });
        }
      else
        {
          const hash_password = await bcrypt.hash(password, 10); // Hash the password using bcrypt
          const newUser = new User({
              username: username,
              email: email,
              password: hash_password
          });
          await newUser.save(); // Save the new user to the database
          const token = generateToken({ userId: newUser._id}); // Generate a JWT token for the user
            res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax", // or "strict"
            maxAge: 7 * 24 * 60 * 60 * 1000
            }); // Set the token in cookies

          res.status(201).json({
            message: "User registered successfully",
            user: { username: newUser.username, email: newUser.email, id: newUser._id  },
            token: token
          })
        }
  }catch(err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};