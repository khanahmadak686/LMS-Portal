import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); 
  }, []);

  const updateUser = (updatedData) => {
    localStorage.setItem('user', JSON.stringify(updatedData));
    setUser(updatedData);
  };

  // 🚀 SMART ROUTING HELPER: 404 Error Fixed
  const navigateBasedOnRole = (userData) => {
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      // Admin ke alawa Student aur Instructor dono ka main route /dashboard hi hai
      navigate('/dashboard'); 
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      
      toast.success('Account created successfully!');
      
      navigateBasedOnRole(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const login = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', userData);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      
      toast.success('Welcome back!');
      
      const from = location.state?.from?.pathname || null;
      if (from) {
        navigate(from);
      } else {
        navigateBasedOnRole(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};