import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login as loginRequest, obtenerPerfil } from '../api/auth';
import { TOKEN_KEY, setOnNoAutorizado } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUsuario(null);
  }, []);

  useEffect(() => {
    setOnNoAutorizado(cerrarSesion);
  }, [cerrarSesion]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setCargando(false);
      return;
    }
    obtenerPerfil()
      .then(setUsuario)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setCargando(false));
  }, []);

  async function iniciarSesion(email, password) {
    const { token, usuario: u } = await loginRequest(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setUsuario(u);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
