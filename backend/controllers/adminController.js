const Blog = require('../models/Blog');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/email');

// @desc    Get pending blogs for approval
// @route   GET /api/admin/blogs/pending
// @access  Private (Admin)
const getPendingBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find({ status: 'pending' })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments({ status: 'pending' });
    
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
    console.error('Get pending blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Approve blog
// @route   PUT /api/admin/blogs/:id/approve
// @access  Private (Admin)
const approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    if (blog.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Blog is not pending approval'
      });
    }
    
    // Update blog status
    blog.status = 'approved';
    blog.approvedBy = req.user._id;
    blog.approvedAt = new Date();
    blog.publishedAt = new Date();
    
    await blog.save();
    await blog.populate('author', 'name email');
    
    // Send email notification to author
    if (blog.author.email && process.env.EMAIL_USER) {
      const emailContent = emailTemplates.blogApproved(
        blog.author.name, 
        blog.title, 
        blog.slug
      );
      await sendEmail({
        email: blog.author.email,
        ...emailContent
      });
    }
    
    res.json({
      success: true,
      message: 'Blog approved successfully',
      data: blog
    });
  } catch (error) {
    console.error('Approve blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reject blog
// @route   PUT /api/admin/blogs/:id/reject
// @access  Private (Admin)
const rejectBlog = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    if (blog.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Blog is not pending approval'
      });
    }
    
    // Update blog status
    blog.status = 'rejected';
    blog.rejectionReason = reason.trim();
    
    await blog.save();
    await blog.populate('author', 'name email');
    
    // Send email notification to author
    if (blog.author.email && process.env.EMAIL_USER) {
      const emailContent = emailTemplates.blogRejected(
        blog.author.name, 
        blog.title, 
        reason
      );
      await sendEmail({
        email: blog.author.email,
        ...emailContent
      });
    }
    
    res.json({
      success: true,
      message: 'Blog rejected',
      data: blog
    });
  } catch (error) {
    console.error('Reject blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Hide/Unhide published blog
// @route   PUT /api/admin/blogs/:id/toggle-visibility
// @access  Private (Admin)
const toggleBlogVisibility = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    if (blog.status !== 'approved' && blog.status !== 'hidden') {
      return res.status(400).json({
        success: false,
        message: 'Can only hide/unhide approved blogs'
      });
    }
    
    // Toggle visibility
    blog.status = blog.status === 'approved' ? 'hidden' : 'approved';
    
    await blog.save();
    
    res.json({
      success: true,
      message: `Blog ${blog.status === 'hidden' ? 'hidden' : 'visible'} successfully`,
      data: blog
    });
  } catch (error) {
    console.error('Toggle visibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all blogs for admin (all statuses)
// @route   GET /api/admin/blogs
// @access  Private (Admin)
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, search } = req.query;
    
    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
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
    console.error('Get all blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalBlogs,
      pendingBlogs,
      approvedBlogs,
      rejectedBlogs,
      totalUsers,
      recentUsers,
      recentBlogs
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'pending' }),
      Blog.countDocuments({ status: 'approved' }),
      Blog.countDocuments({ status: 'rejected' }),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ 
        role: 'user',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Blog.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);
    
    // Get top performing blogs
    const topBlogs = await Blog.find({ status: 'approved' })
      .sort({ views: -1 })
      .limit(5)
      .populate('author', 'name')
      .select('title views likeCount commentCount');
    
    res.json({
      success: true,
      data: {
        stats: {
          totalBlogs,
          pendingBlogs,
          approvedBlogs,
          rejectedBlogs,
          totalUsers,
          recentUsers,
          recentBlogs
        },
        topBlogs
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { search, status } = req.query;
    
    // Build query
    let query = { role: 'user' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }
    
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        users,
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
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate admin users'
      });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  toggleBlogVisibility,
  getAllBlogs,
  getDashboardStats,
  getAllUsers,
  toggleUserStatus
};
