import { useEffect, useState } from 'react';
import { ImageOff, Loader2, Search, Trash2 } from 'lucide-react';
import { TipoBadge } from '../components/ui/Badge';
import BottomSheet from '../components/ui/BottomSheet';
import { listarRegistros, eliminarRegistro } from '../api/registros';
import { formatFechaHora, formatRelativo } from '../utils/format';
import { useToast } from '../context/ToastContext';

const FILTROS = [
  { id: '', label: 'Todos' },
  { id: 'TOMA', label: 'Tomas' },
  { id: 'DEJA', label: 'Entregas' },
];

export default function HistorialScreen() {
  const { showToast } = useToast();
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [borrando, setBorrando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const res = await listarRegistros({ tipo: filtro || undefined, limit: 50 });
      setRegistros(res.data);
    } catch (err) {
      showToast(err.message || 'No se pudo cargar el historial', 'error');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const filtrados = registros.filter((r) => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return (
      r.chofer?.nombre?.toLowerCase().includes(q) ||
      r.vehiculo?.targa?.toLowerCase().includes(q) ||
      r.comentarios?.toLowerCase().includes(q)
    );
  });

  async function borrar(id) {
    setBorrando(true);
    try {
      await eliminarRegistro(id);
      setRegistros((prev) => prev.filter((r) => r.id !== id));
      setSeleccionado(null);
      showToast('Registro eliminado', 'success');
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar', 'error');
    } finally {
      setBorrando(false);
    }
  }

  return (
    <div className="px-5 pt-6 pb-32 max-w-md mx-auto">
      <header className="mb-5">
        <h1 className="font-display font-extrabold text-[26px] text-ink">Historial</h1>
        <p className="text-muted text-sm mt-1">Todos los movimientos registrados por la flota</p>
      </header>

      <div className="relative mb-4">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por chofer, targa o comentario…"
          className="w-full h-11 pl-11 pr-4 rounded-pill bg-surface border border-line focus:border-toma focus:outline-none text-sm shadow-soft transition-colors"
        />
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-4 h-9 rounded-pill text-sm font-semibold whitespace-nowrap transition-colors ${
              filtro === f.id ? 'bg-ink text-white' : 'bg-surface text-muted border border-line'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="flex justify-center py-16 text-muted">
          <Loader2 className="animate-spin" size={26} />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm">Sin registros todavía.</div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((r) => (
            <button
              key={r.id}
              onClick={() => setSeleccionado(r)}
              className="w-full text-left bg-surface rounded-bubble shadow-soft p-4 flex gap-3 items-start hover:shadow-floating transition-shadow"
            >
              {r.fotos?.[0]?.url ? (
                <img src={r.fotos[0].url} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-canvas flex items-center justify-center shrink-0 text-muted">
                  <ImageOff size={18} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-ink truncate">{r.chofer?.nombre}</span>
                  <TipoBadge tipo={r.tipo} />
                </div>
                <div className="text-sm text-muted truncate">{r.vehiculo?.targa} · {r.vehiculo?.modelo || 'sin modelo'}</div>
                {r.comentarios && <div className="text-sm text-ink/80 truncate mt-0.5">{r.comentarios}</div>}
                <div className="text-xs text-muted mt-1">{formatRelativo(r.fechaHora)}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <BottomSheet open={!!seleccionado} onClose={() => setSeleccionado(null)} title="Detalle del registro">
        {seleccionado && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <TipoBadge tipo={seleccionado.tipo} />
              <span className="text-sm text-muted">{formatFechaHora(seleccionado.fechaHora)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-canvas rounded-bubble p-3">
                <div className="text-[11px] font-semibold uppercase text-muted mb-0.5">Chofer</div>
                <div className="font-semibold text-ink">{seleccionado.chofer?.nombre}</div>
              </div>
              <div className="bg-canvas rounded-bubble p-3">
                <div className="text-[11px] font-semibold uppercase text-muted mb-0.5">Vehículo</div>
                <div className="font-semibold text-ink">{seleccionado.vehiculo?.targa}</div>
              </div>
            </div>
            {seleccionado.comentarios && (
              <div className="bg-canvas rounded-bubble p-3">
                <div className="text-[11px] font-semibold uppercase text-muted mb-0.5">Comentarios</div>
                <div className="text-ink">{seleccionado.comentarios}</div>
              </div>
            )}
            {seleccionado.fotos?.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold uppercase text-muted mb-2">Fotos</div>
                <div className="flex flex-wrap gap-2">
                  {seleccionado.fotos.map((f, i) => (
                    <a key={i} href={f.url} target="_blank" rel="noreferrer">
                      <img src={f.url} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => borrar(seleccionado.id)}
              disabled={borrando}
              className="w-full h-12 rounded-pill bg-bad-soft text-bad font-semibold flex items-center justify-center gap-2 mt-2"
            >
              {borrando ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Eliminar registro
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
