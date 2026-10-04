'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t, rates, salons, cats, catIcon } from '../lib/data';
import Booking from './Booking';
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
export const Icon = ({ n, fill, size = 24 }) => (<svg width={size} height={size} aria-hidden="true"><use href={`/icons.svg#gl-${n}${fill ? '-fill' : ''}`} /></svg>);
const F0 = { cat: null, max: 60, promo: false, now: false, rate: false };
export const applyF = (f) => salons.filter((s) => (!f.cat || s.cat === f.cat) && s.price <= f.max && (!f.promo || s.promo) && (!f.now || s.now) && (!f.rate || s.rating >= 4.5));
export default function Shell({ children }) {
  const [lang, setLang] = useState('es'); const [ver, setVer] = useState('a'); const [cur, setCur] = useState('USD');
  const [sc, setSc] = useState(false); const [open, setOpen] = useState(false); const [book, setBook] = useState(null);
  const [f, setF] = useState(F0); const [fm, setFm] = useState(false); const [user, setUser] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const nl = navigator.language || 'es'; const l = localStorage.getItem('gl-lang') || nl.slice(0, 2); if (t[l]) setLang(l);
    setVer(localStorage.getItem('gl-ver') || 'a');
    const r = nl.split('-')[1]; setCur(localStorage.getItem('gl-cur') || { CO: 'COP', AR: 'ARS', MX: 'MXN', BR: 'BRL' }[r] || 'USD');
    const on = () => { setSc(window.scrollY > 8); if (window.scrollY <= 8) setOpen(false); };
    on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { document.documentElement.dataset.v = ver; document.documentElement.lang = lang; try { localStorage.setItem('gl-ver', ver); localStorage.setItem('gl-lang', lang); localStorage.setItem('gl-cur', cur); } catch {} }, [ver, lang, cur]);
  const tr = t[lang];
  const fmt = (usd) => new Intl.NumberFormat(lang, { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(usd * rates[cur]);
  const nf = Object.values({ ...f, cat: f.cat ? 1 : 0, max: f.max < 60 ? 1 : 0 }).filter(Boolean).length;
  const home = path === '/';
  const ctl = (<div className="ctl">
    <div className="seg" role="group" aria-label="Version">{['a', 'b'].map((v) => <button key={v} aria-pressed={ver === v} onClick={() => setVer(v)}>{v.toUpperCase()}</button>)}</div>
    <label className="sel"><Icon n="idioma" size={18} /><select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Idioma">{Object.keys(t).map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}</select></label>
    <select className="cur" value={cur} onChange={(e) => setCur(e.target.value)} aria-label="Moneda">{Object.keys(rates).map((c) => <option key={c}>{c}</option>)}</select></div>);
  const nav = [['inicio', tr.home], ['mapa', tr.map], ['turnos', tr.appts], ['favoritos', tr.favs], ['perfil', tr.profile]];
  const tabs = [['inicio', tr.all], ['promos', tr.promos], ['ahora', tr.now]];
  return (
    <Ctx.Provider value={{ lang, ver, tr, fmt, f, setF, user, setUser, openBooking: setBook, openFilters: () => setFm(true) }}>
      {ver === 'a' ? (<>
        <header className={`top ${sc && !open ? 'sc' : ''}`}>
          <div className="r1"><Link href="/" className="brand"><img src="/logo.png" alt="Glowly" width="34" height="34" /><b>Glowly</b></Link>
            <div className="mid"><nav className="tabs">{tabs.map(([n, l], i) => <button key={n} className={i === 0 ? 'on' : ''}><Icon n={n} fill={i === 0} size={34} /><span>{l}</span></button>)}</nav>
              <button className="mini" onClick={() => setOpen(true)}><b>{tr.ph1}</b><i /><b>{tr.ph2}</b><i /><b>{tr.ph3}</b><span className="go"><Icon n="buscar" size={14} /></span></button></div>{ctl}</div>
          <div className="big"><div className="bar" role="search">{[['q1', 'ph1'], ['q2', 'ph2'], ['q3', 'ph3']].map(([a, b]) => <label key={a}><b>{tr[a]}</b><input placeholder={tr[b]} /></label>)}<button className="go" aria-label="Buscar"><Icon n="buscar" size={20} /></button></div></div>
          {home && (<div className="cats"><div className="cs" role="tablist">{cats.map((c) => <button key={c} role="tab" aria-selected={f.cat === c} className={f.cat === c ? 'on' : ''} onClick={() => setF({ ...f, cat: f.cat === c ? null : c })}><Icon n={catIcon[c]} fill={f.cat === c} /><span>{tr[c]}</span></button>)}</div>
            <button className="fbtn" onClick={() => setFm(true)}><Icon n="filtros" size={18} />{tr.filters}{nf > 0 && <em>{nf}</em>}</button></div>)}
        </header>
        <main>{children}</main>
        <nav className="bottom" aria-label="Principal">{nav.map(([n, l], i) => <button key={n} className={i === 0 ? 'on' : ''}><Icon n={n} fill={i === 0} /><span>{l}</span></button>)}</nav>
      </>) : (<div className="tt">
        <aside className="side"><Link href="/" className="brand"><img src="/logo.png" alt="Glowly" width="34" height="34" /><b>Glowly</b></Link>{nav.map(([n, l], i) => <button key={n} className={i === 0 ? 'on' : ''}><Icon n={n} fill={i === 0} /><span>{l}</span></button>)}</aside>
        <div className="btop"><div className="tk"><span>{tr.following}</span><b>{tr.forYou}</b></div>{ctl}</div>
        <main className="ttm">{children}</main>
        <nav className="bottom dark" aria-label="Principal">{nav.map(([n, l], i) => <button key={n} className={i === 0 ? 'on' : ''}><Icon n={n} fill={i === 0} /><span>{l}</span></button>)}</nav>
      </div>)}
      {fm && (<div className="gate" role="dialog" aria-modal="true"><div className="sheet"><button className="x" onClick={() => setFm(false)} aria-label={tr.close}><Icon n="cerrar" /></button><h2>{tr.filters}</h2>
        <label className="fr">{tr.maxP}: <b>{fmt(f.max)}</b><input type="range" min="10" max="60" value={f.max} onChange={(e) => setF({ ...f, max: +e.target.value })} /></label>
        {[['promo', tr.onlyPromo], ['now', tr.avail], ['rate', tr.r45]].map(([k, l]) => <label key={k} className="fr chk"><input type="checkbox" checked={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.checked })} />{l}</label>)}
        <div className="two"><button className="ghost" onClick={() => setF(F0)}>{tr.clear}</button><button className="cta" onClick={() => setFm(false)}>{tr.show} {applyF(f).length} {tr.results}</button></div></div></div>)}
      {book && <Booking s={book} onClose={() => setBook(null)} />}
    </Ctx.Provider>
  );
}
