import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import CinematicIntro from './components/CinematicIntro';
import { useTheme } from './context/ThemeContext';

function AppInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem("intro_done") === "true"
  );

  const handleEnter = () => {
    sessionStorage.setItem("intro_done", "true");
    setIntroDone(true);
  };

  if (!introDone) return <CinematicIntro onEnter={handleEnter} />;

  return (
    <div style={{
      background: isDark ? '#070B14' : '#f5f5f0',
      color: isDark ? '#F0EDE6' : '#0a0a0a',
      minHeight:'100vh',
      transition:'background 0.4s ease, color 0.4s ease',
    }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/about"     element={<About />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return <AppInner />;
}

export default App;
