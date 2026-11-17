import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Users, DollarSign, PlusCircle, Compass, PlayCircle, Loader2, Search, Star, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        if (user.role === 'instructor') {
          const response = await axios.get('http://localhost:5000/api/instructor/dashboard', config);
          setData(response.data);
        } else {
          const response = await axios.get('http://localhost:5000/api/courses');
          setData(response.data); 
        }
      } catch (error) {
        console.error("Error fetching dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: '#f8fafc' }}>
      <Loader2 size={48} color={user.role === 'instructor' ? '#10b981' : '#4f46e5'} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
      <h3 style={{ color: '#4b5563' }}>Loading your workspace...</h3>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const StatCard = ({ title, value, icon, color, bg }) => (
    <div style={{
      background: '#ffffff', padding: '1.5rem', borderRadius: '1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center',
      gap: '1.5rem', flex: '1 1 250px', border: '1px solid #f1f5f9',
      transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default'
    }}
    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.05)'; }}
    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'; }}
    >
      <div style={{ background: bg, padding: '1rem', borderRadius: '50%', color: color, display: 'flex' }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>{title}</p>
        <h2 style={{ margin: '0.3rem 0 0 0', color: '#0f172a', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>{value}</h2>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 👨‍🎓 STUDENT DASHBOARD HERO SECTION */}
      {(user.role === 'student' || user.role === 'admin') && (
        <div style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
          color: 'white', padding: '4rem 5%', position: 'relative', overflow: 'hidden'
        }}>
          {/* Background decorative elements */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(79, 70, 229, 0.2)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-50px', left: '10%', width: '200px', height: '200px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
          
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ maxWidth: '700px' }}>
              <span style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem', backdropFilter: 'blur(10px)', letterSpacing: '0.5px' }}>
                🚀 Level up your skills today
              </span>
              <h1 style={{ margin: '0 0 1rem 0', fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-1px' }}>
                Find the perfect <span style={{ color: '#818cf8' }}>course</span> to master your craft
              </h1>
              <p style={{ margin: 0, fontSize: '1.1rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                Join thousands of learners achieving their goals. From coding to design, our expert-led courses are built to help you succeed.
              </p>
            </div>

            {/* Premium Search Bar (UI Only) */}
            <div style={{ 
              display: 'flex', alignItems: 'center', background: 'white', padding: '0.5rem', 
              borderRadius: '0.75rem', maxWidth: '600px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
            }}>
              <Search size={22} color="#94a3b8" style={{ marginLeft: '1rem' }} />
              <input type="text" placeholder="What do you want to learn?" style={{ 
                flex: 1, padding: '1rem', border: 'none', outline: 'none', fontSize: '1.05rem', color: '#1e293b'
              }} />
              <button style={{ 
                padding: '1rem 2rem', background: '#4f46e5', color: 'white', border: 'none', 
                borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
                transition: 'background 0.2s'
              }} onMouseOver={(e)=>e.currentTarget.style.background='#4338ca'} onMouseOut={(e)=>e.currentTarget.style.background='#4f46e5'}>
                Search
              </button>
            </div>
            
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem 5%' }}>
      
        {/* INSTRUCTOR DASHBOARD */}
        {user.role === 'instructor' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2rem' }}>Instructor Hub</h1>
                <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '1.05rem' }}>Welcome back, {user.name.split(' ')[0]}! Here's how your courses are doing.</p>
              </div>
              <Link to="/create-course" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem',
                backgroundColor: '#10b981', color: 'white', borderRadius: '0.5rem', textDecoration: 'none',
                fontWeight: '600', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.25)', transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <PlusCircle size={20} /> Create New Course
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
              <StatCard title="Total Earnings" value={`₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}`} icon={<DollarSign size={28} />} color="#10b981" bg="#d1fae5" />
              <StatCard title="Total Students" value={data?.totalEnrollments || 0} icon={<Users size={28} />} color="#3b82f6" bg="#dbeafe" />
              <StatCard title="Active Courses" value={data?.totalCourses || 0} icon={<BookOpen size={28} />} color="#f59e0b" bg="#fef3c7" />
            </div>

            <h2 style={{ color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlayCircle size={24} color="#10b981"/> Manage Your Courses
            </h2>
            
            {data?.courses?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#ffffff', borderRadius: '1rem', border: '1px dashed #cbd5e1' }}>
                <BookOpen size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#1e293b', margin: '0 0 0.5rem 0' }}>No Courses Published Yet</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Share your knowledge with the world by creating your first course.</p>
                <Link to="/create-course" className="btn btn-primary" style={{ background: '#10b981', border: 'none' }}>Create a Course</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {data?.courses?.map((course) => (
                  <div key={course._id} style={{ background: '#ffffff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', transition: 'box-shadow 0.3s, transform 0.3s' }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(0,0,0,0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'; }}
                  >
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={(e)=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={(e)=>e.currentTarget.style.transform='scale(1)'} />
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem', lineHeight: '1.4' }}>{course.title}</h3>
                      <p style={{ margin: '0 0 1.2rem 0', color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Users size={16} /> Students Enrolled: <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{course.studentsEnrolled.length}</span>
                      </p>
                      <Link to={`/course/${course._id}`} style={{ display: 'block', textAlign: 'center', padding: '0.8rem', background: '#f8fafc', color: '#10b981', fontWeight: '600', textDecoration: 'none', borderRadius: '0.5rem', border: '1px solid #10b981', transition: 'background 0.2s' }} onMouseOver={(e)=>{e.currentTarget.style.background='#10b981'; e.currentTarget.style.color='white'}} onMouseOut={(e)=>{e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.color='#10b981'}}>
                        Manage Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* STUDENT DASHBOARD CONTENT */}
        {(user.role === 'student' || user.role === 'admin') && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={24} color="#4f46e5" /> Trending Courses
              </h2>
              
              {/* Optional Filter/Sort tags (UI only) */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ padding: '0.4rem 1rem', background: '#e0e7ff', color: '#4f46e5', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>All</span>
                <span style={{ padding: '0.4rem 1rem', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>Web Dev</span>
                <span style={{ padding: '0.4rem 1rem', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>Design</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {data?.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>No courses are currently available. Please check back later!</div>
              ) : (
                data?.map((course) => (
                  <div key={course._id} style={{ background: '#ffffff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.3s, transform 0.3s' }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(0,0,0,0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'; }}
                  >
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={(e)=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={(e)=>e.currentTarget.style.transform='scale(1)'} />
                      <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.95)', color: '#4f46e5', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', backdropFilter: 'blur(4px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {course.category}
                      </span>
                    </div>
                    
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Premium Course Metadata */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Star size={14} color="#f59e0b" fill="#f59e0b" /> 4.8 (120)</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={14} /> 10+ hrs</span>
                      </div>

                      <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.15rem', lineHeight: '1.4', flex: 1 }}>{course.title}</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {course.instructor?.name ? course.instructor.name.charAt(0).toUpperCase() : 'I'}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{course.instructor?.name || 'Instructor'}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem', marginTop: 'auto' }}>
                        <span style={{ fontWeight: '800', fontSize: '1.3rem', color: '#0f172a' }}>{course.price === 0 ? 'Free' : `₹${course.price}`}</span>
                        <Link to={`/course/${course._id}`} style={{ padding: '0.6rem 1.5rem', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '50px', fontWeight: '600', fontSize: '0.9rem', transition: 'background 0.2s, transform 0.1s' }} onMouseOver={(e)=>e.currentTarget.style.background='#4338ca'} onMouseOut={(e)=>e.currentTarget.style.background='#4f46e5'} onMouseDown={(e)=>e.currentTarget.style.transform='scale(0.95)'} onMouseUp={(e)=>e.currentTarget.style.transform='scale(1)'}>
                          Enroll
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;