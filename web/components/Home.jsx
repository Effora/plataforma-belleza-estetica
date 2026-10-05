'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { reels, salons, demoComments, cats, F0 } from '../lib/data';
import { useApp, Icon } from './Shell';
import Carousel from './Carousel';
import MapView from './Map';

function ReelMedia({ imgs, name }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (imgs.length < 2) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % imgs.length), 3200);
    return () => clearInterval(id);
  }, [imgs.length]);
  return (
    <div className="reel-media">
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
    </div>
  );
}

/** Tarjeta chica tipo Airbnb para las filas del inicio (una foto, sin carrusel para no pelear con el scroll horizontal). */
function MiniCard({ s }) {
  const { tr, fmt, favs, toggleFav } = useApp();
  return (
    <article className="mcard">
      <Link href={`/salon/${s.id}/`}>
        <div className="mph">
          <img src={`/media/${s.imgs[0]}`} alt={s.name} loading="lazy" />
          {s.promo && <span className="tag">{s.promo}</span>}
        </div>
        <div className="mrow"><b className="mn">{s.name}</b><span>★ {s.rating}</span></div>
        <p className="mut">{s.zone} · {s.dist ?? s.km} km</p>
        <p>{tr.from} <b>{fmt(s.price)}</b></p>
      </Link>
      <button type="button" className="heart" aria-pressed={!!favs[s.id]} aria-label={tr.favs} onClick={() => toggleFav(s.id)}>
        <Icon n="favoritos" fill={!!favs[s.id]} size={18} />
      </button>
    </article>
  );
}

/** Fila con título, flecha para ver todos y scroll horizontal (flechas en escritorio). */
function Row({ title, items, onAll }) {
  const r = useRef(null);
  const go = (d) => r.current?.scrollBy({ left: d * r.current.clientWidth * 0.9, behavior: 'smooth' });
  // Al reordenarse (p. ej. por distancia) el scroll-snap salta a la tarjeta que estaba enganchada; volvemos al inicio.
  const ids = items.map((x) => x.id).join();
  useEffect(() => { if (r.current) r.current.scrollLeft = 0; }, [ids]);
  return (
    <section className="hrow">
      <div className="hrow__h">
        <button type="button" className="hrow__t" onClick={onAll}>
          <h2>{title}</h2><span className="hrow__go"><Icon n="atras" size={16} /></span>
        </button>
        <div className="hrow__nav">
          <button type="button" aria-label="‹" onClick={() => go(-1)}><Icon n="atras" size={16} /></button>
          <button type="button" aria-label="›" onClick={() => go(1)}><Icon n="atras" size={16} /></button>
        </div>
      </div>
      <div className="hrow__trk" ref={r}>
        {items.map((s) => <MiniCard key={s.id} s={s} />)}
      </div>
    </section>
  );
}

