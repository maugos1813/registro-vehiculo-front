import api from './client';

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data.data; // { token, usuario }
}

export async function obtenerPerfil() {
  const { data } = await api.get('/api/auth/me');
  return data.data;
}

// Autorregistro público como CHOFER (sin necesitar un admin)
export async function registrarse(nombre, email, password) {
  const { data } = await api.post('/api/auth/registro', { nombre, email, password });
  return data.data; // { token, usuario }
}

export async function solicitarRecuperacion(email) {
  const { data } = await api.post('/api/auth/forgot-password', { email });
  return data.mensaje;
}

export async function restablecerPassword(token, password) {
  const { data } = await api.post('/api/auth/reset-password', { token, password });
  return data.mensaje;
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

// Solo ADMIN. rol: "ADMIN" | "CHOFER"
export async function cambiarRolUsuario(id, rol) {
  const { data } = await api.put(`/api/auth/usuarios/${id}/rol`, { rol });
  return data.data;
}

// Solo ADMIN
export async function eliminarUsuario(id) {
  await api.delete(`/api/auth/usuarios/${id}`);
}
