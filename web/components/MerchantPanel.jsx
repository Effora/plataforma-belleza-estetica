'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useApp, Icon } from './Shell';

const TABS = ['sum', 'agenda', 'clients', 'income', 'promos', 'services'];
const L = {
  es: {
    title: 'Panel del comercio', demo: 'Datos de ejemplo para la demo', edit: 'Editar datos', plan: 'Plan',
    tabs: { sum: 'Resumen', agenda: 'Agenda', clients: 'Clientes', income: 'Ingresos', promos: 'Promos', services: 'Servicios' },
    k1: 'Reservas hoy', k2: 'Ingresos de la semana', k3: 'Ocupación', k4: 'Puntuación', vsPrev: 'vs. semana anterior', reviews: 'reseñas',
    next: 'Próximos turnos', tip: 'Sugerencia', tipT: 'Martes de 10 a 12 h tiene baja demanda.', tipB: 'Crear promo relámpago',
    confirmed: 'Confirmada', paid: 'Pagada', pending: 'Pendiente', canceled: 'Cancelada', confirm: 'Confirmar', cancel: 'Cancelar',
    today: 'Hoy', tomorrow: 'Mañana', with: 'con',
    search: 'Buscar cliente…', visits: 'visitas', last: 'Última visita', suggest: 'Sugerir turno', sent: 'Enviado ✓', back: 'Momento ideal para volver',
    week: 'Ingresos por día', heat: 'Movimiento por horario', low: 'Baja demanda', high: 'Alta demanda', total: 'Total semana',
    d: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
    pTitle: 'Promociones relámpago', pHint: 'Llená horarios flojos. Aparecen en el mapa con cuenta regresiva.', pSvc: 'Servicio', pOff: 'Descuento', pWhen: 'Horario', pCreate: 'Publicar promo', pActive: 'Promos activas', pNone: 'Todavía no hay promos activas.', pStop: 'Pausar',
    pLock: 'Las promociones son parte del plan Pro (USD 25/mes).', mapNote: 'visible en el mapa',
    sTitle: 'Servicios publicados', sNone: 'Todavía no cargaste servicios.', sEdit: 'Editar servicios', min: 'min',
    needAccount: 'Ingresá con tu cuenta de comercio para ver el panel.', go: 'Ingresar',
  },
  en: {
    title: 'Business dashboard', demo: 'Sample data for the demo', edit: 'Edit details', plan: 'Plan',
    tabs: { sum: 'Overview', agenda: 'Schedule', clients: 'Clients', income: 'Revenue', promos: 'Promos', services: 'Services' },
    k1: 'Bookings today', k2: 'Revenue this week', k3: 'Occupancy', k4: 'Rating', vsPrev: 'vs. previous week', reviews: 'reviews',
    next: 'Upcoming appointments', tip: 'Suggestion', tipT: 'Tuesday 10 to 12 am has low demand.', tipB: 'Create flash promo',
    confirmed: 'Confirmed', paid: 'Paid', pending: 'Pending', canceled: 'Canceled', confirm: 'Confirm', cancel: 'Cancel',
    today: 'Today', tomorrow: 'Tomorrow', with: 'with',
    search: 'Search client…', visits: 'visits', last: 'Last visit', suggest: 'Suggest booking', sent: 'Sent ✓', back: 'Good time to come back',
    week: 'Revenue by day', heat: 'Activity by time', low: 'Low demand', high: 'High demand', total: 'Week total',
    d: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    pTitle: 'Flash promotions', pHint: 'Fill slow hours. They show on the map with a countdown.', pSvc: 'Service', pOff: 'Discount', pWhen: 'Time', pCreate: 'Publish promo', pActive: 'Active promos', pNone: 'No active promos yet.', pStop: 'Pause',
    pLock: 'Promotions are part of the Pro plan (USD 25/month).', mapNote: 'visible on the map',
    sTitle: 'Published services', sNone: 'You haven’t added services yet.', sEdit: 'Edit services', min: 'min',
    needAccount: 'Log in with your business account to see the dashboard.', go: 'Log in',
  },
};
L.pt = L.es;

