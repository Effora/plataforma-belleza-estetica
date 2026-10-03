'use client';
import Link from 'next/link';
import { useApp, Icon } from './Shell';
export default function Detail({ s }) {
  const { tr, openGate } = useApp();
  return (<div className="detail"><div><Link href="/" className="back"><Icon n="atras" size={20} />{tr.back}</Link><img className="hero" src={`/media/${s.img}`} alt={s.name} /><h1>{s.name}</h1><p className="mut">★ {s.rating} ({s.reviews} {tr.reviews}) · {s.zone} · {s.km} km</p><h2>{tr.services}</h2><ul className="svc">{s.services.map(([n, m, p]) => <li key={n}><span>{n}<small>{m} min</small></span><b>USD {p}</b></li>)}</ul></div>
    <aside className="book"><p>{tr.from} <b>USD {s.price}</b></p><p className="pts"><Icon n="puntos" size={18} />{tr.points}</p><button className="cta" onClick={openGate}>{tr.book}</button></aside></div>);
}
