import React from 'react';
import { Link } from 'react-router-dom';
import { Blog } from '../../types';
import { formatDate, getImageUrl, truncateText } from '../../utils/helpers';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  EyeIcon, 
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface BlogCardProps {
  blog: Blog;
  showAuthor?: boolean;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  blog, 
  showAuthor = true, 
  className = '' 
}) => {
  const imageUrl = getImageUrl(blog.featuredImage);

  return (
    <article className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ${className}`}>
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {blog.category}
          </span>
          {blog.readTime && (
            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon className="w-3 h-3 mr-1" />
              {blog.readTime} min read
            </div>
          )}
        </div>

        <Link to={`/blog/${blog.slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
            <span className="inline-block transform hover:translate-x-0.5 transition-transform">{blog.title}</span>
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.excerpt || truncateText(blog.content, 150)}
        </p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{blog.tags.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          {showAuthor && blog.author && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {blog.author.avatar ? (
                  <img
                    src={getImageUrl(blog.author.avatar)}
                    alt={blog.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{blog.author.name}</p>
                <p className="text-xs text-gray-500">{formatDate(blog.publishedAt || blog.createdAt)}</p>
              </div>
            </div>
          )}
          
          {!showAuthor && (
            <div className="text-xs text-gray-500">
              {formatDate(blog.publishedAt || blog.createdAt)}
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <HeartIcon className="w-4 h-4" />
              <span>{blog.likeCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span>{blog.commentCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <EyeIcon className="w-4 h-4" />
              <span>{blog.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
