import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Assume AuthContext also provides a 'loading' state while checking token
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 🔄 1. HANDLE REFRESH BUG: Wait while auth status is being checked
  // Agar aapke AuthContext mein 'loading' nahi hai, toh usey add karna best practice hai
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', 
        alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' 
      }}>
        <Loader2 
          size={48} 
          color="#4f46e5" 
          style={{ animation: 'spin 1s linear infinite' }} 
        />
        <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: '500' }}>
          Verifying access...
        </p>
        <style>
          {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  // 🔒 2. NOT LOGGED IN: Redirect to login
  if (!user) {
    // state={{ from: location }} se hum user ko login ke baad wapas isi page par bhej sakte hain
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🛡️ 3. ROLE-BASED ACCESS CONTROL (RBAC)
  // Agar component mein 'allowedRoles' pass kiya gaya hai, toh check karo
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Agar user ka role list mein nahi hai, toh usko wapas Home par bhej do
    return <Navigate to="/" replace />;
  }

  // ✅ 4. ALL CLEAR: Render the requested page
  return children;
};

export default ProtectedRoute;