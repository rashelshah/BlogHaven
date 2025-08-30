const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    minlength: [100, 'Content must be at least 100 characters']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot be more than 300 characters'],
    default: function() {
      return this.content.substring(0, 150) + '...';
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featuredImage: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Technology',
      'Programming',
      'Web Development',
      'Mobile Development',
      'DevOps',
      'AI/ML',
      'Data Science',
      'Career',
      'Tutorials',
      'Opinion',
      'News',
      'Business',
      'Health',
      'Sports',
      'Databases',
      'Other'
    ]
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'hidden'],
    default: 'draft'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  publishedAt: {
    type: Date
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number,
    default: function() {
      // Calculate reading time (average 200 words per minute)
      const wordCount = this.content.split(' ').length;
      return Math.ceil(wordCount / 200);
    }
  },
  isFeature: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', async function(next) {
  if (this.isModified('title') || this.isNew) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check for existing slugs and append counter if needed
    while (await mongoose.model('Blog').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

// Virtual for like count
blogSchema.virtual('likeCount').get(function() {
  return (this.likes || []).length;
});

// Virtual for comment count
blogSchema.virtual('commentCount').get(function() {
  return (this.comments || []).length;
});

// Calculate trending score (for trending section)
blogSchema.virtual('trendingScore').get(function() {
  const now = new Date();
  const publishedAt = this.publishedAt || this.createdAt;
  const daysSincePublished = (now - publishedAt) / (1000 * 60 * 60 * 24);
  
  // Score based on likes, comments, views with time decay
  const likeScore = (this.likes || []).length * 3;
  const commentScore = (this.comments || []).length * 5;
  const viewScore = (this.views || 0) * 0.1;
  const timeDecay = Math.max(0.1, 1 / (1 + daysSincePublished * 0.1));
  
  return (likeScore + commentScore + viewScore) * timeDecay;
});

// Ensure virtuals are included when converting to JSON
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

// Index for search functionality
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ author: 1, status: 1 });

module.exports = mongoose.model('Blog', blogSchema);
