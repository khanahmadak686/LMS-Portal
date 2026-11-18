import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, PlusCircle, UserCheck } from 'lucide-react'; // ✅ UserCheck import kiya
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminNavbar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getLinkStyle = (path) => {
    // Exact match ya path start check karne ke liye
    const isActive = location.pathname === path;
    return {
      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem',
      borderRadius: '0.5rem', color: isActive ? '#dc2626' : '#4b5563',
      backgroundColor: isActive ? '#fee2e2' : 'transparent',
      textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem',
      transition: 'all 0.2s ease-in-out',
    };
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 5%', backgroundColor: '#ffffff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderTop: '4px solid #dc2626',
      position: 'sticky', top: 0, zIndex: 1000
    }}>
      
      {/* 🚀 BRAND / LOGO SECTION */}
      <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <div style={{ background: '#fee2e2', padding: '0.6rem', borderRadius: '0.5rem', display: 'flex' }}>
          <Shield size={24} color="#dc2626" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827', fontWeight: '800', letterSpacing: '-0.5px' }}>
            LMS Workspace
          </h2>
          <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Admin Portal
          </span>
        </div>
      </Link>

      {/* 🧭 NAVIGATION LINKS */}
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        
        <Link to="/admin" style={getLinkStyle('/admin')}>
          <LayoutDashboard size={18}/> Overview
        </Link>

        {/* 🟢 NAYA ROLE APPROVAL LINK */}
        <Link to="/admin" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem',
          borderRadius: '0.5rem', color: '#4b5563', textDecoration: 'none', 
          fontWeight: '500', fontSize: '0.95rem', transition: 'all 0.2s ease-in-out',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#1f2937'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4b5563'; }}
        >
          <UserCheck size={18}/> Approvals
        </Link>
        
        <Link to="/create-course" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem',
          borderRadius: '0.5rem', backgroundColor: '#dc2626', color: '#ffffff', textDecoration: 'none',
          fontWeight: '600', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(220, 38, 38, 0.25)', 
          transition: 'all 0.2s', marginLeft: '0.5rem'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <PlusCircle size={18} /> Add Course
        </Link>

        {/* Divider Line */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }}></div>

        {/* 👤 PROFILE CHIP */}
        <Link to="/profile" style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem 0.4rem 0.4rem',
          borderRadius: '50px', border: '1px solid #e5e7eb', textDecoration: 'none',
          color: '#111827', fontWeight: '600', backgroundColor: '#f8fafc', transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
        >
          <div style={{ 
            background: '#dc2626', color: 'white', borderRadius: '50%', width: '32px', height: '32px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' 
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span style={{ fontSize: '0.9rem' }}>
            {user?.name?.split(' ')[0]} 
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;