import React, { useEffect, useState } from 'react';

const LandingPage = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('lex-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('lex-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('lex-theme', 'light');
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-[#f5f3ef] dark:bg-[#111415] text-[#1a1a1a] dark:text-[#e1e3e4] font-sans">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#111415]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#40484a] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <span
              className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364] text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}
            >
              gavel
            </span>
            <span className="text-[17px] font-bold text-[#1a1a1a] dark:text-white tracking-tight">
              LexIndia Legal Explorer
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {['Research', 'Analytics', 'Solutions', 'Pricing'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#c9a84c] dark:hover:text-[#e6c364] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1d2021] transition-colors"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined text-[20px] text-gray-600 dark:text-gray-300">
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#c9a84c] dark:hover:text-[#e6c364] transition-colors">
              Login
            </button>
            <button className="text-sm font-semibold bg-[#c9a84c] dark:bg-[#c9a84c] text-white px-5 py-2 rounded-lg hover:bg-[#b8943a] transition-colors shadow-sm">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="pt-16">

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">

          {/* Trusted Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 dark:border-[#40484a] bg-white dark:bg-[#1d2021] shadow-sm mb-8">
            <span
              className="material-symbols-outlined text-[15px] text-[#c9a84c] dark:text-[#e6c364]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="text-[13px] font-medium text-gray-600 dark:text-[#bfc8ca]">
              Trusted by 50,000+ Advocates Nationwide
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1a1a1a] dark:text-white leading-tight mb-6 max-w-3xl">
            Empowering Legal Minds with{' '}
            <span className="text-[#c9a84c] dark:text-[#e6c364] relative inline-block">
              Precision
              <svg
                className="absolute w-full h-[10px] -bottom-1 left-0 text-[#c9a84c] dark:text-[#e6c364] opacity-80"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
                aria-hidden="true"
              >
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="5" />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-600 dark:text-[#bfc8ca] max-w-2xl mb-12 leading-relaxed">
            The ultimate digital parchment for modern practitioners. Uncover precedents, analyze case
            histories, and build airtight arguments with intuitive AI-driven research.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl flex items-center bg-white dark:bg-[#0c0f10] border border-gray-300 dark:border-[#40484a] rounded-xl shadow-lg overflow-hidden mb-6">
            <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 ml-5 text-[22px] flex-shrink-0">
              search
            </span>
            <input
              id="search-input"
              type="text"
              placeholder="Search Acts, Sections, or Precedents..."
              className="flex-1 bg-transparent px-4 py-4 text-base text-[#1a1a1a] dark:text-[#e1e3e4] placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none border-none"
            />
            <button
              id="search-btn"
              className="flex-shrink-0 m-2 bg-[#1a1a1a] dark:bg-[#c9a84c] text-white dark:text-[#1a1a1a] px-7 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </div>

          {/* Trending Chips */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">Trending:</span>
            {['Constitutional Law', 'Tax Precedents 2024', 'Corporate Insolvency'].map((tag) => (
              <a
                key={tag}
                href="#"
                className="text-xs px-3 py-1.5 rounded border border-gray-300 dark:border-[#40484a] text-gray-600 dark:text-[#bfc8ca] hover:bg-gray-100 dark:hover:bg-[#1d2021] transition-colors"
              >
                {tag}
              </a>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-white mb-4">
              A Workspace Engineered for Authority
            </h2>
            <p className="text-base text-gray-600 dark:text-[#bfc8ca] max-w-2xl mx-auto">
              Seamlessly transition from broad legal research to highly specific case analytics without
              breaking your focus.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

            {/* Instant Research Engine — Large */}
            <div className="md:col-span-8 bg-white dark:bg-[#1d2021] rounded-xl p-8 border border-gray-200 dark:border-[#40484a] border-t-[3px] border-t-[#c9a84c] dark:border-t-[#e6c364] shadow-sm flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#282a2b] flex items-center justify-center mb-6 border border-gray-200 dark:border-[#40484a]">
                  <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364] text-[24px]">
                    library_books
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-3">
                  Instant Research Engine
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#bfc8ca] max-w-md leading-relaxed">
                  Access millions of judgments, gazette notifications, and centralized acts in
                  milliseconds. Our NLP engine understands legal vernacular.
                </p>
              </div>
              <a
                href="#"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#c9a84c] dark:text-[#e6c364] hover:underline"
              >
                Explore Database
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>

            {/* Cloud-Based Notes — Small */}
            <div className="md:col-span-4 bg-white dark:bg-[#1d2021] rounded-xl p-8 border border-gray-200 dark:border-[#40484a] shadow-sm flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#282a2b] flex items-center justify-center mb-6 border border-gray-200 dark:border-[#40484a]">
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[24px]">
                    cloud_sync
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-3">
                  Cloud-Based Notes
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#bfc8ca] leading-relaxed">
                  Highlight, annotate, and organize your research directly on the parchment. Syncs
                  instantly across all your devices.
                </p>
              </div>
            </div>

            {/* Advanced Analytics — Full Width Dark Card */}
            <div className="md:col-span-12 bg-[#2d2926] dark:bg-[#191c1d] rounded-xl p-8 border border-[#3d3830] dark:border-[#40484a] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#3d3830] dark:bg-[#282a2b] text-gray-300 text-[11px] font-bold uppercase tracking-wider mb-4">
                  <span className="material-symbols-outlined text-[14px]">insights</span>
                  Premium Feature
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Advanced Analytics</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Visualize judicial trends, success rates of specific arguments, and timeline analytics
                  with our masonry-style reporting dashboard.
                </p>
                <button className="text-sm font-bold border-2 border-[#c9a84c] text-[#c9a84c] px-6 py-3 rounded-lg hover:bg-[#c9a84c] hover:text-[#1a1a1a] transition-colors">
                  View Sample Report
                </button>
              </div>

              {/* Abstract Bar Chart */}
              <div className="md:w-1/2 h-48 bg-[#1e1a17] dark:bg-[#0c0f10] rounded-lg border border-[#3d3830] dark:border-[#40484a] p-4 flex items-end justify-around relative">
                <div className="w-8 rounded-t-sm bg-purple-400/60 h-[40%]"></div>
                <div className="w-8 rounded-t-sm bg-[#c9a84c] h-[60%]"></div>
                <div className="w-8 rounded-t-sm bg-slate-400/50 h-[30%]"></div>
                <div className="w-8 rounded-t-sm bg-[#c9a84c] h-[85%] relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2d2926] dark:bg-[#282a2b] text-white text-[10px] px-2 py-0.5 rounded border border-[#3d3830] dark:border-[#40484a] whitespace-nowrap shadow">
                    Peak Precedent
                  </div>
                </div>
                <div className="w-8 rounded-t-sm bg-purple-500 h-[50%]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white dark:bg-[#1d2021] rounded-2xl px-12 py-16 text-center border border-gray-200 dark:border-[#40484a] shadow-sm relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#c9a84c] via-purple-400 to-[#c9a84c]"></div>
            <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-white mb-4">
              Ready to Elevate Your Practice?
            </h2>
            <p className="text-base text-gray-600 dark:text-[#bfc8ca] max-w-xl mx-auto mb-10">
              Join thousands of legal professionals who rely on LexIndia to deliver precision and authority
              in every case.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="cta-register"
                className="w-full sm:w-auto px-8 py-4 bg-[#c9a84c] text-white font-bold text-base rounded-lg hover:bg-[#b8943a] transition-colors shadow-md"
              >
                Register for Free
              </button>
              <button
                id="cta-demo"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-[#40484a] text-[#1a1a1a] dark:text-white font-bold text-base rounded-lg hover:bg-gray-100 dark:hover:bg-[#282a2b] transition-colors"
              >
                Request Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#ede9e4] dark:bg-[#0c0f10] border-t border-gray-200 dark:border-[#40484a] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-4 text-center md:text-left">
            <span className="text-base font-bold text-[#1a1a1a] dark:text-white">LexIndia</span>
            <span className="text-xs text-gray-500 dark:text-gray-600 md:mt-0.5">
              © 2024 LexIndia Legal Explorer. All rights reserved.
            </span>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-1">
            {['Privacy Policy', 'Terms of Service', 'Legal Disclaimer', 'Contact Support', 'API Documentation', 'Careers'].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs text-gray-500 dark:text-gray-600 hover:text-[#c9a84c] dark:hover:text-[#e6c364] hover:underline transition-colors"
                >
                  {link}
                </a>
              )
            )}
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
