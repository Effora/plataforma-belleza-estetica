'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useApp, Icon, applyF } from './Shell';
import Carousel from './Carousel';
import MapView from './Map';
export default function Home() {
  const { ver, tr, fmt, f, openBooking } = useApp(); const [map, setMap] = useState(false); const [liked, setLiked] = useState({}); const [pick, setPick] = useState(null);
  const list = applyF(f); const lk = (id) => setLiked((x) => ({ ...x, [id]: !x[id] }));
  if (ver === 'b') {
    return (<div className="feed">{list.map((s) => (<section key={s.id} className="reel" onDoubleClick={() => lk(s.id)}><img className="bg" src={`/media/${s.imgs[0]}`} alt={s.name} /><div className="shade" />
      <div className="rail"><button aria-pressed={!!liked[s.id]} onClick={() => lk(s.id)} aria-label="like"><Icon n="favoritos" fill={!!liked[s.id]} size={30} /><small>{liked[s.id] ? 1241 : 1240}</small></button><button aria-label="chat"><Icon n="mensaje" size={30} /><small>86</small></button><button aria-label="share"><Icon n="compartir" size={30} /></button></div>
      <div className="info"><Link href={`/salon/${s.id}/`}><b>@{s.id}</b></Link><h2>{s.name}</h2><p>★ {s.rating} · {s.zone} · {s.km} km{s.promo && <em> {s.promo}</em>}</p><button className="cta" onClick={() => openBooking(s)}>{tr.book} · {fmt(s.price)}</button></div></section>))}</div>);
  }
  return (<div className={`split ${map ? 'showmap' : ''}`}>
    <div className="list"><div className="grid">{list.map((s) => (<article key={s.id} className={`card ${pick === s.id ? 'hl' : ''}`}><div className="ph"><Carousel imgs={s.imgs} alt={s.name} />{s.promo && <span className="tag">{s.promo}</span>}<button className="heart" aria-pressed={!!liked[s.id]} aria-label={tr.favs} onClick={() => lk(s.id)}><Icon n="favoritos" fill={!!liked[s.id]} size={20} /></button></div>
      <Link href={`/salon/${s.id}/`}><div className="row"><b>{s.name}</b><span>★ {s.rating}</span></div><p className="mut">{s.zone} · {s.km} km</p><p>{tr.from} <b>{fmt(s.price)}</b></p></Link></article>))}</div></div>
    <div className="mapcol"><MapView items={list} label={(s) => fmt(s.price)} onPick={setPick} /></div>
    <button className="fab" onClick={() => setMap(!map)}><Icon n="mapa" size={18} />{map ? tr.showList : tr.showMap}</button></div>);
}
