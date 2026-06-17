import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  globalSearch,
  searchByAct,
  setQuery,
  setActiveAct,
  clearResults,
  clearHistory,
  removeFromHistory,
} from '../../../store/slices/searchSlice';
import useDebounce from '../../../hooks/useDebounce';
import SearchInput from '../../../components/shared/SearchInput';
import SearchResults from '../../../components/shared/SearchResults';

/* ─── Act filter chip data ──────────────────────────────────────────── */
const ACT_CHIPS = [
  { code: 'ALL', label: 'All Acts' },
  { code: 'IPC',  label: 'IPC' },
  { code: 'CrPC', label: 'CrPC' },
  { code: 'CPC',  label: 'CPC' },
  { code: 'HMA',  label: 'HMA' },
  { code: 'IDA',  label: 'IDA' },
  { code: 'IEA',  label: 'IEA' },
  { code: 'NIA',  label: 'NIA' },
  { code: 'MVA',  label: 'MVA' },
];

/* ─── SearchPage ────────────────────────────────────────────────────── */
export default function SearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    query: storeQuery,
    grouped,
    totalResults,
    totalPages,
    currentPage,
    activeAct,
    loading,
    error,
    history,
  } = useSelector((state) => state.search);

  /* Local controlled input (debounced before hitting the API) */
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(localQuery, 300);

  /* ── Sync URL → local state on mount ─────────────────────────────── */
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    if (urlQ) {
      setLocalQuery(urlQ);
      dispatch(setQuery(urlQ));
    }
    return () => {
      dispatch(clearResults());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Fire search when debounced query changes ─────────────────────── */
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      dispatch(clearResults());
      return;
    }

    // Update URL params
    setSearchParams({ q: debouncedQuery.trim() }, { replace: true });

    if (activeAct === 'ALL') {
      dispatch(globalSearch({ q: debouncedQuery.trim(), page: 1 }));
    } else {
      dispatch(searchByAct({ q: debouncedQuery.trim(), actCode: activeAct, page: 1 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, activeAct]);

  /* ── Handler: act filter chip click ──────────────────────────────── */
  const handleActFilter = useCallback(
    (code) => {
      dispatch(setActiveAct(code));
      // Re-trigger search immediately (no need to wait for debouncedQuery)
      if (debouncedQuery.trim().length >= 2) {
        if (code === 'ALL') {
          dispatch(globalSearch({ q: debouncedQuery.trim(), page: 1 }));
        } else {
          dispatch(searchByAct({ q: debouncedQuery.trim(), actCode: code, page: 1 }));
        }
      }
    },
    [dispatch, debouncedQuery]
  );

  /* ── Handler: load more (next page) ──────────────────────────────── */
  const handleLoadMore = () => {
    if (currentPage >= totalPages || loading) return;
    const nextPage = currentPage + 1;
    if (activeAct === 'ALL') {
      dispatch(globalSearch({ q: storeQuery, page: nextPage }));
    } else {
      dispatch(searchByAct({ q: storeQuery, actCode: activeAct, page: nextPage }));
    }
  };

  /* ── Handler: recent search click ────────────────────────────────── */
  const handleHistoryClick = (q) => {
    setLocalQuery(q);
    dispatch(setQuery(q));
  };

  /* ── Handler: clear input ─────────────────────────────────────────── */
  const handleClear = () => {
    setLocalQuery('');
    dispatch(setQuery(''));
    dispatch(clearResults());
    setSearchParams({}, { replace: true });
  };

  const hasResults = Object.keys(grouped).length > 0;
  const showHistory = !localQuery && history.length > 0;

  return (
    <div className="min-h-screen bg-[#111415] text-[#e1e3e4] font-['Work_Sans',sans-serif]">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="border-b border-[#323536] bg-[#0c0f10] sticky top-0 z-20 px-4 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Back + Title */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="
                w-8 h-8 flex items-center justify-center rounded-full
                text-[#948ea1] hover:text-[#e1e3e4]
                hover:bg-[#1d2021]
                transition-colors duration-150
              "
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                arrow_back
              </span>
            </button>
            <h1 className="text-xl font-['Domine',serif] font-semibold text-[#e1e3e4]">
              Search Laws
            </h1>
          </div>

          {/* Search input */}
          <SearchInput
            id="search-page-input"
            value={localQuery}
            onChange={setLocalQuery}
            onClear={handleClear}
            onSubmit={(q) => {
              if (q.trim().length >= 2) {
                dispatch(globalSearch({ q: q.trim(), page: 1 }));
              }
            }}
            isLoading={loading}
            autoFocus
            placeholder="Search Acts, Sections, Precedents..."
          />
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">

        {/* ── Act filter chips ──────────────────────────────────────── */}
        {(localQuery.length >= 2 || hasResults) && (
          <div
            className="flex items-center gap-2 flex-wrap mb-6"
            role="group"
            aria-label="Filter by Act"
          >
            {ACT_CHIPS.map(({ code, label }) => {
              const isActive = activeAct === code;
              return (
                <button
                  key={code}
                  type="button"
                  id={`filter-chip-${code}`}
                  onClick={() => handleActFilter(code)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium
                    font-['JetBrains_Mono',monospace]
                    border transition-all duration-150
                    ${
                      isActive
                        ? 'bg-[#7c4dff] text-white border-[#7c4dff] shadow-[0_0_8px_rgba(124,77,255,0.4)]'
                        : 'bg-[#1d2021] text-[#948ea1] border-[#323536] hover:border-[#7c4dff]/50 hover:text-[#cdbdff]'
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Recent search history ─────────────────────────────────── */}
        {showHistory && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-['JetBrains_Mono',monospace] text-[#494455] uppercase tracking-widest">
                Recent Searches
              </h2>
              <button
                type="button"
                onClick={() => dispatch(clearHistory())}
                className="text-xs text-[#7c4dff] hover:text-[#cdbdff] transition-colors font-['Work_Sans',sans-serif]"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((q) => (
                <div key={q} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleHistoryClick(q)}
                    className="
                      flex items-center gap-1.5 px-3 py-1.5
                      bg-[#1d2021] border border-[#323536]
                      rounded-full text-xs text-[#cac3d8]
                      hover:border-[#7c4dff]/50 hover:text-[#cdbdff]
                      transition-colors duration-150
                      font-['Work_Sans',sans-serif]
                    "
                  >
                    <span className="material-symbols-outlined text-[#494455]" style={{ fontSize: '14px' }}>
                      history
                    </span>
                    {q}
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromHistory(q))}
                    aria-label={`Remove "${q}" from history`}
                    className="text-[#494455] hover:text-[#ffb4ab] transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Error state ───────────────────────────────────────────── */}
        {error && !loading && localQuery.length >= 2 && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-[#93000a]/20 border border-[#93000a] mb-6">
            <span className="material-symbols-outlined text-[#ffb4ab]" style={{ fontSize: '20px' }}>
              error_outline
            </span>
            <p className="text-sm text-[#ffb4ab] font-['Work_Sans',sans-serif]">
              {error === 'Query too short'
                ? 'Enter at least 2 characters to search.'
                : `Search failed: ${error}`}
            </p>
          </div>
        )}

        {/* ── Query too short hint ──────────────────────────────────── */}
        {localQuery.length === 1 && (
          <p className="text-sm text-[#494455] font-['Work_Sans',sans-serif] mt-4">
            Keep typing…
          </p>
        )}

        {/* ── Empty prompt (no query yet, no history) ───────────────── */}
        {!localQuery && !showHistory && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span
              className="material-symbols-outlined text-[#323536] mb-4"
              style={{ fontSize: '64px' }}
            >
              search
            </span>
            <h2 className="text-xl font-['Domine',serif] font-semibold text-[#cac3d8] mb-2">
              Search across all Indian Acts
            </h2>
            <p className="text-sm text-[#494455] font-['Work_Sans',sans-serif] max-w-md">
              Type a keyword, section number, or legal term to search across IPC, CrPC, CPC, HMA, IDA, IEA, NIA and MVA.
            </p>
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────────── */}
        <SearchResults
          grouped={grouped}
          query={storeQuery}
          loading={loading}
          totalResults={totalResults}
        />

        {/* ── Load more button ──────────────────────────────────────── */}
        {hasResults && currentPage < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              id="search-load-more"
              onClick={handleLoadMore}
              disabled={loading}
              className="
                flex items-center gap-2 px-6 py-2.5
                bg-[#1d2021] hover:bg-[#282a2b]
                border border-[#323536] hover:border-[#7c4dff]/50
                rounded-lg text-sm text-[#cac3d8] hover:text-[#cdbdff]
                font-['Work_Sans',sans-serif]
                transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[#7c4dff]" style={{ fontSize: '18px' }}>
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  expand_more
                </span>
              )}
              Load more results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
