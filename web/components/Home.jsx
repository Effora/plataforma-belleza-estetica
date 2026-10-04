'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { reels, salons, demoComments } from '../lib/data';
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

export default function Home() {
  const {
    ver, lang, tr, fmt, openBooking, filtered, here, favs, toggleFav, requestGeo, geoStatus,
    feedMode,
  } = useApp();
  const [map, setMap] = useState(false);
  const [liked, setLiked] = useState({});
  const [pick, setPick] = useState(null);
  const [chat, setChat] = useState(null);
  const [draft, setDraft] = useState('');
  const [extra, setExtra] = useState({});
  const [toast, setToast] = useState('');

  const list = useMemo(
    () => (feedMode === 'following' ? reels.filter((r) => r.following) : reels),
    [feedMode],
  );

  const lk = (id) => setLiked((x) => ({ ...x, [id]: !x[id] }));

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
    if (!text) return;
    setExtra((x) => ({ ...x, [key]: [...(x[key] || []), { u: 'vos', t: text }] }));
    setDraft('');
  };

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
            const isLiked = !!liked[key];
            const comments = [...(demoComments[lang] || demoComments.es), ...(extra[key] || [])];
            return (
              <section key={key} className="reel" onDoubleClick={() => lk(key)}>
                <ReelMedia imgs={r.imgs} name={r.name} />
                <div className="shade" />
                <div className="rail">
                  <button type="button" aria-pressed={isLiked} onClick={() => lk(key)} aria-label="like">
                    <Icon n="favoritos" fill={isLiked} size={30} />
                    <small>{isLiked ? r.likes + 1 : r.likes}</small>
                  </button>
                  <button type="button" aria-label={tr.comments} onClick={() => { setChat(key); setDraft(''); }}>
                    <Icon n="mensaje" size={30} />
                    <small>{r.chats + (extra[key]?.length || 0)}</small>
                  </button>
                  <button type="button" aria-label={tr.share} onClick={() => shareReel(r)}>
                    <Icon n="compartir" size={30} />
                    <small>{tr.share}</small>
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
