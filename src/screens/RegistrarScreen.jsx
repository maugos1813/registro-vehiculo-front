import { useEffect, useState } from 'react';
import { Car, Loader2, User } from 'lucide-react';
import SegmentedToggle from '../components/ui/SegmentedToggle';
import ComboBox from '../components/ui/ComboBox';
import PhotoPicker from '../components/ui/PhotoPicker';
import useClock from '../hooks/useClock';
import { useToast } from '../context/ToastContext';
import { listarChoferes } from '../api/choferes';
import { listarVehiculos } from '../api/vehiculos';
import { crearRegistro } from '../api/registros';

const VACIO = { choferNombre: '', targaVehiculo: '', comentarios: '', fotos: [] };

export default function RegistrarScreen() {
  const { showToast } = useToast();
  const now = useClock();

  const [tipo, setTipo] = useState('TOMA');
  const [form, setForm] = useState(VACIO);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    listarChoferes().then((data) => setChoferes(data.map((c) => c.nombre))).catch(() => {});
    listarVehiculos().then((data) => setVehiculos(data.map((v) => v.targa))).catch(() => {});
  }, []);

  const listo = form.choferNombre.trim() && form.targaVehiculo.trim() && !enviando;

  async function enviar(e) {
    e.preventDefault();
    if (!listo) return;
    setEnviando(true);
    setProgreso(0);
    try {
      await crearRegistro(
        {
          tipo,
          choferNombre: form.choferNombre.trim(),
          targaVehiculo: form.targaVehiculo.trim().toUpperCase(),
          comentarios: form.comentarios.trim(),
          fotos: form.fotos,
        },
        { onProgress: setProgreso }
      );
      showToast(tipo === 'TOMA' ? '¡Vehículo tomado! Registro guardado' : '¡Vehículo entregado! Registro guardado', 'success');
      // Mantiene chofer y vehículo (turnos seguidos) pero limpia comentarios y fotos
      setForm((f) => ({ ...f, comentarios: '', fotos: [] }));
      if (!choferes.includes(form.choferNombre.trim())) setChoferes((c) => [...c, form.choferNombre.trim()]);
      if (!vehiculos.includes(form.targaVehiculo.trim().toUpperCase())) {
        setVehiculos((v) => [...v, form.targaVehiculo.trim().toUpperCase()]);
      }
    } catch (err) {
      showToast(err.message || 'No se pudo guardar el registro', 'error');
    } finally {
      setEnviando(false);
      setProgreso(0);
    }
  }

  return (
    <div className="px-5 pt-6 pb-32 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="font-display font-extrabold text-[26px] leading-tight text-ink">
          Registrar movimiento
        </h1>
        <p className="text-muted text-sm mt-1">
          Se guardará con fecha y hora exacta:{' '}
          <span className="font-semibold text-ink">
            {now.toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </p>
      </header>

      <form onSubmit={enviar} className="space-y-5">
        <SegmentedToggle value={tipo} onChange={setTipo} />

        <div className="bg-surface rounded-bubble shadow-soft p-5 space-y-4">
          <ComboBox
            label="Chofer"
            icon={User}
            placeholder="Nombre del chofer"
            value={form.choferNombre}
            onChange={(v) => setForm((f) => ({ ...f, choferNombre: v }))}
            options={choferes}
            createLabel="Nuevo chofer"
          />
          <ComboBox
            label="Vehículo (targa)"
            icon={Car}
            placeholder="Ej. AB123CD"
            value={form.targaVehiculo}
            onChange={(v) => setForm((f) => ({ ...f, targaVehiculo: v }))}
            options={vehiculos}
            createLabel="Nuevo vehículo"
          />
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
              Comentarios (opcional)
            </label>
            <textarea
              value={form.comentarios}
              onChange={(e) => setForm((f) => ({ ...f, comentarios: e.target.value }))}
              placeholder="Ej. sin daños visibles, tanque lleno…"
              rows={3}
              className="w-full rounded-bubble bg-canvas border border-line focus:border-toma focus:outline-none px-4 py-3 text-[15px] placeholder:text-muted/70 resize-none transition-colors"
            />
          </div>
        </div>

        <div className="bg-surface rounded-bubble shadow-soft p-5">
          <PhotoPicker fotos={form.fotos} onChange={(fotos) => setForm((f) => ({ ...f, fotos }))} />
        </div>

        <button
          type="submit"
          disabled={!listo}
          className={`w-full h-14 rounded-pill font-display font-bold text-[16px] flex items-center justify-center gap-2 shadow-floating transition-all ${
            listo ? (tipo === 'TOMA' ? 'bg-toma text-white active:scale-[0.98]' : 'bg-deja text-white active:scale-[0.98]') : 'bg-line text-muted'
          }`}
        >
          {enviando ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Subiendo{progreso > 0 ? ` ${progreso}%` : '…'}
            </>
          ) : (
            <>Confirmar {tipo === 'TOMA' ? 'toma' : 'entrega'}</>
          )}
        </button>
      </form>
    </div>
  );
}
