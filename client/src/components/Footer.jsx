import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ borderTop:'1px solid rgba(255,255,255,0.06)', background:'#070B14', padding:'4rem 3rem 2.5rem' }}>
    <div style={{ maxWidth:1280, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2rem', marginBottom:'3rem' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
            <span>🏔</span>
            <span style={{ fontFamily:"'Cormorant Garant',serif", fontSize:'1.05rem', color:'#F0EDE6' }}>Himalayan</span>
          </div>
          <p style={{ fontSize:'0.8rem', color:'rgba(240,237,230,0.3)', maxWidth:260, lineHeight:1.8 }}>
            AI-powered guest intelligence for hotels and homestays across the Himalayas.
          </p>
        </div>
        <div style={{ display:'flex', gap:'4rem', flexWrap:'wrap' }}>
          {[['Platform', [['/', 'Home'],['/dashboard','Dashboard'],['/about','About']]],
            ['Account', [['/login','Sign In'],['/register','Get Started']]]].map(([group, links]) => (
            <div key={group}>
              <div style={{ fontSize:'0.65rem', fontFamily:"'DM Mono',monospace", letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(240,237,230,0.25)', marginBottom:'1.2rem' }}>{group}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {links.map(([to, label]) => (
                  <Link key={to} to={to} style={{ fontSize:'0.82rem', color:'rgba(240,237,230,0.4)', textDecoration:'none', transition:'color 0.2s' }}
                    onMouseEnter={e=>e.target.style.color='#F0EDE6'} onMouseLeave={e=>e.target.style.color='rgba(240,237,230,0.4)'}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
        <span style={{ fontSize:'0.72rem', color:'rgba(240,237,230,0.2)', fontFamily:"'DM Mono',monospace" }}>
          © 2026 Himalayan Guest Experience Intelligence Platform
        </span>
        <span style={{ fontSize:'0.72rem', color:'rgba(240,237,230,0.2)', fontFamily:"'DM Mono',monospace" }}>
          Built by Pranjal Pundeer
        </span>
      </div>
    </div>
  </footer>
);
export default Footer;
