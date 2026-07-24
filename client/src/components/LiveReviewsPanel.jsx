/**
 * LiveReviewsPanel — Full CRUD
 * Connects to /api/reviews and /api/stats. Supports:
 *   READ   — paginated list with search
 *   CREATE — inline form to add a new review
 *   UPDATE — inline edit form per row
 *   DELETE — row-level delete with confirmation
 */
import { useEffect, useState, useCallback } from 'react';
import Badge from './Badge';
import { Input, Button } from './ui';
import {
  fetchAllReviews,
  fetchGuestStats,
  searchGuestReviews,
  createGuestReview,
  updateGuestReview,
  deleteGuestReview,
} from '../utils/api';

const SENTIMENT_ICON = { Positive: '😊', Neutral: '😐', Negative: '😞' };
const sentimentVariant = (s) => s?.toLowerCase() ?? 'default';

const THEMES   = ['Food', 'Location', 'Cleanliness', 'Value', 'Host', 'Experience', 'General'];
const SENTS    = ['Positive', 'Neutral', 'Negative'];
const RATINGS  = [1, 2, 3, 4, 5];

const emptyForm = () => ({
  guestName: '', review: '', sentiment: 'Positive', theme: 'General', rating: 5,
});

const StatPill = ({ label, value, accent }) => (
  <div className="card !p-4 flex flex-col gap-1 border-l-4" style={{ borderLeftColor: accent }}>
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-2xl font-bold text-himalaya-slate dark:text-white">{value}</span>
  </div>
);

