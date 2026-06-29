import axios from "axios";

const api = axios.create({
  baseURL: "https://hk-music.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const SERVER_URL = "https://hk-music.onrender.com";

export default api;