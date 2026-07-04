import { X } from 'lucide-react';

export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface rounded-t-[2rem] shadow-floating p-6 pb-8 max-h-[85vh] overflow-auto animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
        <div className="w-10 h-1.5 bg-line rounded-pill mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-canvas flex items-center justify-center text-muted hover:text-ink transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
