/**
 * Home Page
 * Hero + Features grid + AI Review Analyzer preview section.
 * The preview section calls the REAL /api/analyze endpoint — no mock data.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import SectionTitle from '../components/SectionTitle';
import Badge from '../components/Badge';
import { Input, Button } from '../components/ui';
import { FEATURES } from '../data/sampleData';          // only static marketing copy
import { analyzeReviews } from '../utils/api';
import { SENTIMENT_ICON, THEME_ICON, sentimentVariant } from '../utils/reviewMeta';

const EXAMPLE_TEXT = `Amazing food and very friendly staff. Highly recommend!
Rooms were clean but breakfast was average and nothing special.
The washroom was dirty and service was slow throughout our stay.
Stunning mountain views from our room. Absolutely breathtaking experience.`;

const Home = () => {
  const [previewText, setPreviewText] = useState('');
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const previewCount = previewText.trim()
    ? previewText.trim().split('\n').filter(l => l.trim()).length
    : 0;

  const handleAnalyzePreview = async () => {
    const reviews = previewText.trim().split('\n').filter(l => l.trim());
    if (!reviews.length) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const data = await analyzeReviews(reviews);
      setResults(data.results ?? []);
    } catch (err) {
      setError(
        err.code === 'ERR_NETWORK'
          ? 'Backend not running — start the server to see real AI results.'
          : err.response?.data?.error || 'Analysis failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPreviewText('');
    setResults([]);
    setError('');
  };

  return (
    <>
      <Hero />

      {/* ── Features Section ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="What We Do"
          title="Everything You Need to Understand Your Guests"
          subtitle="From raw review text to actionable intelligence — our platform handles the full analysis pipeline powered by OpenAI."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} delay={i * 80} {...f} />
          ))}
        </div>
      </section>

      {/* ── AI Review Analyzer Preview (REAL API) ────────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-himalaya-mist/30 dark:from-himalaya-stone dark:to-himalaya-slate/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Try It Out"
            title="AI Review Analyzer — Live Preview"
            subtitle="Paste a few reviews and get real AI-powered sentiment analysis. Calls the live backend."
          />

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-himalaya-blue dark:text-himalaya-mist">
                  Paste Guest Reviews
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">One review per line — up to 50 at once</p>
              </div>
              {previewCount > 0 && (
                <span className="text-xs font-medium bg-himalaya-mist dark:bg-himalaya-blue/30 text-himalaya-blue dark:text-himalaya-mist px-3 py-1 rounded-full">
                  {previewCount} review{previewCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <Input
              type="textarea"
              rows={6}
              className="h-40"
              placeholder={`Try pasting:\n${EXAMPLE_TEXT}`}
              value={previewText}
              onChange={(e) => { setPreviewText(e.target.value); setResults([]); setError(''); }}
              disabled={loading}
              aria-label="Preview reviews input"
            />

            {/* Error */}
            {error && (
              <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-xl px-4 py-3 flex justify-between items-start gap-2">
                <span>{error}</span>
                <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                onClick={handleAnalyzePreview}
                disabled={!previewText.trim() || loading}
                loading={loading}
                icon={<span>🧠</span>}
                className="flex-1 sm:flex-none"
              >
                {loading ? 'Analyzing…' : 'Analyze Reviews'}
              </Button>
              <Button
                onClick={() => { setPreviewText(EXAMPLE_TEXT); setResults([]); setError(''); }}
                variant="secondary"
                icon={<span>📋</span>}
                disabled={loading}
              >
                Load Examples
              </Button>
              {previewText && (
                <Button onClick={handleClear} variant="danger" icon={<span>🗑</span>} disabled={loading}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="card mt-6 flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="flex gap-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-himalaya-blue animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <p className="text-himalaya-blue dark:text-himalaya-mist font-semibold">
                Analysing {previewCount} review{previewCount !== 1 ? 's' : ''} with AI…
              </p>
            </div>
          )}

          {/* Real API Results Table */}
          {results.length > 0 && !loading && (
            <div className="card mt-6 animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-himalaya-blue dark:text-himalaya-mist">
                  AI Analysis Results
                  <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">● Live from /api/analyze</span>
                </h3>
                <Link to="/dashboard" className="text-sm text-himalaya-sky hover:underline">
                  Full Dashboard →
                </Link>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-himalaya-mist/60 dark:bg-himalaya-blue/10">
                      {['Review', 'Sentiment', 'Theme', 'Suggested Response'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-himalaya-blue dark:text-himalaya-mist uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-himalaya-stone divide-y divide-gray-50 dark:divide-gray-700/50">
                    {results.map((row, idx) => (
                      <tr key={idx} className="hover:bg-himalaya-snow dark:hover:bg-himalaya-slate/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 max-w-[200px]">
                          <p className="line-clamp-2">{row.review}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={sentimentVariant(row.sentiment)}>
                            {SENTIMENT_ICON[row.sentiment]} {row.sentiment}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="theme">
                            {THEME_ICON[row.theme]} {row.theme}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 italic max-w-[220px]">
                          {row.response}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty state — before user tries anything */}
          {results.length === 0 && !loading && !error && !previewText && (
            <div className="card mt-6 flex flex-col items-center justify-center py-12 gap-3 text-center border-2 border-dashed border-himalaya-blue/15 dark:border-himalaya-blue/30 bg-transparent shadow-none">
              <div className="text-4xl">🏔️</div>
              <p className="font-semibold text-himalaya-blue dark:text-himalaya-mist">Try the live analyser above</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Paste any guest review text, or click <b>Load Examples</b>, then hit <b>Analyze Reviews</b>.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center card gradient-card text-white">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to understand your guests?</h2>
          <p className="text-white/80 mb-8">Open the dashboard, paste your reviews, and let AI do the rest.</p>
          <Button to="/dashboard" variant="outline" size="lg">
            Open Dashboard →
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;
