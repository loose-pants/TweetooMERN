import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes - verifies JWT token
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Next middleware function
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token and attach to request
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Not authorized - user not found' });
      }

      const userObj = user.toObject ? user.toObject() : user;
      const { password, ...userWithoutPassword } = userObj;
      req.user = userWithoutPassword;

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401).json({ message: 'Not authorized - token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized - no token provided' });
  }
};

/**
 * Middleware to authorize specific roles
 * @param {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized - please login first' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}` 
      });
    }

    next();
  };
};

/**
 * Middleware to check if user can modify a tweet
 * User can modify if they are the owner OR if they have editor/admin role
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Next middleware function
 */
export const canModifyTweet = async (req, res, next) => {
  try {
    const Tweet = (await import('../models/Tweet.js')).default;
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    // Allow if user is owner OR has editor/admin role
    if (tweet.user === req.user._id || req.user.role === 'editor' || req.user.role === 'admin') {
      req.tweet = tweet; // Attach tweet to request for controller use
      next();
    } else {
      res.status(403).json({ 
        message: 'Access denied - you can only modify your own tweets unless you are an editor or admin' 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error checking tweet permissions' });
  }
};