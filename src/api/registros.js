import api from './client';

export async function listarRegistros(params = {}) {
  const { data } = await api.get('/api/registros', { params });
  return data; // incluye { data, paginacion }
}

export async function obtenerRegistro(id) {
  const { data } = await api.get(`/api/registros/${id}`);
  return data.data;
}

export async function ultimoEstadoVehiculo(vehiculoId) {
  const { data } = await api.get(`/api/registros/ultimo/${vehiculoId}`);
  return data.data;
}

export async function ultimoEstadoChofer(choferId) {
  const { data } = await api.get(`/api/registros/ultimo-chofer/${choferId}`);
  return data.data;
}

// payload: { tipo, choferNombre, targaVehiculo, comentarios, fotos: File[] }
export async function crearRegistro(payload, { onProgress } = {}) {
  const form = new FormData();
  form.append('tipo', payload.tipo);
  form.append('choferNombre', payload.choferNombre);
  form.append('targaVehiculo', payload.targaVehiculo);
  if (payload.comentarios) form.append('comentarios', payload.comentarios);
  (payload.fotos || []).forEach((file) => form.append('fotos', file));

  const { data } = await api.post('/api/registros', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100));
    },
  });
  return data.data;
}

export async function actualizarRegistro(id, payload) {
  const form = new FormData();
  if (payload.tipo) form.append('tipo', payload.tipo);
  if (payload.comentarios !== undefined) form.append('comentarios', payload.comentarios);
  (payload.fotos || []).forEach((file) => form.append('fotos', file));

  const { data } = await api.put(`/api/registros/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function eliminarRegistro(id) {
  await api.delete(`/api/registros/${id}`);
}
