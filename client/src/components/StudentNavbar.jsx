import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Compass, BookHeart } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const StudentNavbar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path || (path === '/' && location.pathname === '/dashboard');
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.6rem 1.2rem',
      borderRadius: '0.5rem',
      color: isActive ? '#4338ca' : '#4b5563',
      backgroundColor: isActive ? '#e0e7ff' : 'transparent',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease-in-out',
    };
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 5%', 
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      borderTop: '4px solid #4f46e5',
      position: 'sticky', 
      top: 0,
      zIndex: 1000
    }}>
      
      {/* 🚀 BRAND / LOGO SECTION */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <div style={{ background: '#e0e7ff', padding: '0.6rem', borderRadius: '0.5rem', display: 'flex' }}>
          <BookOpen size={24} color="#4f46e5" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827', fontWeight: '800', letterSpacing: '-0.5px' }}>
            LMS Academy
          </h2>
          <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Learn Without Limits
          </span>
        </div>
      </Link>

      {/* 🧭 NAVIGATION LINKS */}
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        
        <Link to="/" style={getLinkStyle('/')}>
          <Compass size={18}/> Explore
        </Link>
        
        {user ? (
          <>
            <Link to="/profile" style={getLinkStyle('/profile')}>
              <BookHeart size={18}/> My Learning
            </Link>

            <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }}></div>

            <Link to="/profile" style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              padding: '0.4rem 1rem 0.4rem 0.4rem',
              borderRadius: '50px',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: '#111827',
              fontWeight: '600',
              backgroundColor: '#f8fafc',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
              marginLeft: '0.5rem'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            >
              <div style={{ 
                background: '#4f46e5', 
                color: 'white', 
                borderRadius: '50%', 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold', 
                fontSize: '1rem' 
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <span style={{ fontSize: '0.9rem' }}>
                {user?.name?.split(' ')[0]} 
              </span>
            </Link>
          </>
        ) : (
          <>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }}></div>

            <Link to="/login" style={{
              padding: '0.6rem 1.2rem',
              color: '#4b5563',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
            onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
            >
              Log in
            </Link>
            
            <Link to="/register" style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '0.5rem',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default StudentNavbar;