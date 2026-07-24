/**
 * Dashboard Page
 * Authenticated dashboard: greets logged-in user by name, fetches real
 * backend stats on mount, provides full AI analysis flow.
 * No mock/sample data is shown on initial load — all data comes from the API.
 */

import { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import SentimentChart from '../components/SentimentChart';
import ResultsTable from '../components/ResultsTable';
import ReviewInput from '../components/ReviewInput';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorBanner from '../components/ErrorBanner';
import DashboardSidebar from '../components/DashboardSidebar';
import LiveReviewsPanel from '../components/LiveReviewsPanel';
import { Button } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { analyzeReviews, fetchGuestStats } from '../utils/api';
import { exportToCSV } from '../utils/exportCSV';

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ExportIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const Dashboard = () => {
  const [reviewText, setReviewText]   = useState('');
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [liveStats, setLiveStats]     = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const { showToast } = useToast();
  const { user } = useAuth();

  // Fetch real stats from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchGuestStats();
        setLiveStats(data.data ?? data);
      } catch {
        // Stats fetch failure is non-fatal; panel will handle its own error
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  const parseReviews = (text) =>
    text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  const handleAnalyze = async () => {
    setError(null);
    const reviews = parseReviews(reviewText);
    if (reviews.length === 0) {
      setError({ title: 'No reviews entered', message: 'Please paste at least one guest review.' });
      return;
    }
    if (reviews.length > 50) {
      setError({ title: 'Too many reviews', message: 'Maximum 50 reviews can be analysed at once.' });
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const data = await analyzeReviews(reviews);
      setResults(data.results);
      showToast(`Analysis complete — ${data.results.length} review${data.results.length !== 1 ? 's' : ''} processed.`, 'success');
    } catch (err) {
      const status    = err.response?.status;
      const serverMsg = err.response?.data?.message || err.response?.data?.error;

      if (status === 401) {
        setError({ title: 'Invalid API Key', message: 'The OpenAI API key is invalid. Check your server .env file.' });
      } else if (status === 429) {
        setError({ title: 'Rate Limit Exceeded', message: 'Too many requests to OpenAI. Please wait a moment.' });
      } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        setError({ title: 'Cannot reach server', message: 'The backend is not running. Run: cd server && npm run dev' });
      } else {
        setError({ title: 'Analysis Failed', message: serverMsg || err.message || 'An unexpected error occurred.' });
      }
      showToast('Analysis failed — see the error details below.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setReviewText('');
    setResults([]);
    setError(null);
  };

  const handleExport = () => {
    exportToCSV(results);
    showToast('Reviews exported to CSV successfully.', 'success');
  };

  const greeting = user?.name ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Analytics Dashboard';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-6 items-start">

        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 min-w-0 space-y-8">

          {/* ===== Header ===== */}
          <div id="overview" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-himalaya-blue hover:bg-himalaya-mist dark:hover:bg-himalaya-blue/20 transition-all flex-shrink-0"
                aria-label="Open dashboard menu"
              >
                <MenuIcon />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-himalaya-blue dark:text-white">
                  {greeting}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {results.length > 0
                    ? `Showing AI analysis for ${results.length} review${results.length !== 1 ? 's' : ''}`
                    : 'Paste guest reviews below to run real-time AI analysis'}
                </p>
              </div>
            </div>
            {results.length > 0 && !loading && (
              <Button onClick={handleExport} variant="secondary" icon={<ExportIcon />}
                className="text-himalaya-emerald border-himalaya-emerald/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex-shrink-0">
                Export CSV
              </Button>
            )}
          </div>

          {/* Error banner */}
          <ErrorBanner error={error} onDismiss={() => setError(null)} />

          {/* Live Stats from backend (shown on load) */}
          {!statsLoading && liveStats && results.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Reviews', value: liveStats.total,         icon: '📋', color: 'border-himalaya-blue'  },
                { label: 'Positive',      value: liveStats.positive,      icon: '😊', color: 'border-emerald-500'   },
                { label: 'Neutral',       value: liveStats.neutral,       icon: '😐', color: 'border-yellow-400'    },
                { label: 'Negative',      value: liveStats.negative,      icon: '😞', color: 'border-red-500'       },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className={`card border-l-4 ${color} !p-4`}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{icon} {label}</p>
                  <p className="text-3xl font-bold text-himalaya-slate dark:text-white mt-1">{value ?? '—'}</p>
                </div>
              ))}
            </div>
          )}

          {/* AI analysis stats (after analyze) */}
          {results.length > 0 && !loading && <StatsCards results={results} />}

          {/* ===== Analyze section ===== */}
          <div id="analyze" className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
            {results.length > 0 && !loading && <SentimentChart results={results} />}
            <ReviewInput
              value={reviewText}
              onChange={setReviewText}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              loading={loading}
            />
          </div>

          {loading && <LoadingOverlay count={parseReviews(reviewText).length} />}

          {/* ===== Results section ===== */}
          <div id="results">
            {results.length > 0 && !loading && (
              <ResultsTable results={results} onExport={handleExport} />
            )}

            {/* Empty state — shown only when no AI results yet */}
            {results.length === 0 && !loading && !error && (
              <div className="card flex flex-col items-center justify-center py-16 gap-4 text-center border-2 border-dashed border-himalaya-blue/15 dark:border-himalaya-blue/30 bg-transparent shadow-none">
                <div className="text-5xl">🏔️</div>
                <div>
                  <p className="font-semibold text-himalaya-blue dark:text-himalaya-mist text-lg">Ready to analyse</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                    Paste guest reviews above (one per line) and click Analyze Reviews to run AI sentiment analysis.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===== Live Backend CRUD panel ===== */}
          <LiveReviewsPanel />

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
