import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh', background:'#070B14',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'6rem 1.5rem 3rem',
    }}>
      {/* Background glow */}
      <div style={{ position:'fixed', top:'30%', left:'50%', transform:'translateX(-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(75,159,213,0.05) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:400, position:'relative', zIndex:1 }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <Link to="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.5rem', marginBottom:'2.5rem' }}>
            <span>🏔</span>
            <span style={{ fontFamily:"'Cormorant Garant',serif", fontSize:'1rem', color:'rgba(240,237,230,0.5)', letterSpacing:'0.04em' }}>Himalayan</span>
          </Link>
          <h1 className="display" style={{ fontSize:'2.2rem', color:'#F0EDE6', marginBottom:'0.75rem' }}>Welcome back</h1>
          <p style={{ color:'rgba(240,237,230,0.35)', fontSize:'0.85rem' }}>Sign in to your account to continue</p>
        </div>

        {/* Form card */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', padding:'2.5rem', borderRadius:2 }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', color:'#fca5a5', fontSize:'0.82rem', padding:'0.75rem 1rem', marginBottom:'1.5rem', borderRadius:2 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
            <div>
              <label style={{ display:'block', fontSize:'0.7rem', fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(240,237,230,0.35)', marginBottom:'0.5rem' }}>Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'0.7rem', fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(240,237,230,0.35)', marginBottom:'0.5rem' }}>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:'0.5rem', justifyContent:'center' }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:'1rem', margin:'1.5rem 0' }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }}/>
            <span style={{ fontSize:'0.7rem', color:'rgba(240,237,230,0.25)', fontFamily:"'DM Mono',monospace" }}>or</span>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }}/>
          </div>

          <a href={`${API}/auth/google`} style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem',
            padding:'0.8rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
            color:'#F0EDE6', textDecoration:'none', fontSize:'0.85rem', borderRadius:2,
            transition:'all 0.2s',
          }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </a>
        </div>

        <p style={{ textAlign:'center', marginTop:'2rem', fontSize:'0.82rem', color:'rgba(240,237,230,0.3)' }}>
          No account?{' '}
          <Link to="/register" style={{ color:'#4B9FD5', textDecoration:'none' }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
