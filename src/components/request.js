import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://staff-records-backend.onrender.com/api',
  timeout: 100000,
});

// Interceptors can be added here for auth tokens, logging, etc.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default instance;
