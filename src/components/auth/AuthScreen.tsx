// src/components/auth/AuthScreen.tsx
import { useState, useEffect } from 'react';
import { T } from '@/lib/theme';
import { PrimaryBtn } from '@/components/ui/Button';
import type { AuthScreen as AuthScreenType } from '@/types';
// 1. Import the Supabase client we created in /lib/supabase.ts
import { supabase } from '@/lib/supabase';

interface AuthScreenProps {
  authScreen: AuthScreenType;
  onSetAuth: (s: AuthScreenType) => void;
}

export function AuthScreen({ authScreen, onSetAuth }: AuthScreenProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [error, setError] = useState('');
  const [city, setCity] = useState('Detecting…');
  // 2. Add a loading state for the UI
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
            .then(r => r.json())
            .then((data: { address?: { city?: string; town?: string; county?: string } }) => {
              setCity(data.address?.city ?? data.address?.town ?? data.address?.county ?? 'Bengaluru');
            })
            .catch(() => setCity('Bengaluru'));
        },
        () => setCity('Bengaluru')
      );
    } else {
      setCity('Bengaluru');
    }
  }, []);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${T.bord}`,
    background: T.bg, color: T.txt, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: T.muted, marginBottom: 6, fontWeight: 500 };

  // 3. Real Supabase Login Logic
  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPass.trim()) { setError('Please fill in all fields.'); return; }
    
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPass,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else if (data.user) {
      onSetAuth('app');
    }
  };

  // 4. Real Supabase Registration Logic
  const handleRegister = async () => {
    if (!regName.trim() || !regEmail.trim() || !regPass.trim()) { setError('Please fill in all required fields.'); return; }
    if (regPass.length < 6) { setError('Password must be at least 6 characters.'); return; }
    
    setLoading(true);
    setError('');

    // Sign up with Supabase
    const { data, error: authError } = await supabase.auth.signUp({
      email: regEmail,
      password: regPass,
      options: {
        data: {
          full_name: regName,
          phone: regPhone,
          city: city,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      // If "Confirm Email" is OFF in Supabase, they can log in immediately
      // If "Confirm Email" is ON, they need to check their inbox
      alert("Registration successful! You can now sign in.");
      onSetAuth('login');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #f6f7f5 0%, #eef1ee 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 18px; height: 18px; border: 2px solid #ffffff33; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <polygon points="22,2 40,12 40,32 22,42 4,32 4,12" fill="none" stroke="#2e9d82" strokeWidth="2.2" strokeLinejoin="round" />
              <rect x="18" y="20" width="5" height="12" rx="1.5" fill="#1c2b1e" />
              <rect x="12" y="26" width="4" height="6" rx="1.5" fill="#2e9d82" opacity="0.6" />
              <rect x="26" y="23" width="4" height="9" rx="1.5" fill="#2e9d82" opacity="0.45" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Georgia, serif', letterSpacing: '-0.5px', lineHeight: 1.15, color: T.txt }}>
                Civic<span style={{ color: '#2e9d82' }}>Chain</span>
              </div>
              <div style={{ fontSize: 9, color: T.muted, letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: 1 }}>
                Civic Routing Platform
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: T.dim, marginTop: 4 }}>{city}</div>
        </div>

        {/* Auth Card */}
        <div style={{ background: T.surf, borderRadius: 14, border: `1px solid ${T.bord}`, padding: '32px 32px', boxShadow: '0 4px 24px #00000008' }}>
          <div style={{ display: 'flex', background: T.surfAlt, borderRadius: 8, padding: 3, marginBottom: 28, border: `1px solid ${T.bord}` }}>
            {([['login', 'Sign In'], ['register', 'Create Account']] as const).map(([id, label]) => (
              <button
                key={id}
                disabled={loading}
                onClick={() => { onSetAuth(id); setError(''); }}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: authScreen === id ? 600 : 400,
                  background: authScreen === id ? T.surf : 'transparent',
                  color: authScreen === id ? T.txt : T.muted,
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ fontSize: 12, color: T.red, marginBottom: 12, padding: '8px 12px', background: T.redLight, borderRadius: 6, border: `1px solid #f0b0a8` }}>
              {error}
            </div>
          )}

          {authScreen === 'login' && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.txt, marginBottom: 4 }}>Welcome back</div>
              <div style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Sign in to track and manage your civic complaints.</div>
              <div style={{ marginBottom: 16 }}>
                <div style={labelStyle}>Email address</div>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} disabled={loading} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={labelStyle}>Password</div>
                <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Your password" style={inputStyle} disabled={loading} />
              </div>
              <PrimaryBtn onClick={handleLogin} disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14, marginTop: 4 }}>
                {loading ? <div className="spinner" /> : 'Sign In'}
              </PrimaryBtn>
            </div>
          )}

          {authScreen === 'register' && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.txt, marginBottom: 4 }}>Create your account</div>
              <div style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Join CivicChain to file and track civic complaints in {city}.</div>
              {[
                { label: 'Full Name *', val: regName, set: setRegName, type: 'text', placeholder: 'Your full name' },
                { label: 'Email Address *', val: regEmail, set: setRegEmail, type: 'email', placeholder: 'you@example.com' },
                { label: 'Mobile Number', val: regPhone, set: setRegPhone, type: 'tel', placeholder: '10-digit number' },
                { label: 'Password *', val: regPass, set: setRegPass, type: 'password', placeholder: 'Minimum 6 characters' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 14 }}>
                  <div style={labelStyle}>{f.label}</div>
                  <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={inputStyle} disabled={loading} />
                </div>
              ))}
              <PrimaryBtn onClick={handleRegister} disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14, marginTop: 4 }}>
                {loading ? <div className="spinner" /> : 'Create Account'}
              </PrimaryBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}