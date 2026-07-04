import api from './client';

export async function listarChoferes(params = {}) {
  const { data } = await api.get('/api/choferes', { params });
  return data.data;
}

export async function obtenerChofer(id) {
  const { data } = await api.get(`/api/choferes/${id}`);
  return data.data;
}

export async function crearChofer(nombre) {
  const { data } = await api.post('/api/choferes', { nombre });
  return data.data;
}

export async function actualizarChofer(id, payload) {
  const { data } = await api.put(`/api/choferes/${id}`, payload);
  return data.data;
}

export async function eliminarChofer(id) {
  await api.delete(`/api/choferes/${id}`);
}
