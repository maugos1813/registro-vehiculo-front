import { useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import BottomNav, { TABS } from './components/ui/BottomNav';
import RegistrarScreen from './screens/RegistrarScreen';
import HistorialScreen from './screens/HistorialScreen';
import VehiculosScreen from './screens/VehiculosScreen';
import UsuariosScreen from './screens/UsuariosScreen';
import LoginScreen from './screens/LoginScreen';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppShell() {
  const { usuario, cargando, cerrarSesion } = useAuth();
  const [tab, setTab] = useState('registrar');

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  if (!usuario) {
    return <LoginScreen />;
  }

  const esAdmin = usuario.rol === 'ADMIN';
  const tabs = TABS.filter((t) => !t.soloAdmin || esAdmin);
  const tabActiva = tabs.some((t) => t.id === tab) ? tab : 'registrar';

  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex items-center justify-end gap-2 px-5 pt-4 max-w-md mx-auto">
        <span className="text-xs text-muted truncate max-w-[65%]">{usuario.email}</span>
        <button
          onClick={cerrarSesion}
          className="w-8 h-8 rounded-full bg-surface shadow-soft flex items-center justify-center text-muted hover:text-bad transition-colors shrink-0"
          aria-label="Cerrar sesión"
        >
          <LogOut size={15} />
        </button>
      </div>

      {tabActiva === 'registrar' && <RegistrarScreen />}
      {tabActiva === 'historial' && <HistorialScreen />}
      {tabActiva === 'vehiculos' && <VehiculosScreen />}
      {tabActiva === 'usuarios' && esAdmin && <UsuariosScreen />}
      <BottomNav active={tabActiva} onChange={setTab} tabs={tabs} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ToastProvider>
  );
}
