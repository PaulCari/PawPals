// src/services/api.js
import axios from 'axios';

// Asegúrate de que tu backend esté corriendo en este puerto
const API_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Antes de cada petición, inyectamos el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nutri_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;