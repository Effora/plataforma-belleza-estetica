'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useApp, Icon } from './Shell';
import { salons, cats, catIcon } from '../lib/data';
export default function Home() {
  const { ver, tr } = useApp(); const [cat, setCat] = useState(null); const [i, setI] = useState(0); const [liked, setLiked] = useState({});
  const list = salons.filter((s) => !cat || s.cat === cat);
  if (ver === 'b') {
    const s = salons[i];
    return (<section className="reel">{s ? (<><Link href={`/salon/${s.id}/`}><img src={`/media/${s.img}`} alt={s.name} /></Link><div className="ov"><h2>{s.name}</h2><p>★ {s.rating} · {s.zone} · {s.km} km</p><p>{tr.from} USD {s.price}{s.promo && <em> {s.promo}</em>}</p></div><div className="acts"><button onClick={() => setI(i + 1)} aria-label={tr.pass}><Icon n="cerrar" size={28} /></button><button className="yes" onClick={() => setI(i + 1)} aria-label={tr.like}><Icon n="favoritos" fill size={28} /></button></div></>) : <p className="empty">{tr.empty}</p>}</section>);
  }
  return (<>
    <div className="cats" role="tablist">{cats.map((c) => <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(cat === c ? null : c)}><Icon n={catIcon[c]} fill={cat === c} /><span>{tr[c]}</span></button>)}</div>
    <h1 className="h">{tr.near}</h1>
    <div className="grid">{list.map((s) => (<article key={s.id} className="card"><Link href={`/salon/${s.id}/`}><div className="ph"><img src={`/media/${s.img}`} alt={s.name} loading="lazy" />{s.promo && <span className="tag">{s.promo}</span>}</div><div className="row"><b>{s.name}</b><span>★ {s.rating}</span></div><p className="mut">{s.zone} · {s.km} km</p><p>{tr.from} <b>USD {s.price}</b></p></Link><button className="heart" aria-pressed={!!liked[s.id]} aria-label={tr.favs} onClick={() => setLiked({ ...liked, [s.id]: !liked[s.id] })}><Icon n="favoritos" fill={!!liked[s.id]} /></button></article>))}</div>
  </>);
}
