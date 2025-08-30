const Blog = require('../models/Blog');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendEmail, emailTemplates } = require('../utils/email');

// @desc    Get all published blogs with pagination
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { search, category, tag, sort } = req.query;
    
    // Build query
    let query = { status: 'approved' };
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Sort options
    let sortQuery = {};
    switch (sort) {
      case 'newest':
        sortQuery = { publishedAt: -1 };
        break;
      case 'oldest':
        sortQuery = { publishedAt: 1 };
        break;
      case 'popular':
        sortQuery = { views: -1, 'likes': -1 };
        break;
      default:
        sortQuery = { publishedAt: -1 };
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .select('-comments'); // Exclude comments for performance
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      },
      message: blogs.length === 0 ? 'No blogs found. Create your first blog post!' : undefined
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trending blogs
// @route   GET /api/blogs/trending
// @access  Public
const getTrendingBlogs = async (req, res) => {
  try {
    const { page, limit: queryLimit } = req.query;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const basePipeline = [
      {
        $match: {
          status: 'approved',
          publishedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $addFields: {
          likeCount: { $size: { $ifNull: ['$likes', []] } },
          commentCount: { $size: { $ifNull: ['$comments', []] } },
          trendingScore: {
            $add: [
              { $multiply: [{ $size: { $ifNull: ['$likes', []] } }, 3] },
              { $multiply: [{ $size: { $ifNull: ['$comments', []] } }, 5] },
              { $multiply: ['$views', 0.1] }
            ]
          }
        }
      }
    ];

    if (page) {
      // --- PAGINATED LOGIC FOR /trending PAGE ---
      const limit = parseInt(queryLimit) || 10;
      const skip = (parseInt(page) - 1) * limit;

      const blogsPipeline = [
        ...basePipeline,
        { $sort: { trendingScore: -1, publishedAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
            pipeline: [{ $project: { name: 1, avatar: 1 } }]
          }
        },
        { $unwind: '$author' }
      ];

      const totalPipeline = [...basePipeline, { $count: 'total' }];

      const [blogs, totalResult] = await Promise.all([
        Blog.aggregate(blogsPipeline),
        Blog.aggregate(totalPipeline)
      ]);

      const total = totalResult.length > 0 ? totalResult[0].total : 0;

      return res.json({
        success: true,
        data: {
          blogs,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total,
            hasNext: parseInt(page) < Math.ceil(total / limit),
            hasPrev: parseInt(page) > 1
          }
        }
      });
    } else {
      // --- NON-PAGINATED LOGIC FOR HOMEPAGE WIDGET ---
      const limit = parseInt(queryLimit) || 6;

      const blogs = await Blog.aggregate([...basePipeline, { $sort: { trendingScore: -1, publishedAt: -1 } }, { $limit: limit }, { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author', pipeline: [{ $project: { name: 1, avatar: 1 } }] } }, { $unwind: '$author' }]);

      return res.json({ success: true, data: blogs });
    }
  } catch (error) {
    console.error('Get trending blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      status: 'approved'
    })
    .populate('author', 'name avatar bio')
    .populate('comments.user', 'name avatar');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment view count
    blog.views += 1;
    await blog.save();
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, content, excerpt, tags, category, featuredImage } = req.body;
    
    // Create blog
    const blog = await Blog.create({
      title,
      content,
      excerpt,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      category,
      featuredImage,
      author: req.user._id,
      status: 'draft'
    });
    
    await blog.populate('author', 'name avatar');
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Author or Admin)
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    const { title, content, excerpt, tags, category, featuredImage } = req.body;
    
    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (tags !== undefined) {
      blog.tags = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    }
    if (category) blog.category = category;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;
    
    // If blog was rejected and now being updated, reset to draft
    if (blog.status === 'rejected') {
      blog.status = 'draft';
      blog.rejectionReason = '';
    }
    
    await blog.save();
    await blog.populate('author', 'name avatar');
    
    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit blog for approval
// @route   PUT /api/blogs/:id/submit
// @access  Private (Author)
const submitBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    if (blog.status !== 'draft' && blog.status !== 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Blog can only be submitted from draft or rejected status'
      });
    }
    
    blog.status = 'pending';
    blog.rejectionReason = '';
    await blog.save();
    
    // Send email notification to user
    const user = await User.findById(blog.author);
    if (user && process.env.EMAIL_USER) {
      const emailContent = emailTemplates.blogSubmitted(user.name, blog.title);
      await sendEmail({
        email: user.email,
        ...emailContent
      });
    }
    
    res.json({
      success: true,
      message: 'Blog submitted for approval',
      data: blog
    });
  } catch (error) {
    console.error('Submit blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single blog for editing
// @route   GET /api/blogs/edit/:id
// @access  Private (Author or Admin)
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's blogs
// @route   GET /api/blogs/my/blogs
// @access  Private
const getMyBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status } = req.query;
    
    let query = { author: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get my blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Author or Admin)
const deleteBlog = async (req, res) => {
  try {
    // The `authorOrAdmin` middleware already verifies ownership.
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Like/Unlike blog
// @route   PUT /api/blogs/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      _id: req.params.id,
      status: 'approved'
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if user already liked the blog
    const likeIndex = blog.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );
    
    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push({ user: req.user._id });
    }
    
    await blog.save();
    
    res.json({
      success: true,
      message: likeIndex > -1 ? 'Blog unliked' : 'Blog liked',
      data: {
        likeCount: blog.likes.length,
        liked: likeIndex === -1
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }
    
    const blog = await Blog.findOne({ 
      _id: req.params.id,
      status: 'approved'
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Add comment
    blog.comments.push({
      user: req.user._id,
      content: content.trim()
    });
    
    await blog.save();
    
    // Populate the new comment
    await blog.populate('comments.user', 'name avatar');
    
    const newComment = blog.comments[blog.comments.length - 1];
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get blog categories with counts
// @route   GET /api/blogs/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get popular tags
// @route   GET /api/blogs/tags
// @access  Public
const getTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
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
};
