import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import {
  Users, BookOpen, DollarSign, TrendingUp, Shield, 
  Loader2, AlertCircle, ChevronRight, MoreVertical
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        const statsResponse = await axios.get('http://localhost:5000/api/admin/stats', config);
        setStats(statsResponse.data);

        const instResponse = await axios.get('http://localhost:5000/api/admin/instructors', config);
        setInstructors(instResponse.data);

        const coursesResponse = await axios.get('http://localhost:5000/api/admin/courses', config);
        setCourses(coursesResponse.data);

      } catch (err) {
        setError('Failed to fetch admin data. Ensure you have admin privileges.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchAdminData();
    } else {
      setLoading(false);
      setError('Please login to access admin dashboard.');
    }
  }, [user]);

  // 🟢 1. PREMIUM LOADING STATE
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Loader2 size={48} color="#dc2626" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
      <h3 style={{ color: '#4b5563' }}>Loading Workspace...</h3>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // 🔴 2. PREMIUM ERROR STATE
  if (error) return (
    <div className="page-container" style={{ paddingTop: '3rem' }}>
      <div style={{ background: '#fee2e2', border: '1px solid #f87171', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#991b1b' }}>
        <AlertCircle size={28} />
        <div>
          <h3 style={{ margin: 0 }}>Access Denied</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{error}</p>
        </div>
      </div>
    </div>
  );

  if (!stats) return <div className="page-container"><h2>No admin data available.</h2></div>;

  // 🟢 3. INTERACTIVE STAT CARD COMPONENT
  const StatCard = ({ title, value, icon, color }) => (
    <div 
      style={{
        background: '#ffffff', padding: '1.5rem', borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center',
        gap: '1.5rem', flex: '1 1 200px', border: '1px solid #f1f5f9',
        transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default'
      }}
      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.05)'; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'; }}
    >
      <div style={{ background: `${color}15`, padding: '1rem', borderRadius: '50%', color: color, display: 'flex' }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>{title}</p>
        <h2 style={{ margin: '0.3rem 0 0 0', color: '#0f172a', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>{value}</h2>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 5% 4rem 5%' }}>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#0f172a', fontSize: '2rem' }}>
              <TrendingUp size={32} color="#dc2626" /> Admin Overview
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Welcome back to your workspace, {user.name.split(' ')[0]}.</p>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} icon={<DollarSign size={28} />} color="#10b981" />
          <StatCard title="Total Enrollments" value={stats.totalEnrollments || 0} icon={<TrendingUp size={28} />} color="#3b82f6" />
          <StatCard title="Active Courses" value={stats.totalCourses || 0} icon={<BookOpen size={28} />} color="#f59e0b" />
          <StatCard title="Total Students" value={stats.totalUsers || 0} icon={<Users size={28} />} color="#8b5cf6" />
          <StatCard title="Total Instructors" value={stats.totalInstructors || 0} icon={<Shield size={28} />} color="#ef4444" />
        </div>

        {/* Charts Section */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <div style={{ flex: '1 1 500px', background: '#ffffff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Revenue Growth (6 Months)</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, fill: '#10b981' }} name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ flex: '1 1 500px', background: '#ffffff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Student Enrollments</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 🟢 4. ENHANCED LISTS (Courses & Instructors) */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Courses List */}
          <div style={{ flex: '1 1 500px', background: '#ffffff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <BookOpen size={22} color="#f59e0b" /> Manage Courses
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: '600', cursor: 'pointer' }}>View All</span>
            </div>
            
            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No courses found.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {courses.slice(0, 5).map(course => ( // Showing only top 5 for neat dashboard look
                  <Link to={`/course/${course._id}`} key={course._id} style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', 
                    border: '1px solid #e2e8f0', borderRadius: '0.5rem', textDecoration: 'none', color: 'inherit',
                    transition: 'border-color 0.2s, background-color 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <img src={course.thumbnail} alt={course.title} style={{ width: '50px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#1e293b' }}>{course.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>By {course.instructor?.name || 'Unknown'}</p>
                    </div>
                    <span style={{ fontWeight: '600', color: '#10b981', fontSize: '0.9rem' }}>₹{course.price}</span>
                    <ChevronRight size={18} color="#94a3b8" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Instructors List */}
          <div style={{ flex: '1 1 400px', background: '#ffffff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <Shield size={22} color="#ef4444" /> Instructors Directory
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: '600', cursor: 'pointer' }}>View All</span>
            </div>

            {instructors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No instructors found.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {instructors.slice(0, 5).map(inst => (
                  <div key={inst._id} style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', 
                    border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#ffffff',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                  >
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2', 
                      color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 'bold', border: '1px solid #fca5a5'
                    }}>
                      {inst.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#1e293b' }}>{inst.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{inst.email}</p>
                    </div>
                    <MoreVertical size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;