import axios from 'axios';

// Live backend API link
const API_URL = "https://lms-backend-api-ybnd.onrender.com/api";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default instance;