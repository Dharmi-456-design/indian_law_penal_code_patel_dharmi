import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

/* ─── Act code → label map ─────────────────────────────────────────── */
const ACT_TAG_MAP = {
  IPC:  ['Penal Code', 'Criminal Law'],
  CrPC: ['Criminal Procedure', 'Criminal Law'],
  CPC:  ['Civil Procedure', 'Civil Law'],
  HMA:  ['Family Law', 'Hindu Law'],
  IEA:  ['Evidence', 'Criminal Law'],
  NIA:  ['Banking', 'Corporate'],
  MVA:  ['Motor Law', 'Civil Law'],
  COI:  ['Constitutional Law', 'Fundamental Rights'],
};

const ACT_FULL = {
  IPC:  'Indian Penal Code, 1860',
  CrPC: 'Code of Criminal Procedure, 1973',
  CPC:  'Code of Civil Procedure, 1908',
  HMA:  'Hindu Marriage Act, 1955',
  IEA:  'Indian Evidence Act, 1872',
  NIA:  'Negotiable Instruments Act, 1881',
  MVA:  'Motor Vehicles Act, 1988',
  COI:  'Constitution of India',
};

/* ─── Fallback demo bookmarks ───────────────────────────────────────── */
const FALLBACK = [
  {
    _id: 'f1',
    actCode: 'IPC',
    sectionNumber: '420',
    sectionTitle: 'Cheating and dishonestly inducing delivery of property',
    description: 'Cheating and dishonestly inducing delivery of property.—Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person...',
    note: '',
    tags: ['Fraud', 'Property'],
    verified: true,
  },
  {
    _id: 'f2',
    actCode: 'COI',
    sectionNumber: '21',
    sectionTitle: 'Article 21',
    description: 'Protection of life and personal liberty.—No person shall be deprived of his life or personal liberty except according to procedure established by law.',
    note: '',
    tags: ['Fundamental Rights', 'Constitutional Law'],
    verified: false,
  },
  {
    _id: 'f3',
    actCode: 'NIA',
    sectionNumber: '138',
    sectionTitle: 'Section 138',
    description: 'Dishonour of cheque for insufficiency, etc., of funds in the account.—Where any cheque drawn by a person on an account maintained by him with a banker...',
    note: '',
    tags: ['Banking', 'Corporate'],
    verified: false,
  },
  {
    _id: 'f4',
    actCode: 'CPC',
    sectionNumber: 'O39R1',
    sectionTitle: 'Order 39 Rule 1',
    description: 'Cases in which temporary injunction may be granted.—Where in any suit it is proved by affidavit or otherwise that any property in dispute in a suit is in danger of being wasted...',
    note: 'My Note: Reference for the Sharma vs Singh property dispute upcoming hearing.',
    tags: ['Civil Procedure', 'Injunction'],
    verified: false,
  },
  {
    _id: 'f5',
    actCode: 'IPC',
    sectionNumber: '302',
    sectionTitle: 'Punishment for murder',
    description: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    note: 'Rarest of Rare doctrine applies—see Bachan Singh v. State of Punjab.',
    tags: ['Penal Code', 'Criminal Law'],
    verified: true,
  },
  {
    _id: 'f6',
    actCode: 'CrPC',
    sectionNumber: '438',
    sectionTitle: 'Direction for grant of bail to person apprehending arrest',
    description: 'When any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session...',
    note: '',
    tags: ['Criminal Procedure', 'Criminal Law'],
    verified: false,
  },
];

