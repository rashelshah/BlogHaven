import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { Blog, BlogStatus } from '../../types';
import Loading from '../../components/common/Loading';
import { formatDate, getErrorMessage } from '../../utils/helpers';

const statusFilters: Array<{ label: string; value: BlogStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Hidden', value: 'hidden' },
];

const MyBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState<BlogStatus | 'all'>('all');

  const load = async (p = 1, s: BlogStatus | 'all' = status) => {
    try {
      setLoading(true);
      setError('');
      const { data: res } = await apiService.blogs.getMyBlogs({ page: p, limit: 10, status: s });
      if (res.success && res.data) {
        setBlogs(res.data.blogs || []);
        setPage(res.data.pagination.current);
        setPages(res.data.pagination.pages);
      } else {
        throw new Error(res.message || 'Failed to load');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog? This cannot be undone.')) return;
    try {
      const { data: res } = await apiService.blogs.deleteBlog(id);
      if (res.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      } else {
        throw new Error(res.message || 'Failed to delete');
      }
    } catch (err: any) {
      window.alert(getErrorMessage(err));
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      const { data: res } = await apiService.blogs.submitBlog(id);
      if (res.success) {
        setBlogs((prev) => prev.map((b) => (b._id === id ? { ...b, status: 'pending' } : b)));
      } else {
        throw new Error(res.message || 'Failed to submit');
      }
    } catch (err: any) {
      window.alert(getErrorMessage(err));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
          <Link to="/create-blog" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">New Blog</Link>
        </div>

        {error ? (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>
        ) : null}

        <div className="mb-4 flex items-center gap-2 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-3 py-1 rounded-full text-sm border ${status === f.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'} `}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {blogs.length === 0 ? (
            <div className="p-8 text-center text-gray-600">No blogs yet. Create your first blog!</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {blogs.map((b) => (
                <li key={b._id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{b.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{b.status}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Updated {formatDate(b.updatedAt)} · {b.readTime} min · {b.views} views
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/edit-blog/${b._id}`)}
                      className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    {(b.status === 'draft' || b.status === 'rejected') && (
                      <button
                        onClick={() => handleSubmit(b._id)}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Submit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {pages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => load(page - 1)}
              className="px-3 py-1.5 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">{page} / {pages}</span>
            <button
              disabled={page >= pages}
              onClick={() => load(page + 1)}
              className="px-3 py-1.5 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
