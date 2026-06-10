import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/* ─── Async Thunks ────────────────────────────────────────────────── */

/** Day 20: fetch all acts with section counts */
export const fetchAllSections = createAsyncThunk(
  'sections/fetchAllSections',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/acts');
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch acts');
    }
  }
);

/** Day 20: fetch sections for a specific act */
export const fetchByActCode = createAsyncThunk(
  'sections/fetchByActCode',
  async (actCode, { rejectWithValue }) => {
    try {
      const res = await api.get(`/sections?actCode=${actCode}&limit=1000`);
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch sections');
    }
  }
);

/** Day 21: fetch paginated sections with filters */
export const fetchSections = createAsyncThunk(
  'sections/fetchSections',
  async ({ actCode = '', page = 1, limit = 20, sort = 'sectionNumber', q = '' } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit, sort });
      if (actCode) params.set('actCode', actCode);
      if (q) params.set('q', q);
      const res = await api.get(`/sections?${params.toString()}`);
      return {
        sections: res.data?.data || [],
        totalPages: res.data?.totalPages || 1,
        currentPage: res.data?.currentPage || page,
        total: res.data?.total || 0,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch sections');
    }
  }
);

/** Day 21: fetch a single section by ID */
export const fetchById = createAsyncThunk(
  'sections/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/sections/${id}`);
      return res.data?.data || null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch section');
    }
  }
);

/* ─── Slice ───────────────────────────────────────────────────────── */

const sectionsSlice = createSlice({
  name: 'sections',
  initialState: {
    acts: [],
    sections: [],
    currentSection: null,
    totalPages: 1,
    currentPage: 1,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentSection: (state) => {
      state.currentSection = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllSections
    builder
      .addCase(fetchAllSections.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllSections.fulfilled, (state, action) => { state.loading = false; state.acts = action.payload; })
      .addCase(fetchAllSections.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // fetchByActCode
    builder
      .addCase(fetchByActCode.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchByActCode.fulfilled, (state, action) => { state.loading = false; state.sections = action.payload; })
      .addCase(fetchByActCode.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // fetchSections (paginated)
    builder
      .addCase(fetchSections.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload.sections;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(fetchSections.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // fetchById
    builder
      .addCase(fetchById.pending, (state) => { state.loading = true; state.error = null; state.currentSection = null; })
      .addCase(fetchById.fulfilled, (state, action) => { state.loading = false; state.currentSection = action.payload; })
      .addCase(fetchById.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCurrentSection, clearError } = sectionsSlice.actions;
export default sectionsSlice.reducer;
