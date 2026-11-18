import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Loader2, ArrowRight } from 'lucide-react';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://lms-backend-api-ybnd.onrender.com/api";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Loader2 size={48} color="#4f46e5" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* 🚀 HERO SECTION */}
      <div style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white', padding: '5rem 5%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' }}>Welcome to Our LMS Portal</h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Explore our premium courses and start learning today. Build your future with expert-led content.
        </p>
        <Link to="/register" style={{ padding: '1rem 2.5rem', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Join for Free
        </Link>
      </div>

      {/* 📚 COURSE LISTING SECTION */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 5%' }}>
        <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlayCircle color="#4f46e5" /> Featured Courses
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {courses.map((course) => (
            <div key={course._id} style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={(e)=>e.currentTarget.style.transform='translateY(0)'}>
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 'bold', textTransform: 'uppercase' }}>{course.category}</span>
                <h3 style={{ margin: '0.5rem 0', color: '#1e293b' }}>{course.title}</h3>
                <h2 style={{ color: '#0f172a', margin: '1rem 0' }}>{course.price === 0 ? 'Free' : `₹${course.price}`}</h2>
                <Link to={`/course/${course._id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: '#f1f5f9', color: '#0f172a', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '600' }}>
                  View Details <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;