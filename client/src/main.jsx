import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Global Contexts
import { AuthProvider } from './context/AuthContext.jsx';

// Main App Component & Styles
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider is nested inside BrowserRouter to allow use of useNavigate inside AuthContext */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);