import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { fetchSections } from '../../../store/slices/sectionsSlice';
import api from '../../../services/api';

/* ─── Constants ─────────────────────────────────────────────────────── */
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
  { value: 'sectionNumber',  label: 'Section No. ↑' },
  { value: '-sectionNumber', label: 'Section No. ↓' },
  { value: 'sectionTitle',   label: 'Title A–Z' },
  { value: '-sectionTitle',  label: 'Title Z–A' },
];

/* ─── Custom responsive dropdown ────────────────────────────────────── */
function CustomSelect({ value, onChange, options, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative min-w-[200px]">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] text-sm text-gray-900 dark:text-white hover:border-[#c9a84c]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-all cursor-pointer shadow-sm"
      >
        <span className={selected ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-[#6e7681]'}>
          {selected ? selected.label : placeholder}
        </span>
        <span
          className="material-symbols-outlined text-gray-400 dark:text-[#6e7681] transition-transform duration-200"
          style={{ fontSize: '18px', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                opt.value === value
                  ? 'bg-[#c9a84c]/15 text-[#c9a84c] font-semibold'
                  : 'text-gray-700 dark:text-[#c9d1d9] hover:bg-gray-100 dark:hover:bg-[#21262d] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SectionCard ───────────────────────────────────────────────────── */
function SectionCard({ section, onBookmark, bookmarkedIds }) {
  const navigate = useNavigate();
  const isBookmarked = bookmarkedIds.has(section._id);

  return (
    <div
      className="group relative bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#21262d] rounded-2xl p-6 flex flex-col gap-3 hover:border-[#c9a84c]/40 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(201,168,76,0.08)] transition-all duration-350 cursor-pointer"
      onClick={() => navigate(`/dashboard/section/${section._id}`)}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-[#c9a84c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#21262d] text-gray-700 dark:text-[#c9d1d9] tracking-widest uppercase">
            {section.actCode}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#c9a84c]/10 text-[#8f6d19] dark:text-[#e6c364] border border-[#c9a84c]/20">
            Sec. {section.sectionNumber}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onBookmark(section); }}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isBookmarked
              ? 'bg-amber-100 dark:bg-[#c9a84c]/20 text-amber-600 dark:text-[#c9a84c]'
              : 'bg-gray-100 dark:bg-[#21262d] text-gray-400 dark:text-[#6e7681] hover:text-[#c9a84c] hover:bg-amber-50 dark:hover:bg-[#c9a84c]/10'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '17px', fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
          >
            bookmark
          </span>
        </button>
      </div>

      <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#c9a84c] transition-colors duration-200 line-clamp-2">
        {section.sectionTitle || section.title || 'Untitled Section'}
      </h3>

      <p className="text-[13px] text-gray-500 dark:text-[#8b949e] leading-relaxed line-clamp-3">
        {section.sectionDesc || section.content || section.description || 'No content preview available.'}
      </p>

      <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 dark:border-[#21262d]">
        <span className="text-[11px] text-gray-400 dark:text-[#6e7681] font-medium">{section.actYear || ''}</span>
        <span className="text-[11px] font-semibold text-[#c9a84c] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          View Full <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
        </span>
      </div>
    </div>
  );
}

/* ─── Pagination ────────────────────────────────────────────────────── */
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
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-[#30363d] text-gray-500 dark:text-[#6e7681] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
      </button>

      {currentPage > delta + 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 rounded-xl text-sm font-semibold border border-gray-200 dark:border-[#30363d] text-gray-600 dark:text-[#8b949e] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-all">1</button>
          {currentPage > delta + 2 && <span className="text-gray-400 dark:text-[#6e7681] px-1">…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all ${
            p === currentPage
              ? 'bg-[#c9a84c] border-[#c9a84c] text-white dark:text-black shadow-md shadow-[#c9a84c]/30'
              : 'border-gray-200 dark:border-[#30363d] text-gray-600 dark:text-[#8b949e] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c]'
          }`}
        >
          {p}
        </button>
      ))}

      {currentPage < totalPages - delta && (
        <>
          {currentPage < totalPages - delta - 1 && <span className="text-gray-400 dark:text-[#6e7681] px-1">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 rounded-xl text-sm font-semibold border border-gray-200 dark:border-[#30363d] text-gray-600 dark:text-[#8b949e] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-all">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-[#30363d] text-gray-500 dark:text-[#6e7681] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
      </button>
    </div>
  );
}

/* ─── BrowsePage ────────────────────────────────────────────────────── */
export default function BrowsePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { sections, loading, totalPages, currentPage, total } = useSelector((s) => s.sections);

  /* Filters */
  const actCodeParam = searchParams.get('actCode') || '';
  const [actCode, setActCode]     = useState(actCodeParam);
  const [sort, setSort]           = useState('sectionNumber');
  const [q, setQ]                 = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [page, setPage]           = useState(1);
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

  /* Sync actCode from URL on mount */
  useEffect(() => {
    if (actCodeParam) setActCode(actCodeParam);
  }, [actCodeParam]);

  /* Fetch existing bookmarks */
  useEffect(() => {
    api.get('/bookmarks')
      .then(res => {
        const ids = new Set((res.data?.data || []).map(b => b.sectionId?._id || b.sectionId));
        setBookmarkedIds(ids);
      })
      .catch(() => {});
  }, []);

  const handleActChange = (code) => {
    setActCode(code);
    setPage(1);
    setSearchParams(code ? { actCode: code } : {});
  };

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

  /* Build options for custom dropdowns */
  const actOptions = [
    { value: '', label: 'All Acts' },
    ...ACTS.map(a => ({ value: a.actCode, label: `${a.actCode} — ${a.actName}` }))
  ];

  return (
    <div className="min-h-screen pb-20 font-sans text-gray-900 dark:text-white bg-transparent">

      {/* ── Background glow ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[10%] w-[500px] h-[350px] bg-[#c9a84c]/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[10%] w-[400px] h-[300px] bg-[#7c4dff]/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">

        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#6e7681] font-medium mb-3">
            <Link to="/dashboard" className="hover:text-[#c9a84c] transition-colors">Dashboard</Link>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
            <span className="text-gray-700 dark:text-[#c9d1d9] font-semibold">Browse Sections</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[#c9a84c] text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  menu_book
                </span>
                Browse Legal Sections
              </h1>
              <p className="text-sm text-gray-500 dark:text-[#6e7681] mt-1 font-medium">
                {total > 0
                  ? `${total.toLocaleString('en-IN')} sections`
                  : 'Loading...'}
                {actCode ? ` in ${actCode}` : ' across all acts'}
              </p>
            </div>

            {/* Quick stats */}
            {total > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <div className="px-4 py-2 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                  <span className="text-gray-500 dark:text-[#8b949e]">Page</span>
                  <span className="text-gray-900 dark:text-white font-bold">{currentPage}</span>
                  <span className="text-gray-400 dark:text-[#6e7681]">/ {totalPages}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FILTERS BAR ── */}
        <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#21262d] rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="flex-1 relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 dark:text-[#6e7681]"
                style={{ fontSize: '20px' }}
              >
                search
              </span>
              <input
                type="text"
                value={q}
                onChange={e => { setQ(e.target.value); setPage(1); }}
                placeholder="Search sections by title or content..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#6e7681] focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all shadow-sm"
              />
            </div>

            {/* Act Filter — custom dropdown */}
            <CustomSelect
              value={actCode}
              onChange={handleActChange}
              options={actOptions}
              placeholder="All Acts"
            />

            {/* Sort — custom dropdown */}
            <CustomSelect
              value={sort}
              onChange={(v) => { setSort(v); setPage(1); }}
              options={SORT_OPTIONS}
              placeholder="Sort by..."
            />

            {/* Clear filters */}
            {(actCode || q) && (
              <button
                onClick={() => { setActCode(''); setQ(''); setPage(1); setSearchParams({}); }}
                className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_alt_off</span>
                Clear
              </button>
            )}
          </div>

          {/* Act quick-filter chips */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-[#21262d]">
            <button
              onClick={() => handleActChange('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                actCode === ''
                  ? 'bg-[#c9a84c] text-white dark:text-black shadow-sm shadow-[#c9a84c]/30'
                  : 'bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] text-gray-600 dark:text-[#8b949e] hover:border-[#c9a84c]/40 hover:text-[#c9a84c]'
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
                    ? 'bg-[#c9a84c] text-white dark:text-black shadow-sm shadow-[#c9a84c]/30'
                    : 'bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] text-gray-600 dark:text-[#8b949e] hover:border-[#c9a84c]/40 hover:text-[#c9a84c]'
                }`}
              >
                {a.actCode}
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION LIST ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#21262d] rounded-2xl p-6 animate-pulse space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 bg-gray-200 dark:bg-[#21262d] rounded-lg w-12" />
                  <div className="h-5 bg-gray-200 dark:bg-[#21262d] rounded-lg w-16" />
                </div>
                <div className="h-5 bg-gray-200 dark:bg-[#21262d] rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 dark:bg-[#161b22] rounded w-full" />
                  <div className="h-3 bg-gray-100 dark:bg-[#161b22] rounded w-5/6" />
                  <div className="h-3 bg-gray-100 dark:bg-[#161b22] rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-[#21262d] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-gray-400 dark:text-[#6e7681] text-4xl">find_in_page</span>
            </div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">No sections found</p>
            <p className="text-sm text-gray-500 dark:text-[#6e7681]">Try adjusting your filters or search query.</p>
            <button
              onClick={() => { setActCode(''); setQ(''); setSearchParams({}); }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] font-semibold text-sm hover:bg-[#c9a84c]/20 transition-colors border border-[#c9a84c]/20"
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
                />
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-xs text-gray-500 dark:text-[#6e7681] font-medium">
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
    </div>
  );
}
