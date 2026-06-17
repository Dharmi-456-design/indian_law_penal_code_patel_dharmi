import React from 'react';
import { Link } from 'react-router-dom';

/* ─── Design tokens (aligned with LexIndia Night DESIGN.md) ────────── */
const ACT_COLORS = {
  IPC:  { bg: 'bg-[#1E1633]',  text: 'text-[#cdbdff]', border: 'border-[#7c4dff]' },
  CrPC: { bg: 'bg-[#16121F]',  text: 'text-[#bec7db]', border: 'border-[#697284]' },
  CPC:  { bg: 'bg-[#191c1d]',  text: 'text-[#e6c364]', border: 'border-[#785d00]' },
  HMA:  { bg: 'bg-[#0c0f10]',  text: 'text-[#ffb4ab]', border: 'border-[#93000a]' },
  IDA:  { bg: 'bg-[#1d2021]',  text: 'text-[#cac3d8]', border: 'border-[#494455]' },
  IEA:  { bg: 'bg-[#191c1d]',  text: 'text-[#e6c364]', border: 'border-[#584400]' },
  NIA:  { bg: 'bg-[#16121F]',  text: 'text-[#cdbdff]', border: 'border-[#4f00d0]' },
  MVA:  { bg: 'bg-[#1d2021]',  text: 'text-[#bec7db]', border: 'border-[#3e4758]' },
};

const ACT_FULL_NAMES = {
  IPC:  'Indian Penal Code, 1860',
  CrPC: 'Code of Criminal Procedure, 1973',
  CPC:  'Civil Procedure Code, 1908',
  HMA:  'Hindu Marriage Act, 1955',
  IDA:  'Indian Divorce Act, 1869',
  IEA:  'Indian Evidence Act, 1872',
  NIA:  'Negotiable Instruments Act, 1881',
  MVA:  'Motor Vehicles Act, 1988',
};

