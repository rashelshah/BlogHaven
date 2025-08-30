import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  AuthUser, 
  Blog, 
  PaginatedResponse, 
  DashboardData,
  User,
  BlogFilters,
  UploadResponse,
  Comment as BlogComment
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://bloghaven-nxkx.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<AuthUser>>('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post<ApiResponse<AuthUser>>('/auth/login', credentials),
  
  getProfile: () =>
    api.get<ApiResponse<User>>('/auth/me'),
  
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
    api.put<ApiResponse<User>>('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse>('/auth/change-password', data),
};

// Blog API
export const blogAPI = {
  getBlogs: (filters: BlogFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    return api.get<ApiResponse<PaginatedResponse<Blog>>>(`/blogs?${params}`);
  },
  
  getTrendingBlogs: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return api.get<ApiResponse<PaginatedResponse<Blog> | Blog[]>>(`/blogs/trending?${params}`);
  },
  
  getBlogBySlug: (slug: string) =>
    api.get<ApiResponse<Blog>>(`/blogs/${slug}`),
  
  getBlogById: (id: string) =>
    api.get<ApiResponse<Blog>>(`/blogs/edit/${id}`),
  
  createBlog: (blogData: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string;
    category: string;
    featuredImage?: string;
  }) =>
    api.post<ApiResponse<Blog>>('/blogs', blogData),
  
  updateBlog: (id: string, blogData: {
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string;
    category?: string;
    featuredImage?: string;
  }) =>
    api.put<ApiResponse<Blog>>(`/blogs/${id}`, blogData),
  
  submitBlog: (id: string) =>
    api.put<ApiResponse<Blog>>(`/blogs/${id}/submit`),
  
  deleteBlog: (id: string) =>
    api.delete<ApiResponse>(`/blogs/${id}`),
  
  getMyBlogs: (filters: BlogFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    return api.get<ApiResponse<PaginatedResponse<Blog>>>(`/blogs/my/blogs?${params}`);
  },
  
  toggleLike: (id: string) =>
    api.put<ApiResponse<{ likeCount: number; liked: boolean }>>(`/blogs/${id}/like`),
  
  addComment: (id: string, content: string) =>
    api.post<ApiResponse<BlogComment>>(`/blogs/${id}/comment`, { content }),
  
  getCategories: () =>
    api.get<ApiResponse<Array<{ _id: string; count: number }>>>('/blogs/categories'),
  
  getTags: () =>
    api.get<ApiResponse<Array<{ _id: string; count: number }>>>('/blogs/tags'),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () =>
    api.get<ApiResponse<DashboardData>>('/admin/dashboard'),
  
  getPendingBlogs: (page: number = 1, limit: number = 10) =>
    api.get<ApiResponse<PaginatedResponse<Blog>>>(`/admin/blogs/pending?page=${page}&limit=${limit}`),
  
  getAllBlogs: (filters: BlogFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    return api.get<ApiResponse<PaginatedResponse<Blog>>>(`/admin/blogs?${params}`);
  },
  
  approveBlog: (id: string) =>
    api.put<ApiResponse<Blog>>(`/admin/blogs/${id}/approve`),
  
  rejectBlog: (id: string, reason: string) =>
    api.put<ApiResponse<Blog>>(`/admin/blogs/${id}/reject`, { reason }),
  
  toggleBlogVisibility: (id: string) =>
    api.put<ApiResponse<Blog>>(`/admin/blogs/${id}/toggle-visibility`),
  
  getAllUsers: (page: number = 1, limit: number = 10, search?: string, status?: 'active' | 'inactive' | 'all') => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    return api.get<ApiResponse<PaginatedResponse<User>>>(`/admin/users?${params}`);
  },
  
  toggleUserStatus: (id: string) =>
    api.put<ApiResponse<User>>(`/admin/users/${id}/toggle-status`),
  
  deleteBlog: (id: string) =>
    api.delete<ApiResponse>(`/admin/blogs/${id}`),

  updateUserRole: (id: string, role: string) =>
    api.put<ApiResponse<User>>(`/admin/users/${id}/role`, { role }),

  deleteUser: (id: string) =>
    api.delete<ApiResponse>(`/admin/users/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<ApiResponse<UploadResponse>>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Combined API service object
const apiService = {
  auth: authAPI,
  blogs: {
    getBlogs: blogAPI.getBlogs,
    getTrendingBlogs: blogAPI.getTrendingBlogs,
    getBlogBySlug: blogAPI.getBlogBySlug,
    getBlogById: blogAPI.getBlogById,
    createBlog: blogAPI.createBlog,
    updateBlog: blogAPI.updateBlog,
    submitBlog: blogAPI.submitBlog,
    deleteBlog: blogAPI.deleteBlog,
    getMyBlogs: blogAPI.getMyBlogs,
    toggleLike: blogAPI.toggleLike,
    addComment: blogAPI.addComment,
    getCategories: blogAPI.getCategories,
    getTags: blogAPI.getTags,
  },
  admin: {
    getDashboardStats: adminAPI.getDashboardStats,
    getPendingBlogs: adminAPI.getPendingBlogs,
    getAllBlogs: adminAPI.getAllBlogs,
    approveBlog: adminAPI.approveBlog,
    rejectBlog: adminAPI.rejectBlog,
    toggleBlogVisibility: adminAPI.toggleBlogVisibility,
    getAllUsers: adminAPI.getAllUsers,
    toggleUserStatus: adminAPI.toggleUserStatus,
    deleteBlog: adminAPI.deleteBlog,
    updateUserRole: adminAPI.updateUserRole,
    deleteUser: adminAPI.deleteUser,
  },
  upload: uploadAPI,
};

export default apiService;
