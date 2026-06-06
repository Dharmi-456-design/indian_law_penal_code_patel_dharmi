import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  const isAdmin = user?.role === 'admin';

  const userRoutes = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Browse Legal Data', path: '/dashboard/browse', icon: 'search' },
    { name: 'Bookmarks', path: '/dashboard/bookmarks', icon: 'bookmark' },
    { name: 'My Notes', path: '/dashboard/notes', icon: 'edit_document' },
    { name: 'Profile', path: '/dashboard/profile', icon: 'person' },
  ];

  const adminRoutes = [
    { name: 'Admin Dashboard', path: '/admin', icon: 'admin_panel_settings' },
    { name: 'Manage Users', path: '/admin/users', icon: 'manage_accounts' },
    { name: 'Manage Acts', path: '/admin/acts', icon: 'gavel' },
    { name: 'Manage Sections', path: '/admin/sections', icon: 'receipt_long' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'monitoring' },
    { name: 'Search Logs', path: '/admin/search-logs', icon: 'manage_search' },
  ];

  const routes = isAdmin ? adminRoutes : userRoutes;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-[#111415] border-r border-[#e5e7eb] dark:border-[#40484a] w-64 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-[#e5e7eb] dark:border-[#40484a] shrink-0">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1, 'wght' 500" }}>gavel</span>
            <span className="text-[17px] font-bold text-[#111827] dark:text-white tracking-tight">LexIndia</span>
          </div>
          <button className="ml-auto lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={closeSidebar}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3">
            {isAdmin ? 'Administration' : 'Main Menu'}
          </div>
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              onClick={() => { if(window.innerWidth < 1024) closeSidebar() }}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#f5f3ef] dark:bg-[#1d2021] text-[#c9a84c] dark:text-[#e6c364]' 
                    : 'text-[#6b7280] dark:text-[#bfc8ca] hover:bg-[#f9fafb] dark:hover:bg-[#1d2021] hover:text-[#111827] dark:hover:text-white'
                }`
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{route.icon}</span>
              {route.name}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-[#e5e7eb] dark:border-[#40484a]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#c9a84c] text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111827] dark:text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            Sign Out
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
