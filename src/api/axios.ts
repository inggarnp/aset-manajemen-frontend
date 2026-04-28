import axios from "axios";

const api = axios.create({
  //baseURL: 'http://localhost:8080',
  //baseURL: 'https://2mwnrqhc-8080.asse.devtunnels.ms/',
  //baseURL: "http://10.80.132.123:8080",
  baseURL: "https://aset-manajemen-backend-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
