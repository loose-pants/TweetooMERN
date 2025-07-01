import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @param {string} username - Username
 * @param {string} role - User role
 * @returns {string} JWT token
 */
const generateToken = (id, username, role) => {
  return jwt.sign({ id, username, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this username' });
    }

    // Create user
    const user = await User.create({ username, password, role: 'user' });

    if (user) {
      // Remove password from response
      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;
      
      res.status(201).json({
        message: 'User registered successfully',
        user: userObj,
        token: generateToken(user._id, user.username, user.role),
      });
    } else {
      res.status(400).json({ message: 'Failed to create user' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Authenticate user and get token
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Check for user
    const user = await User.findOne({ username });
    
    if (user && (await user.matchPassword(password))) {
      // Remove password from response
      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;
      
      res.json({
        message: 'Login successful',
        user: userObj,
        token: generateToken(user._id, user.username, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req, res) => {
  try {
    // User is attached to request by protect middleware
    const { password, ...userWithoutPassword } = req.user;
    
    res.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error getting user profile' });
  }
};