import axios from 'axios';

// ✅ CAMBIO: Usa localhost en lugar de la IP
const API_URL = 'http://localhost:8000'; // ← CORREGIDO

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;