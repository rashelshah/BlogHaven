import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Blog } from '../types';
import { blogAPI } from '../services/api';
import { getErrorMessage } from '../utils/helpers';
import BlogCard from '../components/blog/BlogCard';
import Loading from '../components/common/Loading';
import { FireIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      const [latestResponse, trendingResponse] = await Promise.all([
        blogAPI.getBlogs({ limit: 6, sort: 'newest' }),
        blogAPI.getTrendingBlogs(undefined, 6)
      ]);
      
      if (latestResponse.data.success && latestResponse.data.data) {
        setLatestBlogs(latestResponse.data.data.blogs || []);
      }
      
      if (trendingResponse.data.success && trendingResponse.data.data) {
        const trending = Array.isArray(trendingResponse.data.data) 
          ? trendingResponse.data.data 
          : trendingResponse.data.data.blogs || [];
        setTrendingBlogs(trending);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 bg-[length:200%_200%] animate-gradient-x">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 bg-[length:200%_200%] animate-gradient-x opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to{' '}
              <span className="text-primary-600">BlogHaven</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in-up">
              Discover the latest insights in technology, programming, and innovation. 
              Share your knowledge with the developer community.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow-lg transform hover:scale-[1.02] transition-transform">
                <Link
                  to="/explore"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  Explore Blogs
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 transform hover:scale-[1.02] transition-transform">
                <Link
                  to="/create-blog"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  Start Writing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {trendingBlogs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <FireIcon className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
              </div>
              <Link
                to="/trending"
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <span>View all</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <Link
              to="/explore"
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>View all</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          
          {latestBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FireIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
              <p className="text-gray-500 mb-4">Be the first to share your knowledge with the community!</p>
              <Link
                to="/create-blog"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Write your first blog
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
