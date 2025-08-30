import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
// import Profile from './pages/auth/Profile';
import Explore from './pages/blog/Explore';
import TrendingBlogs from './pages/blog/TrendingBlogs';
import BlogDetail from './pages/blog/BlogDetail';
import Categories from './pages/blog/Categories';
import CreateBlog from './pages/blog/CreateBlog';
import MyBlogs from './pages/blog/MyBlogs';
import EditBlog from './pages/blog/EditBlog';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  console.log("=== DEBUG INFO ===");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
  console.log("All env vars:", Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
  console.log("Hard-coded URL test:", 'https://bloghaven-nxkx.onrender.com/api');
  console.log("=== END DEBUG ===");
  

  console.log("API URL =>", process.env.REACT_APP_API_URL);
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/trending" element={<TrendingBlogs />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              
              {/* Protected Routes */}
              {/* <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}
              <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
              <Route path="/edit-blog/:id" element={<ProtectedRoute adminOnly><EditBlog /></ProtectedRoute>} />
              <Route path="/my-blogs" element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/blogs" element={<ProtectedRoute adminOnly><AdminBlogs /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;