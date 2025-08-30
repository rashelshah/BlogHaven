import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Blog, Comment as BlogComment } from '../../types';
import { formatDate, formatRelativeTime, getImageUrl, getErrorMessage } from '../../utils/helpers';
import Loading from '../../components/common/Loading';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  ClockIcon,
  TagIcon,
  UserIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  useEffect(() => {
    if (blog && user) {
      const userLiked = blog.likes?.some(like => like.user === user._id);
      setIsLiked(userLiked || false);
      setLikeCount(blog.likeCount || 0);
    }
  }, [blog, user]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError('');
      const { data: res } = await apiService.blogs.getBlogBySlug(slug!);
      if (res.success && res.data) {
        setBlog(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch blog');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
      if (err.response?.status === 404) {
        navigate('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!blog) return;

    try {
      const { data: res } = await apiService.blogs.toggleLike(blog._id);
      if (res.success && res.data) {
        setIsLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      }
    } catch (err: any) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!blog || !commentContent.trim()) return;

    try {
      setIsSubmittingComment(true);
      const { data: res } = await apiService.blogs.addComment(blog._id, commentContent.trim());
      
      if (res.success && res.data) {
        // Update blog comments
        setBlog(prev => prev ? {
          ...prev,
          comments: [res.data!, ...prev.comments],
          commentCount: prev.commentCount + 1
        } : null);
        
        setCommentContent('');
      }
    } catch (err: any) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="w-full h-64 lg:h-80 overflow-hidden">
              <img
                src={getImageUrl(blog.featuredImage)}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {blog.category}
                </span>
                <span>•</span>
                <ClockIcon className="h-4 w-4" />
                <span>{blog.readTime} min read</span>
                <span>•</span>
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {blog.excerpt}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                    {blog.author.avatar ? (
                      <img
                        src={getImageUrl(blog.author.avatar)}
                        alt={blog.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      blog.author.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{blog.author.name}</h3>
                    <p className="text-gray-600">{blog.author.bio || 'Writer and developer'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Share"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                  {user && (
                    <button
                      className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                      title="Bookmark"
                    >
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-8">
                <TagIcon className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                      onClick={() => navigate(`/?tag=${tag}`)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow as any}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>

            {/* Engagement Bar */}
            <div className="flex items-center justify-between py-6 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {isLiked ? (
                    <HeartIconSolid className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span className="font-medium">{likeCount}</span>
                </button>

                {/* Comment Count */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span>{blog.commentCount} comments</span>
                </div>

                {/* Views */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <EyeIcon className="h-5 w-5" />
                  <span>{blog.views} views</span>
                </div>
              </div>

              {/* Share Button */}
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Comments ({blog.commentCount})</h3>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.avatar ? (
                      <img
                        src={getImageUrl(user.avatar)}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      maxLength={1000}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-500">
                        {commentContent.length}/1000 characters
                      </span>
                      <button
                        type="submit"
                        disabled={!commentContent.trim() || isSubmittingComment}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-center">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </button>
                  {' '}to join the discussion
                </p>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="divide-y divide-gray-200">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment) => (
                <div key={comment._id} className="p-6">
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {comment.user.avatar ? (
                        <img
                          src={getImageUrl(comment.user.avatar)}
                          alt={comment.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        comment.user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{comment.user.name}</h4>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-500 text-sm">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
                <p className="text-gray-600">
                  {user ? 'Be the first to share your thoughts!' : 'Sign in to start the discussion.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Posts or Author Info could go here */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-xl">
              {blog.author.avatar ? (
                <img
                  src={getImageUrl(blog.author.avatar)}
                  alt={blog.author.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                blog.author.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{blog.author.name}</h4>
              <p className="text-gray-600 leading-relaxed">
                {blog.author.bio || 'A passionate writer sharing knowledge and insights with the developer community.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
