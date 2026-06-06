import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
});

// Attach JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lex_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 auto-logout
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // Dispatch logout action to clear Redux state and localStorage
      store.dispatch(logout());
    }
    return Promise.reject(err);
  }
);

export default api;
