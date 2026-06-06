import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, toggleSidebar } from '../../store/slices/uiSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="h-16 bg-white dark:bg-[#111415] border-b border-[#e5e7eb] dark:border-[#40484a] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      
      {/* Left side: Hamburger (Mobile) + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>menu</span>
        </button>

        {/* Global Search */}
        <div className="hidden sm:flex items-center max-w-md w-full bg-[#f9fafb] dark:bg-[#1d2021] border border-[#d1d5db] dark:border-[#40484a] rounded-lg px-3 py-2 focus-within:border-[#c9a84c] dark:focus-within:border-[#e6c364] transition-colors">
          <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-2" style={{ fontSize: '20px' }}>search</span>
          <input 
            type="text" 
            placeholder="Search Acts, Sections, Precedents..." 
            className="bg-transparent border-none outline-none w-full text-sm text-[#111827] dark:text-[#e1e3e4] placeholder-gray-400 dark:placeholder-gray-600"
          />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] dark:hover:bg-[#1d2021] transition-colors"
          aria-label="Toggle theme"
        >
          <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9ca3af]" style={{ fontSize: '20px' }}>
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] dark:hover:bg-[#1d2021] transition-colors relative">
          <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9ca3af]" style={{ fontSize: '20px' }}>notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#111415]"></span>
        </button>
      </div>

    </header>
  );
};

export default Navbar;
