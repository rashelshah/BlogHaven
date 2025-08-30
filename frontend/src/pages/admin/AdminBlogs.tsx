import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { Blog } from '../../types';
import { formatDate, getStatusLabel } from '../../utils/helpers';
import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const navigate = useNavigate();

  const categories = [
    'Technology', 'Programming', 'Web Development', 'Mobile Development',
    'DevOps', 'AI/ML', 'Data Science', 'Career', 'Tutorials', 'Opinion',
    'News', 'Other'
  ] as const;

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs, searchTerm, statusFilter, categoryFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // Fetch all blogs with pagination wrapper
      const { data: res } = await apiService.admin.getAllBlogs();
      if (res.success && res.data?.blogs) {
        setBlogs(res.data.blogs);
      } else if (Array.isArray((res as any))) {
        // Fallback if API returns raw array (older variant)
        setBlogs(res as any);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(blog => blog.category === categoryFilter);
    }

    setFilteredBlogs(filtered);
  };

  const handleApproveBlog = async (blogId: string) => {
    try {
      setActionLoading(blogId);
      await apiService.admin.approveBlog(blogId);
      setBlogs(prev => prev.map(blog =>
        blog._id === blogId ? { ...blog, status: 'approved' as const } : blog
      ));
    } catch (error) {
      console.error('Error approving blog:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBlog = async (blogId: string, reason: string) => {
    try {
      setActionLoading(blogId);
      await apiService.admin.rejectBlog(blogId, reason);
      setBlogs(prev => prev.map(blog =>
        blog._id === blogId ? { ...blog, status: 'rejected' as const, rejectionReason: reason } : blog
      ));
    } catch (error) {
      console.error('Error rejecting blog:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(blogId);
      await apiService.admin.deleteBlog(blogId);
      setBlogs(prev => prev.filter(blog => blog._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; blog: Blog | null }>({
    isOpen: false,
    blog: null
  });

  const RejectModal: React.FC<{ 
    blog: Blog; 
    isOpen: boolean; 
    onClose: () => void; 
    onReject: (reason: string) => void;
  }> = ({ blog, isOpen, onClose, onReject }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Reject Blog Post</h3>
          <p className="text-gray-600 mb-4">
            Reject "{blog.title}"?
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-4"
            rows={3}
            required
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (reason.trim()) {
                  onReject(reason);
                  setReason('');
                  onClose();
                }
              }}
              disabled={!reason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Blogs</h1>
        <p className="text-gray-600 mt-2">View and manage all blog posts on the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="hidden">Hidden</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredBlogs.length} of {blogs.length} blogs
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blog Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(blog.slug ? `/blog/${blog.slug}` : `/edit-blog/${blog._id}`)}
                >
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => navigate(`/blog/${blog.slug}`)}
                    title="View blog"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {blog.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {blog.excerpt}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{blog.author?.name}</div>
                    <div className="text-sm text-gray-500">{blog.author?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusLabel(blog.status).className}`}>
                      {getStatusLabel(blog.status).text}
                    </span>
                    {blog.status === 'rejected' && blog.rejectionReason && (
                      <div className="text-xs text-red-600 mt-1" title={blog.rejectionReason}>
                        {blog.rejectionReason.length > 30 
                          ? `${blog.rejectionReason.substring(0, 30)}...` 
                          : blog.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{blog.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {blog.views}
                      </div>
                      <div className="flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {blog.likeCount}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(blog.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {blog.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApproveBlog(blog._id); }}
                            disabled={actionLoading === blog._id}
                            className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setRejectModal({ isOpen: true, blog }); }}
                            disabled={actionLoading === blog._id}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteBlog(blog._id); }}
                        disabled={actionLoading === blog._id}
                        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {blogs.length === 0 ? 'No blogs found.' : 'No blogs match your current filters.'}
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <RejectModal
        blog={rejectModal.blog!}
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, blog: null })}
        onReject={(reason) => rejectModal.blog && handleRejectBlog(rejectModal.blog._id, reason)}
      />
    </div>
  );
};

export default AdminBlogs;
