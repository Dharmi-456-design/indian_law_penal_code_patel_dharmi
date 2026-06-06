import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 px-6 mt-auto border-t border-[#e5e7eb] dark:border-[#40484a] bg-white dark:bg-[#111415] text-[#6b7280] dark:text-[#9ca3af] text-sm text-center lg:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
      <p>© {new Date().getFullYear()} LexIndia Legal Explorer. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="#" className="hover:text-[#c9a84c] transition-colors">Privacy</a>
        <a href="#" className="hover:text-[#c9a84c] transition-colors">Terms</a>
        <a href="#" className="hover:text-[#c9a84c] transition-colors">Help</a>
      </div>
    </footer>
  );
};

export default Footer;
