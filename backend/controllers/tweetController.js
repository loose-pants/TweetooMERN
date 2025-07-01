import Tweet from '../models/Tweet.js';

/**
 * Get all tweets
 * @route GET /api/tweets
 * @access Public
 */
export const getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.findAllPopulated();
    res.json({
      success: true,
      count: tweets.length,
      data: tweets
    });
  } catch (error) {
    console.error('Get tweets error:', error);
    res.status(500).json({ message: 'Server error fetching tweets' });
  }
};

/**
 * Get single tweet by ID
 * @route GET /api/tweets/:id
 * @access Public
 */
export const getTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findByIdPopulated(req.params.id);
    
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    res.json({
      success: true,
      data: tweet
    });
  } catch (error) {
    console.error('Get tweet error:', error);
    res.status(500).json({ message: 'Server error fetching tweet' });
  }
};

/**
 * Create new tweet
 * @route POST /api/tweets
 * @access Private (user, editor, admin)
 */
export const createTweet = async (req, res) => {
  try {
    const { content } = req.body;

    // Validation
    if (!content) {
      return res.status(400).json({ message: 'Tweet content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ message: 'Tweet content cannot exceed 280 characters' });
    }

    // Create tweet
    const tweet = await Tweet.create({
      user: req.user._id,
      content: content.trim()
    });

    // Get tweet with populated user data
    const populatedTweet = await Tweet.findByIdPopulated(tweet._id);

    res.status(201).json({
      success: true,
      message: 'Tweet created successfully',
      data: populatedTweet
    });
  } catch (error) {
    console.error('Create tweet error:', error);
    res.status(500).json({ message: 'Server error creating tweet' });
  }
};

/**
 * Update tweet
 * @route PUT /api/tweets/:id
 * @access Private (owner, editor, admin)
 */
export const updateTweet = async (req, res) => {
  try {
    const { content } = req.body;

    // Validation
    if (!content) {
      return res.status(400).json({ message: 'Tweet content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ message: 'Tweet content cannot exceed 280 characters' });
    }

    // Update tweet (tweet is attached to request by canModifyTweet middleware)
    const updatedTweet = await Tweet.findByIdAndUpdate(
      req.params.id,
      { content: content.trim(), updatedAt: new Date() },
      { new: true }
    );

    if (!updatedTweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    // Get tweet with populated user data
    const populatedTweet = await Tweet.findByIdPopulated(updatedTweet._id);

    res.json({
      success: true,
      message: 'Tweet updated successfully',
      data: populatedTweet
    });
  } catch (error) {
    console.error('Update tweet error:', error);
    res.status(500).json({ message: 'Server error updating tweet' });
  }
};

/**
 * Delete tweet
 * @route DELETE /api/tweets/:id
 * @access Private (owner, editor, admin)
 */
export const deleteTweet = async (req, res) => {
  try {
    const deletedTweet = await Tweet.findByIdAndDelete(req.params.id);

    if (!deletedTweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    res.json({
      success: true,
      message: 'Tweet deleted successfully'
    });
  } catch (error) {
    console.error('Delete tweet error:', error);
    res.status(500).json({ message: 'Server error deleting tweet' });
  }
};