import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../../services/api';
import Loading from '../../components/common/Loading';

interface CategoryCount {
  _id: string; // category name
  count: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await blogAPI.getCategories();
        if (data.success && data.data) {
          setCategories(data.data);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Browse blogs by category</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No categories found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => navigate(`/explore?category=${encodeURIComponent(c._id)}`)}
                className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow transition-shadow"
                title={`View ${c._id} blogs`}
              >
                <div className="text-lg font-semibold text-gray-900">{c._id}</div>
                <div className="text-sm text-gray-500 mt-2">{c.count} posts</div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-medium">
            Explore all blogs →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;