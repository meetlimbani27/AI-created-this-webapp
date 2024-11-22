const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getActiveUsers,
  updateActivity,
  setInactive
} = require('../controllers/user.controller');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/active', protect, getActiveUsers);
router.put('/activity', protect, updateActivity);
router.put('/inactive', protect, setInactive);

module.exports = router;
