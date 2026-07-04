import api from './client';

export async function listarVehiculos(params = {}) {
  const { data } = await api.get('/api/vehiculos', { params });
  return data.data;
}

export async function obtenerVehiculo(id) {
  const { data } = await api.get(`/api/vehiculos/${id}`);
  return data.data;
}

export async function crearVehiculo(payload) {
  const { data } = await api.post('/api/vehiculos', payload);
  return data.data;
}

export async function actualizarVehiculo(id, payload) {
  const { data } = await api.put(`/api/vehiculos/${id}`, payload);
  return data.data;
}

export async function eliminarVehiculo(id) {
  await api.delete(`/api/vehiculos/${id}`);
}
