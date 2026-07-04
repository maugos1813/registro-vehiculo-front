import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

/**
 * Selector segmentado tipo "burbuja deslizante" — el elemento firma de la app.
 * Una sola cápsula donde una burbuja de color se desliza entre dos mitades.
 */
export default function SegmentedToggle({ value, onChange }) {
  const isToma = value === 'TOMA';

  return (
    <div className="relative w-full h-16 rounded-pill bg-canvas border border-line p-1.5 flex select-none">
      {/* Burbuja deslizante */}
      <div
        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-pill shadow-soft transition-all duration-300 ease-out ${
          isToma ? 'left-1.5 bg-toma' : 'left-[calc(50%+1px)] bg-deja'
        }`}
      />
      <button
        type="button"
        onClick={() => onChange('TOMA')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-pill font-display font-semibold text-[15px] transition-colors duration-300 ${
          isToma ? 'text-white' : 'text-muted'
        }`}
      >
        <ArrowDownToLine size={18} strokeWidth={2.5} />
        Tomar
      </button>
      <button
        type="button"
        onClick={() => onChange('DEJA')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-pill font-display font-semibold text-[15px] transition-colors duration-300 ${
          !isToma ? 'text-white' : 'text-muted'
        }`}
      >
        <ArrowUpFromLine size={18} strokeWidth={2.5} />
        Dejar
      </button>
    </div>
  );
}
