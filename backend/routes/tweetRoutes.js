import express from 'express';
import {
  getTweets,
  getTweet,
  createTweet,
  updateTweet,
  deleteTweet
} from '../controllers/tweetController.js';
import { protect, authorize, canModifyTweet } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getTweets);
router.get('/:id', getTweet);

// Protected routes
router.post('/', protect, authorize('user', 'editor', 'admin'), createTweet);
router.put('/:id', protect, canModifyTweet, updateTweet);
router.delete('/:id', protect, canModifyTweet, deleteTweet);

export default router;