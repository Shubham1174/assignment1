import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
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