export default function Home() {
  const {
    ver, lang, tr, fmt, openBooking, filtered, here, favs, toggleFav, requestGeo, geoStatus,
    feedMode, follows, toggleFollow, needLogin, f, setF, q,
  } = useApp();
  const [map, setMap] = useState(false);
  const [pick, setPick] = useState(null);
  const [chat, setChat] = useState(null);
  const [draft, setDraft] = useState('');
  const [extra, setExtra] = useState({});
  const [toast, setToast] = useState('');

  const list = useMemo(() => {
    const ids = new Set(filtered.map((x) => x.id));
    return reels.filter((r) => ids.has(r.id) && (feedMode !== 'following' || follows[r.id]));
  }, [feedMode, filtered, follows]);

  const shareReel = async (r) => {
    const url = `${window.location.origin}/salon/${r.id}/`;
    const text = `${r.name} — ${tr.shareText}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: r.name, text, url });
        return;
      }
    } catch { /* cancel */ }
    try {
      await navigator.clipboard.writeText(url);
      setToast(tr.shared);
      setTimeout(() => setToast(''), 2000);
    } catch {
      setToast(url);
      setTimeout(() => setToast(''), 2500);
    }
  };

  const sendComment = (key) => {
    const text = draft.trim();
    if (!text || needLogin()) return;
    setExtra((x) => ({ ...x, [key]: [...(x[key] || []), { u: 'vos', t: text }] }));
    setDraft('');
  };

  // Inicio sin filtros ni búsqueda: filas por sección como Airbnb; con filtros, grilla compacta.
  const plain = !q && !f.cat && !f.promo && !f.now && !f.rate && f.max === F0.max;
  const rows = useMemo(() => {
    if (!plain) return [];
    const pick = (k) => () => { setF({ ...F0, ...k }); window.scrollTo({ top: 0 }); };
    return [
      { k: 'pop', title: tr.secPop, items: [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 12), onAll: pick({ rate: true }) },
      { k: 'promo', title: tr.secPromo, items: filtered.filter((x) => x.promo), onAll: pick({ promo: true }) },
      ...cats.map((c) => ({ k: c, title: `${tr[c]} ${tr.nearS}`, items: filtered.filter((x) => x.cat === c), onAll: pick({ cat: c }) })),
      { k: 'now', title: tr.secNow, items: filtered.filter((x) => x.now), onAll: pick({ now: true }) },
    ].filter((x) => x.items.length);
  }, [plain, filtered, tr, setF]);

  if (ver === 'b') {
    return (
      <>
        <div className="feed" role="feed" aria-label={feedMode === 'following' ? tr.following : tr.forYou}>
          {!list.length && (
            <div className="feed-empty">
              <p>{tr.emptyFollowing}</p>
            </div>
          )}
          {list.map((r, idx) => {
            const salon = salons.find((s) => s.id === r.id) || salons[0];
            const key = `${r.handle}-${idx}`;
            const isLiked = !!favs[r.id];
            const isFollow = !!follows[r.id];
            const comments = [...(demoComments[lang] || demoComments.es), ...(extra[key] || [])];
            return (
              <section key={key} className="reel" onDoubleClick={() => { if (!isLiked) toggleFav(r.id); }}>
                <ReelMedia imgs={r.imgs} name={r.name} />
                <div className="shade" />
                <div className="rail">
                  <button type="button" aria-pressed={isLiked} onClick={() => toggleFav(r.id)} aria-label={tr.favs}>
                    <Icon n="favoritos" fill={isLiked} size={30} />
                    <small>{r.likes + (isLiked ? 1 : 0)}</small>
                  </button>
                  <button type="button" aria-label={tr.comments} onClick={() => { if (needLogin()) return; setChat(key); setDraft(''); }}>
                    <Icon n="mensaje" size={30} />
                    <small>{r.chats + (extra[key]?.length || 0)}</small>
                  </button>
                  <button type="button" aria-label={tr.share} onClick={() => shareReel(r)}>
                    <Icon n="compartir" size={30} />
                    <small>{tr.share}</small>
                  </button>
                </div>
                <div className="info">
                  <div className="who">
                    <Link href={`/salon/${r.id}/`}><b>@{r.handle}</b></Link>
                    <button type="button" className="follow" aria-pressed={isFollow} onClick={() => toggleFollow(r.id)}>
                      {isFollow ? tr.unfollow : tr.follow}
                    </button>
                  </div>
                  <h2>{r.name}</h2>
                  <p className="cap">{r.caption[lang] || r.caption.es}</p>
                  <p>★ {r.rating} · {r.zone} · {r.km} km{r.promo ? <em> {r.promo}</em> : null}</p>
                  <button type="button" className="cta" onClick={() => openBooking(salon)}>
                    {tr.book} · {fmt(r.price)}
                  </button>
                </div>
                {chat === key && (
                  <div className="chat-sheet" role="dialog" aria-label={tr.comments}>
                    <div className="chat-sheet__head">
                      <b>{tr.comments}</b>
                      <button type="button" onClick={() => setChat(null)} aria-label={tr.close}><Icon n="cerrar" /></button>
                    </div>
                    <ul className="chat-sheet__list">
                      {comments.map((c, i) => (
                        <li key={`${c.u}-${i}`}><b>@{c.u}</b> {c.t}</li>
                      ))}
                    </ul>
                    <form className="chat-sheet__form" onSubmit={(e) => { e.preventDefault(); sendComment(key); }}>
                      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={tr.commentPh} />
                      <button type="submit" className="cta">{tr.send}</button>
                    </form>
                  </div>
                )}
              </section>
            );
          })}
        </div>
        {toast && <div className="toast" role="status">{toast}</div>}
      </>
    );
  }

  return (
    <div className={`split ${map ? 'showmap' : ''}`}>
      <div className="list">
        <div className="geo-bar">
          <button type="button" className="ghost geo" onClick={requestGeo}>
            <Icon n="mapa" size={16} />
            {geoStatus === 'ok' ? tr.nearYou : tr.useLocation}
          </button>
        </div>
        {!map && rows.length > 0 ? rows.map((x) => <Row key={x.k} title={x.title} items={x.items} onAll={x.onAll} />) : (
        <div className="grid">
          {filtered.map((s) => (
            <article key={s.id} className={`card ${pick === s.id ? 'hl' : ''}`}>
              <div className="ph">
                <Carousel imgs={s.imgs} alt={s.name} />
                {s.promo && <span className="tag">{s.promo}</span>}
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
              <Link href={`/salon/${s.id}/`}>
                <div className="row"><b>{s.name}</b><span>★ {s.rating}</span></div>
                <p className="mut">{s.zone} · {s.dist ?? s.km} km</p>
                <p>{tr.from} <b>{fmt(s.price)}</b></p>
              </Link>
            </article>
          ))}
        </div>
        )}
      </div>
      <div className="mapcol">
        <MapView items={filtered} here={here} label={(s) => fmt(s.price)} onPick={setPick} active />
      </div>
      <button type="button" className="fab" onClick={() => setMap((v) => !v)}>
        <Icon n="mapa" size={18} />{map ? tr.showList : tr.showMap}
      </button>
    </div>
  );
}
