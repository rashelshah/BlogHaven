import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Blog, BlogFilters } from '../../types';
import { blogAPI } from '../../services/api';
import BlogCard from '../../components/blog/BlogCard';
import Loading from '../../components/common/Loading';

const Explore: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: BlogFilters = useMemo(() => ({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
    sort: (searchParams.get('sort') as any) || 'newest',
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 9)
  }), [searchParams]);

  useEffect(() => {
    setPage(filters.page || 1);
  }, [filters.page]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await blogAPI.getBlogs(filters);
        if (data.success && data.data) {
          setBlogs(data.data.blogs || []);
          setPages(data.data.pagination.pages);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key); else next.set(key, value);
    next.set('page', '1');
    setSearchParams(next);
  };

  const goToPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
          <p className="text-gray-600 mt-2">Discover and filter approved blogs</p>
        </div>

        <div className="bg-white border rounded-lg p-4 mb-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search..."
            defaultValue={filters.search || ''}
            onKeyDown={(e) => { if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value.trim() || undefined); }}
            className="px-3 py-2 border rounded w-full md:w-64"
          />
          <select
            defaultValue={filters.category || 'all'}
            onChange={(e) => updateParam('category', e.target.value === 'all' ? undefined : e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All categories</option>
            <option value="Technology">Technology</option>
            <option value="Programming">Programming</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="DevOps">DevOps</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Data Science">Data Science</option>
            <option value="Career">Career</option>
            <option value="Tutorials">Tutorials</option>
            <option value="Opinion">Opinion</option>
            <option value="News">News</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
            <option value="Sports">Sports</option>
            <option value="Databases">Databases</option>
            <option value="Other">Other</option>
          </select>
          <select
            defaultValue={filters.sort || 'newest'}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most viewed</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loading size="lg" /></div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {blogs.length === 0 ? (
              <div className="text-center text-gray-500 py-20">No blogs found.</div>
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
                >Prev</button>
                <span className="text-sm text-gray-600">Page {page} of {pages}</span>
                <button
                  disabled={page >= pages}
                  onClick={() => goToPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;