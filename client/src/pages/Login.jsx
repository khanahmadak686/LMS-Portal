import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, BookOpen, Loader2, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      setIsSubmitting(false); 
    } catch (error) {
      console.error("Login failed", error);
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
      padding: '1.5rem 1rem' 
    }}>
      
      <div style={{ 
        background: '#ffffff', 
        width: '100%', 
        maxWidth: '380px', // Thoda slim kiya taaki neat lage
        borderRadius: '1.25rem', 
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
        overflow: 'hidden',
        border: '1px solid #f1f5f9'
      }}>
        
        {/* Header Section */}
        <div style={{ padding: '2rem 1.5rem 1rem 1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '0.8rem', display: 'inline-flex' }}>
              <BookOpen size={26} color="#4f46e5" />
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>Welcome Back</h2>
          <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            Log in to continue your learning journey
          </p>
        </div>

        {/* Form Section */}
        <div style={{ padding: '0 1.5rem 2rem 1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{ 
                    width: '100%', padding: '0.7rem 1rem 0.7rem 2.4rem', borderRadius: '0.5rem', 
                    border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.9rem', 
                    outline: 'none', transition: 'border-color 0.2s', color: '#1e293b'
                  }}
                  onFocus={(e)=>e.target.style.borderColor='#4f46e5'} 
                  onBlur={(e)=>e.target.style.borderColor='#cbd5e1'}
                />
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Password</label>
                <Link to="#" style={{ fontSize: '0.75rem', color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={{ 
                    width: '100%', padding: '0.7rem 1rem 0.7rem 2.4rem', borderRadius: '0.5rem', 
                    border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.9rem', 
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
                width: '100%', padding: '0.75rem', background: '#4f46e5', color: 'white', 
                border: 'none', borderRadius: '0.5rem', fontSize: '0.95rem', fontWeight: 'bold', 
                cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)', transition: 'background 0.2s, transform 0.2s',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem'
              }}
              onMouseOver={(e)=> { if(!isSubmitting) e.currentTarget.style.transform='translateY(-2px)' }} 
              onMouseOut={(e)=> { if(!isSubmitting) e.currentTarget.style.transform='translateY(0)' }}
            >
              {isSubmitting ? (
                <><Loader2 size={16} style={{animation: 'spin 1s linear infinite'}}/> Signing in...</>
              ) : (
                <><LogIn size={18}/> Sign In</>
              )}
            </button>
            
          </form>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            Don't have an account yet? <Link to="/register" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>Create Account</Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;