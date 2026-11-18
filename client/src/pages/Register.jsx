import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 🔒 SECURE: Role is strictly hardcoded to 'student' from frontend
      // Admin will manually upgrade them to instructor later
      await register({ name, email, password, role: 'student' });
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
      padding: '1.5rem 1rem' 
    }}>
      
      <div style={{ 
        background: '#ffffff', 
        width: '100%', 
        maxWidth: '400px', 
        borderRadius: '1.25rem', 
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
        overflow: 'hidden',
        border: '1px solid #f1f5f9'
      }}>
        
        <div style={{ padding: '2rem 1.5rem 1rem 1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '0.8rem', display: 'inline-flex' }}>
              <UserPlus size={26} color="#4f46e5" />
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>Create an Account</h2>
          <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            Join our platform to start learning today.
          </p>
        </div>

        <div style={{ padding: '0 1.5rem 2rem 1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
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
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  placeholder="Min. 6 characters" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  minLength="6"
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
                <><Loader2 size={16} style={{animation: 'spin 1s linear infinite'}}/> Creating account...</>
              ) : (
                'Create Account'
              )}
            </button>
            
          </form>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Register;