import { useEffect, useState } from 'react';
import { Car, Loader2, Pencil, Plus, Search, Trash2, User } from 'lucide-react';
import { EstadoBadge } from '../components/ui/Badge';
import BottomSheet from '../components/ui/BottomSheet';
import { listarVehiculos, actualizarVehiculo, crearVehiculo, eliminarVehiculo } from '../api/vehiculos';
import { ultimoEstadoVehiculo } from '../api/registros';
import { formatRelativo } from '../utils/format';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function VehiculosScreen() {
  const { showToast } = useToast();
  const { usuario } = useAuth();
  const esAdmin = usuario.rol === 'ADMIN';
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [cambiandoActivoId, setCambiandoActivoId] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [aEditar, setAEditar] = useState(null);
  const [formEdicion, setFormEdicion] = useState({ targa: '', modelo: '' });
  const [guardando, setGuardando] = useState(false);
  const [agregando, setAgregando] = useState(false);
  const [formNuevo, setFormNuevo] = useState({ targa: '', modelo: '' });
  const [creando, setCreando] = useState(false);

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

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrados = items.filter((v) => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return v.targa.toLowerCase().includes(q) || v.modelo?.toLowerCase().includes(q);
  });

  const enUso = filtrados.filter((v) => v.tomado).length;

  async function alternarActivoVehiculo(v) {
    setCambiandoActivoId(v.id);
    try {
      const actualizado = await actualizarVehiculo(v.id, { activo: !v.activo });
      setItems((prev) => prev.map((x) => (x.id === v.id ? { ...x, ...actualizado } : x)));
      showToast(`${actualizado.targa} ahora está ${actualizado.activo ? 'activo' : 'inactivo'}`, 'success');
    } catch (err) {
      showToast(err.message || 'No se pudo actualizar el vehículo', 'error');
    } finally {
      setCambiandoActivoId(null);
    }
  }

  function abrirEdicion(v) {
    setFormEdicion({ targa: v.targa, modelo: v.modelo || '' });
    setAEditar(v);
  }

  async function confirmarEdicion(e) {
    e.preventDefault();
    if (!aEditar || !formEdicion.targa.trim()) return;
    setGuardando(true);
    try {
      const actualizado = await actualizarVehiculo(aEditar.id, {
        targa: formEdicion.targa.trim(),
        modelo: formEdicion.modelo.trim(),
      });
      setItems((prev) => prev.map((x) => (x.id === aEditar.id ? { ...x, ...actualizado } : x)));
      showToast(`Vehículo ${actualizado.targa} actualizado`, 'success');
      setAEditar(null);
    } catch (err) {
      showToast(err.message || 'No se pudo actualizar el vehículo', 'error');
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarCreacion(e) {
    e.preventDefault();
    if (!formNuevo.targa.trim()) return;
    setCreando(true);
    try {
      const nuevo = await crearVehiculo({
        targa: formNuevo.targa.trim(),
        modelo: formNuevo.modelo.trim(),
      });
      setItems((prev) => [{ ...nuevo, ultimo: null, tomado: false }, ...prev]);
      showToast(`Vehículo ${nuevo.targa} agregado`, 'success');
      setAgregando(false);
      setFormNuevo({ targa: '', modelo: '' });
    } catch (err) {
      showToast(err.message || 'No se pudo agregar el vehículo', 'error');
    } finally {
      setCreando(false);
    }
  }

  async function confirmarEliminarVehiculo() {
    if (!aEliminar) return;
    setEliminando(true);
    try {
      await eliminarVehiculo(aEliminar.id);
      setItems((prev) => prev.filter((v) => v.id !== aEliminar.id));
      showToast(`Vehículo ${aEliminar.targa} eliminado`, 'success');
      setAEliminar(null);
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar', 'error');
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="px-5 pt-6 pb-32 max-w-md md:max-w-3xl lg:max-w-5xl mx-auto">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-ink">Flota</h1>
          <p className="text-muted text-sm mt-1">
            {cargando ? 'Cargando estado…' : `${enUso} en uso · ${filtrados.length - enUso} libres`}
          </p>
        </div>
        {esAdmin && (
          <button
            type="button"
            onClick={() => {
              setFormNuevo({ targa: '', modelo: '' });
              setAgregando(true);
            }}
            title="Agregar vehículo"
            className="shrink-0 w-11 h-11 rounded-full bg-toma text-white shadow-floating flex items-center justify-center active:scale-95 transition-transform"
          >
            <Plus size={20} />
          </button>
        )}
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
              <div className="text-sm text-muted mb-2">
                {v.modelo || 'Sin modelo especificado'}
                {!v.activo && ' · inactivo'}
              </div>
              {v.ultimo ? (
                <div className="flex items-center gap-1.5 text-sm text-ink/80 bg-canvas rounded-pill px-3 py-1.5 w-fit">
                  <User size={13} />
                  {v.tomado ? 'Con' : 'Últ. dejó'} {v.ultimo.chofer?.nombre} · {formatRelativo(v.ultimo.fechaHora)}
                </div>
              ) : (
                <div className="text-sm text-muted italic">Sin movimientos registrados</div>
              )}

              {esAdmin && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
                  <button
                    type="button"
                    disabled={cambiandoActivoId === v.id}
                    onClick={() => alternarActivoVehiculo(v)}
                    title={v.activo ? 'Marcar como inactivo' : 'Marcar como activo'}
                    className="shrink-0 flex items-center gap-2"
                  >
                    <span className={`text-xs font-bold ${v.activo ? 'text-ink' : 'text-muted'}`}>
                      {v.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    {cambiandoActivoId === v.id ? (
                      <Loader2 size={16} className="animate-spin text-muted" />
                    ) : (
                      <span
                        className={`relative w-11 h-6 rounded-pill transition-colors ${
                          v.activo ? 'bg-good' : 'bg-line'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${
                            v.activo ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    )}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => abrirEdicion(v)}
                      title="Editar vehículo"
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-toma hover:bg-toma-soft transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAEliminar(v)}
                      title="Eliminar vehículo"
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-bad hover:bg-bad-soft transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomSheet open={agregando} onClose={() => setAgregando(false)} title="Agregar vehículo">
        <form onSubmit={confirmarCreacion} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
              Targa
            </label>
            <div className="relative">
              <Car size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                autoFocus
                value={formNuevo.targa}
                onChange={(e) => setFormNuevo((f) => ({ ...f, targa: e.target.value }))}
                placeholder="Ej. AB123CD"
                className="w-full h-12 pl-11 pr-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
              Modelo (opcional)
            </label>
            <input
              type="text"
              value={formNuevo.modelo}
              onChange={(e) => setFormNuevo((f) => ({ ...f, modelo: e.target.value }))}
              placeholder="Ej. Renault Kangoo"
              className="w-full h-12 px-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={creando || !formNuevo.targa.trim()}
            className={`w-full h-12 rounded-pill font-display font-bold flex items-center justify-center gap-2 transition-colors ${
              formNuevo.targa.trim() ? 'bg-toma text-white' : 'bg-line text-muted'
            }`}
          >
            {creando ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Agregar vehículo
          </button>
        </form>
      </BottomSheet>

      <BottomSheet open={!!aEliminar} onClose={() => setAEliminar(null)} title="Eliminar vehículo">
        {aEliminar && (
          <div className="space-y-4">
            <p className="text-sm text-ink/80">
              ¿Eliminar el vehículo <span className="font-semibold">{aEliminar.targa}</span> de la flota? Si
              tiene registros cargados, no se va a poder eliminar.
            </p>
            <button
              onClick={confirmarEliminarVehiculo}
              disabled={eliminando}
              className="w-full h-12 rounded-pill bg-bad-soft text-bad font-semibold flex items-center justify-center gap-2"
            >
              {eliminando ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Eliminar
            </button>
          </div>
        )}
      </BottomSheet>

      <BottomSheet open={!!aEditar} onClose={() => setAEditar(null)} title="Editar vehículo">
        {aEditar && (
          <form onSubmit={confirmarEdicion} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
                Targa
              </label>
              <div className="relative">
                <Car size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={formEdicion.targa}
                  onChange={(e) => setFormEdicion((f) => ({ ...f, targa: e.target.value }))}
                  placeholder="Ej. AB123CD"
                  className="w-full h-12 pl-11 pr-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
                Modelo (opcional)
              </label>
              <input
                type="text"
                value={formEdicion.modelo}
                onChange={(e) => setFormEdicion((f) => ({ ...f, modelo: e.target.value }))}
                placeholder="Ej. Renault Kangoo"
                className="w-full h-12 px-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={guardando || !formEdicion.targa.trim()}
              className={`w-full h-12 rounded-pill font-display font-bold flex items-center justify-center gap-2 transition-colors ${
                formEdicion.targa.trim() ? 'bg-toma text-white' : 'bg-line text-muted'
              }`}
            >
              {guardando ? <Loader2 size={16} className="animate-spin" /> : <Pencil size={16} />}
              Guardar cambios
            </button>
          </form>
        )}
      </BottomSheet>
    </div>
  );
}
