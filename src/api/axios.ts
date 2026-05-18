import axios from "axios";

const api = axios.create({
  //baseURL: 'http://localhost:8080',
  //baseURL: 'https://2mwnrqhc-8080.asse.devtunnels.ms/',
  //baseURL: "http://10.80.132.123:8080",
  baseURL: "https://11830e59-afe7-40c4-917c-6fc2638ff6fb-00-1206pj0e9puai.sisko.replit.dev/",
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
