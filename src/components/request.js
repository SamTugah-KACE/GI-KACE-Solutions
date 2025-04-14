import axios from 'axios';
import { getAuthToken } from '../context/auth';
import { toast } from 'react-toastify';

const instance = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  baseURL: process.env.REACT_APP_API_URL || 'https://staff-records-backend.onrender.com/api',
  timeout: 100000,
  // Set timeout to 30 minutes for long processing tasks like large excel file processing
  // timeout: process.env.REACT_APP_API_TIMEOUT ? Number(process.env.REACT_APP_API_TIMEOUT) : 1800000, // 30 * 60 * 1000 = 1,800,000 ms
});

// Request interceptor: attaches auth token and sets default headers
instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    console.log('\n\nRequest Token:', token);
    // Attach the token to the Authorization header if it exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Set default Content-Type header if not set
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptors can be added here for auth tokens, logging, etc.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API error:', error);

    // Check if a response exists so we can handle specific status codes
    if (error.response) {
      const status = error.response.status;

      // Handle unauthorized error: possibly trigger logout or token refresh logic
      if (status === 401) {
        toast.error('Unauthorized access. Please log in again.');
        // Optionally, trigger a logout action here.
      }
      // Handle server errors (500 and above)
      if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } else {
      // Handle errors that are not HTTP responses such as network errors or timeouts.
      toast.error('Network error or request timed out.');
    }
    
    // Log the error to an external monitoring service (e.g. Sentry)
    // Sentry.captureException(error);

    
    return Promise.reject(error);
  }
);

export default instance;
