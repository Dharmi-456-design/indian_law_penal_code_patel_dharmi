import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/* ─── Helpers ─────────────────────────────────────────────────────── */

/**
 * Group a flat array of sections by their actCode.
 * Returns: { IPC: [...], CrPC: [...], ... }
 */
function groupByAct(sections) {
  return sections.reduce((acc, section) => {
    const key = section.actCode || 'OTHER';
    if (!acc[key]) acc[key] = [];
    acc[key].push(section);
    return acc;
  }, {});
}

/** Persist recent searches to localStorage (max 10) */
function saveToHistory(query) {
  if (!query || query.trim().length < 2) return;
  try {
    const raw = localStorage.getItem('lex_search_history');
    const history = raw ? JSON.parse(raw) : [];
    const updated = [query, ...history.filter((q) => q !== query)].slice(0, 10);
    localStorage.setItem('lex_search_history', JSON.stringify(updated));
  } catch (_) {
    // ignore storage errors
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem('lex_search_history');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

/* ─── Async Thunks ────────────────────────────────────────────────── */

/**
 * Day 22: Cross-act global search.
 * Hits GET /api/v1/search/global?q=&page=&limit=
 * Falls back to /sections?q=&page=&limit= if the global endpoint is unavailable.
 */
export const globalSearch = createAsyncThunk(
  'search/globalSearch',
  async ({ q, page = 1, limit = 30 } = {}, { rejectWithValue }) => {
    if (!q || q.trim().length < 2) return rejectWithValue('Query too short');
    try {
      saveToHistory(q.trim());
      const params = new URLSearchParams({ q: q.trim(), page, limit });
      const res = await api.get(`/search/global?${params.toString()}`);
      const data = res.data?.data || [];
      return {
        results: data,
        grouped: groupByAct(data),
        totalResults: res.data?.total || data.length,
        totalPages: res.data?.totalPages || 1,
        currentPage: res.data?.currentPage || page,
        query: q.trim(),
      };
    } catch (primaryErr) {
      // Fallback: use /sections?q= if global search endpoint returns 404
      if (primaryErr.response?.status === 404) {
        try {
          const params = new URLSearchParams({ q: q.trim(), page, limit });
          const fallback = await api.get(`/sections?${params.toString()}`);
          const data = fallback.data?.data || [];
          return {
            results: data,
            grouped: groupByAct(data),
            totalResults: fallback.data?.total || data.length,
            totalPages: fallback.data?.totalPages || 1,
            currentPage: fallback.data?.currentPage || page,
            query: q.trim(),
          };
        } catch (fallbackErr) {
          return rejectWithValue(
            fallbackErr.response?.data?.message || 'Search failed'
          );
        }
      }
      return rejectWithValue(
        primaryErr.response?.data?.message || 'Search failed'
      );
    }
  }
);

/**
 * Day 22: Act-scoped search.
 * Hits GET /api/v1/sections?q=&actCode=&page=&limit=
 */
export const searchByAct = createAsyncThunk(
  'search/searchByAct',
  async ({ q, actCode, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    if (!q || q.trim().length < 2) return rejectWithValue('Query too short');
    try {
      const params = new URLSearchParams({ q: q.trim(), page, limit });
      if (actCode && actCode !== 'ALL') params.set('actCode', actCode);
      const res = await api.get(`/sections?${params.toString()}`);
      const data = res.data?.data || [];
      return {
        results: data,
        grouped: groupByAct(data),
        totalResults: res.data?.total || data.length,
        totalPages: res.data?.totalPages || 1,
        currentPage: res.data?.currentPage || page,
        query: q.trim(),
        activeAct: actCode || 'ALL',
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

/* ─── Slice ───────────────────────────────────────────────────────── */

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    results: [],
    grouped: {},          // { actCode: [section, ...], ... }
    totalResults: 0,
    totalPages: 1,
    currentPage: 1,
    activeAct: 'ALL',     // current act filter chip
    loading: false,
    error: null,
    history: loadHistory(), // recent searches from localStorage
  },
  reducers: {
    /** Update live query string (no API call) */
    setQuery: (state, action) => {
      state.query = action.payload;
      if (!action.payload) {
        state.error = null;
      }
    },
    /** Set the active act filter chip */
    setActiveAct: (state, action) => {
      state.activeAct = action.payload;
    },
    /** Clear all results and reset state */
    clearResults: (state) => {
      state.results = [];
      state.grouped = {};
      state.totalResults = 0;
      state.totalPages = 1;
      state.currentPage = 1;
      state.error = null;
    },
    /** Clear error only */
    clearSearchError: (state) => {
      state.error = null;
    },
    /** Remove one entry from local history */
    removeFromHistory: (state, action) => {
      state.history = state.history.filter((q) => q !== action.payload);
      localStorage.setItem('lex_search_history', JSON.stringify(state.history));
    },
    /** Clear all history */
    clearHistory: (state) => {
      state.history = [];
      localStorage.removeItem('lex_search_history');
    },
  },
  extraReducers: (builder) => {
    // ── globalSearch ────────────────────────────────────────────────
    builder
      .addCase(globalSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(globalSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.grouped = action.payload.grouped;
        state.totalResults = action.payload.totalResults;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.query = action.payload.query;
        state.history = loadHistory(); // refresh from localStorage
      })
      .addCase(globalSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── searchByAct ─────────────────────────────────────────────────
    builder
      .addCase(searchByAct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByAct.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.grouped = action.payload.grouped;
        state.totalResults = action.payload.totalResults;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.query = action.payload.query;
        state.activeAct = action.payload.activeAct;
      })
      .addCase(searchByAct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setQuery,
  setActiveAct,
  clearResults,
  clearSearchError,
  removeFromHistory,
  clearHistory,
} = searchSlice.actions;

export default searchSlice.reducer;
