import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const bg = isDark
    ? scrolled ? 'rgba(7,11,20,0.97)' : 'transparent'
    : scrolled ? 'rgba(255,255,255,0.97)' : 'transparent';

  const border = scrolled
    ? isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)'
    : '1px solid transparent';

  const textColor = isDark ? '#F0EDE6' : '#0a0a0a';
  const mutedColor = isDark ? 'rgba(240,237,230,0.4)' : 'rgba(10,10,10,0.45)';

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:200,
      height:60,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 3rem',
      background: bg,
      borderBottom: border,
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      transition:'all 0.5s ease',
    }}>
      <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'0.6rem' }}>
        <span style={{ fontSize:18 }}>🏔</span>
        <span style={{ fontFamily:"'Cormorant Garant',serif", fontSize:'1.05rem', color:textColor, letterSpacing:'0.04em', transition:'color 0.3s' }}>
          Himalayan
        </span>
      </Link>

      <div style={{ display:'flex', alignItems:'center', gap:'2.5rem' }}>
        {[['/', 'Home'], ['/about', 'About'], ...(user ? [['/dashboard','Dashboard']] : [])].map(([to, label]) => (
          <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
            fontSize:'0.78rem', letterSpacing:'0.06em', textTransform:'uppercase',
            color: isActive ? textColor : mutedColor,
            textDecoration:'none', transition:'color 0.2s',
            fontFamily:"'DM Mono',monospace",
          })}>{label}</NavLink>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width:34, height:34, borderRadius:2,
            display:'flex', alignItems:'center', justifyContent:'center',
            background:'transparent',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            cursor:'pointer', fontSize:14,
            transition:'all 0.2s',
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <span style={{ fontSize:'0.72rem', color:mutedColor, fontFamily:"'DM Mono',monospace", letterSpacing:'0.05em' }}>
              {user.name?.split(' ')[0]}
            </span>
            <button onClick={() => { logout(); navigate('/'); }} style={{
              padding:'0.35rem 1rem', fontSize:'0.72rem',
              background:'transparent',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.15)',
              color: mutedColor, cursor:'pointer', borderRadius:2,
              fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize:'0.78rem', color:mutedColor, textDecoration:'none', letterSpacing:'0.04em', transition:'color 0.2s' }}>
              Sign in
            </Link>
            <Link to="/register" style={{
              padding:'0.35rem 1.2rem', fontSize:'0.68rem',
              background:'transparent',
              border: isDark ? '1px solid rgba(201,169,110,0.6)' : '1px solid rgba(0,0,0,0.4)',
              color: isDark ? '#C9A96E' : '#0a0a0a',
              textDecoration:'none', letterSpacing:'0.15em', textTransform:'uppercase',
              fontFamily:"'DM Mono',monospace", borderRadius:2, transition:'all 0.2s',
            }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
