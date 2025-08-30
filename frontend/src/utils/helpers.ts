import { format, formatDistanceToNow } from 'date-fns';

// Date formatting utilities
export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'MMM dd, yyyy • HH:mm');
};

export const formatRelativeTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Text utilities
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
};

// Validation utilities
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string) => {
  // Min 6 chars, at least one uppercase letter and one special character
  const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
  return regex.test(password);
};

// Image utilities
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';
  return `${baseUrl}${imagePath}`;
};

// Local storage utilities
export const getFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

export const setInStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

export const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// URL utilities
export const buildQueryString = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

// File utilities
export const validateImageFile = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed');
  }

  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }

  return true;
};

// Blog utilities
export const calculateReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const extractExcerpt = (content: string, maxLength: number = 150) => {
  // Remove markdown formatting for excerpt
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
  
  return truncateText(plainText, maxLength);
};

// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.errors?.length > 0) {
    const first = error.response.data.errors[0];
    // Support express-validator shape: { msg, param, ... }
    const msg = first.message || first.msg || 'Validation failed';
    const field = first.field || first.param;
    return field ? `${msg} (${field})` : msg;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Status utilities
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'hidden':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft':
      return { text: 'Draft', className: 'bg-gray-100 text-gray-800' };
    case 'pending':
      return { text: 'Pending Review', className: 'bg-yellow-100 text-yellow-800' };
    case 'approved':
      return { text: 'Published', className: 'bg-green-100 text-green-800' };
    case 'rejected':
      return { text: 'Rejected', className: 'bg-red-100 text-red-800' };
    case 'hidden':
      return { text: 'Hidden', className: 'bg-gray-100 text-gray-600' };
    default:
      return { text: status, className: 'bg-gray-100 text-gray-800' };
  }
};
