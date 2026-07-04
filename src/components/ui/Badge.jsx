import { ArrowDownToLine, ArrowUpFromLine, Circle } from 'lucide-react';

export function TipoBadge({ tipo }) {
  const isToma = tipo === 'TOMA';
  const Icon = isToma ? ArrowDownToLine : ArrowUpFromLine;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold ${
        isToma ? 'bg-toma-soft text-toma' : 'bg-deja-soft text-deja'
      }`}
    >
      <Icon size={13} strokeWidth={3} />
      {isToma ? 'Tomó' : 'Dejó'}
    </span>
  );
}

export function EstadoBadge({ tomado }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold ${
        tomado ? 'bg-deja-soft text-deja' : 'bg-good-soft text-good'
      }`}
    >
      <Circle size={8} fill="currentColor" strokeWidth={0} />
      {tomado ? 'En uso' : 'Libre'}
    </span>
  );
}
