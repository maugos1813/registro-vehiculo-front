import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Plus, Search } from 'lucide-react';

/**
 * Input tipo "chip buscable": muestra sugerencias en burbujas.
 * Si el texto no coincide con ninguna opción, permite crear una nueva
 * (igual que hace el backend automáticamente al registrar).
 */
export default function ComboBox({ label, icon: Icon, value, onChange, options, placeholder, createLabel }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const wrapRef = useRef(null);

  useEffect(() => setQuery(value || ''), [value]);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 6);
    return options.filter((o) => o.toLowerCase().includes(q)).slice(0, 6);
  }, [query, options]);

  const existeExacto = options.some((o) => o.toLowerCase() === query.trim().toLowerCase());

  function elegir(v) {
    setQuery(v);
    onChange(v);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />}
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          className={`w-full h-12 rounded-pill bg-canvas border border-line focus:border-toma focus:outline-none text-[15px] font-medium placeholder:text-muted/70 transition-colors ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-10`}
        />
        <ChevronDown
          size={16}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-bubble bg-surface shadow-floating border border-line p-2 max-h-64 overflow-auto animate-pop">
          {filtradas.length === 0 && !query && (
            <div className="px-3 py-2 text-sm text-muted flex items-center gap-2">
              <Search size={14} /> Escribe para buscar…
            </div>
          )}
          {filtradas.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => elegir(opt)}
              className="w-full text-left px-4 py-2.5 rounded-pill hover:bg-toma-soft text-[15px] font-medium transition-colors"
            >
              {opt}
            </button>
          ))}
          {query.trim() && !existeExacto && (
            <button
              type="button"
              onClick={() => elegir(query.trim())}
              className="w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-pill hover:bg-good-soft text-good font-semibold text-[15px] transition-colors"
            >
              <Plus size={16} strokeWidth={2.5} />
              {createLabel || 'Crear'} "{query.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
