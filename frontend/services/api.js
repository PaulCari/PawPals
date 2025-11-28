import axios from 'axios';

// La IP de tu máquina. No uses 'localhost' directamente en el emulador/dispositivo.
// Para encontrar tu IP, en Windows usa 'ipconfig' en la terminal, y en Mac/Linux 'ifconfig'.
const API_URL = 'http://192.168.18.23/'; // Reemplaza TU_IP_LOCAL con tu IP

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;