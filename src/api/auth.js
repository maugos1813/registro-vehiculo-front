import api from './client';

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data.data; // { token, usuario }
}

export async function obtenerPerfil() {
  const { data } = await api.get('/api/auth/me');
  return data.data;
}

// Solo ADMIN
export async function listarUsuarios() {
  const { data } = await api.get('/api/auth/usuarios');
  return data.data;
}

// Solo ADMIN. payload: { email, password, rol, choferId }
export async function registrarUsuario(payload) {
  const { data } = await api.post('/api/auth/registrar', payload);
  return data.data;
}
