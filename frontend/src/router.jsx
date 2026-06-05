import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/* ── Public Pages ── */
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import NotFound from './pages/public/NotFound.jsx';

/* ── Dashboard Pages (User) ── */
import UserDashboard from './pages/dashboard/user/UserDashboard.jsx';
import BrowsePage from './pages/dashboard/user/BrowsePage.jsx';
import SectionDetail from './pages/dashboard/user/SectionDetail.jsx';
import BookmarksPage from './pages/dashboard/user/BookmarksPage.jsx';
import NotesPage from './pages/dashboard/user/NotesPage.jsx';
import ProfilePage from './pages/dashboard/user/ProfilePage.jsx';

/* ── Dashboard Pages (Admin) ── */
import AdminDashboard from './pages/dashboard/admin/AdminDashboard.jsx';
import UsersPage from './pages/dashboard/admin/UsersPage.jsx';
import ActsPage from './pages/dashboard/admin/ActsPage.jsx';
import SectionsPage from './pages/dashboard/admin/SectionsPage.jsx';
import AnalyticsPage from './pages/dashboard/admin/AnalyticsPage.jsx';
import SearchLogsPage from './pages/dashboard/admin/SearchLogsPage.jsx';

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Dashboard Routes */}
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/dashboard/browse" element={<BrowsePage />} />
      <Route path="/dashboard/section/:id" element={<SectionDetail />} />
      <Route path="/dashboard/bookmarks" element={<BookmarksPage />} />
      <Route path="/dashboard/notes" element={<NotesPage />} />
      <Route path="/dashboard/profile" element={<ProfilePage />} />

      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/acts" element={<ActsPage />} />
      <Route path="/admin/sections" element={<SectionsPage />} />
      <Route path="/admin/analytics" element={<AnalyticsPage />} />
      <Route path="/admin/search-logs" element={<SearchLogsPage />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
