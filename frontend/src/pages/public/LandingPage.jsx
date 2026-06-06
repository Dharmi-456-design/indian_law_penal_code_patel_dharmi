import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#f5f3ef] dark:bg-[#111415] text-[#1a1a1a] dark:text-[#e1e3e4]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#e5e7eb] dark:border-[#40484a]"
        style={{ backgroundColor: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)' }}
        id="main-header">
        {/* Override dark bg via inline for alpha support */}
        <style>{`.dark #main-header { background-color: rgba(17,20,21,0.96) !important; }`}</style>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]"
              style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1, 'wght' 500" }}>
              gavel
            </span>
            <span className="text-[17px] font-bold text-[#111827] dark:text-white tracking-tight">
              LexIndia Legal Explorer
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Research', 'Analytics', 'Solutions', 'Pricing'].map(item => (
              <a key={item} href="#"
                className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] hover:text-[#c9a84c] dark:hover:text-[#e6c364] transition-colors duration-150">
                {item}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button id="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] dark:hover:bg-[#1d2021] transition-colors">
              <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9ca3af]"
                style={{ fontSize: '20px' }}>
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button onClick={() => navigate('/login')}
              className="hidden sm:block text-sm font-medium text-[#374151] dark:text-[#d1d5db] hover:text-[#c9a84c] dark:hover:text-[#e6c364] transition-colors">
              Login
            </button>
            <button onClick={() => navigate('/register')}
              className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#c9a84c', boxShadow: '0 1px 3px rgba(201,168,76,0.3)' }}>
              Register
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="pt-16">

        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d1d5db] dark:border-[#40484a] bg-white dark:bg-[#1d2021] shadow-sm mb-8">
            <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]"
              style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-[13px] font-medium text-[#6b7280] dark:text-[#bfc8ca]">
              Trusted by 50,000+ Advocates Nationwide
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[56px] font-extrabold text-[#111827] dark:text-white leading-[1.1] tracking-tight mb-6 max-w-3xl">
            Empowering Legal Minds with{' '}
            <span className="relative inline-block text-[#c9a84c] dark:text-[#e6c364]">
              Precision
              <svg className="absolute w-full left-0 -bottom-1 opacity-75"
                style={{ height: '10px' }}
                preserveAspectRatio="none" viewBox="0 0 100 10" aria-hidden="true">
                <path d="M0 6 Q 50 10 100 6" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Sub */}
          <p className="text-[17px] leading-relaxed text-[#6b7280] dark:text-[#bfc8ca] max-w-xl mb-12">
            The ultimate digital parchment for modern practitioners. Uncover precedents, analyze
            case histories, and build airtight arguments with intuitive AI-driven research.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl flex items-center rounded-xl overflow-hidden mb-6 border border-[#d1d5db] dark:border-[#40484a] bg-white dark:bg-[#0c0f10]"
            style={{ boxShadow: '0 8px 30px -8px rgba(0,0,0,0.15)' }}>
            <span className="material-symbols-outlined text-[#9ca3af] dark:text-[#6b7280] ml-5 flex-shrink-0"
              style={{ fontSize: '22px' }}>
              search
            </span>
            <input id="search-input" type="text"
              placeholder="Search Acts, Sections, or Precedents..."
              className="flex-1 bg-transparent px-4 py-4 text-[15px] text-[#111827] dark:text-[#e1e3e4] placeholder:text-[#9ca3af] dark:placeholder:text-[#6b7280] outline-none border-none" />
            <button id="search-btn"
              className="flex-shrink-0 m-2 px-7 py-3 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 text-white dark:text-[#111827]"
              style={{ backgroundColor: dark ? '#c9a84c' : '#111827' }}>
              Search
            </button>
          </div>

          {/* Trending */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            <span className="text-xs text-[#9ca3af] dark:text-[#6b7280]">Trending:</span>
            {['Constitutional Law', 'Tax Precedents 2024', 'Corporate Insolvency'].map(tag => (
              <a key={tag} href="#"
                className="text-xs px-3 py-1.5 rounded border border-[#d1d5db] dark:border-[#40484a] text-[#6b7280] dark:text-[#bfc8ca] hover:bg-[#f9fafb] dark:hover:bg-[#1d2021] transition-colors">
                {tag}
              </a>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold text-[#111827] dark:text-white mb-3 tracking-tight">
              A Workspace Engineered for Authority
            </h2>
            <p className="text-[15px] text-[#6b7280] dark:text-[#bfc8ca] max-w-2xl mx-auto leading-relaxed">
              Seamlessly transition from broad legal research to highly specific case analytics without breaking your focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

            {/* CARD 1 — Instant Research (large) */}
            <div className="md:col-span-8 relative bg-white dark:bg-[#1d2021] rounded-xl p-8 border border-[#e5e7eb] dark:border-[#40484a] flex flex-col justify-between overflow-hidden group"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minHeight: '260px' }}>
              {/* Gold top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a84c] dark:bg-[#e6c364] rounded-t-xl" />
              {/* Subtle bg orb */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-[#c9a84c] opacity-[0.03] rounded-bl-full -mr-12 -mt-12 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f9fafb] dark:bg-[#282a2b] flex items-center justify-center mb-6 border border-[#e5e7eb] dark:border-[#40484a]">
                  <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]"
                    style={{ fontSize: '22px' }}>library_books</span>
                </div>
                <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-3">
                  Instant Research Engine
                </h3>
                <p className="text-sm text-[#6b7280] dark:text-[#bfc8ca] max-w-md leading-relaxed">
                  Access millions of judgments, gazette notifications, and centralized acts in milliseconds.
                  Our NLP engine understands legal vernacular.
                </p>
              </div>
              <a href="#" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-[#c9a84c] dark:text-[#e6c364] hover:underline underline-offset-4">
                Explore Database
                <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>arrow_forward</span>
              </a>
            </div>

            {/* CARD 2 — Cloud Notes (small) */}
            <div className="md:col-span-4 relative bg-white dark:bg-[#1d2021] rounded-xl p-8 border border-[#e5e7eb] dark:border-[#40484a] flex flex-col justify-between"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minHeight: '260px' }}>
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f9fafb] dark:bg-[#282a2b] flex items-center justify-center mb-6 border border-[#e5e7eb] dark:border-[#40484a]">
                  <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9ca3af]"
                    style={{ fontSize: '22px' }}>cloud_sync</span>
                </div>
                <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-3">
                  Cloud-Based Notes
                </h3>
                <p className="text-sm text-[#6b7280] dark:text-[#bfc8ca] leading-relaxed">
                  Highlight, annotate, and organize your research directly on the parchment. Syncs
                  instantly across all your devices.
                </p>
              </div>
            </div>

            {/* CARD 3 — Analytics (full width, always dark) */}
            <div className="md:col-span-12 rounded-xl p-8 border border-[#3d3830] flex flex-col md:flex-row items-center justify-between gap-8"
              style={{ backgroundColor: '#2d2926' }}>
              <div className="md:w-1/2">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md mb-5 text-[#d1d5db] text-[11px] font-bold uppercase tracking-widest"
                  style={{ backgroundColor: '#3d3830' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>insights</span>
                  Premium Feature
                </div>
                <h3 className="text-[28px] font-bold text-white mb-4 leading-tight">Advanced Analytics</h3>
                <p className="text-sm text-[#9ca3af] mb-7 leading-relaxed">
                  Visualize judicial trends, success rates of specific arguments, and timeline analytics
                  with our masonry-style reporting dashboard.
                </p>
                <button className="text-sm font-bold px-6 py-3 rounded-lg border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#1a1a1a] transition-colors duration-150">
                  View Sample Report
                </button>
              </div>

              {/* Bar Chart */}
              <div className="md:w-1/2 h-48 rounded-xl border border-[#3d3830] p-4 flex items-end justify-around relative"
                style={{ backgroundColor: '#1e1a17' }}>
                <div className="w-8 rounded-t-sm bg-purple-400/60 h-[40%] hover:h-[44%] transition-all duration-300" />
                <div className="w-8 rounded-t-sm h-[60%] hover:h-[64%] transition-all duration-300" style={{ backgroundColor: '#c9a84c' }} />
                <div className="w-8 rounded-t-sm bg-slate-400/50 h-[28%] hover:h-[32%] transition-all duration-300" />
                <div className="w-8 rounded-t-sm h-[85%] hover:h-[89%] transition-all duration-300 relative" style={{ backgroundColor: '#c9a84c' }}>
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap border border-[#3d3830] shadow-lg"
                    style={{ backgroundColor: '#2d2926' }}>
                    Peak Precedent
                  </div>
                </div>
                <div className="w-8 rounded-t-sm bg-purple-500 h-[50%] hover:h-[54%] transition-all duration-300" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="relative rounded-2xl px-12 py-16 text-center border border-[#e5e7eb] dark:border-[#40484a] bg-white dark:bg-[#1d2021] overflow-hidden"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            {/* Gradient top line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, #c9a84c, #a78bfa, #c9a84c)' }} />

            <h2 className="text-[32px] font-bold text-[#111827] dark:text-white mb-4 tracking-tight">
              Ready to Elevate Your Practice?
            </h2>
            <p className="text-[15px] text-[#6b7280] dark:text-[#bfc8ca] max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of legal professionals who rely on LexIndia to deliver precision and
              authority in every case.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button id="cta-register" onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 text-white font-bold text-[15px] rounded-xl hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: '#c9a84c', boxShadow: '0 4px 14px rgba(201,168,76,0.25)' }}>
                Register for Free
              </button>
              <button id="cta-demo" onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 font-bold text-[15px] rounded-xl border-2 border-[#d1d5db] dark:border-[#40484a] text-[#111827] dark:text-white hover:bg-[#f9fafb] dark:hover:bg-[#282a2b] transition-colors">
                Request Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#e5e7eb] dark:border-[#40484a] py-8 px-6 bg-[#ede9e4] dark:bg-[#0c0f10]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-4 text-center md:text-left">
            <span className="text-[15px] font-bold text-[#111827] dark:text-white">LexIndia</span>
            <span className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] md:mt-0.5">
              © 2024 LexIndia Legal Explorer. All rights reserved.
            </span>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-1.5">
            {['Privacy Policy', 'Terms of Service', 'Legal Disclaimer', 'Contact Support', 'API Documentation', 'Careers'].map(link => (
              <a key={link} href="#"
                className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] hover:text-[#c9a84c] dark:hover:text-[#e6c364] hover:underline underline-offset-2 transition-colors">
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
