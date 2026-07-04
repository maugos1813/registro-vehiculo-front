import axios from 'axios';

// La URL del backend se configura por variable de entorno (ver .env.example)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  timeout: 20000,
});

// Normaliza los errores para mostrar siempre un mensaje legible en la UI
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const mensaje =
      error.response?.data?.mensaje ||
      error.message ||
      'Error de conexión con el servidor';
    return Promise.reject(new Error(mensaje));
  }
);

export default api;
