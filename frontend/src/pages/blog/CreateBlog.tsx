import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { BlogCategory } from '../../types';
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
  'Other',
];

const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    category: 'Technology',
    featuredImage: '',
  });

  const isValid = useMemo(() => (
    form.title.trim().length >= 5 &&
    form.content.trim().length >= 100
  ), [form]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const create = async () => {
    try {
      setCreating(true);
      setError('');
      const { data: res } = await apiService.blogs.createBlog({
        title: form.title.trim(),
        content: form.content.trim(),
        excerpt: form.excerpt?.trim() || '',
        tags: form.tags,
        category: form.category,
        featuredImage: form.featuredImage?.trim() || '',
      });
      if (res.success && res.data) {
        return res.data._id as string;
      }
      throw new Error(res.message || 'Failed to create');
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!isValid) {
      const titleLen = form.title.trim().length;
      const contentLen = form.content.trim().length;
      const parts: string[] = [];
      if (titleLen < 5) parts.push(`Title must be at least 5 characters (currently ${titleLen})`);
      if (contentLen < 100) parts.push(`Content must be at least 100 characters (currently ${contentLen})`);
      setError(parts.join(' • '));
      return;
    }
    try {
      const id = await create();
      navigate('/my-blogs');
    } catch {}
  };

  const handleSubmitForReview = async () => {
    if (!isValid) {
      const titleLen = form.title.trim().length;
      const contentLen = form.content.trim().length;
      const parts: string[] = [];
      if (titleLen < 5) parts.push(`Title must be at least 5 characters (currently ${titleLen})`);
      if (contentLen < 100) parts.push(`Content must be at least 100 characters (currently ${contentLen})`);
      setError(parts.join(' • '));
      return;
    }
    try {
      setSubmitting(true);
      const id = await create();
      const { data: res } = await apiService.blogs.submitBlog(id);
      if (!res.success) throw new Error(res.message || 'Failed to submit');
      navigate('/my-blogs');
    } catch (err: any) {
      // error already set in create or here
      if (!error) setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Blog</h1>

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
              onClick={handleSaveDraft}
              disabled={creating}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handleSubmitForReview}
              disabled={submitting || creating}
              className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
