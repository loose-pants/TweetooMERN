import User from '../models/User.js';

/**
 * Get all users (Admin only)
 * @route GET /api/users
 * @access Private (admin)
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const usersWithoutPasswords = users.map(user => {
      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;
      return userObj;
    });
    res.json({
      success: true,
      count: usersWithoutPasswords.length,
      data: usersWithoutPasswords
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

/**
 * Update user role (Admin only)
 * @route PUT /api/users/:id/role
 * @access Private (admin)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;
    const validRoles = ['user', 'editor', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be one of: user, editor, admin' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.user._id === userId && req.user.role === 'admin' && role !== 'admin') {
      return res.status(400).json({ message: 'Admins cannot change their own role' });
    }
    user.role = role;
    user.updatedAt = new Date();
    await user.save();
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: userObj
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

/**
 * Delete user (Admin only)
 * @route DELETE /api/users/:id
 * @access Private (admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.user._id === userId) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    await User.findByIdAndDelete(userId);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};