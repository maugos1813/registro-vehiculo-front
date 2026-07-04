import { useState } from 'react';
import BottomNav from './components/ui/BottomNav';
import RegistrarScreen from './screens/RegistrarScreen';
import HistorialScreen from './screens/HistorialScreen';
import VehiculosScreen from './screens/VehiculosScreen';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  const [tab, setTab] = useState('registrar');

  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas">
        {tab === 'registrar' && <RegistrarScreen />}
        {tab === 'historial' && <HistorialScreen />}
        {tab === 'vehiculos' && <VehiculosScreen />}
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </ToastProvider>
  );
}
