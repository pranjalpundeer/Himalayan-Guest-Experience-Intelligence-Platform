import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ComponentShowcase from './pages/ComponentShowcase';
import ProtectedRoute from './components/ProtectedRoute';
import CinematicIntro from './components/CinematicIntro';
import ParallaxBackground from './components/ParallaxBackground';

function App() {
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem("intro_done") === "true"
  );

  const handleEnter = () => {
    sessionStorage.setItem("intro_done", "true");
    setIntroDone(true);
  };

  if (!introDone) return <CinematicIntro onEnter={handleEnter} />;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200"
      style={{ position:"relative", zIndex:1 }}>

      {/* Global 3D parallax background — sits behind everything */}
      <ParallaxBackground />

      <Navbar />
      <main className="flex-1" style={{ position:"relative", zIndex:2 }}>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/components" element={<ComponentShowcase />} />
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analytics"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer style={{ position:"relative", zIndex:2 }} />
    </div>
  );
}

export default App;
