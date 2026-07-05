import { useState } from 'react';
import { Loader2, Lock, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import hero from '../assets/hero.png';

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);

  const listo = email.trim() && password && !enviando;

  async function enviar(e) {
    e.preventDefault();
    if (!listo) return;
    setEnviando(true);
    try {
      await iniciarSesion(email.trim(), password);
    } catch (err) {
      showToast(err.message || 'No se pudo iniciar sesión', 'error');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10 max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <img src={hero} alt="" className="w-32 h-32 object-contain animate-float-y" />
      </div>

      <header className="mb-8 text-center">
        <h1 className="font-display font-extrabold text-[28px] leading-tight text-ink">
          Registro de vehículos
        </h1>
        <p className="text-muted text-sm mt-1">Iniciá sesión para continuar</p>
      </header>

      <form onSubmit={enviar} className="space-y-4">
        <div className="bg-surface rounded-bubble shadow-soft p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full h-12 pl-11 pr-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-11 pr-4 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] placeholder:text-muted/70 transition-colors"
              />
            </div>
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
              Ingresando…
            </>
          ) : (
            <>
              <LogIn size={19} />
              Ingresar
            </>
          )}
        </button>
      </form>
    </div>
  );
}
