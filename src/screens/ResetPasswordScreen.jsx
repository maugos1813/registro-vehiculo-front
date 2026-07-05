import { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, LogIn } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { restablecerPassword } from '../api/auth';
import hero from '../assets/hero.png';

export default function ResetPasswordScreen({ token }) {
  const { showToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const listo = password.length >= 6 && password === confirmar && !enviando;

  async function enviar(e) {
    e.preventDefault();
    if (!listo) return;
    setEnviando(true);
    try {
      await restablecerPassword(token, password);
      setExito(true);
    } catch (err) {
      showToast(err.message || 'No se pudo restablecer la contraseña', 'error');
    } finally {
      setEnviando(false);
    }
  }

  function irAlLogin() {
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10 max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <img src={hero} alt="" className="w-32 h-32 object-contain animate-float-y" />
      </div>

      <header className="mb-8 text-center">
        <h1 className="font-display font-extrabold text-[28px] leading-tight text-ink">
          Nueva contraseña
        </h1>
        <p className="text-muted text-sm mt-1">Elegí una nueva contraseña para tu cuenta</p>
      </header>

      {exito ? (
        <div className="bg-surface rounded-bubble shadow-soft p-5 text-center space-y-4">
          <CheckCircle2 className="mx-auto text-toma" size={40} />
          <p className="text-ink text-[15px]">¡Contraseña actualizada! Ya podés iniciar sesión.</p>
          <button
            type="button"
            onClick={irAlLogin}
            className="w-full h-14 rounded-pill font-display font-bold text-[16px] flex items-center justify-center gap-2 shadow-floating bg-toma text-white active:scale-[0.98]"
          >
            <LogIn size={19} />
            Ir a iniciar sesión
          </button>
        </div>
      ) : (
        <form onSubmit={enviar} className="space-y-4">
          <div className="bg-surface rounded-bubble shadow-soft p-5 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={verPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full h-12 pl-11 pr-11 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setVerPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                  aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={verPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  placeholder="Repetí la contraseña"
                  className="w-full h-12 pl-11 pr-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
                />
              </div>
              {confirmar && password !== confirmar && (
                <p className="text-[11px] text-bad mt-1 ml-1">Las contraseñas no coinciden</p>
              )}
            </div>
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
                Guardando…
              </>
            ) : (
              'Guardar nueva contraseña'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
