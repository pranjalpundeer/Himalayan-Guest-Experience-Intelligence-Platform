import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:200,
      height:60,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 3rem',
      background: scrolled ? 'rgba(7,11,20,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      transition:'all 0.5s ease',
    }}>
      <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'0.6rem' }}>
        <span style={{ fontSize:18 }}>🏔</span>
        <span style={{ fontFamily:"'Cormorant Garant',serif", fontSize:'1.05rem', color:'#F0EDE6', letterSpacing:'0.04em' }}>
          Himalayan
        </span>
      </Link>

      <div style={{ display:'flex', alignItems:'center', gap:'2.5rem' }}>
        {[['/', 'Home'], ['/about', 'About'], ...(user ? [['/dashboard','Dashboard']] : [])].map(([to, label]) => (
          <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
            fontSize:'0.8rem', letterSpacing:'0.06em', textTransform:'uppercase',
            color: isActive ? '#F0EDE6' : 'rgba(240,237,230,0.4)',
            textDecoration:'none', transition:'color 0.2s',
            fontFamily:"'DM Mono',monospace",
          })}>{label}</NavLink>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        {user ? (
          <>
            <span style={{ fontSize:'0.72rem', color:'rgba(240,237,230,0.35)', fontFamily:"'DM Mono',monospace", letterSpacing:'0.05em' }}>
              {user.name?.split(' ')[0]}
            </span>
            <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost" style={{ padding:'0.35rem 1rem', fontSize:'0.72rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize:'0.78rem', color:'rgba(240,237,230,0.45)', textDecoration:'none', letterSpacing:'0.04em', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='#F0EDE6'} onMouseLeave={e=>e.target.style.color='rgba(240,237,230,0.45)'}>
              Sign in
            </Link>
            <Link to="/register" className="btn-gold" style={{ padding:'0.35rem 1.2rem', fontSize:'0.68rem' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