/* ─── Utility: highlight matched query text ─────────────────────────── */
function Highlight({ text = '', query = '' }) {
  if (!query || !text) return <span>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-[#7c4dff]/30 text-[#cdbdff] rounded-[2px] px-0.5 not-italic font-medium"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

/* ─── Skeleton loader ────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg bg-[#1d2021] border border-[#323536] p-4 mb-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-16 rounded bg-[#282a2b]" />
        <div className="h-5 w-8 rounded bg-[#282a2b]" />
      </div>
      <div className="h-4 w-3/4 rounded bg-[#282a2b] mb-2" />
      <div className="h-3 w-full rounded bg-[#1d2021] mb-1" />
      <div className="h-3 w-5/6 rounded bg-[#1d2021]" />
    </div>
  );
}

/* ─── Single Section result card ─────────────────────────────────────── */
function ResultCard({ section, query }) {
  const actKey = section.actCode || 'IPC';
  const colors = ACT_COLORS[actKey] || ACT_COLORS.IPC;

  // Show a short snippet of the description (~200 chars)
  const snippet =
    section.sectionDesc?.length > 200
      ? section.sectionDesc.slice(0, 200) + '…'
      : section.sectionDesc || '';

  return (
    <Link
      to={`/dashboard/section/${section._id}`}
      id={`result-${section._id}`}
      className="
        group block rounded-lg border border-[#323536]
        bg-[#191c1d] hover:bg-[#1d2021]
        hover:border-[#7c4dff]/50
        transition-all duration-200
        p-4 mb-3
      "
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Act badge */}
          <span
            className={`
              inline-flex items-center px-2 py-0.5
              rounded text-[11px] font-['JetBrains_Mono',monospace] font-medium
              border ${colors.bg} ${colors.text} ${colors.border}
            `}
          >
            {actKey}
          </span>
          {/* Section number */}
          <span className="text-[11px] font-['JetBrains_Mono',monospace] text-[#948ea1]">
            §{section.sectionNumber}
          </span>
          {/* Chapter badge */}
          {section.chapter && (
            <span className="text-[11px] font-['JetBrains_Mono',monospace] text-[#494455]">
              Ch. {section.chapter}
            </span>
          )}
        </div>
        {/* Relevance score */}
        {section.score != null && (
          <span className="text-[10px] font-['JetBrains_Mono',monospace] text-[#494455] flex-shrink-0">
            score {Number(section.score).toFixed(2)}
          </span>
        )}
      </div>

      {/* Section title */}
      <p className="text-sm font-semibold text-[#e1e3e4] font-['Work_Sans',sans-serif] mb-1.5 group-hover:text-[#cdbdff] transition-colors">
        <Highlight text={section.sectionTitle} query={query} />
      </p>

      {/* Description snippet */}
      <p className="text-xs text-[#948ea1] font-['Work_Sans',sans-serif] leading-relaxed line-clamp-3">
        <Highlight text={snippet} query={query} />
      </p>

      {/* Hover arrow */}
      <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-[#7c4dff]" style={{ fontSize: '16px' }}>
          arrow_forward
        </span>
      </div>
    </Link>
  );
}

/* ─── Act group accordion ────────────────────────────────────────────── */
function ActGroup({ actCode, sections, query, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const fullName = ACT_FULL_NAMES[actCode] || actCode;
  const colors = ACT_COLORS[actCode] || ACT_COLORS.IPC;

  return (
    <div className="mb-6">
      {/* Group header */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="
          w-full flex items-center justify-between
          px-3 py-2 rounded-lg mb-2
          bg-[#1d2021] hover:bg-[#282a2b]
          border border-[#323536]
          transition-colors duration-150
          cursor-pointer
        "
        id={`act-group-${actCode}`}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span
            className={`
              inline-flex items-center px-2 py-0.5
              rounded text-[11px] font-['JetBrains_Mono',monospace] font-medium
              border ${colors.bg} ${colors.text} ${colors.border}
            `}
          >
            {actCode}
          </span>
          <span className="text-sm font-['Work_Sans',sans-serif] text-[#cac3d8]">
            {fullName}
          </span>
          <span className="text-xs font-['JetBrains_Mono',monospace] text-[#494455]">
            ({sections.length} result{sections.length !== 1 ? 's' : ''})
          </span>
        </div>
        <span
          className={`material-symbols-outlined text-[#948ea1] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ fontSize: '18px' }}
        >
          expand_more
        </span>
      </button>

      {/* Results */}
      {open && (
        <div className="pl-1">
          {sections.map((section) => (
            <ResultCard key={section._id} section={section} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────── */
function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span
        className="material-symbols-outlined text-[#494455] mb-4"
        style={{ fontSize: '56px' }}
      >
        manage_search
      </span>
      <h3 className="text-lg font-semibold text-[#cac3d8] font-['Domine',serif] mb-2">
        No results for "{query}"
      </h3>
      <p className="text-sm text-[#948ea1] font-['Work_Sans',sans-serif] max-w-sm">
        Try different keywords, check your spelling, or search with a shorter phrase.
      </p>
    </div>
  );
}

/* ─── Main SearchResults component ──────────────────────────────────── */
/**
 * Day 22 — SearchResults component.
 *
 * Props:
 *   grouped       {object}  - { actCode: [section, ...], ... }
 *   query         {string}  - current search query
 *   loading       {boolean}
 *   totalResults  {number}
 */
const SearchResults = ({ grouped = {}, query = '', loading = false, totalResults = 0 }) => {
  const actCodes = Object.keys(grouped);

  /* Loading state — skeleton cards */
  if (loading) {
    return (
      <div className="mt-4" aria-live="polite" aria-busy="true">
        <div className="h-4 w-32 rounded bg-[#282a2b] animate-pulse mb-6" />
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  /* No query yet */
  if (!query) return null;

  /* Empty results */
  if (actCodes.length === 0) {
    return <EmptyState query={query} />;
  }

  return (
    <div className="mt-4" aria-live="polite">
      {/* Summary line */}
      <p className="text-xs font-['JetBrains_Mono',monospace] text-[#948ea1] mb-6">
        {totalResults} result{totalResults !== 1 ? 's' : ''} for{' '}
        <span className="text-[#e6c364]">"{query}"</span>
      </p>

      {/* One accordion group per act */}
      {actCodes.map((actCode, i) => (
        <ActGroup
          key={actCode}
          actCode={actCode}
          sections={grouped[actCode]}
          query={query}
          defaultOpen={i === 0}
        />
      ))}
    </div>
  );
};

export default SearchResults;
