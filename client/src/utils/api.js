import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000') + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - token might be invalid/expired
        localStorage.removeItem('token');
        localStorage.removeItem('isAuth');
        // You might want to redirect to login page here
        // window.location.href = '/login';
      }

      // Return a more user-friendly error message
      const errorMessage = data.msg || data.errors || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Network error
      return Promise.reject(new Error('Network error - please check your connection'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default api;
