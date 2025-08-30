import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../services/api';
import { Blog, BlogCategory } from '../../types';
import Loading from '../../components/common/Loading';
import { getErrorMessage } from '../../utils/helpers';

interface FormState {
  title: string;
  content: string;
  excerpt?: string;
  tags: string; // comma separated
  category: BlogCategory;
  featuredImage?: string;
}

const CATEGORIES: BlogCategory[] = [
  'Technology',
  'Programming',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'AI/ML',
  'Data Science',
  'Career',
  'Tutorials',
  'Opinion',
  'News',
  'Business',
  'Health',
  'Sports',
  'Databases',
  'Other',
];

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [blog, setBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState<FormState>({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    category: 'Technology',
    featuredImage: '',
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        const { data: res } = await apiService.blogs.getBlogById(id);
        if (res.success && res.data) {
          setBlog(res.data);
          setForm({
            title: res.data.title,
            content: res.data.content,
            excerpt: res.data.excerpt || '',
            tags: (res.data.tags || []).join(', '),
            category: res.data.category,
            featuredImage: res.data.featuredImage || '',
          });
        } else {
          throw new Error(res.message || 'Failed to load blog');
        }
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const canSubmit = useMemo(() => {
    return blog && (blog.status === 'draft' || blog.status === 'rejected');
  }, [blog]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!id) return;
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const { data: res } = await apiService.blogs.updateBlog(id, {
        title: form.title.trim(),
        content: form.content.trim(),
        excerpt: form.excerpt?.trim() || '',
        tags: form.tags,
        category: form.category,
        featuredImage: form.featuredImage?.trim() || '',
      });
      if (res.success) {
        navigate('/my-blogs');
      } else {
        throw new Error(res.message || 'Failed to save');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!id) return;
    try {
      setSubmitting(true);
      setError('');
      const { data: res } = await apiService.blogs.submitBlog(id);
      if (res.success) {
        navigate('/my-blogs');
      } else {
        throw new Error(res.message || 'Failed to submit');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error && !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white border rounded-lg p-6 text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
            {blog && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Status: {blog.status}
              </span>
            )}
          </div>

          {blog?.rejectionReason ? (
            <div className="mt-4 p-3 rounded bg-red-50 text-red-700 text-sm">
              Rejection reason: {blog.rejectionReason}
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>
          ) : null}

          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Blog title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={onChange}
                rows={12}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your content in Markdown"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Excerpt</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={onChange}
                rows={3}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short summary (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={onChange}
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. react, typescript, node"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="mt-1 w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Featured Image URL</label>
              <input
                name="featuredImage"
                value={form.featuredImage}
                onChange={onChange}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://... (optional)"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {canSubmit ? (
              <button
                onClick={handleSubmitForReview}
                disabled={submitting}
                className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            ) : null}
            <button
              onClick={() => navigate('/my-blogs')}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;