/* ─── Derive all available tag labels ──────────────────────────────── */
function getAllTags(bookmarks) {
  const set = new Set();
  bookmarks.forEach(b => (b.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort();
}

/* ─── Single bookmark card ──────────────────────────────────────────── */
function BookmarkCard({ bookmark, onRemove, navigate }) {
  const [removing, setRemoving] = useState(false);
  const actFullName = ACT_FULL[bookmark.actCode] || bookmark.actCode;

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await api.delete(`/bookmarks/${bookmark._id}`);
    } catch (_) { /* silent */ }
    onRemove(bookmark._id);
  };

  const handleOpen = () => {
    navigate(`/dashboard/browse?actCode=${bookmark.actCode}&section=${bookmark.sectionNumber}`);
  };

  return (
    <div
      className={`bm-card group relative flex flex-col bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#21262d] rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-300 dark:hover:border-[#30363d] hover:shadow-lg dark:hover:shadow-[0_0_24px_rgba(0,0,0,0.5)] ${removing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      style={{ transition: 'opacity 0.3s, transform 0.3s, border-color 0.2s, box-shadow 0.2s' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a84c]/60 via-[#c9a84c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Verified badge */}
        {bookmark.verified && (
          <span className="self-start text-[11px] font-bold px-2.5 py-1 border border-gray-200 dark:border-[#30363d] text-gray-500 dark:text-[#8b949e] rounded uppercase tracking-widest bg-gray-50 dark:bg-transparent">
            VERIFIED
          </span>
        )}

        {/* Title */}
        <div>
          <h3 className="text-[17px] font-bold text-[#8f6d19] dark:text-[#c9a84c] leading-snug group-hover:text-amber-600 dark:group-hover:text-[#e6c364] transition-colors">
            {bookmark.sectionTitle || `Section ${bookmark.sectionNumber}`}
          </h3>
          <p className="text-xs font-mono text-gray-400 dark:text-[#6e7681] mt-0.5 tracking-wide">{actFullName}</p>
        </div>

        {/* Text excerpt box */}
        {bookmark.description && (
          <div className="bg-gray-50 dark:bg-[#161b22] border border-gray-150 dark:border-[#21262d] rounded-lg p-3.5">
            <p className="text-[13.5px] text-gray-600 dark:text-[#8b949e] leading-relaxed line-clamp-4">
              {bookmark.description}
            </p>

            {/* Note section */}
            {bookmark.note && (
              <>
                <div className="my-2.5 border-t border-dashed border-gray-200 dark:border-[#30363d]" />
                <div className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-[#8f6d19] dark:text-[#c9a84c] text-[14px] mt-0.5 shrink-0">edit_note</span>
                  <p className="text-[12px] font-mono text-gray-700 dark:text-[#c9a84c]/80 leading-relaxed">{bookmark.note}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tags */}
        {(bookmark.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {bookmark.tags.map(tag => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] text-gray-500 dark:text-[#8b949e] rounded tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card footer actions */}
      <div className="border-t border-gray-200 dark:border-[#21262d] px-5 py-3 flex items-center justify-between bg-gray-50/50 dark:bg-[#0d1117]">
        <button
          onClick={handleOpen}
          className="text-xs font-semibold text-blue-600 dark:text-[#58a6ff] hover:text-blue-500 dark:hover:text-[#79c0ff] flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          View Section
        </button>
        <button
          onClick={handleRemove}
          className="text-xs text-gray-400 dark:text-[#6e7681] hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100"
        >
          <span className="material-symbols-outlined text-[14px]">bookmark_remove</span>
          Remove
        </button>
      </div>
    </div>
  );
}

/* ─── Main BookmarksPage ────────────────────────────────────────────── */
export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All Bookmarks');
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [customTags, setCustomTags] = useState([]);
  const [page, setPage] = useState(1);
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const PAGE_SIZE = 9;

  /* Fetch bookmarks */
  useEffect(() => {
    setLoading(true);
    api.get('/bookmarks')
      .then(res => {
        const data = res.data?.data || [];
        if (data.length > 0) {
          const mapped = data.map(b => {
            const actCode = b.lawId?.actCode || b.actCode || '';
            const sectionNumber = b.lawId?.sectionNumber || b.sectionNumber || '';
            const sectionTitle = b.lawId?.sectionTitle || b.lawId?.sectionTitle || `Section ${sectionNumber}`;
            const description = b.lawId?.description || b.description || '';
            const tags = ACT_TAG_MAP[actCode] || [actCode];
            return { _id: b._id, actCode, sectionNumber, sectionTitle, description, note: b.note || '', tags, verified: b.lawId?.isVerified || false };
          });
          setBookmarks(mapped);
        } else {
          setBookmarks(FALLBACK);
        }
      })
      .catch(() => setBookmarks(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  /* Derived tags list */
  const allTags = useMemo(() => {
    const base = getAllTags(bookmarks);
    return ['All Bookmarks', ...base, ...customTags.filter(t => !base.includes(t))];
  }, [bookmarks, customTags]);

  /* Filtered + searched bookmarks */
  const filtered = useMemo(() => {
    let result = bookmarks;
    if (activeTag !== 'All Bookmarks') {
      result = result.filter(b => (b.tags || []).includes(activeTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        (b.sectionTitle || '').toLowerCase().includes(q) ||
        (b.actCode || '').toLowerCase().includes(q) ||
        (b.sectionNumber || '').toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q) ||
        (b.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [bookmarks, activeTag, searchQuery]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const handleRemove = (id) => {
    setBookmarks(prev => prev.filter(b => b._id !== id));
  };

  const addCustomTag = () => {
    const tag = newTagInput.trim();
    if (tag && !allTags.includes(tag)) {
      setCustomTags(prev => [...prev, tag]);
    }
    setNewTagInput('');
    setShowTagInput(false);
    setActiveTag(tag || activeTag);
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-white font-sans">
      {/* ── Background glow ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[400px] bg-[#c9a84c]/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[350px] bg-[#58a6ff]/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 py-10">

        {/* ── Page header ── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight mb-1">Bookmarks Library</h1>
            <p className="text-gray-500 dark:text-[#6e7681] text-[15px] font-light">
              Manage and organize your saved legal sections and annotations.
            </p>
          </div>

          {/* Search + Filter row */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#6e7681] text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search bookmarks..."
                className="w-[260px] pl-9 pr-4 py-2.5 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#6e7681] outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilterPanel(prev => !prev)}
              className={`flex items-center justify-center w-10 h-10 border rounded-xl active:scale-95 transition-all ${
                showFilterPanel
                  ? 'bg-[#c9a84c]/10 border-[#c9a84c]/50 text-[#8f6d19] dark:text-[#c9a84c]'
                  : 'bg-white dark:bg-[#161b22] border-gray-200 dark:border-[#30363d] text-gray-400 dark:text-[#6e7681] hover:border-[#c9a84c]/50 hover:bg-gray-50 dark:hover:bg-[#1c2128]'
              }`}
              title="Toggle tag filters"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {/* ── Tag filter chips ── */}
        <div
          className={`flex flex-wrap items-center gap-2 overflow-hidden transition-all duration-350 ${
            showFilterPanel ? 'max-h-[300px] mb-8 opacity-100' : 'max-h-0 mb-0 opacity-0 pointer-events-none'
          }`}
          style={{ transitionProperty: 'max-height, margin-bottom, opacity' }}
        >
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => { setActiveTag(tag); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-[#c9a84c] border-[#c9a84c] text-white dark:text-black shadow-[0_0_12px_rgba(201,168,76,0.3)]'
                  : 'bg-transparent border-gray-200 dark:border-[#30363d] text-gray-500 dark:text-[#8b949e] hover:border-[#c9a84c]/50 hover:text-[#c9a84c]/80'
              }`}
            >
              {tag}
            </button>
          ))}

          {/* + New Tag */}
          {showTagInput ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                type="text"
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addCustomTag(); if (e.key === 'Escape') setShowTagInput(false); }}
                placeholder="Tag name..."
                className="px-3 py-1 bg-white dark:bg-[#161b22] border border-[#c9a84c]/50 rounded-full text-[12px] text-gray-900 dark:text-white outline-none w-28"
              />
              <button onClick={addCustomTag} className="text-[#8f6d19] dark:text-[#c9a84c] hover:text-[#c9a84c] dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </button>
              <button onClick={() => setShowTagInput(false)} className="text-gray-400 dark:text-[#6e7681] hover:text-gray-900 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowTagInput(true)}
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold border border-dashed border-gray-200 dark:border-[#30363d] text-gray-500 dark:text-[#8b949e] hover:border-[#c9a84c]/50 hover:text-[#c9a84c]/80 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              New Tag
            </button>
          )}
        </div>

        {/* ── Stats bar ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[13px] text-gray-500 dark:text-[#6e7681]">
            {loading ? 'Loading...' : (
              <>
                Showing <span className="text-gray-900 dark:text-white font-medium">{visible.length}</span> of{' '}
                <span className="text-gray-900 dark:text-white font-medium">{filtered.length}</span> bookmarks
                {activeTag !== 'All Bookmarks' && <> · filtered by <span className="text-[#8f6d19] dark:text-[#c9a84c]">{activeTag}</span></>}
              </>
            )}
          </p>
          {!loading && bookmarks.length > 0 && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-[#6e7681]">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
              {bookmarks.length} saved sections
            </div>
          )}
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#21262d] rounded-2xl p-5 animate-pulse space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-[#21262d] rounded w-1/3" />
                <div className="h-5 bg-gray-200 dark:bg-[#21262d] rounded w-2/3" />
                <div className="h-3 bg-gray-200 dark:bg-[#21262d] rounded w-1/2" />
                <div className="h-24 bg-gray-50 dark:bg-[#161b22] rounded-lg" />
                <div className="flex gap-2">
                  <div className="h-4 bg-gray-200 dark:bg-[#21262d] rounded w-16" />
                  <div className="h-4 bg-gray-200 dark:bg-[#21262d] rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-[#21262d] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-gray-400 dark:text-[#6e7681] text-4xl">bookmarks</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No bookmarks found</h3>
            <p className="text-gray-500 dark:text-[#6e7681] text-sm max-w-xs">
              {searchQuery ? `No results for "${searchQuery}". Try a different search.` : 'Start browsing legal sections and bookmark them for quick access.'}
            </p>
            <button
              onClick={() => navigate('/dashboard/browse')}
              className="mt-6 px-6 py-2.5 bg-[#c9a84c] hover:bg-[#b0903a] text-white dark:text-black font-semibold rounded-xl transition-colors text-sm"
            >
              Browse Legal Codes
            </button>
          </div>
        )}

        {/* ── Card grid ── */}
        {!loading && visible.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map(bookmark => (
              <BookmarkCard
                key={bookmark._id}
                bookmark={bookmark}
                onRemove={handleRemove}
                navigate={navigate}
              />
            ))}
          </div>
        )}

        {/* ── Load more ── */}
        {!loading && hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] hover:border-[#c9a84c]/50 hover:bg-gray-50 dark:hover:bg-[#1c2128] text-gray-500 dark:text-[#8b949e] hover:text-[#8f6d19] dark:hover:text-[#c9a84c] rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm"
            >
              Load More Bookmarks
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </div>
        )}

        {/* ── End of results ── */}
        {!loading && !hasMore && visible.length > 0 && (
          <div className="flex justify-center mt-10">
            <p className="text-[12px] text-gray-400 dark:text-[#6e7681] flex items-center gap-2">
              <span className="w-12 h-px bg-gray-250 dark:bg-[#21262d]" />
              All {filtered.length} bookmarks shown
              <span className="w-12 h-px bg-gray-250 dark:bg-[#21262d]" />
            </p>
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bm-card {
          animation: fadeInUp 0.35s ease both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