/* ── small inline form used for both create and edit ── */
const ReviewForm = ({ initial = emptyForm(), onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-himalaya-mist/40 dark:bg-himalaya-blue/10 rounded-xl p-4 space-y-3 border border-himalaya-blue/10">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Guest Name *</label>
          <input
            value={form.guestName} onChange={e => set('guestName', e.target.value)}
            placeholder="e.g. Ananya Sharma"
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-himalaya-stone focus:outline-none focus:ring-2 focus:ring-himalaya-blue/50"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sentiment</label>
            <select value={form.sentiment} onChange={e => set('sentiment', e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-himalaya-stone focus:outline-none focus:ring-2 focus:ring-himalaya-blue/50">
              {SENTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Theme</label>
            <select value={form.theme} onChange={e => set('theme', e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-himalaya-stone focus:outline-none focus:ring-2 focus:ring-himalaya-blue/50">
              {THEMES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Rating</label>
            <select value={form.rating} onChange={e => set('rating', Number(e.target.value))}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-himalaya-stone focus:outline-none focus:ring-2 focus:ring-himalaya-blue/50">
              {RATINGS.map(r => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Review Text *</label>
        <textarea
          rows={3} value={form.review} onChange={e => set('review', e.target.value)}
          placeholder="Enter the full guest review text…"
          className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-himalaya-stone focus:outline-none focus:ring-2 focus:ring-himalaya-blue/50 resize-none"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button onClick={() => onSave(form)} disabled={saving || !form.guestName.trim() || !form.review.trim()}>
          {saving ? 'Saving…' : 'Save Review'}
        </Button>
      </div>
    </div>
  );
};

const LiveReviewsPanel = () => {
  const [reviews, setReviews]     = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [query, setQuery]         = useState('');
  const [searching, setSearching] = useState(false);

  // CREATE state
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating]     = useState(false);

  // UPDATE state — tracks which row is being edited
  const [editId, setEditId]     = useState(null);
  const [updating, setUpdating] = useState(false);

  // DELETE state — tracks which row awaits confirmation
  const [deleteId, setDeleteId]   = useState(null);
  const [deleting, setDeleting]   = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reviewsRes, statsRes] = await Promise.all([fetchAllReviews(), fetchGuestStats()]);
      setReviews(reviewsRes.data ?? reviewsRes);
      setStats(statsRes.data ?? statsRes);
    } catch (err) {
      setError(
        err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED'
          ? 'Cannot reach the backend. Make sure the server is running on port 5000.'
          : err.message || 'Failed to load live data from the backend.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) { loadAll(); return; }
    setSearching(true); setError(null);
    try {
      const res = await searchGuestReviews(query.trim());
      setReviews(res.data ?? res);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed.');
    } finally { setSearching(false); }
  };

  /* CREATE */
  const handleCreate = async (form) => {
    setCreating(true);
    try {
      const res = await createGuestReview(form);
      const created = res.data ?? res;
      setReviews(prev => [created, ...prev]);
      setShowCreate(false);
      if (stats) setStats(s => ({ ...s, total: (s.total || 0) + 1, [form.sentiment.toLowerCase()]: (s[form.sentiment.toLowerCase()] || 0) + 1 }));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create review.');
    } finally { setCreating(false); }
  };

  /* UPDATE */
  const handleUpdate = async (form) => {
    setUpdating(true);
    try {
      const res = await updateGuestReview(editId, form);
      const updated = res.data ?? res;
      setReviews(prev => prev.map(r => r.id === editId ? { ...r, ...updated } : r));
      setEditId(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update review.');
    } finally { setUpdating(false); }
  };

  /* DELETE */
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteGuestReview(deleteId);
      setReviews(prev => prev.filter(r => r.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete review.');
    } finally { setDeleting(false); }
  };

  return (
    <div id="live-backend" className="card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-himalaya-blue dark:text-himalaya-mist flex items-center gap-2">
            🔌 Live Guest Reviews <span className="text-xs font-normal text-gray-400">(REST API — Full CRUD)</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real data from <code className="text-xs bg-himalaya-mist dark:bg-himalaya-blue/20 px-1.5 py-0.5 rounded">/api/reviews</code>
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setShowCreate(c => !c); setEditId(null); }} variant="secondary">
            {showCreate ? 'Cancel' : '＋ Add Review'}
          </Button>
          <Button onClick={loadAll} variant="secondary" icon={<span>↻</span>}>Refresh</Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-xl px-4 py-3 flex justify-between items-start gap-2">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <ReviewForm
          onSave={handleCreate}
          onCancel={() => setShowCreate(false)}
          saving={creating}
        />
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading live data…</div>
      ) : (
        <>
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <StatPill label="Total Reviews" value={stats.total}         accent="#2563eb" />
              <StatPill label="Positive"      value={stats.positive}      accent="#16a34a" />
              <StatPill label="Negative"      value={stats.negative}      accent="#dc2626" />
              <StatPill label="Neutral"       value={stats.neutral}       accent="#ca8a04" />
              <StatPill label="Avg Rating"    value={`${stats.averageRating} ★`} accent="#7c3aed" />
            </div>
          )}

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by guest, keyword, theme or sentiment…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={searching}>{searching ? 'Searching…' : 'Search'}</Button>
            {query && <Button type="button" variant="secondary" onClick={() => { setQuery(''); loadAll(); }}>Clear</Button>}
          </form>

          {/* Delete confirmation modal */}
          {deleteId && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-sm text-red-700 dark:text-red-300">Delete this review permanently?</span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
              <thead>
                <tr className="bg-himalaya-mist/60 dark:bg-himalaya-blue/10">
                  {['Guest', 'Review', 'Sentiment', 'Theme', 'Rating', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-himalaya-blue dark:text-himalaya-mist uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-himalaya-stone divide-y divide-gray-50 dark:divide-gray-700/50">
                {reviews.map((r) => (
                  editId === r.id ? (
                    <tr key={r.id}>
                      <td colSpan={6} className="px-4 py-3">
                        <ReviewForm
                          initial={{ guestName: r.guestName, review: r.review, sentiment: r.sentiment, theme: r.theme, rating: r.rating }}
                          onSave={handleUpdate}
                          onCancel={() => setEditId(null)}
                          saving={updating}
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr key={r.id} className="hover:bg-himalaya-snow dark:hover:bg-himalaya-slate/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{r.guestName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                        <p className="line-clamp-2">{r.review}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={sentimentVariant(r.sentiment)}>
                          {SENTIMENT_ICON[r.sentiment]} {r.sentiment}
                        </Badge>
                      </td>
                      <td className="px-4 py-3"><Badge variant="theme">{r.theme}</Badge></td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{r.rating} / 5</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => { setEditId(r.id); setShowCreate(false); setDeleteId(null); }}
                            className="text-xs font-semibold text-himalaya-blue hover:underline whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => { setDeleteId(r.id); setEditId(null); }}
                            className="text-xs font-semibold text-red-500 hover:underline whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="text-3xl mb-2">📭</div>
                      <p className="text-gray-400 text-sm">No reviews found. Add one above!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveReviewsPanel;
