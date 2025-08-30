const express = require('express');
const router = express.Router();
const {
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  toggleBlogVisibility,
  getAllBlogs,
  getDashboardStats,
  getAllUsers,
  toggleUserStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Blog management
router.get('/blogs', getAllBlogs);
router.get('/blogs/pending', getPendingBlogs);
router.put('/blogs/:id/approve', approveBlog);
router.put('/blogs/:id/reject', rejectBlog);
router.put('/blogs/:id/toggle-visibility', toggleBlogVisibility);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
