import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('lex_theme') || 'dark',
  sidebarOpen: false,
  toast: {
    message: '',
    type: 'info', // info, success, warning, error
    isOpen: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('lex_theme', state.theme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info',
        isOpen: true,
      };
    },
    clearToast: (state) => {
      state.toast.isOpen = false;
    },
  },
});

export const { toggleTheme, toggleSidebar, setSidebarOpen, setToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
