export function formatFechaHora(iso) {
  const d = new Date(iso);
  return d.toLocaleString('es', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatHoraCorta(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

export function formatRelativo(iso) {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return 'justo ahora';
  if (min < 60) return `hace ${min} min`;
  const horas = Math.round(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.round(horas / 24);
  return `hace ${dias} d`;
}
