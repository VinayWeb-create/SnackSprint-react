// client/src/suby/components/AuthModal.jsx
import React, { useState } from 'react';
import { API_URL } from '../api';
import { useApp } from '../AppContext';

const AuthModal = () => {
  const { setShowAuth, login, addToast } = useApp();
  const [tab,      setTab]      = useState('login');
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  // Login fields
  const [lemail,    setLemail]    = useState('');
  const [lpassword, setLpassword] = useState('');
  const [showLpw,   setShowLpw]   = useState(false);

  // Register fields
  const [rname,     setRname]     = useState('');
  const [remail,    setRemail]    = useState('');
  const [rpassword, setRpassword] = useState('');
  const [showRpw,   setShowRpw]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!lemail.trim())    errs.lemail    = 'Email required';
    if (!lpassword)        errs.lpassword = 'Password required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/vendor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lemail, password: lpassword }),
      });
      const data = await res.json();
      if (res.ok) {
        login({ _id: data.vendorId, username: data.vendor?.username || lemail.split('@')[0], email: lemail }, data.token);
        addToast(`Welcome back! 🎉`, 'success');
        setShowAuth(false);
      } else {
        addToast(data.error || 'Invalid email or password', 'error');
      }
    } catch { addToast('Network error, try again', 'error'); }
    finally  { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!rname.trim())                              errs.rname     = 'Name required';
    if (!remail.trim())                             errs.remail    = 'Email required';
    if (rpassword.length < 6)                       errs.rpassword = 'Min 6 characters';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/vendor/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: rname, email: remail, password: rpassword }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Registered! Please log in.', 'success');
        setTab('login'); setLemail(remail);
      } else {
        addToast(data.error || 'Registration failed', 'error');
      }
    } catch { addToast('Network error, try again', 'error'); }
    finally  { setLoading(false); }
  };

  const inp = (err) => ({
    className: 'form-input',
    style: err ? { borderColor: 'var(--red)' } : {},
  });

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAuth(false)}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={() => setShowAuth(false)}>✕</button>

        <div className="auth-logo">🍛 SnackSprint</div>
        <div className="auth-subtitle">
          {tab === 'login' ? 'Welcome back! Sign in to order food.' : 'Create account to start ordering.'}
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setErrors({}); }}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setErrors({}); }}>
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input {...inp(errors.lemail)} type="email" placeholder="you@example.com"
                value={lemail} onChange={e => { setLemail(e.target.value); setErrors(p => ({ ...p, lemail: '' })); }} />
              {errors.lemail && <span className="form-error">{errors.lemail}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input {...inp(errors.lpassword)} type={showLpw ? 'text' : 'password'}
                  placeholder="••••••••" value={lpassword}
                  onChange={e => { setLpassword(e.target.value); setErrors(p => ({ ...p, lpassword: '' })); }}
                  style={{ ...(errors.lpassword ? { borderColor: 'var(--red)' } : {}), paddingRight: 52, width: '100%' }}
                  className="form-input"
                />
                <button type="button" onClick={() => setShowLpw(!showLpw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  {showLpw ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.lpassword && <span className="form-error">{errors.lpassword}</span>}
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>
              No account?{' '}
              <span onClick={() => setTab('register')}
                style={{ color: 'var(--saffron)', fontWeight: 700, cursor: 'pointer' }}>
                Register free
              </span>
            </p>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input {...inp(errors.rname)} type="text" placeholder="John Doe"
                value={rname} onChange={e => { setRname(e.target.value); setErrors(p => ({ ...p, rname: '' })); }} />
              {errors.rname && <span className="form-error">{errors.rname}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input {...inp(errors.remail)} type="email" placeholder="you@example.com"
                value={remail} onChange={e => { setRemail(e.target.value); setErrors(p => ({ ...p, remail: '' })); }} />
              {errors.remail && <span className="form-error">{errors.remail}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showRpw ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={rpassword} onChange={e => { setRpassword(e.target.value); setErrors(p => ({ ...p, rpassword: '' })); }}
                  className="form-input"
                  style={{ ...(errors.rpassword ? { borderColor: 'var(--red)' } : {}), paddingRight: 52, width: '100%' }}
                />
                <button type="button" onClick={() => setShowRpw(!showRpw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  {showRpw ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.rpassword && <span className="form-error">{errors.rpassword}</span>}
              {/* Password strength bar */}
              {rpassword && (
                <div style={{ display: 'flex', gap: 3, marginTop: 5 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 99,
                      background: rpassword.length >= i * 2
                        ? (rpassword.length >= 8 ? 'var(--green)' : 'var(--gold)')
                        : 'var(--border)',
                      transition: '0.3s',
                    }} />
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>
              Have account?{' '}
              <span onClick={() => setTab('login')}
                style={{ color: 'var(--saffron)', fontWeight: 700, cursor: 'pointer' }}>
                Sign in
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
