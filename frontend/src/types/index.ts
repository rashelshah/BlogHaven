// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  bio: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  token: string;
}

// Blog types
export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: Date;
}

export interface Like {
  user: string;
  createdAt: Date;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    _id: string;
    name: string;
    email?: string;
    avatar: string;
    bio?: string;
  };
  featuredImage: string;
  tags: string[];
  category: BlogCategory;
  status: BlogStatus;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: Date;
  publishedAt?: Date;
  likes: Like[];
  comments: Comment[];
  views: number;
  readTime: number;
  isFeature: boolean;
  slug: string;
  likeCount: number;
  commentCount: number;
  trendingScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'hidden';

export type BlogCategory = 
  | 'Technology'
  | 'Programming'
  | 'Web Development'
  | 'Mobile Development'
  | 'DevOps'
  | 'AI/ML'
  | 'Data Science'
  | 'Career'
  | 'Tutorials'
  | 'Opinion'
  | 'News'
  | 'Business'
  | 'Health'
  | 'Sports'
  | 'Databases'
  | 'Other';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  blogs?: T[];
  users?: T[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  tags: string;
  category: BlogCategory;
  featuredImage?: string;
}

export interface CommentFormData {
  content: string;
}

export interface ProfileFormData {
  name: string;
  bio: string;
  avatar?: string;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  pendingBlogs: number;
  approvedBlogs: number;
  rejectedBlogs: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface DashboardData {
  stats: DashboardStats;
  topBlogs: Array<{
    _id: string;
    title: string;
    views: number;
    likeCount: number;
    commentCount: number;
    author: {
      name: string;
    };
  }>;
}

// Filter and search types
export interface BlogFilters {
  search?: string;
  category?: string;
  tag?: string;
  sort?: 'newest' | 'oldest' | 'popular';
  status?: BlogStatus | 'all';
  page?: number;
  limit?: number;
}

// Upload types
export interface UploadResponse {
  filename: string;
  originalName: string;
  size: number;
  url: string;
}
