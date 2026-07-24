/**
 * Navbar Component
 * Sticky top navigation with auth-aware user menu, mobile hamburger, dark mode.
 */

import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Home',      path: '/'          },
  { label: 'About',     path: '/about'     },
  { label: 'Dashboard', path: '/dashboard' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`;

  return (
    <nav className={`sticky top-0 z-50 bg-white/90 dark:bg-himalaya-stone/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700/50 transition-all duration-300 ${scrolled ? 'shadow-nav' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🏔️</span>
            <div className="leading-tight">
              <span className="font-display font-bold text-himalaya-blue dark:text-white text-base tracking-tight">Himalayan</span>
              <span className="block text-[10px] font-medium text-himalaya-sky dark:text-himalaya-mist uppercase tracking-widest -mt-0.5">Guest Intelligence</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass} end={item.path === '/'}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop right controls */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-himalaya-blue dark:text-himalaya-mist px-3 py-1 bg-himalaya-mist/60 dark:bg-himalaya-blue/20 rounded-full">
                  👤 {user?.name?.split(' ')[0] || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="nav-link text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <NavLink to="/register" className="btn-primary !py-2 !px-4 text-sm">
                  Get Started →
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-lg text-gray-500 hover:text-himalaya-blue hover:bg-himalaya-mist dark:hover:bg-himalaya-blue/20 transition-all"
              aria-label="Toggle menu" aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-himalaya-stone px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path} to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-himalaya-mist text-himalaya-blue dark:bg-himalaya-blue/30 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-himalaya-mist dark:hover:bg-himalaya-blue/20'
                }`
              }
              end={item.path === '/'} onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                Signed in as <strong>{user?.name}</strong>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-himalaya-mist"
                onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-himalaya-blue dark:text-white bg-himalaya-mist dark:bg-himalaya-blue/30"
                onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
