import { useEffect, useState } from 'react';
import { Loader2, Search, User } from 'lucide-react';
import { EstadoBadge } from '../components/ui/Badge';
import { listarVehiculos } from '../api/vehiculos';
import { ultimoEstadoVehiculo } from '../api/registros';
import { formatRelativo } from '../utils/format';
import { useToast } from '../context/ToastContext';

export default function VehiculosScreen() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const vehiculos = await listarVehiculos();
        const conEstado = await Promise.all(
          vehiculos.map(async (v) => {
            const ultimo = await ultimoEstadoVehiculo(v.id).catch(() => null);
            const tomado = ultimo?.tipo === 'TOMA';
            return { ...v, ultimo, tomado };
          })
        );
        setItems(conEstado);
      } catch (err) {
        showToast(err.message || 'No se pudo cargar la flota', 'error');
      } finally {
        setCargando(false);
      }
    }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrados = items.filter((v) => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return v.targa.toLowerCase().includes(q) || v.modelo?.toLowerCase().includes(q);
  });

  const enUso = filtrados.filter((v) => v.tomado).length;

  return (
    <div className="px-5 pt-6 pb-32 max-w-md md:max-w-3xl lg:max-w-5xl mx-auto">
      <header className="mb-5">
        <h1 className="font-display font-extrabold text-[26px] text-ink">Flota</h1>
        <p className="text-muted text-sm mt-1">
          {cargando ? 'Cargando estado…' : `${enUso} en uso · ${filtrados.length - enUso} libres`}
        </p>
      </header>

      <div className="relative mb-5">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por targa o modelo…"
          className="w-full h-11 pl-11 pr-4 rounded-pill bg-surface border border-line focus:border-toma focus:outline-none text-sm shadow-soft transition-colors"
        />
      </div>

      {cargando ? (
        <div className="flex justify-center py-16 text-muted">
          <Loader2 className="animate-spin" size={26} />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm">No hay vehículos registrados todavía.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtrados.map((v) => (
            <div key={v.id} className="bg-surface rounded-bubble shadow-soft p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-lg text-ink">{v.targa}</span>
                <EstadoBadge tomado={v.tomado} />
              </div>
              <div className="text-sm text-muted mb-2">{v.modelo || 'Sin modelo especificado'}</div>
              {v.ultimo ? (
                <div className="flex items-center gap-1.5 text-sm text-ink/80 bg-canvas rounded-pill px-3 py-1.5 w-fit">
                  <User size={13} />
                  {v.tomado ? 'Con' : 'Últ. dejó'} {v.ultimo.chofer?.nombre} · {formatRelativo(v.ultimo.fechaHora)}
                </div>
              ) : (
                <div className="text-sm text-muted italic">Sin movimientos registrados</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
