import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { setQuery, removeFromHistory } from '../../store/slices/searchSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.ui);
  const { history } = useSelector((state) => state.search);
  const isDark = theme === 'dark';

  const [localValue, setLocalValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  /* Sync dark class on <html> */
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    dispatch(setQuery(e.target.value));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && localValue.trim().length >= 2) {
      setDropdownOpen(false);
      navigate(`/dashboard/search?q=${encodeURIComponent(localValue.trim())}`);
    }
    if (e.key === 'Escape') {
      setDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleHistoryClick = (q) => {
    setLocalValue(q);
    dispatch(setQuery(q));
    setDropdownOpen(false);
    navigate(`/dashboard/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="h-16 bg-white dark:bg-[#111415] border-b border-[#e5e7eb] dark:border-[#40484a] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">

      {/* Left: Hamburger (mobile) + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Open sidebar"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>menu</span>
        </button>

        {/* Global Search with recent-searches dropdown */}
        <div ref={containerRef} className="hidden sm:block relative max-w-md w-full">
          <div className="flex items-center bg-[#f9fafb] dark:bg-[#1d2021] border border-[#d1d5db] dark:border-[#40484a] rounded-lg px-3 py-2 focus-within:border-[#7c4dff] dark:focus-within:border-[#7c4dff] focus-within:shadow-[0_0_0_2px_rgba(124,77,255,0.18)] transition-all duration-200">
            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" style={{ fontSize: '20px' }}>
              search
            </span>
            <input
              ref={inputRef}
              id="navbar-search-input"
              type="text"
              value={localValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => history.length > 0 && setDropdownOpen(true)}
              placeholder="Search Acts, Sections, Precedents..."
              autoComplete="off"
              aria-label="Search laws"
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
              className="bg-transparent border-none outline-none w-full text-sm text-[#111827] dark:text-[#e1e3e4] placeholder-gray-400 dark:placeholder-gray-600"
            />
            {localValue && (
              <button
                type="button"
                onClick={() => { setLocalValue(''); dispatch(setQuery('')); inputRef.current?.focus(); }}
                aria-label="Clear search"
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ml-1"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
              </button>
            )}
          </div>

          {/* Recent searches dropdown */}
          {dropdownOpen && history.length > 0 && (
            <div
              role="listbox"
              aria-label="Recent searches"
              className="absolute top-full left-0 right-0 mt-1 bg-[#1d2021] border border-[#323536] rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-['JetBrains_Mono',monospace] text-[#494455] uppercase tracking-widest">
                  Recent
                </span>
              </div>
              {history.slice(0, 6).map((q) => (
                <div
                  key={q}
                  role="option"
                  className="flex items-center justify-between px-3 py-2 hover:bg-[#282a2b] cursor-pointer group"
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 flex-1 text-left"
                    onClick={() => handleHistoryClick(q)}
                  >
                    <span className="material-symbols-outlined text-[#494455]" style={{ fontSize: '14px' }}>history</span>
                    <span className="text-sm text-[#cac3d8] font-['Work_Sans',sans-serif]">{q}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); dispatch(removeFromHistory(q)); }}
                    aria-label={`Remove "${q}"`}
                    className="opacity-0 group-hover:opacity-100 text-[#494455] hover:text-[#ffb4ab] transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                  </button>
                </div>
              ))}
              {/* Navigate to full search page */}
              {localValue.trim().length >= 2 && (
                <button
                  type="button"
                  onClick={() => { setDropdownOpen(false); navigate(`/dashboard/search?q=${encodeURIComponent(localValue.trim())}`); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 border-t border-[#323536] hover:bg-[#282a2b] text-sm text-[#7c4dff] font-['Work_Sans',sans-serif] transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>search</span>
                  Search for "{localValue}"
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Theme + Notifications */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#1d2021] active:scale-90 transition-all text-gray-500 hover:text-gray-700 dark:text-[#c9a84c] dark:hover:text-[#e6c364]"
          aria-label="Toggle theme"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span
            className="material-symbols-outlined transition-transform duration-300 hover:rotate-45"
            style={{ fontSize: '19px', fontVariationSettings: isDark ? "'FILL' 1" : "'FILL' 0" }}
          >
            {isDark ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] dark:hover:bg-[#1d2021] transition-colors relative">
          <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9ca3af]" style={{ fontSize: '20px' }}>notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#111415]"></span>
        </button>
      </div>

    </header>
  );
};

export default Navbar;
