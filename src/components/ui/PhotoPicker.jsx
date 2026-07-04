import { useRef } from 'react';
import { Camera, X } from 'lucide-react';

export default function PhotoPicker({ fotos, onChange, max = 6 }) {
  const inputRef = useRef(null);

  function agregarArchivos(fileList) {
    const nuevos = Array.from(fileList).slice(0, max - fotos.length);
    onChange([...fotos, ...nuevos]);
  }

  function quitar(index) {
    const copia = [...fotos];
    copia.splice(index, 1);
    onChange(copia);
  }

  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 ml-1">
        Fotos de evidencia
      </label>
      <div className="flex flex-wrap gap-3">
        {fotos.map((file, i) => (
          <div key={i} className="relative w-20 h-20 rounded-bubble overflow-hidden shadow-soft animate-pop">
            <img
              src={URL.createObjectURL(file)}
              alt={`evidencia-${i}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => quitar(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white"
              aria-label="Quitar foto"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        ))}

        {fotos.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-bubble border-2 border-dashed border-line flex flex-col items-center justify-center gap-1 text-muted hover:border-toma hover:text-toma transition-colors"
          >
            <Camera size={20} />
            <span className="text-[10px] font-semibold">Agregar</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) agregarArchivos(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
