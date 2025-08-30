import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Blog, PaginatedResponse, ApiResponse } from '../../types';
import { blogAPI } from '../../services/api';
import BlogCard from '../../components/blog/BlogCard';
import Loading from '../../components/common/Loading';

const TrendingBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get('page') || 1);
  const limit = 9;

  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await blogAPI.getTrendingBlogs(page, limit);
        if (data.success && data.data) {
          if (Array.isArray(data.data)) {
            // Non-paginated fallback
            setBlogs(data.data);
            setPages(1);
            setTotal(data.data.length);
          } else {
            setBlogs(data.data.blogs || []);
            setPages(data.data.pagination.pages);
            setTotal(data.data.pagination.total);
          }
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Failed to load trending blogs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  const goToPage = (p: number) => {
    setSearchParams({ page: String(p) });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trending</h1>
          <p className="text-gray-600 mt-2">Most engaging posts from the last 30 days</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loading size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {blogs.length === 0 ? (
              <div className="text-center text-gray-500 py-20">No trending blogs found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            )}

            {pages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">Page {page} of {pages}</span>
                <button
                  disabled={page >= pages}
                  onClick={() => goToPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrendingBlogs;