'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { t } from '../lib/data';
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
export const Icon = ({ n, fill, size = 24 }) => (<svg width={size} height={size} aria-hidden="true"><use href={`/icons.svg#gl-${n}${fill ? '-fill' : ''}`} /></svg>);
export default function Shell({ children }) {
  const [lang, setLang] = useState('es'); const [ver, setVer] = useState('a'); const [gate, setGate] = useState(false);
  useEffect(() => { const l = localStorage.getItem('gl-lang') || (navigator.language || 'es').slice(0, 2); if (t[l]) setLang(l); setVer(localStorage.getItem('gl-ver') || 'a'); }, []);
  useEffect(() => { document.documentElement.dataset.v = ver; document.documentElement.lang = lang; try { localStorage.setItem('gl-ver', ver); localStorage.setItem('gl-lang', lang); } catch {} }, [ver, lang]);
  const tr = t[lang];
  const nav = [['inicio', tr.home], ['mapa', tr.map], ['turnos', tr.appts], ['favoritos', tr.favs], ['perfil', tr.profile]];
  return (
    <Ctx.Provider value={{ lang, ver, tr, openGate: () => setGate(true) }}>
      <header className="top">
        <Link href="/" className="brand"><img src="/logo.png" alt="Glowly" width="36" height="36" /><b>Glowly</b></Link>
        <div className="pill" role="search"><Icon n="buscar" size={20} /><span><b>{tr.search}</b><small>{tr.sub}</small></span><Icon n="filtros" size={20} /></div>
        <div className="ctl">
          <div className="seg" role="group" aria-label="Version">{['a', 'b'].map((v) => <button key={v} aria-pressed={ver === v} onClick={() => setVer(v)}>{v.toUpperCase()}</button>)}</div>
          <label className="lang"><Icon n="idioma" size={18} /><select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Idioma">{Object.keys(t).map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}</select></label>
        </div>
      </header>
      <main>{children}</main>
      <nav className="bottom" aria-label="Principal">{nav.map(([n, l], i) => <button key={n} className={i === 0 ? 'on' : ''}><Icon n={n} fill={i === 0} /><span>{l}</span></button>)}</nav>
      {gate && (<div className="gate" role="dialog" aria-modal="true"><div><Icon n="turnos" fill size={36} /><h2>{tr.gateT}</h2><p>{tr.gateP}</p><button className="cta" onClick={() => setGate(false)}>{tr.gateB}</button><button className="ghost" onClick={() => setGate(false)}>{tr.close}</button></div></div>)}
    </Ctx.Provider>
  );
}
