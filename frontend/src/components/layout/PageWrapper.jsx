import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const PageWrapper = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#f5f3ef] dark:bg-[#0c0f10] text-[#111827] dark:text-[#e1e3e4] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-64">
        <Navbar />
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PageWrapper;
