import { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, Mail, Search, ShieldCheck, Trash2, User, UserPlus, Users } from 'lucide-react';
import { listarChoferes, eliminarChofer } from '../api/choferes';
import { registrarUsuario, listarUsuarios, cambiarRolUsuario, eliminarUsuario } from '../api/auth';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import BottomSheet from '../components/ui/BottomSheet';

const VACIO = { email: '', password: '', rol: 'CHOFER', choferId: null };

export default function UsuariosScreen() {
  const { showToast } = useToast();
  const { usuario: usuarioActual } = useAuth();
  const [choferes, setChoferes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [form, setForm] = useState(VACIO);
  const [busquedaChofer, setBusquedaChofer] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [cambiandoId, setCambiandoId] = useState(null);
  const [aEliminar, setAEliminar] = useState(null); // { tipo: 'usuario' | 'chofer', item }
  const [eliminando, setEliminando] = useState(false);

  async function cargarChoferes() {
    try {
      setChoferes(await listarChoferes());
    } catch (err) {
      showToast(err.message || 'No se pudo cargar la lista de choferes', 'error');
    }
  }

  async function cargarUsuarios() {
    setCargandoUsuarios(true);
    try {
      setUsuarios(await listarUsuarios());
    } catch (err) {
      showToast(err.message || 'No se pudo cargar la lista de usuarios', 'error');
    } finally {
      setCargandoUsuarios(false);
    }
  }

  useEffect(() => {
    cargarChoferes();
    cargarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choferIdsConCuenta = useMemo(
    () => new Set(usuarios.filter((u) => u.choferId).map((u) => u.choferId)),
    [usuarios]
  );

  const choferesFiltrados = useMemo(() => {
    const disponibles = choferes.filter((c) => !choferIdsConCuenta.has(c.id));
    const q = busquedaChofer.trim().toLowerCase();
    if (!q) return disponibles;
    return disponibles.filter((c) => c.nombre.toLowerCase().includes(q));
  }, [busquedaChofer, choferes, choferIdsConCuenta]);

  const necesitaChofer = form.rol === 'CHOFER';
  const listo =
    form.email.trim() &&
    form.password.length >= 6 &&
    (!necesitaChofer || form.choferId) &&
    !enviando;

  async function enviar(e) {
    e.preventDefault();
    if (!listo) return;

    setEnviando(true);
    try {
      await registrarUsuario({
        email: form.email.trim(),
        password: form.password,
        rol: form.rol,
        ...(necesitaChofer && { choferId: form.choferId }),
      });
      showToast(`Usuario ${form.email.trim()} creado`, 'success');
      setForm(VACIO);
      setBusquedaChofer('');
      cargarUsuarios();
    } catch (err) {
      showToast(err.message || 'No se pudo crear el usuario', 'error');
    } finally {
      setEnviando(false);
    }
  }

  async function alternarRol(u) {
    const nuevoRol = u.rol === 'ADMIN' ? 'CHOFER' : 'ADMIN';
    setCambiandoId(u.id);
    try {
      const actualizado = await cambiarRolUsuario(u.id, nuevoRol);
      setUsuarios((prev) => prev.map((x) => (x.id === u.id ? actualizado : x)));
      showToast(
        `${actualizado.email} ahora es ${nuevoRol === 'ADMIN' ? 'administrador' : 'chofer'}`,
        'success'
      );
    } catch (err) {
      showToast(err.message || 'No se pudo cambiar el rol', 'error');
    } finally {
      setCambiandoId(null);
    }
  }

  async function confirmarEliminar() {
    if (!aEliminar) return;
    setEliminando(true);
    try {
      if (aEliminar.tipo === 'usuario') {
        await eliminarUsuario(aEliminar.item.id);
        setUsuarios((prev) => prev.filter((u) => u.id !== aEliminar.item.id));
        showToast(`Usuario ${aEliminar.item.email} eliminado`, 'success');
      } else {
        await eliminarChofer(aEliminar.item.id);
        setChoferes((prev) => prev.filter((c) => c.id !== aEliminar.item.id));
        showToast(`Chofer ${aEliminar.item.nombre} eliminado`, 'success');
        // Si tenía una cuenta vinculada, esa cuenta queda sin chofer: refrescamos para mostrarlo.
        cargarUsuarios();
      }
      setAEliminar(null);
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar', 'error');
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="px-5 pt-6 pb-32 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="font-display font-extrabold text-[26px] text-ink">Usuarios</h1>
        <p className="text-muted text-sm mt-1">Creá el acceso para un chofer o un administrador</p>
      </header>

      <form onSubmit={enviar} className="space-y-5">
        <div className="bg-surface rounded-bubble shadow-soft p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="chofer@correo.com"
                className="w-full h-12 pl-11 pr-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
              Contraseña provisoria
            </label>
            <input
              type="text"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
              className="w-full h-12 px-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
              Rol
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, rol: 'CHOFER' }))}
                className={`flex-1 h-11 rounded-pill font-display font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                  form.rol === 'CHOFER' ? 'bg-toma text-white' : 'bg-canvas text-muted border border-line'
                }`}
              >
                <User size={16} /> Chofer
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, rol: 'ADMIN', choferId: null }))}
                className={`flex-1 h-11 rounded-pill font-display font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                  form.rol === 'ADMIN' ? 'bg-ink text-white' : 'bg-canvas text-muted border border-line'
                }`}
              >
                <ShieldCheck size={16} /> Admin
              </button>
            </div>
          </div>

          {necesitaChofer && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
                Vincular con el chofer
              </label>
              <div className="relative mb-2">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={busquedaChofer}
                  onChange={(e) => setBusquedaChofer(e.target.value)}
                  placeholder="Buscar chofer…"
                  className="w-full h-11 pl-11 pr-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-sm placeholder:text-muted/70 transition-colors"
                />
              </div>
              <div className="max-h-48 overflow-auto space-y-1.5">
                {choferesFiltrados.length === 0 && (
                  <div className="text-sm text-muted px-2 py-3">No hay choferes que coincidan.</div>
                )}
                {choferesFiltrados.map((c) => {
                  const seleccionado = form.choferId === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setForm((f) => ({ ...f, choferId: c.id }))}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-pill text-[15px] font-medium transition-colors ${
                        seleccionado ? 'bg-toma-soft text-toma' : 'hover:bg-canvas text-ink'
                      }`}
                    >
                      {c.nombre}
                      {seleccionado && <Check size={16} strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!listo}
          className={`w-full h-14 rounded-pill font-display font-bold text-[16px] flex items-center justify-center gap-2 shadow-floating transition-all ${
            listo ? 'bg-toma text-white active:scale-[0.98]' : 'bg-line text-muted'
          }`}
        >
          {enviando ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creando…
            </>
          ) : (
            <>
              <UserPlus size={19} />
              Crear usuario
            </>
          )}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="flex items-center gap-2 font-display font-bold text-lg text-ink mb-3">
          <Users size={18} /> Cuentas existentes
        </h2>
        {cargandoUsuarios ? (
          <div className="flex justify-center py-10 text-muted">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-10 text-muted text-sm">Todavía no hay usuarios creados.</div>
        ) : (
          <div className="space-y-2.5">
            {usuarios.map((u) => (
              <div key={u.id} className="bg-surface rounded-bubble shadow-soft p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-ink truncate">{u.email}</div>
                    <div className="text-xs text-muted truncate">
                      {u.chofer?.nombre || (u.rol === 'ADMIN' ? 'Administrador' : 'Sin chofer vinculado')}
                      {!u.activo && ' · inactivo'}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={u.id === usuarioActual.id}
                    onClick={() => setAEliminar({ tipo: 'usuario', item: u })}
                    title={u.id === usuarioActual.id ? 'No podés eliminar tu propia cuenta' : 'Eliminar usuario'}
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      u.id === usuarioActual.id
                        ? 'text-muted/40'
                        : 'text-muted hover:text-bad hover:bg-bad-soft'
                    }`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    disabled={u.id === usuarioActual.id || cambiandoId === u.id}
                    onClick={() => alternarRol(u)}
                    title={u.id === usuarioActual.id ? 'No podés cambiar tu propio rol' : 'Cambiar rol'}
                    className={`shrink-0 flex items-center gap-2 ${
                      u.id === usuarioActual.id ? 'opacity-40' : ''
                    }`}
                  >
                    <span
                      className={`flex items-center gap-1 text-xs font-bold ${
                        u.rol === 'ADMIN' ? 'text-ink' : 'text-muted'
                      }`}
                    >
                      {u.rol === 'ADMIN' ? <ShieldCheck size={13} /> : <User size={13} />}
                      Admin
                    </span>
                    {cambiandoId === u.id ? (
                      <Loader2 size={16} className="animate-spin text-muted" />
                    ) : (
                      <span
                        className={`relative w-11 h-6 rounded-pill transition-colors ${
                          u.rol === 'ADMIN' ? 'bg-ink' : 'bg-line'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${
                            u.rol === 'ADMIN' ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="flex items-center gap-2 font-display font-bold text-lg text-ink mb-3">
          <User size={18} /> Choferes registrados
        </h2>
        {choferes.length === 0 ? (
          <div className="text-center py-10 text-muted text-sm">Todavía no hay choferes cargados.</div>
        ) : (
          <div className="space-y-2.5">
            {choferes.map((c) => (
              <div key={c.id} className="bg-surface rounded-bubble shadow-soft p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate">{c.nombre}</div>
                  <div className="text-xs text-muted truncate">
                    {choferIdsConCuenta.has(c.id) ? 'Tiene cuenta de usuario' : 'Sin cuenta de usuario'}
                    {!c.activo && ' · inactivo'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAEliminar({ tipo: 'chofer', item: c })}
                  title="Eliminar chofer"
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-bad hover:bg-bad-soft transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomSheet
        open={!!aEliminar}
        onClose={() => setAEliminar(null)}
        title={aEliminar?.tipo === 'chofer' ? 'Eliminar chofer' : 'Eliminar usuario'}
      >
        {aEliminar && (
          <div className="space-y-4">
            <p className="text-sm text-ink/80">
              {aEliminar.tipo === 'chofer' ? (
                <>
                  ¿Eliminar a <span className="font-semibold">{aEliminar.item.nombre}</span> de la lista de
                  choferes? Si tiene registros cargados, no se va a poder eliminar.
                </>
              ) : (
                <>
                  ¿Eliminar la cuenta <span className="font-semibold">{aEliminar.item.email}</span>? Va a
                  perder el acceso a la app.
                </>
              )}
            </p>
            <button
              onClick={confirmarEliminar}
              disabled={eliminando}
              className="w-full h-12 rounded-pill bg-bad-soft text-bad font-semibold flex items-center justify-center gap-2"
            >
              {eliminando ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Eliminar
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
