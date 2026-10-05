'use client';
import Link from 'next/link';
import { salons, t, rates } from '../lib/data';
import { useApp, Icon } from './Shell';
import MapView from './Map';

export function MapPanel() {
  const { tr, fmt, here, geoStatus, requestGeo, setTab, filtered } = useApp();
  return (
    <div className="panel panel--map">
      <div className="panel__head">
        <h1>{tr.map}</h1>
        <button type="button" className="ghost geo" onClick={requestGeo}>
          <Icon n="mapa" size={18} />
          {geoStatus === 'loading' ? tr.searching : geoStatus === 'ok' ? tr.nearYou : tr.useLocation}
        </button>
      </div>
      {geoStatus === 'denied' && <p className="mut pad">{tr.geoDenied}</p>}
      <div className="panel__map">
        <MapView
          items={filtered}
          here={here}
          label={(s) => fmt(s.price)}
          onPick={(id) => { setTab('inicio'); window.location.assign(`/salon/${id}/`); }}
          active
        />
      </div>
      <ul className="panel__list">
        {filtered.map((s) => (
          <li key={s.id}>
            <Link href={`/salon/${s.id}/`} onClick={() => setTab('inicio')}>
              <b>{s.name}</b>
              <span>
                {s.dist ?? s.km} km · {fmt(s.price)}
                {s.promo ? ` · ${s.promo}` : ''}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TurnosPanel() {
  const { tr, fmt, bookings, openBooking } = useApp();
  if (!bookings.length) {
    return (
      <div className="panel empty">
        <Icon n="turnos" size={40} />
        <h1>{tr.appts}</h1>
        <p className="mut">{tr.noAppts}</p>
        <button type="button" className="cta" onClick={() => openBooking(salons[0])}>{tr.book}</button>
      </div>
    );
  }
  return (
    <div className="panel">
      <h1>{tr.appts}</h1>
      <ul className="panel__cards">
        {bookings.map((b) => (
          <li key={b.id} className="panel__card">
            <b>{b.salon}</b>
            <p>{b.service}</p>
            <p className="mut">{b.when} · {fmt(b.price)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FavsPanel() {
  const { tr, fmt, favs, toggleFav, setTab } = useApp();
  const list = salons.filter((s) => favs[s.id]);
  if (!list.length) {
    return (
      <div className="panel empty">
        <Icon n="favoritos" size={40} />
        <h1>{tr.favs}</h1>
        <p className="mut">{tr.noFavs}</p>
      </div>
    );
  }
  return (
    <div className="panel">
      <h1>{tr.favs}</h1>
      <ul className="panel__cards">
        {list.map((s) => (
          <li key={s.id} className="panel__card rowish">
            <Link href={`/salon/${s.id}/`} onClick={() => setTab('inicio')}>
              <b>{s.name}</b>
              <p className="mut">{s.zone} · {fmt(s.price)}</p>
            </Link>
            <button type="button" className="fav-btn" aria-label={tr.favs} onClick={() => toggleFav(s.id)}>
              <Icon n="favoritos" fill size={22} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProfilePanel() {
  const { tr, user, setUser, lang, setLang, cur, setCur, openAuth, setTab } = useApp();
  return (
    <div className="panel">
      <button type="button" className="ghost backd" onClick={() => setTab('inicio')}><Icon n="atras" size={18} />{tr.home}</button>
      <h1>{tr.profile}</h1>
      <div className="panel__card">
        {user ? (
          <>
            <p><b>{user.name}</b></p>
            <p className="mut">{user.email} · {user.provider === 'google' ? 'Google' : 'Email'}</p>
            <p className="mut">{tr.pointsHint}</p>
            {user.role === 'merchant' && <Link href="/comercio/" className="cta">{tr.myShop}</Link>}
            <button type="button" className="ghost" onClick={() => setUser(null)}>{tr.logout}</button>
          </>
        ) : (
          <>
            <p><b>{tr.guest}</b></p>
            <p className="mut">{tr.loginSub}</p>
            <button type="button" className="cta" onClick={() => openAuth({ choose: true })}>{tr.gateB}</button>
          </>
        )}
      </div>
      <div className="prefs">
        <label className="pref">
          <span className="pref__label"><Icon n="idioma" size={16} />{tr.lang}</span>
          <select className="pref__sel" value={lang} onChange={(e) => setLang(e.target.value)} aria-label={tr.lang}>
            {Object.keys(t).map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </label>
        <label className="pref">
          <span className="pref__label"><Icon n="puntos" size={16} />{tr.currency}</span>
          <select className="pref__sel" value={cur} onChange={(e) => setCur(e.target.value)} aria-label={tr.currency}>
            {Object.keys(rates).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}
