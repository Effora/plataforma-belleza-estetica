'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { t, rates, salons, cats, catIcon, BRAND, F0, applyF as filterSalons, matchQ } from '../lib/data';
import { DEFAULT_HERE, withDistance } from '../lib/geo';
import Booking from './Booking';
import Auth from './Auth';
import { MapPanel, TurnosPanel, FavsPanel, ProfilePanel } from './Panels';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export const Icon = ({ n, fill, size = 24 }) => (
  <svg className="ico" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <use href={`/icons.svg#gl-${n}${fill ? '-fill' : ''}`} />
  </svg>
);

export const applyF = (f) => filterSalons(f);

export default function Shell({ children }) {
  const [lang, setLang] = useState('es');
  const [ver, setVer] = useState('a');
  const [cur, setCur] = useState('USD');
  const [sc, setSc] = useState(false);
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState(null);
  const [f, setF] = useState(F0);
  const [fm, setFm] = useState(false);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authChoose, setAuthChoose] = useState(false);
  const [sm, setSm] = useState(false);
  const [q, setQ] = useState('');
  const [follows, setFollows] = useState({});
  const [feedMode, setFeedMode] = useState('foryou'); // foryou | following
  const [tab, setTab] = useState('inicio');
  const [here, setHere] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle');
  const [favs, setFavs] = useState({});
  const [bookings, setBookings] = useState([]);
  const topRef = useRef(null);
  const btopRef = useRef(null);
  const path = usePathname();
  const router = useRouter();
  const home = path === '/';
  const onSalon = path.startsWith('/salon');
  const onShop = path.startsWith('/comercio');
  const onSub = onSalon || onShop;

  useEffect(() => {
    const nl = navigator.language || 'es';
    const l = localStorage.getItem('gl-lang') || nl.slice(0, 2);
    if (t[l]) setLang(l);
    setVer(localStorage.getItem('gl-ver') || 'a');
    const r = nl.split('-')[1];
    setCur(localStorage.getItem('gl-cur') || { CO: 'COP', AR: 'ARS', MX: 'MXN', BR: 'BRL' }[r] || 'USD');
    try {
      setFavs(JSON.parse(localStorage.getItem('gl-favs') || '{}'));
      setFollows(JSON.parse(localStorage.getItem('gl-follows') || '{}'));
      setBookings(JSON.parse(localStorage.getItem('gl-bookings') || '[]'));
      const saved = localStorage.getItem('gl-user');
      setUser(saved && saved !== '0' && saved !== '1' ? JSON.parse(saved) : null);
    } catch { /* ignore */ }
    const on = () => {
      setSc(window.scrollY > 8);
      if (window.scrollY <= 8) setOpen(false);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.v = ver;
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('gl-ver', ver);
      localStorage.setItem('gl-lang', lang);
      localStorage.setItem('gl-cur', cur);
      localStorage.setItem('gl-favs', JSON.stringify(favs));
      localStorage.setItem('gl-follows', JSON.stringify(follows));
      localStorage.setItem('gl-bookings', JSON.stringify(bookings));
      localStorage.setItem('gl-user', user ? JSON.stringify(user) : '');
    } catch { /* ignore */ }
  }, [ver, lang, cur, favs, follows, bookings, user]);

  // Mide el alto real del header para que el mapa ocupe todo el resto de la pantalla.
  useEffect(() => {
    const root = document.documentElement;
    const pairs = [[topRef.current, '--hdr'], [btopRef.current, '--btop-h']].filter(([el]) => el);
    ['--hdr', '--btop-h'].forEach((v) => root.style.removeProperty(v));
    if (!pairs.length) return undefined;
    const set = () => pairs.forEach(([el, v]) => root.style.setProperty(v, `${Math.round(el.getBoundingClientRect().height)}px`));
    set();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(set);
    pairs.forEach(([el]) => ro.observe(el));
    return () => ro.disconnect();
  }, [ver]);

  useEffect(() => {
    const feedOn = ver === 'b' && home && tab === 'inicio';
    document.documentElement.dataset.feed = feedOn ? '1' : '';
  }, [ver, home, tab]);

  const requestGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setHere(DEFAULT_HERE);
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere([pos.coords.latitude, pos.coords.longitude]);
        setGeoStatus('ok');
      },
      () => {
        setHere(DEFAULT_HERE);
        setGeoStatus('denied');
      },
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    setHere(DEFAULT_HERE);
    requestGeo();
  }, [requestGeo]);

  const setVersion = (v) => {
    setVer(v);
    setF(F0);
    setOpen(false);
    setTab('inicio');
    window.scrollTo(0, 0);
  };

  const goTab = (id) => {
    setTab(id);
    if (onSub) router.push('/');
    window.scrollTo(0, 0);
  };

  // Acciones que requieren cuenta: me gusta, seguir, comentar, reservar.
  const needLogin = () => {
    if (user) return false;
    setAuthChoose(false);
    setAuthOpen(true);
    return true;
  };
  const toggleFav = (id) => { if (needLogin()) return; setFavs((x) => ({ ...x, [id]: !x[id] })); };
  const toggleFollow = (id) => { if (needLogin()) return; setFollows((x) => ({ ...x, [id]: !x[id] })); };
  const addBooking = (entry) => setBookings((x) => [entry, ...x]);

  const tr = t[lang];
  const fmt = (usd) => new Intl.NumberFormat(lang, {
    style: 'currency', currency: cur, maximumFractionDigits: 0,
  }).format(usd * rates[cur]);

  const filtered = useMemo(
    () => withDistance(filterSalons(f, salons).filter((x) => matchQ(x, q)), here),
    [f, here, q],
  );

  const nf = Object.values({ ...f, cat: f.cat ? 1 : 0, max: f.max < 60 ? 1 : 0 }).filter(Boolean).length;
  const showFeedChrome = ver === 'b' && home && tab === 'inicio';
  const showBBack = ver === 'b' && (onSub || tab !== 'inicio');

  const ctl = (
    <div className="ctl">
      <div className="seg" role="group" aria-label="Version">
        {['a', 'b'].map((v) => (
          <button key={v} type="button" aria-pressed={ver === v} onClick={() => setVersion(v)}>{v.toUpperCase()}</button>
        ))}
      </div>
      <label className="pill-sel">
        <Icon n="idioma" size={16} />
        <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label={tr.lang}>
          {Object.keys(t).map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </select>
      </label>
      <label className="pill-sel">
        <span className="pill-sel__cur" aria-hidden="true">$</span>
        <select value={cur} onChange={(e) => setCur(e.target.value)} aria-label={tr.currency}>
          {Object.keys(rates).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      {user ? (
        <button type="button" className="login-chip on" onClick={() => (user.role === 'merchant' ? router.push(JSON.parse(localStorage.getItem('gl-merchant') || '{}').published ? '/comercio/panel/' : '/comercio/') : goTab('perfil'))} title={user.email}>
          <Icon n="perfil" size={16} />{user.name?.split(' ')[0] || tr.profile}
        </button>
      ) : (
        <button type="button" className="login-chip" onClick={() => { setAuthChoose(true); setAuthOpen(true); }}>
          <Icon n="perfil" size={16} />{tr.login}
        </button>
      )}
    </div>
  );

  const navItems = [
    ['inicio', tr.home],
    ['mapa', tr.map],
    ['turnos', tr.appts],
    ['favoritos', tr.favs],
    ['perfil', tr.profile],
  ];

  const tabsQuick = [
    ['all', tr.all, () => setF(F0)],
    ['promos', tr.promos, () => setF({ ...F0, promo: true })],
    ['ahora', tr.now, () => setF({ ...F0, now: true })],
  ];

  const bottomNav = () => (
    <nav className="bottom" aria-label="Principal">
      {navItems.map(([n, l]) => (
        <button
          key={n}
          type="button"
          className={tab === n && !onSub ? 'on' : ''}
          onClick={() => goTab(n)}
        >
          <span className="ic"><Icon n={n} fill={tab === n && !onSub} /></span>
          <span className="bottom__lbl">{l}</span>
        </button>
      ))}
    </nav>
  );

  const mainContent = () => {
    if (onSub) return children;
    if (tab === 'mapa') return <MapPanel />;
    if (tab === 'turnos') return <TurnosPanel />;
    if (tab === 'favoritos') return <FavsPanel />;
    if (tab === 'perfil') return <ProfilePanel />;
    return children;
  };

  const ctx = {
    lang, setLang, ver, cur, setCur, tr, fmt, f, setF, user, setUser,
    openBooking: setBook, openFilters: () => setFm(true), openAuth: (o) => { setAuthChoose(!!(o && o.choose)); setAuthOpen(true); },
    tab, setTab: goTab, here, geoStatus, requestGeo,
    favs, toggleFav, follows, toggleFollow, needLogin, q, setQ, bookings, addBooking, filtered,
    feedMode, setFeedMode,
  };

  return (
    <Ctx.Provider value={ctx}>
      {ver === 'a' ? (
        <>
          <header ref={topRef} className={`top ${sc && !open ? 'sc' : ''} ${onShop ? 'm' : ''}`}>
            <div className="r1">
              <Link href="/" className="brand" onClick={() => goTab('inicio')}>
                <img src="/logo.png" alt="" width="34" height="34" />
                <b>{BRAND}</b>
              </Link>
              <div className="mid">
                <nav className="tabs">
                  {tabsQuick.map(([k, l, fn], i) => (
                    <button
                      key={k}
                      type="button"
                      className={(k === 'all' && !f.promo && !f.now) || (k === 'promos' && f.promo) || (k === 'ahora' && f.now) ? 'on' : ''}
                      onClick={fn}
                    >
                      <Icon n={i === 0 ? 'inicio' : i === 1 ? 'promos' : 'ahora'} fill size={34} />
                      <span>{l}</span>
                    </button>
                  ))}
                </nav>
                <button type="button" className="mini" onClick={() => setOpen(true)}>
                  <b>{q || tr.ph1}</b><i /><b>{tr.ph2}</b><i /><b>{tr.ph3}</b>
                  <span className="go"><Icon n="buscar" size={14} /></span>
                </button>
              </div>
              {ctl}
            </div>
            <div className="big">
              <div className="bar" role="search">
                {[['q1', 'ph1'], ['q2', 'ph2'], ['q3', 'ph3']].map(([a, b], i) => (
                  <label key={a}><b>{tr[a]}</b>{i === 0
                    ? <input placeholder={tr[b]} value={q} onChange={(e) => setQ(e.target.value)} />
                    : <input placeholder={tr[b]} />}</label>
                ))}
                <button type="button" className="go" aria-label="Buscar"><Icon n="buscar" size={20} /></button>
              </div>
            </div>
            {home && tab === 'inicio' && (
              <div className="cats">
                <div className="cs" role="tablist">
                  {cats.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="tab"
                      aria-selected={f.cat === c}
                      className={f.cat === c ? 'on' : ''}
                      onClick={() => setF({ ...f, cat: f.cat === c ? null : c })}
                    >
                      <span className="ic"><Icon n={catIcon[c]} fill={f.cat === c} /></span>
                      <span>{tr[c]}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="fbtn" onClick={() => setFm(true)} aria-label={tr.filters} title={tr.filters}>
                  <Icon n="filtros" size={20} />
                  {nf > 0 && <em>{nf}</em>}
                </button>
              </div>
            )}
          </header>
          <main>{mainContent()}</main>
          {bottomNav()}
        </>
      ) : (
        <div className="tt">
          <aside className="side" aria-label="Navegación">
            <Link href="/" className="brand brand--icon" onClick={() => goTab('inicio')} aria-label={BRAND}>
              <img src="/logo.png" alt="" width="60" height="60" />
              <b>{BRAND}</b>
            </Link>
            {navItems.map(([n, l]) => (
              <button
                key={n}
                type="button"
                className={tab === n && !onSub ? 'on' : ''}
                onClick={() => goTab(n)}
                aria-label={l}
                title={l}
              >
                <span className="ic"><Icon n={n} fill={tab === n && !onSub} size={26} /></span>
              </button>
            ))}
          </aside>
          {showFeedChrome && (
            <aside className="rail-list" aria-label={tr.results}>
              <h2>{tr.nearYou}</h2>
              <ul>
                {filtered.map((s) => (
                  <li key={s.id}>
                    <Link href={`/salon/${s.id}/`} onClick={() => goTab('inicio')}>
                      <img src={`/media/${s.imgs[0]}`} alt="" width="44" height="44" />
                      <span>
                        <b>{s.name}</b>
                        <small>★ {s.rating} · {s.zone} · {fmt(s.price)}</small>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
          <div className="col">
            <div className="btop" ref={btopRef}>
              <Link href="/" className="brand brand--b" onClick={() => goTab('inicio')} aria-label={BRAND}>
                <img src="/logo.png" alt="" width="40" height="40" />
                <b>{BRAND}</b>
              </Link>
              {showFeedChrome && (
                <div className="tk" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={feedMode === 'following'}
                    className={feedMode === 'following' ? 'on' : ''}
                    onClick={() => setFeedMode('following')}
                  >{tr.following}</button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={feedMode === 'foryou'}
                    className={feedMode === 'foryou' ? 'on' : ''}
                    onClick={() => setFeedMode('foryou')}
                  >{tr.forYou}</button>
                </div>
              )}
              {showBBack && (
                <Link href="/" className="back-b" onClick={() => goTab('inicio')}>
                  <Icon n="atras" size={20} />{tr.back}
                </Link>
              )}
              {!showFeedChrome && !showBBack && <span />}
              {showFeedChrome && (
                <div className="bicons">
                  <button type="button" className="bicon" onClick={() => setSm(true)} aria-label={tr.search} title={tr.search}>
                    <Icon n="buscar" size={20} />{q && <em />}
                  </button>
                  <button type="button" className="bicon" onClick={() => setFm(true)} aria-label={tr.filters} title={tr.filters}>
                    <Icon n="filtros" size={20} />{nf > 0 && <em>{nf}</em>}
                  </button>
                </div>
              )}
              {ctl}
            </div>
            <main className="ttm">{mainContent()}</main>
          </div>
          {bottomNav()}
        </div>
      )}

      {fm && (
        <div className="gate" role="dialog" aria-modal="true">
          <div className="sheet">
            <button type="button" className="x" onClick={() => setFm(false)} aria-label={tr.close}><Icon n="cerrar" /></button>
            <h2>{tr.filters}</h2>
            <div className="fr">{tr.category}
              <div className="chips">
                {cats.map((c) => (
                  <button key={c} type="button" className={f.cat === c ? 'on' : ''} onClick={() => setF({ ...f, cat: f.cat === c ? null : c })}>{tr[c]}</button>
                ))}
              </div>
            </div>
            <label className="fr">{tr.maxP}: <b>{fmt(f.max)}</b>
              <input type="range" min="10" max="60" value={f.max} onChange={(e) => setF({ ...f, max: +e.target.value })} />
            </label>
            {[['promo', tr.onlyPromo], ['now', tr.avail], ['rate', tr.r45]].map(([k, l]) => (
              <label key={k} className="fr chk">
                <input type="checkbox" checked={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.checked })} />{l}
              </label>
            ))}
            <div className="two">
              <button type="button" className="ghost" onClick={() => setF(F0)}>{tr.clear}</button>
              <button type="button" className="cta" onClick={() => setFm(false)}>{tr.show} {filtered.length} {tr.results}</button>
            </div>
          </div>
        </div>
      )}
      {sm && (
        <div className="gate" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && setSm(false)}>
          <div className="sheet">
            <button type="button" className="x" onClick={() => setSm(false)} aria-label={tr.close}><Icon n="cerrar" /></button>
            <h2>{tr.search}</h2>
            <form className="searchbox" onSubmit={(e) => { e.preventDefault(); setSm(false); }}>
              <Icon n="buscar" size={20} />
              <input autoFocus type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr.searchPh} aria-label={tr.search} />
            </form>
            <div className="two">
              <button type="button" className="ghost" onClick={() => setQ('')}>{tr.clear}</button>
              <button type="button" className="cta" onClick={() => setSm(false)}>{tr.show} {filtered.length} {tr.results}</button>
            </div>
          </div>
        </div>
      )}
      {authOpen && <Auth reason={authChoose ? null : tr.needAuth} choose={authChoose} onClose={() => setAuthOpen(false)} />}
      {book && <Booking s={book} onClose={() => setBook(null)} />}
    </Ctx.Provider>
  );
}
