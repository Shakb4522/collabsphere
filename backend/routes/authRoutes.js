const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Mock Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    
    // Auto-create user for demo purposes if they don't exist
    if (!user) {
      user = await User.create({
        name: email.split('@')[0],
        email,
        password, 
        avatar: email.substring(0, 2).toUpperCase()
      });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