const APPTS = [
  { id: 1, time: '09:30', client: 'Martina R.', svc: 'Color completo', pro: 'Cami', usd: 55, st: 'paid' },
  { id: 2, time: '11:00', client: 'Lucas P.', svc: 'Corte y lavado', pro: 'Leo', usd: 18, st: 'paid' },
  { id: 3, time: '12:30', client: 'Sam G.', svc: 'Manicura', pro: 'Valen', usd: 20, st: 'pending' },
  { id: 4, time: '15:00', client: 'Ana L.', svc: 'Corte + barba', pro: 'Leo', usd: 24, st: 'paid' },
  { id: 5, time: '16:30', client: 'Diego R.', svc: 'Corte y lavado', pro: 'Cami', usd: 18, st: 'pending' },
  { id: 6, time: '18:00', client: 'Sofía M.', svc: 'Tratamiento facial', pro: 'Valen', usd: 42, st: 'paid' },
];
const CLIENTS = [
  { n: 'Martina R.', v: 9, last: { es: 'hace 6 semanas', en: '6 weeks ago' }, svc: 'Color', due: true },
  { n: 'Lucas P.', v: 4, last: { es: 'hace 2 semanas', en: '2 weeks ago' }, svc: 'Corte' },
  { n: 'Sam G.', v: 1, last: { es: 'ayer', en: 'yesterday' }, svc: 'Manicura' },
  { n: 'Ana L.', v: 6, last: { es: 'hace 3 semanas', en: '3 weeks ago' }, svc: 'Corte + barba' },
  { n: 'Diego R.', v: 3, last: { es: 'hace 5 semanas', en: '5 weeks ago' }, svc: 'Corte', due: true },
  { n: 'Sofía M.', v: 12, last: { es: 'hace 1 semana', en: '1 week ago' }, svc: 'Facial' },
];
const WEEK = [180, 210, 160, 240, 310, 420, 140];
const HOURS = ['9', '11', '13', '15', '17', '19'];
const HEAT = [
  [0.5, 0.2, 0.7, 0.8, 0.9, 1, 0.3],
  [0.3, 0.1, 0.6, 0.7, 0.8, 1, 0.2],
  [0.7, 0.6, 0.8, 0.9, 0.9, 1, 0.1],
  [0.8, 0.7, 0.8, 0.9, 1, 0.9, 0.1],
  [0.9, 0.8, 0.9, 1, 1, 0.8, 0],
  [0.6, 0.5, 0.7, 0.8, 0.9, 0.5, 0],
];

