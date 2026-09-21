import axios from 'axios';

const api = axios.create({
  baseURL: 'https://quiz-backend-j9va.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Admin JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (
        window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.includes('/login')
      ) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;