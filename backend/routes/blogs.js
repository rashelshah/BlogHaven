const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getTrendingBlogs,
  getBlogBySlug,
  getBlog,
  createBlog,
  updateBlog,
  submitBlog,
  getMyBlogs,
  deleteBlog,
  toggleLike,
  addComment,
  getCategories,
  getTags
} = require('../controllers/blogController');
const { protect, authorOrAdmin } = require('../middleware/auth');
const { validateBlog, validateComment } = require('../middleware/validation');

// Public routes - specific routes first
router.get('/', getBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/categories', getCategories);
router.get('/tags', getTags);
// Public route with slug parameter (must come after specific routes)
router.get('/:slug', getBlogBySlug);

// Protected routes
router.use(protect); // All routes below require authentication

// User blog management
router.get('/my/blogs', getMyBlogs);
router.get('/edit/:id', authorOrAdmin, getBlog);
router.post('/', validateBlog, createBlog);
router.put('/:id', authorOrAdmin, validateBlog, updateBlog);
router.put('/:id/submit', authorOrAdmin, submitBlog);
router.delete('/:id', authorOrAdmin, deleteBlog);

// Blog interactions
router.put('/:id/like', toggleLike);
router.post('/:id/comment', validateComment, addComment);

module.exports = router;
