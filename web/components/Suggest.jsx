'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { suggest, catIcon } from '../lib/data';
import { useApp, Icon } from './Shell';

/** Recomendaciones al escribir 3+ letras en el buscador. */
export default function Suggest({ onPick, inline }) {
  const { q, setQ, f, setF, tr, fmt } = useApp();
  const router = useRouter();
  const items = useMemo(() => suggest(q, tr), [q, tr]);
  if (!items.length) return null;

  const icon = (it) => (it.type === 'cat' ? catIcon[it.value] : it.type === 'salon' ? 'comercio' : it.type === 'zone' ? 'mapa' : 'buscar');
  const kind = (it) => ({ cat: tr.sCat, service: tr.sService, salon: tr.sSalon, zone: tr.sZone })[it.type];
  const noun = (n) => `${n} ${n === 1 ? tr.sPlace : tr.sPlaces}`;
  const sub = (it) => (it.type === 'service' ? `${noun(it.n)} · ${tr.sFrom} ${fmt(it.usd)}` : it.type === 'cat' ? noun(it.n) : it.sub || '');

  const pick = (it) => {
    if (it.type === 'cat') { setF({ ...f, cat: it.value }); setQ(''); }
    else if (it.type === 'salon') { setQ(''); router.push(`/salon/${it.value}/`); }
    else setQ(it.label);
    onPick?.();
  };

  return (
    <ul className={`sugg ${inline ? 'sugg--inline' : ''}`} role="listbox" aria-label={tr.search}>
      {items.map((it) => (
        <li key={`${it.type}-${it.value}`} role="option" aria-selected="false">
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(it)}>
            <span className="sugg__ic"><Icon n={icon(it)} size={20} /></span>
            <span className="sugg__tx"><b>{it.label}</b><small>{kind(it)}{sub(it) ? ` · ${sub(it)}` : ''}</small></span>
          </button>
        </li>
      ))}
    </ul>
  );
}
