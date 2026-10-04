'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cats } from '../lib/data';
import { PLANS, DAYS, PAYS, tm } from '../lib/merchantT';
import { useApp, Icon } from './Shell';

const hours0 = () => Object.fromEntries(DAYS.map((d) => [d, { open: d !== 'sun', from: '09:00', to: '19:00' }]));
const M0 = {
  name: '', cats: [], desc: '', address: '', city: '', country: 'CO', ll: null,
  hours: hours0(), pay: { card: true, pse: true, nequi: true },
  services: [{ id: 's1', name: '', min: 45, price: '', desc: '' }],
  account: false, plan: 'pro', published: false,
};

export default function Merchant() {
  const { lang, tr, fmt, user, openAuth } = useApp();
  const T = tm[lang] || tm.es;
  const [m, setM] = useState(M0);
  const [step, setStep] = useState(0);
  const [err, setErr] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [svcFiles, setSvcFiles] = useState({});
  const [ready, setReady] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gl-merchant') || 'null');
      if (saved) setM({ ...M0, ...saved });
    } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem('gl-merchant', JSON.stringify(m)); } catch { /* ignore */ }
  }, [m, ready]);

  const set = (patch) => setM((x) => ({ ...x, ...patch }));
  const go = (n) => { setErr(''); setStep(n); topRef.current?.scrollIntoView({ block: 'start' }); window.scrollTo(0, 0); };
  const addFiles = (setter, files, max) => {
    const added = Array.from(files).map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setter((cur) => [...cur, ...added].slice(0, max));
  };
  const svcOk = m.services.some((s) => s.name.trim() && Number(s.price) > 0);

  const validate = (n) => {
    if (n === 0 && !(m.name.trim() && m.cats.length && m.address.trim() && m.city.trim())) return T.required;
    if (n === 3 && !svcOk) return T.svcNeed;
    if (n === 4 && !m.account) return T.accNeed;
    return '';
  };
  const next = () => { const e = validate(step); if (e) { setErr(e); return; } go(step + 1); };

  const locate = () => navigator.geolocation?.getCurrentPosition(
    (p) => set({ ll: [p.coords.latitude, p.coords.longitude] }),
    () => {},
    { timeout: 5000 },
  );

  const minPrice = useMemo(() => {
    const p = m.services.map((s) => Number(s.price)).filter((n) => n > 0);
    return p.length ? Math.min(...p) : 0;
  }, [m.services]);

  if (!user || user.role !== 'merchant') {
    return (
      <div className="panel empty">
        <Icon n="comercio" size={40} />
        <h1>{T.title}</h1>
        <p className="mut">{T.needAccount}</p>
        <button type="button" className="cta" onClick={() => openAuth({ choose: true })}>{T.createAcc}</button>
      </div>
    );
  }

  const Preview = (
    <div className="mpreview">
      <div className="mpreview__ph">
        {photos[0] ? <img src={photos[0].url} alt="" /> : <Icon n="comercio" size={40} />}
        {m.plan === 'pro' && <span className="tag">Pro</span>}
      </div>
      <div className="row"><b>{m.name || '—'}</b><span>★ 5.0</span></div>
      <p className="mut">{m.city}{m.city && m.address ? ' · ' : ''}{m.address}</p>
      {minPrice > 0 && <p>{T.from2} <b>{fmt(minPrice)}</b></p>}
    </div>
  );

  if (m.published && step === 7) {
    return (
      <div className="panel mwiz" ref={topRef}>
        <div className="c">
          <Icon n="check" size={44} />
          <h1>{T.done}</h1>
          <p className="mut">{T.doneP}</p>
        </div>
        {Preview}
        <p className="mut">{T.photosN}: {photos.length} · {T.videosN}: {videos.length} · {T.servicesN}: {m.services.filter((s) => s.name).length}</p>
        <button type="button" className="ghost" onClick={() => go(0)}>{T.edit}</button>
        <small>{T.onlyDemo}</small>
      </div>
    );
  }

  return (
    <div className="panel mwiz" ref={topRef}>
      <h1>{T.title}</h1>
      <p className="mut">{T.sub}</p>
      <div className="mprog" role="progressbar" aria-valuemin={1} aria-valuemax={7} aria-valuenow={step + 1}>
        {T.steps.map((s, i) => <i key={s} className={i <= step ? 'on' : ''} />)}
      </div>
      <p className="mut">{T.step} {step + 1} {T.of} 7 · <b>{T.steps[step]}</b></p>

      {step === 0 && (
        <div className="mform">
          <label className="fr">{T.name}<input className="mi" value={m.name} onChange={(e) => set({ name: e.target.value })} /></label>
          <div className="fr">{T.cats}
            <div className="chips">
              {cats.map((c) => (
                <button key={c} type="button" className={m.cats.includes(c) ? 'on' : ''} onClick={() => set({ cats: m.cats.includes(c) ? m.cats.filter((x) => x !== c) : [...m.cats, c] })}>{T[c]}</button>
              ))}
            </div>
          </div>
          <label className="fr">{T.desc}<textarea className="mi" rows={3} placeholder={T.descPh} value={m.desc} onChange={(e) => set({ desc: e.target.value })} /></label>
          <label className="fr">{T.address}<input className="mi" value={m.address} onChange={(e) => set({ address: e.target.value })} autoComplete="street-address" /></label>
          <div className="two2">
            <label className="fr">{T.city}<input className="mi" value={m.city} onChange={(e) => set({ city: e.target.value })} /></label>
            <label className="fr">{T.country}
              <select className="mi" value={m.country} onChange={(e) => set({ country: e.target.value })}>
                {[['CO', 'Colombia'], ['AR', 'Argentina'], ['MX', 'México'], ['BR', 'Brasil'], ['CL', 'Chile'], ['PE', 'Perú'], ['US', 'United States'], ['ES', 'España']].map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>
          <button type="button" className="ghost geo" onClick={locate}><Icon n="mapa" size={16} />{m.ll ? T.locOk : T.useLoc}</button>
        </div>
      )}

      {step === 1 && (
        <ul className="mhours">
          {DAYS.map((d) => {
            const h = m.hours[d];
            const upd = (p) => set({ hours: { ...m.hours, [d]: { ...h, ...p } } });
            return (
              <li key={d}>
                <label className="chk"><input type="checkbox" checked={h.open} onChange={(e) => upd({ open: e.target.checked })} /><b>{T.days[d]}</b></label>
                {h.open ? (
                  <span className="mh">
                    <input type="time" className="mi" aria-label={T.from} value={h.from} onChange={(e) => upd({ from: e.target.value })} />
                    <span>–</span>
                    <input type="time" className="mi" aria-label={T.to} value={h.to} onChange={(e) => upd({ to: e.target.value })} />
                  </span>
                ) : <span className="mut">{T.closed}</span>}
              </li>
            );
          })}
        </ul>
      )}

      {step === 2 && (
        <div className="mform">
          {[[T.photos, T.addPhotos, 'image/*', photos, setPhotos, 12], [T.videos, T.addVideos, 'video/*', videos, setVideos, 4]].map(([title, btn, acc, list, setter, max]) => (
            <div key={title} className="fr">
              <b>{title}</b>
              <div className="mgrid">
                {list.map((f, i) => (
                  <div key={f.url} className="mthumb">
                    {acc === 'image/*' ? <img src={f.url} alt="" /> : <video src={f.url} muted playsInline />}
                    <button type="button" aria-label={T.remove} onClick={() => setter(list.filter((_, k) => k !== i))}><Icon n="cerrar" size={14} /></button>
                  </div>
                ))}
                {list.length < max && (
                  <label className="madd">
                    <Icon n="compartir" size={22} /><span>{btn}</span>
                    <input type="file" accept={acc} multiple hidden onChange={(e) => { addFiles(setter, e.target.files, max); e.target.value = ''; }} />
                  </label>
                )}
              </div>
            </div>
          ))}
          <small>{T.mediaHint}</small>
        </div>
      )}

      {step === 3 && (
        <div className="mform">
          <p className="mut">{T.svcHint}</p>
          {m.services.map((s, i) => {
            const upd = (p) => set({ services: m.services.map((x) => (x.id === s.id ? { ...x, ...p } : x)) });
            const f = svcFiles[s.id];
            return (
              <div key={s.id} className="msvc">
                <div className="row"><b>{T.svcTitle} {i + 1}</b>
                  {m.services.length > 1 && <button type="button" className="fav-btn" aria-label={T.remove} onClick={() => set({ services: m.services.filter((x) => x.id !== s.id) })}><Icon n="cerrar" size={18} /></button>}
                </div>
                <label className="fr">{T.svcName}<input className="mi" value={s.name} onChange={(e) => upd({ name: e.target.value })} /></label>
                <div className="two2">
                  <label className="fr">{T.svcMin}<input className="mi" type="number" min="5" step="5" value={s.min} onChange={(e) => upd({ min: e.target.value })} /></label>
                  <label className="fr">{T.svcPrice}<input className="mi" type="number" min="0" step="1" value={s.price} onChange={(e) => upd({ price: e.target.value })} /></label>
                </div>
                <label className="fr">{T.svcDesc}<textarea className="mi" rows={2} value={s.desc} onChange={(e) => upd({ desc: e.target.value })} /></label>
                <div className="fr">{T.svcMedia}
                  {f ? (
                    <div className="mthumb mthumb--s">
                      {f.type.startsWith('video') ? <video src={f.url} muted playsInline /> : <img src={f.url} alt="" />}
                      <button type="button" aria-label={T.remove} onClick={() => setSvcFiles((x) => { const n = { ...x }; delete n[s.id]; return n; })}><Icon n="cerrar" size={14} /></button>
                    </div>
                  ) : (
                    <label className="madd madd--s"><Icon n="compartir" size={20} /><span>{T.addPhotos}</span>
                      <input type="file" accept="image/*,video/*" hidden onChange={(e) => { const file = e.target.files[0]; if (file) setSvcFiles((x) => ({ ...x, [s.id]: { url: URL.createObjectURL(file), type: file.type } })); e.target.value = ''; }} />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
          <button type="button" className="ghost geo" onClick={() => set({ services: [...m.services, { id: `s${Date.now()}`, name: '', min: 45, price: '', desc: '' }] })}>+ {T.addSvc}</button>
        </div>
      )}

      {step === 4 && (
        <div className="mform">
          <h2>{T.payTitle}</h2>
          <p className="mut">{T.payHint}</p>
          {PAYS.map((p) => (
            <label key={p} className="opt chk"><span>{T[p]}</span>
              <input type="checkbox" checked={!!m.pay[p]} onChange={(e) => set({ pay: { ...m.pay, [p]: e.target.checked } })} />
            </label>
          ))}
          <h2>{T.accTitle}</h2>
          <p className="mut">{T.accHint}</p>
          <button type="button" className={m.account ? 'cta mok' : 'cta'} onClick={() => set({ account: !m.account })}>
            {m.account ? <><Icon n="check" size={18} /> {T.accOk}</> : T.accBtn}
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="mform">
          <p className="mut">{T.planHint}</p>
          {['basic', 'pro'].map((k) => (
            <button key={k} type="button" className={`mplan ${m.plan === k ? 'on' : ''}`} onClick={() => set({ plan: k })} aria-pressed={m.plan === k}>
              <span className="row"><b>{T[k]}</b>{k === 'pro' && <em>{T.rec}</em>}</span>
              <strong>{T[`${k}P`]}</strong>
              <ul>{T[`${k}L`].map((l) => <li key={l}>{l}</li>)}</ul>
            </button>
          ))}
        </div>
      )}

      {step === 6 && (
        <div className="mform">
          <h2>{T.preview}</h2>
          {Preview}
          <h2>{T.summary}</h2>
          <ul className="msum">
            <li><b>{T.cats}:</b> {m.cats.map((c) => T[c]).join(', ')}</li>
            <li><b>{T.address}:</b> {m.address}, {m.city}</li>
            <li><b>{T.steps[2]}:</b> {T.photosN}: {photos.length} · {T.videosN}: {videos.length}</li>
            <li><b>{T.svcTitle}:</b> {m.services.filter((s) => s.name).map((s) => `${s.name} (${fmt(Number(s.price) || 0)})`).join(' · ')}</li>
            <li><b>{T.payTitle}:</b> {PAYS.filter((p) => m.pay[p]).map((p) => T[p]).join(', ') || '—'}</li>
            <li><b>{T.planTitle}:</b> {T[m.plan]} · {T[`${m.plan}P`]}</li>
          </ul>
        </div>
      )}

      {err && <p className="auth-err" role="alert">{err}</p>}
      <div className="mnav">
        {step > 0 && <button type="button" className="ghost" onClick={() => go(step - 1)}>{T.back}</button>}
        {step < 6
          ? <button type="button" className="cta" onClick={next}>{T.next}</button>
          : <button type="button" className="cta" onClick={() => { set({ published: true }); go(7); }}>{T.publish}</button>}
      </div>
      <small>{T.onlyDemo}</small>
    </div>
  );
}
