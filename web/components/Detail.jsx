'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { salons } from '../lib/data';
import { useApp, Icon } from './Shell';
import Carousel from './Carousel';
import MapView from './Map';

export default function Detail({ s }) {
  const { tr, fmt, openBooking, ver, favs, toggleFav, follows, toggleFollow, setTab, here } = useApp();
  const router = useRouter();
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
        <div className="namerow">
          <h1>{s.name}</h1>
          <button type="button" className="follow follow--d" aria-pressed={!!follows[s.id]} onClick={() => toggleFollow(s.id)}>
            {follows[s.id] ? tr.unfollow : tr.follow}
          </button>
        </div>
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
      <aside className="dside">
        <div className="book">
          <p>{tr.from} <b>{fmt(s.price)}</b></p>
          <p className="pts"><Icon n="puntos" size={18} />{tr.points}</p>
          <button type="button" className="cta" onClick={() => openBooking(s)}>{tr.book}</button>
        </div>
        {/* Mapa con todas las ubicaciones; el comercio abierto queda resaltado */}
        <h2 className="dmap-t">{tr.map}</h2>
        <div className="dmap">
          <MapView items={salons} here={here} focus={s.id} label={(x) => fmt(x.price)} onPick={(id) => { if (id !== s.id) router.push(`/salon/${id}/`); }} />
        </div>
      </aside>
    </div>
  );
}
