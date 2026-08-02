import Button from './ui/Button';
import { useParallax } from '../hooks/useParallax';

const Hero = () => {
  const bgRef    = useParallax(0.5, true);   // background moves most
  const midRef   = useParallax(0.3, true);   // mid layer
  const frontRef = useParallax(0.15, true);  // foreground text moves least
  const mtnRef   = useParallax(0.4, false);  // mountain silhouette

  return (
    <header style={{ position:"relative", overflow:"hidden", minHeight:"92vh",
      background:"linear-gradient(135deg, #0a1628 0%, #0d2240 40%, #0e3a5c 70%, #0a2a45 100%)",
      display:"flex", alignItems:"center", justifyContent:"center" }}>

      {/* ── Layer 1: Stars (far background, moves most) ────────────────── */}
      <div ref={bgRef} style={{
        position:"absolute", inset:"-20% -10%", zIndex:1, willChange:"transform",
      }}>
        {Array.from({length:80}).map((_,i) => (
          <div key={i} style={{
            position:"absolute",
            left:`${Math.random()*100}%`,
            top:`${Math.random()*100}%`,
            width: i%5===0 ? "3px" : "1.5px",
            height: i%5===0 ? "3px" : "1.5px",
            borderRadius:"50%",
            background:"white",
            opacity: 0.3 + Math.random()*0.6,
            animation:`twinkle ${2+Math.random()*3}s ease-in-out infinite`,
            animationDelay:`${Math.random()*3}s`,
          }}/>
        ))}
      </div>

      {/* ── Layer 2: Glowing orbs (mid layer) ─────────────────────────── */}
      <div ref={midRef} style={{
        position:"absolute", inset:0, zIndex:2, willChange:"transform",
        pointerEvents:"none",
      }}>
        {[
          {x:"15%",  y:"20%", w:300, col:"rgba(30,100,200,0.12)"},
          {x:"70%",  y:"10%", w:250, col:"rgba(0,180,160,0.10)"},
          {x:"50%",  y:"60%", w:400, col:"rgba(20,80,180,0.08)"},
          {x:"80%",  y:"70%", w:200, col:"rgba(60,140,220,0.10)"},
          {x:"5%",   y:"70%", w:280, col:"rgba(0,160,140,0.09)"},
        ].map((o,i) => (
          <div key={i} style={{
            position:"absolute", left:o.x, top:o.y,
            width:o.w, height:o.w, borderRadius:"50%",
            background:`radial-gradient(circle, ${o.col}, transparent 70%)`,
            transform:"translate(-50%,-50%)",
            filter:"blur(40px)",
          }}/>
        ))}
      </div>

      {/* ── Layer 3: Mountain silhouette (mid-front) ──────────────────── */}
      <div ref={mtnRef} style={{
        position:"absolute", bottom:0, left:0, right:0,
        zIndex:3, willChange:"transform",
      }}>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none"
          style={{width:"100%", height:"auto", display:"block"}}>
          {/* Far peaks */}
          <polygon points="0,320 180,120 320,200 500,60 680,160 860,80 1040,180 1200,100 1440,160 1440,320"
            fill="rgba(8,25,60,0.6)"/>
          {/* Snow caps far */}
          <polygon points="180,120 210,150 150,150" fill="rgba(220,235,255,0.5)"/>
          <polygon points="500,60 535,100 465,100"  fill="rgba(220,235,255,0.55)"/>
          <polygon points="860,80 895,118 825,118"  fill="rgba(220,235,255,0.5)"/>
          {/* Near peaks */}
          <polygon points="0,320 100,200 250,260 400,140 560,220 720,120 880,200 1040,130 1200,210 1440,150 1440,320"
            fill="rgba(5,15,40,0.8)"/>
          {/* Snow caps near */}
          <polygon points="400,140 430,175 370,175" fill="rgba(230,242,255,0.6)"/>
          <polygon points="720,120 755,158 685,158" fill="rgba(230,242,255,0.65)"/>
          <polygon points="1040,130 1075,168 1005,168" fill="rgba(230,242,255,0.6)"/>
          {/* Foreground base */}
          <polygon points="0,320 0,280 1440,280 1440,320" fill="rgba(3,10,25,0.9)"/>
        </svg>
      </div>

      {/* ── Layer 4: Text content (moves least = closest to viewer) ────── */}
      <div ref={frontRef} style={{
        position:"relative", zIndex:5, textAlign:"center",
        padding:"2rem", maxWidth:"900px", willChange:"transform",
        marginBottom:"8rem",
      }}>
        {/* Badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:"0.5rem",
          background:"rgba(255,255,255,0.08)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:"999px",
          padding:"0.4rem 1.2rem", fontSize:"0.8rem", color:"rgba(255,255,255,0.85)",
          marginBottom:"2rem",
          animation:"fadeUp 0.8s ease forwards",
        }}>
          <span>🏔️</span>
          <span style={{letterSpacing:"0.05em"}}>Himalayan Hospitality Intelligence</span>
          <span style={{width:8,height:8,borderRadius:"50%",background:"#34d399",
            display:"inline-block", animation:"pulse 2s infinite"}}/>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize:"clamp(2rem,5.5vw,4rem)", fontWeight:300,
          color:"rgba(255,255,255,0.95)", lineHeight:1.2, marginBottom:"1.5rem",
          fontFamily:"Georgia, serif", letterSpacing:"0.03em",
          textShadow:"0 0 60px rgba(80,140,255,0.3)",
          animation:"fadeUp 0.9s ease 0.15s forwards", opacity:0,
        }}>
          Himalayan Guest Experience<br/>
          <span style={{color:"#7dd3fc", fontStyle:"italic"}}>Intelligence Platform</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          color:"rgba(255,255,255,0.55)", fontSize:"clamp(0.95rem,1.8vw,1.15rem)",
          maxWidth:"600px", margin:"0 auto 2.5rem", lineHeight:1.8,
          animation:"fadeUp 0.9s ease 0.3s forwards", opacity:0,
        }}>
          AI-powered guest review analysis for hotels and homestays. Instantly classify
          guest sentiment, detect review themes, and generate intelligent responses.
        </p>

        {/* CTAs */}
        <div style={{
          display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"1rem",
          animation:"fadeUp 0.9s ease 0.45s forwards", opacity:0,
        }}>
          <Button to="/dashboard" variant="primary" size="lg">Analyze Reviews →</Button>
          <Button to="/about" variant="outline" size="lg">Learn More</Button>
        </div>

        {/* Feature pills */}
        <div style={{
          display:"flex", flexWrap:"wrap", justifyContent:"center",
          gap:"1.5rem", marginTop:"2.5rem", fontSize:"0.78rem",
          color:"rgba(255,255,255,0.4)", letterSpacing:"0.05em",
          animation:"fadeUp 0.9s ease 0.6s forwards", opacity:0,
        }}>
          {[["#34d399","Sentiment Analysis"],["#fcd34d","Theme Classification"],
            ["#93c5fd","Auto-Generated Responses"],["#f9a8d4","CSV Export"]].map(([col,label])=>(
            <span key={label} style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:col,display:"inline-block"}}/>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes twinkle {
          0%,100% { opacity:0.2; } 50% { opacity:1; }
        }
        @keyframes pulse {
          0%,100% { transform:scale(1); opacity:1; }
          50% { transform:scale(1.4); opacity:0.6; }
        }
      `}</style>
    </header>
  );
};

export default Hero;
