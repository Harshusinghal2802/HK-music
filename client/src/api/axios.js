import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hk-music-1.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const SERVER_URL = 'http://localhost:5000';

export default api;
