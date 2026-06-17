import React, { useRef } from 'react';

/**
 * Day 22 — Reusable SearchInput component.
 * Purely presentational — no Redux connection.
 *
 * Props:
 *   value        {string}   - controlled input value
 *   onChange     {fn}       - called with the raw string on every keystroke
 *   onClear      {fn}       - called when the ✕ button is clicked
 *   onSubmit     {fn}       - called on Enter key press / form submit
 *   placeholder  {string}
 *   isLoading    {boolean}  - shows spinner when true
 *   autoFocus    {boolean}
 *   id           {string}
 */
const SearchInput = ({
  value = '',
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search Acts, Sections, Precedents...',
  isLoading = false,
  autoFocus = false,
  id = 'search-input',
}) => {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit(value);
    }
    if (e.key === 'Escape' && onClear) {
      onClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className="
        flex items-center gap-2 w-full
        bg-[#0c0f10] dark:bg-[#0c0f10]
        border border-[#323536] dark:border-[#323536]
        rounded-lg px-4 py-3
        focus-within:border-[#7c4dff] focus-within:shadow-[0_0_0_3px_rgba(124,77,255,0.18)]
        transition-all duration-200
      "
    >
      {/* Search icon / Loading spinner */}
      <span
        className={`
          flex-shrink-0 text-[#948ea1]
          ${isLoading ? 'animate-spin' : ''}
        `}
        style={{ fontSize: '20px' }}
        aria-hidden="true"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
          {isLoading ? 'progress_activity' : 'search'}
        </span>
      </span>

      {/* Text input */}
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        className="
          flex-1 min-w-0
          bg-transparent border-none outline-none
          text-sm text-[#e1e3e4]
          placeholder-[#494455]
          font-['Work_Sans',sans-serif]
          [&::-webkit-search-cancel-button]:hidden
        "
      />

      {/* Clear button — shown only when there's a value */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onClear?.();
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="
            flex-shrink-0 w-6 h-6 flex items-center justify-center
            rounded-full
            text-[#948ea1] hover:text-[#e1e3e4]
            hover:bg-[#323536]
            transition-colors duration-150
          "
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            close
          </span>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
