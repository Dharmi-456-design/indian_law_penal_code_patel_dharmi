import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { fetchSections } from '../../../store/slices/sectionsSlice';
import api from '../../../services/api';

/* ─── Constants ──────────────────────────────────────────────────── */
const ACTS = [
  { actCode: 'IPC',  actName: 'Indian Penal Code' },
  { actCode: 'CrPC', actName: 'Code of Criminal Procedure' },
  { actCode: 'CPC',  actName: 'Civil Procedure Code' },
  { actCode: 'HMA',  actName: 'Hindu Marriage Act' },
  { actCode: 'IDA',  actName: 'Indian Divorce Act' },
  { actCode: 'IEA',  actName: 'Indian Evidence Act' },
  { actCode: 'NIA',  actName: 'Negotiable Instruments Act' },
  { actCode: 'MVA',  actName: 'Motor Vehicles Act' },
];

const SORT_OPTIONS = [
  { value: 'sectionNumber', label: 'Section No. ↑' },
  { value: '-sectionNumber', label: 'Section No. ↓' },
  { value: 'sectionTitle', label: 'Title A–Z' },
  { value: '-sectionTitle', label: 'Title Z–A' },
];

/* ─── SectionCard ────────────────────────────────────────────────── */
function SectionCard({ section, onBookmark, bookmarkedIds, dark }) {
  const navigate = useNavigate();
  const isBookmarked = bookmarkedIds.has(section._id);

  return (
    <div
      className="group relative bg-white/70 dark:bg-[#16121f]/70 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-white/8 p-6 flex flex-col gap-3 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#c9a84c]/40 dark:hover:border-[#c9a84c]/30 hover:-translate-y-0.5"
      onClick={() => navigate(`/dashboard/section/${section._id}`)}
    >
      {/* Top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-[#c9a84c] to-[#f0d074] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-900 dark:bg-white/10 text-white dark:text-white tracking-widest uppercase">
            {section.actCode}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#c9a84c]/10 text-[#8f6d19] dark:text-[#e6c364] border border-[#c9a84c]/20">
            Sec. {section.sectionNumber}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onBookmark(section); }}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isBookmarked
              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
              : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '17px', fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>
            bookmark
          </span>
        </button>
      </div>

      <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#c9a84c] dark:group-hover:text-[#e6c364] transition-colors duration-200 line-clamp-2">
        {section.sectionTitle || section.title || 'Untitled Section'}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 font-medium">
        {section.sectionDesc || section.content || section.description || 'No content preview available.'}
      </p>

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-white/5">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{section.actYear || ''}</span>
        <span className="text-xs font-semibold text-[#c9a84c] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          View Full <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
        </span>
      </div>
    </div>
  );
}

/* ─── Pagination ─────────────────────────────────────────────────── */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
      </button>

      {currentPage > delta + 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-all duration-200">1</button>
          {currentPage > delta + 2 && <span className="text-gray-400 px-1">…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all duration-200 ${
            p === currentPage
              ? 'bg-[#c9a84c] border-[#c9a84c] text-white shadow-md shadow-[#c9a84c]/30'
              : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c]'
          }`}
        >
          {p}
        </button>
      ))}

      {currentPage < totalPages - delta && (
        <>
          {currentPage < totalPages - delta - 1 && <span className="text-gray-400 px-1">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-all duration-200">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
      </button>
    </div>
  );
}

/* ─── BrowsePage ─────────────────────────────────────────────────── */
export default function BrowsePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { sections, loading, totalPages, currentPage, total } = useSelector((s) => s.sections);
  const { theme } = useSelector((s) => s.ui);
  const isDark = theme === 'dark';

  /* Filters */
  const actCodeParam = searchParams.get('actCode') || '';
  const [actCode, setActCode] = useState(actCodeParam);
  const [sort, setSort] = useState('sectionNumber');
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [page, setPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  /* Fetch sections */
  useEffect(() => {
    dispatch(fetchSections({ actCode, page, limit: 20, sort, q: debouncedQ }));
  }, [dispatch, actCode, page, sort, debouncedQ]);

  /* Sync actCode from URL param on mount */
  useEffect(() => {
    if (actCodeParam) setActCode(actCodeParam);
  }, [actCodeParam]);

  /* Fetch existing bookmarks to mark cards */
  useEffect(() => {
    api.get('/bookmarks')
      .then(res => {
        const ids = new Set((res.data?.data || []).map(b => b.sectionId?._id || b.sectionId));
        setBookmarkedIds(ids);
      })
      .catch(() => {});
  }, []);

  /* Handle act filter change — reset to page 1 */
  const handleActChange = (code) => {
    setActCode(code);
    setPage(1);
    setSearchParams(code ? { actCode: code } : {});
  };

  /* Handle bookmark toggle */
  const handleBookmark = useCallback(async (section) => {
    const isBookmarked = bookmarkedIds.has(section._id);
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${section._id}`);
        setBookmarkedIds(prev => { const n = new Set(prev); n.delete(section._id); return n; });
      } else {
        await api.post('/bookmarks', { sectionId: section._id });
        setBookmarkedIds(prev => new Set(prev).add(section._id));
      }
    } catch {
      // Optimistic update anyway
      setBookmarkedIds(prev => {
        const n = new Set(prev);
        isBookmarked ? n.delete(section._id) : n.add(section._id);
        return n;
      });
    }
  }, [bookmarkedIds]);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20 font-sans">

      {/* ── PAGE HEADER ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 font-medium mb-3">
          <Link to="/dashboard" className="hover:text-[#c9a84c] transition-colors">Dashboard</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
          <span className="text-gray-700 dark:text-gray-300 font-semibold">Browse Sections</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c9a84c] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              Browse Legal Sections
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {total > 0 ? `${total.toLocaleString('en-IN')} sections` : 'Loading...'}{actCode ? ` in ${actCode}` : ' across all acts'}
            </p>
          </div>
        </div>
      </div>

      {/* ── FILTERS BAR ── */}
      <div className="bg-white/80 dark:bg-[#16121f]/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-white/8 p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">

          {/* Search */}
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 dark:text-gray-500" style={{ fontSize: '20px' }}>search</span>
            <input
              type="text"
              value={q}
              onChange={e => { setQ(e.target.value); setPage(1); }}
              placeholder="Search sections by title or content..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/50 transition-all"
            />
          </div>

          {/* Act Filter */}
          <select
            value={actCode}
            onChange={e => handleActChange(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/50 transition-all min-w-[200px] cursor-pointer"
          >
            <option value="">All Acts</option>
            {ACTS.map(a => (
              <option key={a.actCode} value={a.actCode}>{a.actCode} — {a.actName}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/50 transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Clear filters */}
          {(actCode || q) && (
            <button
              onClick={() => { setActCode(''); setQ(''); setPage(1); setSearchParams({}); }}
              className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_alt_off</span>
              Clear
            </button>
          )}
        </div>

        {/* Act quick-filter chips */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={() => handleActChange('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              actCode === ''
                ? 'bg-[#c9a84c] text-white shadow-sm shadow-[#c9a84c]/30'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c]'
            }`}
          >
            All Acts
          </button>
          {ACTS.map(a => (
            <button
              key={a.actCode}
              onClick={() => handleActChange(a.actCode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                actCode === a.actCode
                  ? 'bg-[#c9a84c] text-white shadow-sm shadow-[#c9a84c]/30'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c]'
              }`}
            >
              {a.actCode}
            </button>
          ))}
        </div>
      </div>

      {/* ── SECTION LIST ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span className="material-symbols-outlined text-5xl text-[#c9a84c] animate-spin">progress_activity</span>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">find_in_page</span>
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">No sections found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters or search query.</p>
          <button
            onClick={() => { setActCode(''); setQ(''); setSearchParams({}); }}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] font-semibold text-sm hover:bg-[#c9a84c]/20 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {sections.map(section => (
              <SectionCard
                key={section._id}
                section={section}
                onBookmark={handleBookmark}
                bookmarkedIds={bookmarkedIds}
                dark={isDark}
              />
            ))}
          </div>

          {/* Pagination info + controls */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Page {currentPage} of {totalPages} · {total.toLocaleString('en-IN')} total sections
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
