import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = error?.response?.data || { message: error.message };
    return Promise.reject(normalized);
  }
);

export default api;


