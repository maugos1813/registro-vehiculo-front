import { ClipboardList, PlusCircle, Truck } from 'lucide-react';

const TABS = [
  { id: 'registrar', label: 'Registrar', icon: PlusCircle },
  { id: 'historial', label: 'Historial', icon: ClipboardList },
  { id: 'vehiculos', label: 'Flota', icon: Truck },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-5 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 bg-ink/90 backdrop-blur-xl rounded-pill p-1.5 shadow-floating">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 h-12 rounded-pill font-display font-semibold text-sm transition-all duration-300 ${
                isActive ? 'bg-white text-ink pr-5' : 'text-white/70'
              }`}
            >
              <Icon size={19} strokeWidth={2.3} />
              {isActive && <span className="whitespace-nowrap">{tab.label}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
