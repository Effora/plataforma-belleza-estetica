'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { reels, salons } from '../lib/data';
import { useApp, Icon, applyF } from './Shell';
import Carousel from './Carousel';
import MapView from './Map';

function ReelMedia({ imgs, name }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (imgs.length < 2) {
      return undefined;
    }
    const id = setInterval(() => setI((n) => (n + 1) % imgs.length), 3200);
    return () => clearInterval(id);
  }, [imgs.length]);
  return (
    <>
      {imgs.map((src, idx) => (
        <img
          key={src}
          className={`bg ${idx === i ? 'is-on' : ''}`}
          src={`/media/${src}`}
          alt={name}
          loading={idx === 0 ? 'eager' : 'lazy'}
        />
      ))}
      <div className="reel-dots" aria-hidden="true">
        {imgs.map((src, idx) => <i key={src} className={idx === i ? 'on' : ''} />)}
      </div>
    </>
  );
}

export default function Home() {
  const { ver, lang, tr, fmt, f, openBooking } = useApp();
  const [map, setMap] = useState(false);
  const [liked, setLiked] = useState({});
  const [pick, setPick] = useState(null);
  const list = applyF(f);
  const lk = (id) => setLiked((x) => ({ ...x, [id]: !x[id] }));

  if (ver === 'b') {
    return (
      <div className="feed" role="feed" aria-label={tr.forYou}>
        {reels.map((r, idx) => {
          const salon = salons.find((s) => s.id === r.id) || salons[0];
          const key = `${r.handle}-${idx}`;
          const isLiked = !!liked[key];
          return (
            <section key={key} className="reel" onDoubleClick={() => lk(key)}>
              <ReelMedia imgs={r.imgs} name={r.name} />
              <div className="shade" />
              <div className="rail">
                <button type="button" aria-pressed={isLiked} onClick={() => lk(key)} aria-label="like">
                  <Icon n="favoritos" fill={isLiked} size={30} />
                  <small>{isLiked ? r.likes + 1 : r.likes}</small>
                </button>
                <button type="button" aria-label="chat">
                  <Icon n="mensaje" size={30} />
                  <small>{r.chats}</small>
                </button>
                <button type="button" aria-label="share">
                  <Icon n="compartir" size={30} />
                </button>
              </div>
              <div className="info">
                <Link href={`/salon/${r.id}/`}><b>@{r.handle}</b></Link>
                <h2>{r.name}</h2>
                <p className="cap">{r.caption[lang] || r.caption.es}</p>
                <p>★ {r.rating} · {r.zone} · {r.km} km{r.promo ? <em> {r.promo}</em> : null}</p>
                <button type="button" className="cta" onClick={() => openBooking(salon)}>
                  {tr.book} · {fmt(r.price)}
                </button>
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`split ${map ? 'showmap' : ''}`}>
      <div className="list">
        <div className="grid">
          {list.map((s) => (
            <article key={s.id} className={`card ${pick === s.id ? 'hl' : ''}`}>
              <div className="ph">
                <Carousel imgs={s.imgs} alt={s.name} />
                {s.promo && <span className="tag">{s.promo}</span>}
                <button type="button" className="heart" aria-pressed={!!liked[s.id]} aria-label={tr.favs} onClick={() => lk(s.id)}>
                  <Icon n="favoritos" fill={!!liked[s.id]} size={20} />
                </button>
              </div>
              <Link href={`/salon/${s.id}/`}>
                <div className="row"><b>{s.name}</b><span>★ {s.rating}</span></div>
                <p className="mut">{s.zone} · {s.km} km</p>
                <p>{tr.from} <b>{fmt(s.price)}</b></p>
              </Link>
            </article>
          ))}
        </div>
      </div>
      <div className="mapcol"><MapView items={list} label={(s) => fmt(s.price)} onPick={setPick} /></div>
      <button type="button" className="fab" onClick={() => setMap(!map)}>
        <Icon n="mapa" size={18} />{map ? tr.showList : tr.showMap}
      </button>
    </div>
  );
}
