import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const layer1 = useRef(null);
  const layer2 = useRef(null);
  const layer3 = useRef(null);

  useEffect(() => {
    let raf;
    let mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = e => { mx = (e.clientX/window.innerWidth - 0.5); my = (e.clientY/window.innerHeight - 0.5); };
    window.addEventListener('mousemove', onMove);
    const tick = () => {
      cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06;
      if (layer1.current) layer1.current.style.transform = `translate(${cx*-28}px, ${cy*-18}px)`;
      if (layer2.current) layer2.current.style.transform = `translate(${cx*-14}px, ${cy*-9}px)`;
      if (layer3.current) layer3.current.style.transform = `translate(${cx*-6}px, ${cy*-4}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section style={{
      position:'relative', minHeight:'100vh', display:'flex', alignItems:'center',
      overflow:'hidden', background:'#070B14',
    }}>
      {/* Layer 1 — deep background gradient orbs */}
      <div ref={layer1} style={{ position:'absolute', inset:'-10%', willChange:'transform', pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'10%', left:'5%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(75,159,213,0.07) 0%, transparent 70%)', filter:'blur(40px)' }}/>
        <div style={{ position:'absolute', top:'40%', right:'5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)', filter:'blur(60px)' }}/>
        <div style={{ position:'absolute', bottom:'10%', left:'30%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(126,200,227,0.05) 0%, transparent 70%)', filter:'blur(50px)' }}/>
      </div>

      {/* Layer 2 — mountain silhouette */}
      <div ref={layer2} style={{ position:'absolute', bottom:0, left:0, right:0, willChange:'transform', pointerEvents:'none' }}>
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ width:'100%', height:'auto', display:'block', opacity:0.6 }}>
          <defs>
            <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a3a5c" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#070B14" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d2035" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#070B14" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <polygon points="0,400 0,280 120,180 250,240 400,100 560,200 700,80 860,170 1000,60 1160,160 1300,90 1440,140 1440,400" fill="url(#mtn1)"/>
          <polygon points="0,400 0,310 80,260 200,290 350,200 480,250 600,180 740,230 880,160 1000,210 1140,140 1280,200 1440,170 1440,400" fill="url(#mtn2)"/>
          {/* Snow caps */}
          <polygon points="400,100 430,138 370,138" fill="rgba(230,240,255,0.4)"/>
          <polygon points="700,80 733,120 667,120"  fill="rgba(230,240,255,0.45)"/>
          <polygon points="1000,60 1035,102 965,102" fill="rgba(230,240,255,0.4)"/>
        </svg>
      </div>

      {/* Layer 3 — thin horizontal line accent */}
      <div ref={layer3} style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, rgba(75,159,213,0.15), transparent)', willChange:'transform', pointerEvents:'none' }}/>

      {/* Content */}
      <div style={{ position:'relative', zIndex:10, maxWidth:1280, margin:'0 auto', padding:'8rem 3rem 6rem', width:'100%' }}>
        <div style={{ maxWidth:720 }}>

          {/* Eyebrow */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2.5rem', opacity:0, animation:'fadeUp 0.8s ease 0.1s forwards' }}>
            <div style={{ width:32, height:1, background:'#4B9FD5' }}/>
            <span className="eyebrow">Himalayan Hospitality Intelligence</span>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#4B9FD5', animation:'pulse 2s infinite' }}/>
          </div>

          {/* Title */}
          <h1 className="display" style={{
            fontSize:'clamp(3rem, 6vw, 5.5rem)',
            color:'#F0EDE6', marginBottom:'1.5rem',
            opacity:0, animation:'fadeUp 0.9s ease 0.25s forwards',
          }}>
            Guest Intelligence<br/>
            <span className="display-italic text-gradient">for the Himalayas</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize:'1rem', color:'rgba(240,237,230,0.45)', maxWidth:520,
            lineHeight:1.9, marginBottom:'3rem',
            opacity:0, animation:'fadeUp 0.9s ease 0.4s forwards',
          }}>
            AI-powered review analysis for hotels and homestays. Classify sentiment, identify themes, and generate intelligent management responses — instantly.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', opacity:0, animation:'fadeUp 0.9s ease 0.55s forwards' }}>
            <Link to="/dashboard" className="btn-primary">Analyze Reviews →</Link>
            <Link to="/about" className="btn-ghost">Learn More</Link>
          </div>

          {/* Stats row */}
          <div style={{
            display:'flex', gap:'3rem', marginTop:'5rem', paddingTop:'3rem',
            borderTop:'1px solid rgba(255,255,255,0.06)',
            opacity:0, animation:'fadeUp 0.9s ease 0.7s forwards',
          }}>
            {[['50+','Hotels using platform'],['10k+','Reviews analyzed'],['3s','Average analysis time']].map(([val, label]) => (
              <div key={label}>
                <div className="display" style={{ fontSize:'2rem', color:'#F0EDE6' }}>{val}</div>
                <div style={{ fontSize:'0.72rem', color:'rgba(240,237,230,0.35)', letterSpacing:'0.06em', marginTop:'0.25rem', fontFamily:"'DM Mono',monospace", textTransform:'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
      `}</style>
    </section>
  );
};
export default Hero;
