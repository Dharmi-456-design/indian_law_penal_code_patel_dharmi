import { configureStore } from '@reduxjs/toolkit';

// Import reducers/slices here as you build them
// import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // Add your reducers here
    // auth: authReducer,
  },
});

export default store;
