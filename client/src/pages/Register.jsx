import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, Loader2, GraduationCap, Presentation } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register({ name, email, password, role });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Registration failed", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc',
      padding: '2rem 1rem' 
    }}>
      
      <div style={{ 
        background: '#ffffff', 
        width: '100%', 
        maxWidth: '480px', 
        borderRadius: '1.5rem', 
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
        overflow: 'hidden',
        border: '1px solid #f1f5f9'
      }}>
        
        {/* Header Section */}
        <div style={{ padding: '2.5rem 2.5rem 1.5rem 2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '1rem', display: 'inline-flex' }}>
              <UserPlus size={32} color="#4f46e5" />
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a', fontWeight: '800' }}>Create an Account</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Join us to start learning or teaching today.
          </p>
        </div>

        {/* Form Section */}
        <div style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* 🟢 PREMIUM ROLE SELECTOR (Cards instead of dropdown) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.8rem' }}>I want to join as a:</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                
                <div 
                  onClick={() => setRole('student')}
                  style={{
                    flex: 1, padding: '1rem', border: role === 'student' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    borderRadius: '0.75rem', cursor: 'pointer', background: role === 'student' ? '#e0e7ff' : '#f8fafc',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s',
                    opacity: role === 'student' ? 1 : 0.7
                  }}
                >
                  <GraduationCap size={28} color={role === 'student' ? '#4f46e5' : '#64748b'} />
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', color: role === 'student' ? '#4f46e5' : '#475569' }}>Student</span>
                </div>

                <div 
                  onClick={() => setRole('instructor')}
                  style={{
                    flex: 1, padding: '1rem', border: role === 'instructor' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    borderRadius: '0.75rem', cursor: 'pointer', background: role === 'instructor' ? '#e0e7ff' : '#f8fafc',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s',
                    opacity: role === 'instructor' ? 1 : 0.7
                  }}
                >
                  <Presentation size={28} color={role === 'instructor' ? '#4f46e5' : '#64748b'} />
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', color: role === 'instructor' ? '#4f46e5' : '#475569' }}>Instructor</span>
                </div>

              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  style={{ 
                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', 
                    border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', 
                    outline: 'none', transition: 'border-color 0.2s', color: '#1e293b'
                  }}
                  onFocus={(e)=>e.target.style.borderColor='#4f46e5'} 
                  onBlur={(e)=>e.target.style.borderColor='#cbd5e1'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{ 
                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', 
                    border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', 
                    outline: 'none', transition: 'border-color 0.2s', color: '#1e293b'
                  }}
                  onFocus={(e)=>e.target.style.borderColor='#4f46e5'} 
                  onBlur={(e)=>e.target.style.borderColor='#cbd5e1'}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="Min. 6 characters" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  minLength="6"
                  required 
                  style={{ 
                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', 
                    border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', 
                    outline: 'none', transition: 'border-color 0.2s', color: '#1e293b'
                  }}
                  onFocus={(e)=>e.target.style.borderColor='#4f46e5'} 
                  onBlur={(e)=>e.target.style.borderColor='#cbd5e1'}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ 
                width: '100%', padding: '1rem', background: '#4f46e5', color: 'white', 
                border: 'none', borderRadius: '0.5rem', fontSize: '1.05rem', fontWeight: 'bold', 
                cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)', transition: 'background 0.2s, transform 0.2s',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem'
              }}
              onMouseOver={(e)=> { if(!isSubmitting) e.currentTarget.style.transform='translateY(-2px)' }} 
              onMouseOut={(e)=> { if(!isSubmitting) e.currentTarget.style.transform='translateY(0)' }}
            >
              {isSubmitting ? (
                <><Loader2 size={20} style={{animation: 'spin 1s linear infinite'}}/> Creating account...</>
              ) : (
                'Create Account'
              )}
            </button>
            
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Register;