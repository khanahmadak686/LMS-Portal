import axios from 'axios';

// Ek central axios instance create kar rahe hain
const api = axios.create({
  // Vite mein environment variables VITE_ se start hote hain
  // Agar .env mein VITE_API_URL hai toh wo use hoga, warna localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Optional: Backend agar cookies/sessions use karta hai toh isey true rakhein
  withCredentials: true 
});

export default api;