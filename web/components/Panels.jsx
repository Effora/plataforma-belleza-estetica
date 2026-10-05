'use client';
import Link from 'next/link';
import { salons, t, rates } from '../lib/data';
import { useApp, Icon } from './Shell';
import MapView from './Map';
import { withDistance } from '../lib/geo';

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
      {geoStatus === 'far' && <p className="mut pad">{tr.geoFar}</p>}
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

/** Tarjetita tipo comentario de Instagram: foto redonda del comercio, nombre, ubicación, valor y corazón. */
function IgCard({ s, title, line, meta, onClick }) {
  const { tr, favs, toggleFav } = useApp();
  const liked = !!(s && favs[s.id]);
  const href = s ? `/salon/${s.id}/` : '/';
  return (
    <li className="igc">
      <Link href={href} className="igc__av" onClick={onClick} aria-label={title}>
        {s ? <img src={`/media/${s.imgs[0]}`} alt="" /> : <Icon n="turnos" size={22} />}
      </Link>
      <Link href={href} className="igc__b" onClick={onClick}>
        <p className="igc__t"><b>{title}</b>{s && <span> · {s.zone}</span>}</p>
        {line && <p className="igc__l">{line}</p>}
        <p className="igc__m">{meta}</p>
      </Link>
      {s && (
        <button type="button" className="igc__h" aria-pressed={liked} aria-label={tr.favs} onClick={() => toggleFav(s.id)}>
          <Icon n="favoritos" fill={liked} size={20} />
        </button>
      )}
    </li>
  );
}

export function TurnosPanel() {
  const { tr, fmt, bookings, openBooking, setTab } = useApp();
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
      <ul className="igl">
        {bookings.map((b) => {
          const s = salons.find((x) => x.id === b.sid) || salons.find((x) => x.name === b.salon);
          return (
            <IgCard
              key={b.id}
              s={s}
              title={b.salon}
              line={b.service}
              meta={<><Icon n="turnos" size={14} />{b.when} · <b>{fmt(b.price)}</b></>}
              onClick={() => setTab('inicio')}
            />
          );
        })}
      </ul>
    </div>
  );
}

export function FavsPanel() {
  const { tr, fmt, favs, setTab, here } = useApp();
  const list = withDistance(salons.filter((s) => favs[s.id]), here);
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
      <ul className="igl">
        {list.map((s) => (
          <IgCard
            key={s.id}
            s={s}
            title={s.name}
            line={`★ ${s.rating} (${s.reviews} ${tr.reviews})${s.promo ? ` · ${s.promo}` : ''}`}
            meta={<>{s.dist ?? s.km} km · {tr.from} <b>{fmt(s.price)}</b></>}
            onClick={() => setTab('inicio')}
          />
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
