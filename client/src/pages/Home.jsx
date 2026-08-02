import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { analyzeReviews } from '../utils/api';
import { SENTIMENT_ICON, THEME_ICON } from '../utils/reviewMeta';

const EXAMPLE_TEXT = `Amazing food and very friendly staff. Highly recommend!\nRooms were clean but breakfast was average and nothing special.\nThe washroom was dirty and service was slow throughout our stay.\nStunning mountain views from our room. Absolutely breathtaking experience.`;

const FEATURES = [
  { icon:'🧠', title:'Sentiment Analysis', desc:'Classify every review as Positive, Neutral, or Negative using advanced AI — in under 3 seconds.' },
  { icon:'🏷', title:'Theme Detection', desc:'Automatically categorise feedback by topic: Food, Host, Location, Cleanliness, Value, Experience.' },
  { icon:'✍️', title:'Response Generation', desc:'Generate professional, brand-appropriate management responses for every piece of feedback.' },
  { icon:'📊', title:'Analytics Dashboard', desc:'Visual breakdown of sentiment distribution, theme trends, and guest satisfaction over time.' },
  { icon:'📥', title:'CSV Export', desc:'Download all analysed reviews with sentiment, theme and response data in one click.' },
  { icon:'🔒', title:'Secure & Private', desc:'JWT authentication, Google OAuth, and encrypted data storage. Your guest data stays yours.' },
];

const RevealSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
    }}>{children}</div>
  );
};

const Home = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    const reviews = text.trim().split('\n').filter(l => l.trim());
    if (!reviews.length) return;
    setLoading(true); setError(''); setResults([]);
    try {
      const data = await analyzeReviews(reviews);
      setResults(data.results ?? []);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background:'#070B14', minHeight:'100vh' }}>
      <Hero />

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section style={{ padding:'8rem 3rem', maxWidth:1280, margin:'0 auto' }}>
        <RevealSection>
          <div style={{ marginBottom:'5rem' }}>
            <span className="eyebrow" style={{ display:'block', marginBottom:'1.5rem' }}>Platform Capabilities</span>
            <h2 className="display" style={{ fontSize:'clamp(2rem,4vw,3.5rem)', color:'#F0EDE6', maxWidth:600 }}>
              Everything you need to understand your guests
            </h2>
          </div>
        </RevealSection>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'1px', background:'rgba(255,255,255,0.06)' }}>
          {FEATURES.map((f, i) => (
            <RevealSection key={f.title} delay={i * 60}>
              <div style={{
                padding:'2.5rem', background:'#070B14',
                transition:'background 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(75,159,213,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background='#070B14'}
              >
                <div style={{ fontSize:'1.5rem', marginBottom:'1.2rem' }}>{f.icon}</div>
                <h3 style={{ fontFamily:"'Cormorant Garant',serif", fontSize:'1.25rem', color:'#F0EDE6', marginBottom:'0.75rem', fontWeight:400 }}>{f.title}</h3>
                <p style={{ fontSize:'0.85rem', color:'rgba(240,237,230,0.4)', lineHeight:1.8 }}>{f.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Live Analyzer ─────────────────────────────────────────────── */}
      <section style={{ padding:'8rem 3rem', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <RevealSection>
            <span className="eyebrow" style={{ display:'block', marginBottom:'1.5rem' }}>Try It Live</span>
            <h2 className="display" style={{ fontSize:'clamp(2rem,4vw,3rem)', color:'#F0EDE6', marginBottom:'1rem' }}>
              Real AI analysis, right now
            </h2>
            <p style={{ fontSize:'0.9rem', color:'rgba(240,237,230,0.4)', marginBottom:'3rem', lineHeight:1.8 }}>
              Paste any guest reviews below and see live sentiment analysis powered by our AI engine.
            </p>
          </RevealSection>

          <RevealSection delay={100}>
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', padding:'2.5rem', borderRadius:2 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
                <span style={{ fontSize:'0.75rem', color:'rgba(240,237,230,0.35)', fontFamily:"'DM Mono',monospace", letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  Guest Reviews Input
                </span>
                {text.trim() && (
                  <span style={{ fontSize:'0.7rem', color:'#4B9FD5', fontFamily:"'DM Mono',monospace" }}>
                    {text.trim().split('\n').filter(l=>l.trim()).length} reviews
                  </span>
                )}
              </div>
              <textarea
                className="input"
                rows={6}
                placeholder={`Paste reviews here, one per line...\n\nExample:\n${EXAMPLE_TEXT}`}
                value={text}
                onChange={e => { setText(e.target.value); setResults([]); setError(''); }}
                disabled={loading}
                style={{ marginBottom:'1.5rem' }}
              />
              {error && (
                <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#fca5a5', fontSize:'0.82rem', padding:'0.8rem 1rem', marginBottom:'1rem', borderRadius:2 }}>
                  {error}
                </div>
              )}
              <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                <button onClick={handleAnalyze} disabled={!text.trim() || loading} className="btn-primary">
                  {loading ? 'Analyzing…' : 'Analyze Reviews →'}
                </button>
                <button onClick={() => { setText(EXAMPLE_TEXT); setResults([]); }} className="btn-ghost" disabled={loading}>
                  Load Examples
                </button>
                {text && <button onClick={() => { setText(''); setResults([]); setError(''); }} className="btn-ghost" disabled={loading}>Clear</button>}
              </div>
            </div>
          </RevealSection>

          {/* Results */}
          {results.length > 0 && !loading && (
            <RevealSection delay={100}>
              <div style={{ marginTop:'2rem', border:'1px solid rgba(255,255,255,0.07)', borderRadius:2, overflow:'hidden' }}>
                <div style={{ padding:'1.2rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'0.72rem', fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(240,237,230,0.35)' }}>
                    Analysis Results — {results.length} reviews
                  </span>
                  <Link to="/dashboard" style={{ fontSize:'0.78rem', color:'#4B9FD5', textDecoration:'none' }}>Full Dashboard →</Link>
                </div>
                <table className="table-luxury">
                  <thead>
                    <tr>
                      <th>Review</th><th>Sentiment</th><th>Theme</th><th>Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td style={{ maxWidth:200, fontSize:'0.82rem' }}><p style={{ overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{r.review}</p></td>
                        <td>
                          <span className={`badge ${r.sentiment==='Positive'?'badge-pos':r.sentiment==='Negative'?'badge-neg':'badge-neu'}`}>
                            {SENTIMENT_ICON[r.sentiment]} {r.sentiment}
                          </span>
                        </td>
                        <td><span className="badge badge-theme">{THEME_ICON[r.theme]} {r.theme}</span></td>
                        <td style={{ fontSize:'0.78rem', color:'rgba(240,237,230,0.4)', fontStyle:'italic', maxWidth:220 }}>{r.response}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </RevealSection>
          )}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section style={{ padding:'8rem 3rem', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <RevealSection>
          <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
            <h2 className="display" style={{ fontSize:'clamp(2rem,4vw,3.5rem)', color:'#F0EDE6', marginBottom:'1.5rem' }}>
              Ready to understand<br/><span className="display-italic text-gradient">your guests?</span>
            </h2>
            <p style={{ color:'rgba(240,237,230,0.4)', marginBottom:'2.5rem', fontSize:'0.95rem', lineHeight:1.9 }}>
              Join hotels and homestays across the Himalayas using AI to turn guest feedback into competitive advantage.
            </p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/register" className="btn-primary">Create Free Account</Link>
              <Link to="/dashboard" className="btn-ghost">View Dashboard</Link>
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
};
export default Home;
