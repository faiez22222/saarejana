// server/routes/userRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/signup',
  [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    check('username').notEmpty().withMessage('Username is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username, profession, expertise , confirmPassword } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
      }

      user = new User({
        email,
        password,
        username , 
        profession , 
        expertise , 
        confirmPassword
      });

      await user.save();

      res.json({ message: 'User signed up successfully!' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

// POST route for user login
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      res.json({ message: 'User logged in successfully!', userId: user._id , username : user.username });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

  router.get('/search', async (req, res) => {
    const { profession, expertise, username } = req.query;
    const query = {};
  
    if (profession) {
      query.profession = { $regex: new RegExp(profession, 'i') };
    }
  
    if (expertise) {
      query.expertise = { $regex: new RegExp(expertise, 'i') };
    }
  
    if (username) {
      query.username = { $regex: new RegExp(username, 'i') };
    }
  
    try {
      // Search for users based on the query
      const users = await User.find(query, 'username profession expertise');
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      // Return the user data based on the search criteria
      res.json({ users });
    } catch (error) {
      console.error('User search error:', error);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  });

  router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
      console.log('hey')
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });
  
  

module.exports = router;
