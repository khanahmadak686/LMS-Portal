import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, BookOpen, Shield, ChevronRight, LogOut, Settings, Loader2, Save, Video } from 'lucide-react';

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext); 
  
  const [activeTab, setActiveTab] = useState('courses'); 
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const avatarUrl = `https://ui-avatars.com/api/?name=${user?.name}&background=4f46e5&color=fff&size=128&font-size=0.4`;

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        let response;
        
        // ✅ BULLETPROOF ROUTING FIX: Call specific APIs based strictly on Role
        if (user?.role === 'admin') {
          response = await axios.get('http://localhost:5000/api/admin/courses', config);
          setCourses(response.data);
        } else if (user?.role === 'instructor') {
          // Instructor gets courses from dashboard endpoint
          response = await axios.get('http://localhost:5000/api/instructor/dashboard', config);
          setCourses(response.data.courses || []);
        } else {
          // Students get enrolled courses
          response = await axios.get('http://localhost:5000/api/courses/enrolled', config);
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    if (user) fetchMyCourses();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.put('http://localhost:5000/api/auth/profile', {
        name, email, password: password ? password : undefined 
      }, config);
      updateUser(response.data); 
      toast.success('Profile updated successfully!');
      setPassword(''); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleStyle = (role) => {
    if (role === 'admin') return { bg: '#fee2e2', text: '#dc2626' };
    if (role === 'instructor') return { bg: '#d1fae5', text: '#059669' };
    return { bg: '#e0e7ff', text: '#4f46e5' };
  };
  const roleStyle = getRoleStyle(user?.role);

  const getTabStyle = (tabName) => ({
    display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 1.2rem',
    width: '100%', textAlign: 'left', borderRadius: '0.75rem', border: 'none',
    cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.2s', marginBottom: '0.5rem',
    background: activeTab === tabName ? '#e0e7ff' : 'transparent',
    color: activeTab === tabName ? '#4f46e5' : '#64748b'
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '3rem 5% 5rem 5%' }}>
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        
        {/* LEFT COLUMN (SIDEBAR) */}
        <div style={{ 
          flex: '0 0 280px', background: '#ffffff', padding: '2rem', 
          borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
          display: 'flex', flexDirection: 'column', minHeight: '600px',
          border: '1px solid #f1f5f9'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={avatarUrl} alt="Avatar" style={{ borderRadius: '50%', width: '90px', height: '90px', marginBottom: '1rem', border: '4px solid #f8fafc', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.2rem' }}>{user?.name}</h3>
            <span style={{ 
              background: roleStyle.bg, color: roleStyle.text, 
              padding: '0.3rem 1rem', borderRadius: '50px', fontSize: '0.75rem', 
              fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              {user?.role}
            </span>
          </div>

          <hr style={{ borderTop: '1px solid #e2e8f0', borderBottom: 'none', marginBottom: '1.5rem' }} />

          <div style={{ flex: 1 }}>
            <button 
              style={getTabStyle('courses')} 
              onClick={() => setActiveTab('courses')}
              onMouseOver={(e) => { if(activeTab !== 'courses') e.currentTarget.style.background = '#f1f5f9' }}
              onMouseOut={(e) => { if(activeTab !== 'courses') e.currentTarget.style.background = 'transparent' }}
            >
              {user?.role === 'admin' ? <Shield size={20} /> : user?.role === 'instructor' ? <Video size={20} /> : <BookOpen size={20} />} 
              {user?.role === 'student' ? 'My Enrolled Courses' : 'My Managed Courses'}
            </button>
            
            <button 
              style={getTabStyle('settings')} 
              onClick={() => setActiveTab('settings')}
              onMouseOver={(e) => { if(activeTab !== 'settings') e.currentTarget.style.background = '#f1f5f9' }}
              onMouseOut={(e) => { if(activeTab !== 'settings') e.currentTarget.style.background = 'transparent' }}
            >
              <Settings size={20} /> Profile Settings
            </button>
          </div>

          <button onClick={logout} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', 
            width: '100%', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', 
            borderRadius: '0.75rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e)=> { e.currentTarget.style.background = '#fecaca' }}
          onMouseOut={(e)=> { e.currentTarget.style.background = '#fee2e2' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>


        {/* RIGHT COLUMN */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          
          {activeTab === 'courses' && (
            <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <h2 style={{ margin: '0 0 2rem 0', display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#0f172a', fontSize: '1.5rem' }}>
                {user?.role === 'student' ? (
                  <><BookOpen size={28} color="#4f46e5" /> My Enrolled Courses</>
                ) : (
                  <><Shield size={28} color={roleStyle.text} /> My Managed Courses</>
                )}
              </h2>
              
              {loadingCourses ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Loader2 size={40} color="#4f46e5" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                  Loading your courses...
                </div>
              ) : courses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '1rem' }}>
                  <BookOpen size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ color: '#1e293b', marginBottom: '0.5rem', fontSize: '1.2rem' }}>No Courses Yet</h3>
                  
                  <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                    {user?.role === 'student' ? "You haven't enrolled in any courses yet." : "You haven't published any courses yet."}
                  </p>
                  <Link to={user?.role === 'student' ? "/dashboard" : "/create-course"} style={{ padding: '0.8rem 1.5rem', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '600' }}>
                    {user?.role === 'student' ? "Browse Courses" : "Create New Course"}
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {courses.map((course) => (
                    <div key={course._id} style={{ 
                      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden', 
                      transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' 
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                      <div style={{ padding: '1.5rem' }}>
                        <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '50px', fontWeight: '700', textTransform: 'uppercase' }}>
                          {course.category}
                        </span>
                        <h4 style={{ margin: '0.8rem 0 1.2rem 0', fontSize: '1.1rem', color: '#0f172a', lineHeight: '1.4' }}>{course.title}</h4>
                        
                        {/* ✅ LINK FIX: Always route to /course/:id to manage/learn */}
                        <Link 
                          to={`/course/${course._id}`} 
                          style={{ 
                            width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', 
                            padding: '0.8rem', background: '#f8fafc', color: '#4f46e5', border: '1px solid #e2e8f0', 
                            borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600', transition: 'all 0.2s' 
                          }}
                          onMouseOver={(e)=>{e.currentTarget.style.background='#e0e7ff'; e.currentTarget.style.borderColor='#4f46e5'}}
                          onMouseOut={(e)=>{e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.borderColor='#e2e8f0'}}
                        >
                          {user?.role === 'student' ? 'Continue Learning' : 'Manage Course'} <ChevronRight size={18} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <h2 style={{ margin: '0 0 2rem 0', display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#0f172a', fontSize: '1.5rem' }}>
                <Settings size={28} color="#4f46e5" /> Account Settings
              </h2>
              
              <form onSubmit={handleSubmit} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><User size={18} /></div>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                      style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', color: '#1e293b' }}
                      onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><Mail size={18} /></div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                      style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', color: '#1e293b' }}
                      onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><Lock size={18} /></div>
                    <input type="password" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" 
                      style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', color: '#1e293b' }}
                      onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{ 
                  width: '100%', padding: '1rem', background: '#4f46e5', color: 'white', border: 'none', 
                  borderRadius: '0.5rem', fontSize: '1.05rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', 
                  boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)', transition: 'background 0.2s, transform 0.2s',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem'
                }}
                onMouseOver={(e)=> { if(!loading) e.currentTarget.style.transform='translateY(-2px)' }} 
                onMouseOut={(e)=> { if(!loading) e.currentTarget.style.transform='translateY(0)' }}
                >
                  {loading ? <><Loader2 size={20} style={{animation: 'spin 1s linear infinite'}}/> Saving Changes...</> : <><Save size={20}/> Save Changes</>}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;