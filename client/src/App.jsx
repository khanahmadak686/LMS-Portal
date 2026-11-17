import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// 🎨 Premium 404 Error Page
const NotFound = () => (
  <div style={{ 
    display: 'flex', flexDirection: 'column', alignItems: 'center', 
    justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem' 
  }}>
    <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
    <h1 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '0.5rem' }}>404</h1>
    <h2 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '1rem' }}>Page Not Found</h2>
    <p style={{ color: '#6b7280', maxWidth: '400px', marginBottom: '2rem', lineHeight: '1.6' }}>
      The page you are looking for doesn't exist or has been moved. 
      Please check the URL or return to the homepage.
    </p>
    <Link to="/" style={{
      padding: '0.8rem 1.5rem', backgroundColor: '#4f46e5', color: 'white',
      borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600',
      boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)', transition: 'transform 0.2s'
    }}>
      Back to Dashboard
    </Link>
  </div>
);

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ 
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      }} />
      
      <Navbar />

      <Routes>
        {/* 🚀 DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 🔓 PUBLIC ROUTES (Accessible without login) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🛡️ GENERAL PROTECTED ROUTES (For All Logged-in Users) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/course/:id" element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* 👑 ADMIN ONLY ROUTES */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* 👨‍🏫 INSTRUCTOR & ADMIN ROUTES (Course Creation/Editing) */}
        <Route path="/create-course" element={
          <ProtectedRoute allowedRoles={['admin', 'instructor']}>
            <CreateCourse />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-course/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'instructor']}>
            <CreateCourse />
          </ProtectedRoute>
        } />

        {/* 🚫 CATCH-ALL (404 Page) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;