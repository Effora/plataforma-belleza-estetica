'use client';
import { useState } from 'react';
import { useApp, Icon } from './Shell';

export default function Booking({ s, onClose }) {
  const { tr, fmt, lang, user, setUser, addBooking } = useApp();
  const [step, setStep] = useState(1);
  const [sv, setSv] = useState(0);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState('');
  const svc = s.services[sv];
  const days = [0, 1, 2, 3, 4].map((n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toLocaleDateString(lang, { weekday: 'short', day: 'numeric' });
  });

  const finish = () => {
    addBooking({
      id: `${s.id}-${Date.now()}`,
      salon: s.name,
      service: svc[0],
      when: `${days[day]} ${time}`,
      price: svc[2],
    });
    setStep('done');
  };

  const confirm = () => (user ? finish() : setStep('login'));

  return (
    <div className="gate" role="dialog" aria-modal="true">
      <div className="sheet">
        <button type="button" className="x" onClick={onClose} aria-label={tr.close}><Icon n="cerrar" /></button>
        {typeof step === 'number' && <p className="mut">{step}/3 · {tr[`s${step}`]}</p>}
        {step === 1 && s.services.map(([n, m, p], k) => (
          <button key={n} type="button" className={`opt ${sv === k ? 'on' : ''}`} onClick={() => setSv(k)}>
            <span>{n}<small>{m} min</small></span><b>{fmt(p)}</b>
          </button>
        ))}
        {step === 2 && (
          <>
            <div className="chips">
              {days.map((d, k) => (
                <button key={d} type="button" className={day === k ? 'on' : ''} onClick={() => setDay(k)}>{d}</button>
              ))}
            </div>
            <div className="chips">
              {['10:00', '11:30', '14:00', '16:30'].map((h) => (
                <button key={h} type="button" className={time === h ? 'on' : ''} onClick={() => setTime(h)}>{h}</button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <div>
            <h3>{s.name}</h3>
            <p>{svc[0]} · {days[day]} · {time}</p>
            <p className="pts"><Icon n="puntos" size={18} />{tr.points}</p>
            <p><b>{tr.total}: {fmt(svc[2])}</b></p>
          </div>
        )}
        {step === 'login' && (
          <div className="c">
            <Icon n="turnos" fill size={36} />
            <h2>{tr.gateT}</h2>
            <p>{tr.gateP}</p>
            <button type="button" className="cta" onClick={() => { setUser(true); finish(); }}>{tr.gateB}</button>
          </div>
        )}
        {step === 'done' && (
          <div className="c">
            <Icon n="check" size={40} />
            <h2>{tr.done}</h2>
            <p>{s.name} · {svc[0]} · {days[day]} {time}</p>
            <p>{tr.doneP}</p>
            <button type="button" className="cta" onClick={onClose}>{tr.close}</button>
          </div>
        )}
        {step === 1 && <button type="button" className="cta" onClick={() => setStep(2)}>{tr.next}</button>}
        {step === 2 && <button type="button" className="cta" disabled={!time} onClick={() => setStep(3)}>{tr.next}</button>}
        {step === 3 && <button type="button" className="cta" onClick={confirm}>{tr.confirm}</button>}
      </div>
    </div>
  );
}
