'use client';
import Link from 'next/link';
import { useApp, Icon } from './Shell';
import Carousel from './Carousel';

export default function Detail({ s }) {
  const { tr, fmt, openBooking, ver, favs, toggleFav, setTab } = useApp();
  if (!s) return null;
  return (
    <div className={`detail ${ver === 'b' ? 'detail--b' : ''}`}>
      <div>
        {ver !== 'b' && (
          <Link href="/" className="back" onClick={() => setTab('inicio')}>
            <Icon n="atras" size={20} />{tr.back}
          </Link>
        )}
        <div className="gal">
          <Carousel imgs={s.imgs} alt={s.name} />
          <button
            type="button"
            className="heart"
            aria-pressed={!!favs[s.id]}
            aria-label={tr.favs}
            onClick={() => toggleFav(s.id)}
          >
            <Icon n="favoritos" fill={!!favs[s.id]} size={20} />
          </button>
        </div>
        <h1>{s.name}</h1>
        <p className="mut">★ {s.rating} ({s.reviews} {tr.reviews}) · {s.zone} · {s.dist ?? s.km} km</p>
        <h2>{tr.services}</h2>
        <ul className="svc">
          {s.services.map(([n, m, p]) => (
            <li key={n}>
              <span>{n}<small>{m} min</small></span>
              <b>{fmt(p)}</b>
            </li>
          ))}
        </ul>
      </div>
      <aside className="book">
        <p>{tr.from} <b>{fmt(s.price)}</b></p>
        <p className="pts"><Icon n="puntos" size={18} />{tr.points}</p>
        <button type="button" className="cta" onClick={() => openBooking(s)}>{tr.book}</button>
      </aside>
    </div>
  );
}
