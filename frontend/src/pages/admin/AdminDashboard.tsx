import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { Blog, DashboardStats } from '../../types';
import { formatDate } from '../../utils/helpers';
import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBlogs: 0,
    pendingBlogs: 0,
    approvedBlogs: 0,
    rejectedBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [{ data: statsRes }, { data: pendingRes }] = await Promise.all([
        apiService.admin.getDashboardStats(),
        apiService.admin.getPendingBlogs()
      ]);
      if (statsRes.success && statsRes.data) setStats(statsRes.data.stats);
      if (pendingRes.success && pendingRes.data?.blogs) setPendingBlogs(pendingRes.data.blogs);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBlog = async (blogId: string) => {
    try {
      setActionLoading(blogId);
      await apiService.admin.approveBlog(blogId);
      setPendingBlogs(prev => prev.filter(blog => blog._id !== blogId));
      setStats(prev => ({
        ...prev,
        pendingBlogs: prev.pendingBlogs - 1,
        approvedBlogs: prev.approvedBlogs + 1
      }));
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
      setPendingBlogs(prev => prev.filter(blog => blog._id !== blogId));
      setStats(prev => ({
        ...prev,
        pendingBlogs: prev.pendingBlogs - 1,
        rejectedBlogs: prev.rejectedBlogs + 1
      }));
    } catch (error) {
      console.error('Error rejecting blog:', error);
    } finally {
      setActionLoading(null);
    }
  };

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
            Are you sure you want to reject "{blog.title}"?
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
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

  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; blog: Blog | null }>({
    isOpen: false,
    blog: null
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage blog posts, users, and platform content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingBlogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => navigate('/admin/blogs')}
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-left"
        >
          <DocumentTextIcon className="h-8 w-8 mb-2" />
          <h3 className="text-lg font-semibold">Manage All Blogs</h3>
          <p className="text-blue-100">View and manage all blog posts</p>
        </button>

        <button
          onClick={() => navigate('/admin/users')}
          className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-left"
        >
          <UserIcon className="h-8 w-8 mb-2" />
          <h3 className="text-lg font-semibold">Manage Users</h3>
          <p className="text-green-100">View and manage user accounts</p>
        </button>

        <button
          onClick={() => navigate('/admin/analytics')}
          className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-left"
        >
          <EyeIcon className="h-8 w-8 mb-2" />
          <h3 className="text-lg font-semibold">Analytics</h3>
          <p className="text-purple-100">View platform analytics</p>
        </button>
      </div>

      {/* Pending Blogs Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pending Blog Approvals</h2>
          <p className="text-gray-600">Review and approve blog posts waiting for moderation</p>
        </div>

        {pendingBlogs.length === 0 ? (
          <div className="p-8 text-center">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Blogs</h3>
            <p className="text-gray-600">All blog posts have been reviewed.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingBlogs.map((blog) => (
              <div
                key={blog._id}
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/edit-blog/${blog._id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {blog.author?.name}</span>
                      <span>{formatDate(blog.createdAt)}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/edit-blog/${blog._id}`); }}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Open"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApproveBlog(blog._id); }}
                      disabled={actionLoading === blog._id}
                      className="p-2 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                      title="Approve"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setRejectModal({ isOpen: true, blog }); }}
                      disabled={actionLoading === blog._id}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                      title="Reject"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

export default AdminDashboard;