export default function MerchantPanel() {
  const { lang, user, openAuth, fmt } = useApp();
  const T = L[lang] || L.es;
  const lg = lang === 'en' ? 'en' : 'es';
  const [tab, setTab] = useState('sum');
  const [shop, setShop] = useState(null);
  const [appts, setAppts] = useState(APPTS);
  const [sent, setSent] = useState({});
  const [qc, setQc] = useState('');
  const [promos, setPromos] = useState([]);
  const [pf, setPf] = useState({ svc: 0, off: 20, when: 'Mar 10:00–12:00' });

  useEffect(() => {
    try { setShop(JSON.parse(localStorage.getItem('gl-merchant') || 'null')); } catch { setShop(null); }
  }, []);

  const services = useMemo(() => (shop?.services || []).filter((s) => s.name), [shop]);
  const pro = (shop?.plan || 'pro') === 'pro';
  const maxW = Math.max(...WEEK);
  const total = WEEK.reduce((a, b) => a + b, 0);

  if (!user || user.role !== 'merchant') {
    return (
      <div className="panel empty">
        <Icon n="comercio" size={40} />
        <h1>{T.title}</h1>
        <p className="mut">{T.needAccount}</p>
        <button type="button" className="cta" onClick={() => openAuth({ choose: true })}>{T.go}</button>
      </div>
    );
  }

  const setSt = (id, st) => setAppts((x) => x.map((a) => (a.id === id ? { ...a, st } : a)));
  const stLabel = (st) => T[st === 'paid' ? 'paid' : st === 'pending' ? 'pending' : st === 'confirmed' ? 'confirmed' : 'canceled'];
  const addPromo = () => {
    const name = services[pf.svc]?.name || 'Corte y lavado';
    setPromos((x) => [{ id: Date.now(), name, off: pf.off, when: pf.when }, ...x]);
  };

  return (
    <div className="panel mp">
      <div className="mp__head">
        <div>
          <h1>{shop?.name || T.title}</h1>
          <p className="mut">{T.title} · <span className="chipx">{T.plan} {pro ? 'Pro' : 'Básico'}</span></p>
        </div>
        <Link href="/comercio/" className="ghost mp__edit">{T.edit}</Link>
      </div>
      <p className="mut mp__demo">{T.demo}</p>

      <div className="chips mp__tabs" role="tablist">
        {TABS.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{T.tabs[k]}</button>
        ))}
      </div>

      {tab === 'sum' && (
        <>
          <div className="mp__kpis">
            <div className="kpi"><small>{T.k1}</small><b>6</b></div>
            <div className="kpi"><small>{T.k2}</small><b>{fmt(total)}</b><em>▲ 18% {T.vsPrev}</em></div>
            <div className="kpi"><small>{T.k3}</small><b>72%</b></div>
            <div className="kpi"><small>{T.k4}</small><b>★ 4.9</b><em>312 {T.reviews}</em></div>
          </div>
          <div className="mp__tip">
            <div><small>{T.tip}</small><p>{T.tipT}</p></div>
            <button type="button" className="cta" onClick={() => setTab('promos')}>{T.tipB}</button>
          </div>
          <h2>{T.next}</h2>
          <ul className="panel__cards">
            {appts.filter((a) => a.st !== 'canceled').slice(0, 3).map((a) => (
              <li key={a.id} className="panel__card rowish"><span><b>{a.time}</b> · {a.client}<br /><small className="mut">{a.svc} {T.with} {a.pro}</small></span><span className={`st st--${a.st}`}>{stLabel(a.st)}</span></li>
            ))}
          </ul>
        </>
      )}

      {tab === 'agenda' && (
        <>
          <h2>{T.today}</h2>
          <ul className="panel__cards">
            {appts.map((a) => (
              <li key={a.id} className={`panel__card mp__appt ${a.st === 'canceled' ? 'off' : ''}`}>
                <div className="row"><b>{a.time} · {a.client}</b><span className={`st st--${a.st}`}>{stLabel(a.st)}</span></div>
                <small className="mut">{a.svc} {T.with} {a.pro} · {fmt(a.usd)}</small>
                {a.st === 'pending' && (
                  <div className="mp__act">
                    <button type="button" className="cta" onClick={() => setSt(a.id, 'confirmed')}>{T.confirm}</button>
                    <button type="button" className="ghost" onClick={() => setSt(a.id, 'canceled')}>{T.cancel}</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'clients' && (
        <>
          <input className="mi" type="search" placeholder={T.search} value={qc} onChange={(e) => setQc(e.target.value)} />
          <ul className="panel__cards">
            {CLIENTS.filter((c) => c.n.toLowerCase().includes(qc.toLowerCase())).map((c) => (
              <li key={c.n} className="panel__card rowish">
                <span className="mp__av">{c.n[0]}</span>
                <span className="grow"><b>{c.n}</b><br /><small className="mut">{c.svc} · {c.v} {T.visits} · {T.last}: {c.last[lg]}</small>{c.due && <><br /><small className="due">{T.back}</small></>}</span>
                <button type="button" className={sent[c.n] ? 'ghost' : 'cta'} disabled={!!sent[c.n]} onClick={() => setSent((x) => ({ ...x, [c.n]: true }))}>{sent[c.n] ? T.sent : T.suggest}</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'income' && (
        <>
          <h2>{T.week} · {fmt(total)}</h2>
          <div className="mp__bars" role="img" aria-label={T.week}>
            {WEEK.map((v, i) => (
              <div key={i} className="mbar"><i style={{ height: `${Math.round((v / maxW) * 100)}%` }} /><small>{T.d[i]}</small></div>
            ))}
          </div>
          <h2>{T.heat}</h2>
          <div className="mp__heat">
            <div className="hrow hh"><span />{T.d.map((d, i) => <small key={i}>{d}</small>)}</div>
            {HEAT.map((row, r) => (
              <div key={r} className="hrow">
                <small>{HOURS[r]}h</small>
                {row.map((v, i) => <i key={i} style={{ opacity: 0.12 + v * 0.88 }} title={`${Math.round(v * 100)}%`} />)}
              </div>
            ))}
          </div>
          <p className="mut"><span className="dot dot--lo" /> {T.low} · <span className="dot dot--hi" /> {T.high}</p>
        </>
      )}

      {tab === 'promos' && (
        <>
          <h2>{T.pTitle}</h2>
          <p className="mut">{T.pHint}</p>
          <div className="mform">
            <label className="fr">{T.pSvc}
              <select className="mi" value={pf.svc} onChange={(e) => setPf({ ...pf, svc: Number(e.target.value) })}>
                {(services.length ? services : [{ name: 'Corte y lavado' }]).map((s, i) => <option key={i} value={i}>{s.name}</option>)}
              </select>
            </label>
            <div className="two2">
              <label className="fr">{T.pOff}: {pf.off}%<input type="range" min="10" max="50" step="5" value={pf.off} onChange={(e) => setPf({ ...pf, off: Number(e.target.value) })} /></label>
              <label className="fr">{T.pWhen}
                <select className="mi" value={pf.when} onChange={(e) => setPf({ ...pf, when: e.target.value })}>
                  {['Mar 10:00–12:00', 'Mié 11:00–13:00', 'Jue 15:00–17:00', 'Hoy 15:00–17:00'].map((w) => <option key={w}>{w}</option>)}
                </select>
              </label>
            </div>
            <button type="button" className="cta" onClick={addPromo}>{T.pCreate}</button>
          </div>
          <h2>{T.pActive}</h2>
          {promos.length === 0 ? <p className="mut">{T.pNone}</p> : (
            <ul className="panel__cards">
              {promos.map((p) => (
                <li key={p.id} className="panel__card rowish"><span><b>−{p.off}% · {p.name}</b><br /><small className="mut">{p.when} · {T.mapNote}</small></span>
                  <button type="button" className="ghost" onClick={() => setPromos((x) => x.filter((y) => y.id !== p.id))}>{T.pStop}</button></li>
              ))}
            </ul>
          )}
        </>
      )}

      {tab === 'services' && (
        <>
          <h2>{T.sTitle}</h2>
          {services.length === 0 ? <p className="mut">{T.sNone}</p> : (
            <ul className="panel__cards">
              {services.map((s) => (
                <li key={s.id} className="panel__card rowish"><span><b>{s.name}</b><br /><small className="mut">{s.min} {T.min}{s.desc ? ` · ${s.desc}` : ''}</small></span><b>{fmt(Number(s.price) || 0)}</b></li>
              ))}
            </ul>
          )}
          <Link href="/comercio/" className="ghost mp__edit">{T.sEdit}</Link>
        </>
      )}
    </div>
  );
}
