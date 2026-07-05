import axios from 'axios';

// La URL del backend se configura por variable de entorno (ver .env.example)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const TOKEN_KEY = 'rv_token';

export const api = axios.create({
  baseURL,
  timeout: 20000,
});

// Adjunta el token guardado (si existe) a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// El AuthProvider se registra acá para enterarse cuando el backend
// rechaza el token (expirado / inválido) y así cerrar la sesión.
let onNoAutorizado = null;
export function setOnNoAutorizado(fn) {
  onNoAutorizado = fn;
}

// Normaliza los errores para mostrar siempre un mensaje legible en la UI
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && onNoAutorizado) {
      onNoAutorizado();
    }
    const mensaje =
      error.response?.data?.mensaje ||
      error.message ||
      'Error de conexión con el servidor';
    return Promise.reject(new Error(mensaje));
  }
);

export default api;
