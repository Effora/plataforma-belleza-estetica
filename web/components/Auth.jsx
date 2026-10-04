'use client';
import { useState } from 'react';
import { useApp, Icon } from './Shell';

export default function Auth({ onClose, reason }) {
  const { tr, setUser } = useApp();
  const [mode, setMode] = useState('landing'); // landing | email | signup
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const finish = (user) => {
    setUser(user);
    onClose();
  };

  const withGoogle = () => {
    finish({
      name: 'Demo Google',
      email: 'demo@glowlys.app',
      provider: 'google',
    });
  };

  const submitEmail = (e) => {
    e.preventDefault();
    if (!email.includes('@') || pass.length < 4) {
      setErr(tr.authError);
      return;
    }
    finish({
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      provider: 'email',
    });
  };

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="sheet auth-sheet">
        <button type="button" className="x" onClick={onClose} aria-label={tr.close}><Icon n="cerrar" /></button>
        <div className="auth-brand">
          <img src="/logo.png" alt="" width="48" height="48" />
          <h2 id="auth-title">{mode === 'signup' ? tr.createAccount : tr.loginTitle}</h2>
          <p className="mut">{reason || tr.loginSub}</p>
        </div>

        {mode === 'landing' && (
          <div className="auth-actions">
            <button type="button" className="cta google" onClick={withGoogle}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7 12.9 19.6C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l.1.1 6.2 5.2C39 37.3 44 33 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
              {tr.continueGoogle}
            </button>
            <button type="button" className="ghost auth-email" onClick={() => { setMode('email'); setErr(''); }}>
              {tr.continueEmail}
            </button>
            <p className="auth-switch">
              {tr.noAccount}{' '}
              <button type="button" onClick={() => { setMode('signup'); setErr(''); }}>{tr.createAccount}</button>
            </p>
          </div>
        )}

        {(mode === 'email' || mode === 'signup') && (
          <form className="auth-form" onSubmit={submitEmail}>
            {mode === 'signup' && (
              <label className="fr">{tr.name}
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </label>
            )}
            <label className="fr">{tr.email}
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </label>
            <label className="fr">{tr.password}
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={4} />
            </label>
            {err && <p className="auth-err">{err}</p>}
            <button type="submit" className="cta">{mode === 'signup' ? tr.createAccount : tr.loginBtn}</button>
            <button type="button" className="ghost" onClick={() => { setMode('landing'); setErr(''); }}>{tr.back}</button>
          </form>
        )}
      </div>
    </div>
  );
}
