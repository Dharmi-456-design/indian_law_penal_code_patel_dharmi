import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Animated Counter Component ─────────────────────────────────── */
const AnimatedCounter = ({ end, suffix = '', prefix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = progress * (2 - progress);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
};

/* ─── Scroll-Reveal Hook ─────────────────────────────────────────── */
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

/* ─── Floating Particle ──────────────────────────────────────────── */
const FloatingParticle = ({ char, style, dark }) => (
  <div
    className="absolute font-bold select-none pointer-events-none"
    style={{
      color: dark ? 'rgba(201,168,76,0.18)' : 'rgba(163,127,34,0.12)',
      fontSize: style.size,
      left: style.left,
      top: style.top,
      animation: `floatLandingParticle ${style.duration}s ${style.delay}s ease-in-out infinite`,
    }}
  >
    {char}
  </div>
);

const HERO_PARTICLES = [
  { char: '§', style: { duration: 7, delay: 0, size: '28px', left: '5%', top: '18%' } },
  { char: '⚖', style: { duration: 9, delay: 1.2, size: '24px', left: '88%', top: '12%' } },
  { char: '¶', style: { duration: 6, delay: 2, size: '20px', left: '12%', top: '72%' } },
  { char: '©', style: { duration: 8, delay: 0.5, size: '18px', left: '82%', top: '68%' } },
  { char: '†', style: { duration: 10, delay: 3, size: '22px', left: '92%', top: '42%' } },
  { char: '₹', style: { duration: 7.5, delay: 1.8, size: '16px', left: '3%', top: '55%' } },
  { char: '§', style: { duration: 8.5, delay: 4, size: '14px', left: '45%', top: '85%' } },
  { char: '⚖', style: { duration: 6.5, delay: 2.5, size: '16px', left: '68%', top: '8%' } },
];

/* ─── Feature Data ───────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: 'library_books',
    title: 'Instant Research Engine',
    desc: 'Access millions of judgments, gazette notifications, and centralized acts in milliseconds. Our NLP engine understands legal vernacular.',
    accent: 'gold',
    span: 8,
  },
  {
    icon: 'cloud_sync',
    title: 'Cloud-Based Notes',
    desc: 'Highlight, annotate, and organize your research. Syncs instantly across all devices with end-to-end encryption.',
    accent: 'purple',
    span: 4,
  },
  {
    icon: 'insights',
    title: 'Advanced Analytics',
    desc: 'Visualize judicial trends, success rates of specific arguments, and timeline analytics with our masonry-style reporting dashboard.',
    accent: 'gold',
    span: 4,
  },
  {
    icon: 'verified_user',
    title: 'Verified Intelligence',
    desc: 'Every statute is cross-verified against the official Gazette of India. Standardized, structured, and ready for citation.',
    accent: 'purple',
    span: 4,
  },
  {
    icon: 'gavel',
    title: 'Case Law Cross-Reference',
    desc: 'Automatically link related judgments, identify overruled precedents, and build argument chains with AI-powered case mapping.',
    accent: 'gold',
    span: 4,
  },
];

/* ─── Testimonials Data ──────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Adv. Priya Sharma',
    role: 'Senior Partner, Sharma & Associates',
    text: 'LexIndia transformed how our firm approaches legal research. What took hours now takes minutes. The cross-referencing is simply unmatched.',
    rating: 5,
  },
  {
    name: 'Justice (Retd.) Rajesh Kumar',
    role: 'Former High Court Judge',
    text: 'An exceptional platform that brings the entire Indian legal framework to your fingertips. The accuracy and depth of coverage is remarkable.',
    rating: 5,
  },
  {
    name: 'Adv. Meera Patel',
    role: 'Criminal Law Specialist',
    text: 'The annotation and bookmarking features are game-changers. I can build case strategies faster and share research with my team seamlessly.',
    rating: 5,
  },
];

/* ─── Stats Data ─────────────────────────────────────────────────── */
const STATS = [
  { value: 8, suffix: '+', label: 'Major Acts', icon: 'gavel' },
  { value: 2200, suffix: '+', label: 'Legal Sections', icon: 'menu_book' },
  { value: 50000, suffix: '+', label: 'Advocates Trust Us', icon: 'groups' },
  { value: 99, suffix: '%', label: 'Accuracy Rate', icon: 'verified' },
];

/* ════════════════════════════════════════════════════════════════════
    LANDING PAGE COMPONENT
   ════════════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('lex-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [mounted, setMounted] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  /* Scroll-reveal refs for each section */
  const [featRef, featVisible] = useScrollReveal();
  const [statsRef, statsVisible] = useScrollReveal();
  const [testRef, testVisible] = useScrollReveal();
  const [ctaRef, ctaVisible] = useScrollReveal();
  const [howRef, howVisible] = useScrollReveal();

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add('dark'); localStorage.setItem('lex-theme', 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('lex-theme', 'light'); }
  }, [dark]);

  /* Header scroll effect */
  useEffect(() => {
    const handleScroll = () => setHeaderScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Auto-rotate testimonials */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#f5f3ef] dark:bg-[#0a0d10] text-[#1a1a1a] dark:text-[#e1e3e4] overflow-x-hidden relative"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── INLINE KEYFRAMES ── */}
      <style>{`
        @keyframes floatLandingParticle {
          0%   { opacity: 0; transform: translateY(0) rotate(0deg) scale(1); }
          25%  { opacity: 1; }
          50%  { opacity: 0.6; transform: translateY(-30px) rotate(12deg) scale(1.1); }
          75%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes heroGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes morphBlob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50%      { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
          75%      { border-radius: 60% 30% 60% 40% / 70% 40% 50% 60%; }
        }
        @keyframes slideRevealLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRevealRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRevealUp {
          from { opacity: 0; transform: translateY(50px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleReveal {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseRingCTA {
          0%   { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
          70%  { box-shadow: 0 0 0 18px rgba(201,168,76,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
        }
        @keyframes marqueeSlide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes tickerFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes gradientRotate {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes typeText {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes blinkCaret {
          from, to { border-color: transparent; }
          50% { border-color: #c9a84c; }
        }
        .hero-typewriter {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #c9a84c;
          animation: typeText 3s steps(35) infinite alternate, blinkCaret 0.8s step-end infinite;
        }
        .reveal-left  { animation: slideRevealLeft  0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .reveal-right { animation: slideRevealRight 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .reveal-up    { animation: slideRevealUp    0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .reveal-scale { animation: scaleReveal      0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      {/* ── BACKGROUND AMBIENT ORBS ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[600px] h-[600px] opacity-[0.06] dark:opacity-[0.1]"
          style={{
            top: '-10%', left: '-15%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 70%)',
            animation: 'heroGlow 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] opacity-[0.04] dark:opacity-[0.08]"
          style={{
            top: '40%', right: '-10%',
            background: 'radial-gradient(circle, rgba(124,77,255,0.3) 0%, transparent 70%)',
            animation: 'heroGlow 10s 3s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] opacity-[0.03] dark:opacity-[0.06]"
          style={{
            bottom: '5%', left: '20%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)',
            animation: 'heroGlow 12s 5s ease-in-out infinite',
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          HEADER
         ════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          headerScrolled
            ? 'border-b border-[#e5e7eb]/60 dark:border-white/5 shadow-lg shadow-black/[0.03] dark:shadow-black/20'
            : 'border-b border-transparent'
        }`}
        style={{
          backgroundColor: headerScrolled
            ? (dark ? 'rgba(10,13,16,0.92)' : 'rgba(245,243,239,0.92)')
            : 'transparent',
          backdropFilter: headerScrolled ? 'blur(20px) saturate(180%)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer select-none group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #c9a84c, #f0d074)',
                boxShadow: '0 4px 16px rgba(201,168,76,0.35)',
              }}
            >
              <span className="material-symbols-outlined text-[#1a0f00]" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>gavel</span>
            </div>
            <div>
              <span className="text-[17px] font-bold text-[#111827] dark:text-white tracking-tight leading-none">LexIndia</span>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c9a84c] leading-none mt-0.5">Legal Explorer</div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {['Research', 'Analytics', 'Solutions', 'Pricing'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-semibold text-[#6b7280] dark:text-[#9ca3af] hover:text-[#c9a84c] dark:hover:text-[#e6c364] transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#c9a84c] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              id="theme-toggle"
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9ca3af]" style={{ fontSize: '20px' }}>
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:block text-sm font-semibold text-[#374151] dark:text-[#d1d5db] hover:text-[#c9a84c] dark:hover:text-[#e6c364] transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #c9a84c, #e8b84b)',
                boxShadow: '0 4px 16px rgba(201,168,76,0.3)',
              }}
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10">

        {/* ════════════════════════════════════════════════════════
            HERO SECTION
           ════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
          {/* Morphing background blobs */}
          <div
            className="absolute w-[500px] h-[500px] opacity-[0.07] dark:opacity-[0.12]"
            style={{
              top: '5%', left: '10%',
              background: 'linear-gradient(135deg, #c9a84c, #f0d074)',
              animation: 'morphBlob 15s ease-in-out infinite, heroGlow 6s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-[400px] h-[400px] opacity-[0.05] dark:opacity-[0.10]"
            style={{
              bottom: '10%', right: '5%',
              background: 'linear-gradient(135deg, #7c4dff, #a78bfa)',
              animation: 'morphBlob 18s 3s ease-in-out infinite, heroGlow 8s 2s ease-in-out infinite',
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(201,168,76,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.4) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Floating particles */}
          {HERO_PARTICLES.map((p, i) => (
            <FloatingParticle key={i} {...p} dark={dark} />
          ))}

          <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center relative z-10">
            {/* Trusted Badge */}
            <div
              className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border bg-white/60 dark:bg-white/[0.03] shadow-sm mb-10 transition-all duration-700 transform ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                borderColor: dark ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.3)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 inline-block"
                style={{ animation: 'pulseRingCTA 2s infinite' }}
              />
              <span className="text-[12px] font-bold text-[#6b7280] dark:text-[#bfc8ca] tracking-wide uppercase">
                Trusted by 50,000+ Advocates Nationwide
              </span>
              <span
                className="material-symbols-outlined text-[#c9a84c]"
                style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-5xl md:text-[64px] font-black text-[#111827] dark:text-white leading-[1.05] tracking-tight mb-7 max-w-4xl transition-all duration-700 delay-100 transform ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Empowering Legal Minds
              <br />
              with{' '}
              <span
                className="relative inline-block"
                style={{
                  background: dark
                    ? 'linear-gradient(135deg, #c9a84c, #f0d074, #e6c364)'
                    : 'linear-gradient(135deg, #a37f22, #d5ae3c, #c9a84c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Precision
                <svg
                  className="absolute w-full left-0 -bottom-2 opacity-60"
                  style={{ height: '12px' }}
                  preserveAspectRatio="none"
                  viewBox="0 0 100 12"
                >
                  <path
                    d="M0 8 Q 25 2 50 8 Q 75 14 100 8"
                    fill="none"
                    stroke={dark ? '#c9a84c' : '#a37f22'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{ animation: 'heroGlow 2s ease-in-out infinite' }}
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg md:text-xl leading-relaxed text-[#6b7280] dark:text-[#9ca3af] max-w-2xl mb-12 font-medium transition-all duration-700 delay-200 transform ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              The ultimate digital parchment for modern practitioners. Uncover precedents, analyze
              case histories, and build airtight arguments with AI-driven research.
            </p>

            {/* Search Bar */}
            <div
              className={`w-full max-w-2xl relative mb-6 transition-all duration-700 delay-300 transform ${
                mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div
                className="flex items-center rounded-2xl overflow-hidden border border-[#d1d5db]/60 dark:border-white/8 bg-white/80 dark:bg-[#16121f]/80 transition-all duration-300 focus-within:border-[#c9a84c] dark:focus-within:border-[#c9a84c]/50 focus-within:shadow-xl focus-within:shadow-[#c9a84c]/5"
                style={{
                  backdropFilter: 'blur(20px)',
                  boxShadow: dark
                    ? '0 12px 48px -8px rgba(0,0,0,0.4)'
                    : '0 12px 48px -8px rgba(0,0,0,0.08)',
                }}
              >
                <span className="material-symbols-outlined text-[#9ca3af] dark:text-[#6b7280] ml-6 flex-shrink-0" style={{ fontSize: '22px' }}>
                  search
                </span>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search Acts, Sections, or Precedents..."
                  className="flex-1 bg-transparent px-4 py-4.5 text-[15px] text-[#111827] dark:text-[#e1e3e4] placeholder:text-[#9ca3af] dark:placeholder:text-[#6b7280] outline-none border-none font-medium"
                />
                <button
                  id="search-btn"
                  onClick={() => navigate('/login')}
                  className="flex-shrink-0 m-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95 text-white"
                  style={{
                    background: dark ? 'linear-gradient(135deg, #c9a84c, #e8b84b)' : 'linear-gradient(135deg, #111827, #1f2937)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Trending Tags */}
            <div
              className={`flex flex-wrap justify-center items-center gap-2.5 transition-all duration-700 delay-400 transform ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <span className="text-xs text-[#9ca3af] dark:text-[#6b7280] font-semibold">Trending:</span>
              {['IPC Section 302', 'Constitutional Law', 'Cheque Bounce NIA 138', 'Corporate Insolvency'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate('/login')}
                  className="text-xs px-3.5 py-1.5 rounded-lg border border-[#d1d5db]/60 dark:border-white/8 text-[#6b7280] dark:text-[#bfc8ca] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] dark:hover:text-[#e6c364] transition-all duration-200 font-medium cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Scroll indicator */}
            <div
              className={`mt-16 flex flex-col items-center gap-1.5 transition-all duration-700 delay-500 transform ${
                mounted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] dark:text-[#6b7280]">Scroll to explore</span>
              <div className="w-5 h-8 rounded-full border-2 border-[#c9a84c]/40 flex items-start justify-center pt-1.5">
                <div
                  className="w-1 h-2 rounded-full bg-[#c9a84c]"
                  style={{ animation: 'tickerFloat 1.5s ease-in-out infinite' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            TRUSTED BY / MARQUEE
           ════════════════════════════════════════════════════════ */}
        <section className="py-10 border-y border-[#e5e7eb]/40 dark:border-white/5 bg-white/30 dark:bg-white/[0.01] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-6">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-[#9ca3af] dark:text-[#6b7280]">
              Trusted by India's finest legal institutions
            </p>
          </div>
          <div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
            <div className="flex items-center gap-16 whitespace-nowrap" style={{ animation: 'marqueeSlide 30s linear infinite' }}>
              {[...Array(2)].map((_, setIdx) => (
                <React.Fragment key={setIdx}>
                  {['Supreme Court of India', 'Bar Council of India', 'National Law University', 'Law Commission of India', 'Delhi High Court', 'Bombay High Court', 'Madras High Court', 'Calcutta High Court'].map((name) => (
                    <div key={`${setIdx}-${name}`} className="flex items-center gap-2.5 px-4">
                      <span className="material-symbols-outlined text-[#c9a84c]/40 dark:text-[#c9a84c]/20" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
                        account_balance
                      </span>
                      <span className="text-sm font-semibold text-[#9ca3af]/60 dark:text-[#6b7280]/60 whitespace-nowrap">{name}</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            FEATURES SECTION
           ════════════════════════════════════════════════════════ */}
        <section ref={featRef} className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div
            className={`text-center mb-16 transition-all duration-700 transform ${
              featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/5 mb-5">
              <span className="material-symbols-outlined text-[#c9a84c]" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Premium Features</span>
            </div>
            <h2 className="text-[36px] md:text-[44px] font-extrabold text-[#111827] dark:text-white mb-4 tracking-tight leading-tight">
              A Workspace Engineered
              <br />
              for <span className="gradient-text-gold">Authority</span>
            </h2>
            <p className="text-[16px] text-[#6b7280] dark:text-[#9ca3af] max-w-2xl mx-auto leading-relaxed font-medium">
              Seamlessly transition from broad legal research to highly specific case analytics without breaking your focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {FEATURES.map((feat, idx) => (
              <div
                key={idx}
                className={`md:col-span-${feat.span} relative bg-white/70 dark:bg-[#141118]/70 backdrop-blur-md rounded-2xl p-7 border border-[#e5e7eb]/60 dark:border-white/5 flex flex-col justify-between overflow-hidden group card-hover shadow-sm hover:shadow-xl transition-all duration-500 ${
                  featVisible ? 'reveal-up' : 'opacity-0'
                }`}
                style={{
                  animationDelay: featVisible ? `${idx * 0.1}s` : '0s',
                  minHeight: feat.span === 8 ? '340px' : '280px',
                }}
              >
                {/* Accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl transition-all duration-300 group-hover:h-[3px]"
                  style={{
                    background: feat.accent === 'gold'
                      ? 'linear-gradient(90deg, #c9a84c, #f0d074, #c9a84c)'
                      : 'linear-gradient(90deg, #7c4dff, #a78bfa, #7c4dff)',
                  }}
                />

                {/* Hover glow */}
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -mr-12 -mt-12"
                  style={{
                    background: feat.accent === 'gold'
                      ? 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(124,77,255,0.08) 0%, transparent 70%)',
                  }}
                />

                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[#e5e7eb]/50 dark:border-white/5 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(249,250,251,0.8)',
                    }}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        feat.accent === 'gold' ? 'text-[#c9a84c]' : 'text-[#7c4dff]'
                      } group-hover:rotate-6 transition-transform duration-300`}
                      style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}
                    >
                      {feat.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-2.5 tracking-tight group-hover:text-[#c9a84c] dark:group-hover:text-[#e6c364] transition-colors duration-300">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>

                <a
                  href="#"
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-bold hover:underline underline-offset-4 transition-colors ${
                    feat.accent === 'gold'
                      ? 'text-[#c9a84c] dark:text-[#e6c364]'
                      : 'text-[#7c4dff] dark:text-[#a78bfa]'
                  }`}
                >
                  Learn More
                  <span className="material-symbols-outlined group-hover:translate-x-1.5 transition-transform duration-300" style={{ fontSize: '16px' }}>
                    arrow_forward
                  </span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            HOW IT WORKS SECTION
           ════════════════════════════════════════════════════════ */}
        <section ref={howRef} className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <div
            className={`text-center mb-16 transition-all duration-700 transform ${
              howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 mb-5">
              <span className="material-symbols-outlined text-[#7c4dff]" style={{ fontSize: '14px' }}>route</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7c4dff]">How It Works</span>
            </div>
            <h2 className="text-[36px] md:text-[44px] font-extrabold text-[#111827] dark:text-white mb-4 tracking-tight">
              Start in <span className="gradient-text-purple">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[2px]" style={{
              background: dark
                ? 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), rgba(124,77,255,0.3), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), rgba(124,77,255,0.2), transparent)',
            }} />

            {[
              { step: '01', icon: 'person_add', title: 'Create Account', desc: 'Sign up in seconds with just your email. No credit card required to get started.' },
              { step: '02', icon: 'search', title: 'Search & Discover', desc: 'Browse 8+ major acts, 2,200+ sections with intelligent full-text search and filters.' },
              { step: '03', icon: 'bookmark', title: 'Save & Annotate', desc: 'Bookmark critical sections, add personal notes, and build your private legal research library.' },
            ].map((s, idx) => (
              <div
                key={idx}
                className={`text-center relative transition-all duration-700 transform ${
                  howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: howVisible ? `${idx * 0.15}s` : '0s' }}
              >
                {/* Step number circle */}
                <div className="relative inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl mb-6 mx-auto group"
                  style={{
                    background: dark
                      ? 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(124,77,255,0.1))'
                      : 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(124,77,255,0.05))',
                    border: `1px solid ${dark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.2)'}`,
                  }}
                >
                  <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>
                    {s.icon}
                  </span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#c9a84c] text-[#1a0f00] text-[10px] font-black flex items-center justify-center shadow-md">
                    {s.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-2 tracking-tight">{s.title}</h3>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            STATS SECTION
           ════════════════════════════════════════════════════════ */}
        <section
          ref={statsRef}
          className="relative py-20 overflow-hidden"
          style={{
            background: dark
              ? 'linear-gradient(135deg, #0f0a1c 0%, #1a0f2e 50%, #0d0d16 100%)'
              : 'linear-gradient(135deg, #1a1025 0%, #231540 50%, #16102a 100%)',
          }}
        >
          {/* Orb decorations */}
          <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)', animation: 'heroGlow 6s ease-in-out infinite' }} />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.3) 0%, transparent 70%)', animation: 'heroGlow 8s 3s ease-in-out infinite' }} />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div
              className={`text-center mb-14 transition-all duration-700 transform ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-[36px] md:text-[44px] font-extrabold text-white mb-3 tracking-tight">
                Numbers That <span style={{
                  background: 'linear-gradient(135deg, #c9a84c, #f0d074)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Speak</span>
              </h2>
              <p className="text-[15px] text-gray-400 max-w-lg mx-auto leading-relaxed">
                India's most comprehensive legal research platform, trusted by professionals across the nation.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className={`text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-700 transform hover:bg-white/[0.05] hover:border-[#c9a84c]/20 hover:scale-105 ${
                    statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: statsVisible ? `${idx * 0.1}s` : '0s' }}
                >
                  <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.15)' }}>
                    <span className="material-symbols-outlined text-[#e6c364]" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>
                      {stat.icon}
                    </span>
                  </div>
                  <div className="text-[36px] md:text-[42px] font-black text-white tracking-tight leading-none mb-2"
                    style={{
                      background: 'linear-gradient(135deg, #c9a84c, #f0d074)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                    {statsVisible ? (
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2200} />
                    ) : (
                      <span>0{stat.suffix}</span>
                    )}
                  </div>
                  <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            TESTIMONIALS SECTION
           ════════════════════════════════════════════════════════ */}
        <section ref={testRef} className="max-w-5xl mx-auto px-6 py-24 relative z-10">
          <div
            className={`text-center mb-14 transition-all duration-700 transform ${
              testVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/5 mb-5">
              <span className="material-symbols-outlined text-[#c9a84c]" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Testimonials</span>
            </div>
            <h2 className="text-[36px] md:text-[44px] font-extrabold text-[#111827] dark:text-white mb-4 tracking-tight">
              What Advocates <span className="gradient-text-gold">Say</span>
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div
            className={`relative transition-all duration-700 transform ${
              testVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  className={`relative p-7 rounded-2xl border transition-all duration-500 group ${
                    activeTestimonial === idx
                      ? 'bg-white dark:bg-[#141118] border-[#c9a84c]/30 dark:border-[#c9a84c]/20 shadow-xl shadow-[#c9a84c]/5 scale-[1.02]'
                      : 'bg-white/50 dark:bg-[#141118]/50 border-[#e5e7eb]/40 dark:border-white/5 shadow-sm hover:shadow-md'
                  }`}
                  onMouseEnter={() => setActiveTestimonial(idx)}
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  {/* Quote icon */}
                  <div className={`absolute top-4 right-4 transition-colors duration-300 ${
                    activeTestimonial === idx ? 'text-[#c9a84c]/30' : 'text-gray-200 dark:text-white/5'
                  }`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '36px', fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[#c9a84c]"
                        style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <p className="text-[14px] text-[#374151] dark:text-[#d1d5db] leading-relaxed mb-6 italic font-normal">
                    "{t.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#e5e7eb]/40 dark:border-white/5">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{
                        background: idx === 0 ? 'linear-gradient(135deg, #c9a84c, #e8b84b)' :
                          idx === 1 ? 'linear-gradient(135deg, #7c4dff, #a78bfa)' :
                            'linear-gradient(135deg, #3b82f6, #60a5fa)',
                      }}
                    >
                      {t.name.split(' ').slice(-1)[0][0]}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#111827] dark:text-white">{t.name}</div>
                      <div className="text-[11px] text-[#9ca3af] dark:text-[#6b7280] font-medium">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    activeTestimonial === idx
                      ? 'w-8 h-2 bg-[#c9a84c]'
                      : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-[#c9a84c]/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CTA SECTION
           ════════════════════════════════════════════════════════ */}
        <section ref={ctaRef} className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div
            className={`relative rounded-3xl px-8 md:px-16 py-20 text-center border border-white/5 overflow-hidden transition-all duration-700 transform ${
              ctaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
            style={{
              background: dark
                ? 'linear-gradient(135deg, #0f0a1c 0%, #1c103c 45%, #2a0c4d 100%)'
                : 'linear-gradient(135deg, #12081f 0%, #1e1040 45%, #2d0f55 100%)',
              boxShadow: '0 20px 60px -12px rgba(0,0,0,0.5)',
            }}
          >
            {/* CTA Orbs */}
            <div
              className="absolute top-[-40%] left-[-15%] w-[400px] h-[400px] rounded-full pointer-events-none opacity-25"
              style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)', animation: 'heroGlow 6s ease-in-out infinite' }}
            />
            <div
              className="absolute bottom-[-40%] right-[-15%] w-[400px] h-[400px] rounded-full pointer-events-none opacity-25"
              style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.3) 0%, transparent 70%)', animation: 'heroGlow 8s 2s ease-in-out infinite' }}
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" style={{ animation: 'pulseRingCTA 2s infinite' }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e6c364]">Limited Time — Free Access</span>
              </div>

              <h2 className="text-[38px] md:text-[48px] font-black text-white mb-5 tracking-tight leading-tight">
                Ready to Elevate
                <br />
                Your <span style={{
                  background: 'linear-gradient(135deg, #c9a84c, #f0d074)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Practice</span>?
              </h2>
              <p className="text-[16px] text-[#cdbdff] max-w-xl mx-auto mb-10 leading-relaxed font-medium opacity-90">
                Join thousands of legal professionals who rely on LexIndia to deliver precision and
                authority in every case. Start for free today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="cta-register"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto px-10 py-4.5 text-[#1a0f00] font-bold text-[15px] rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #c9a84c, #f0d074)',
                    boxShadow: '0 6px 24px rgba(201,168,76,0.4)',
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                    Register for Free
                  </span>
                </button>
                <button
                  id="cta-demo"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-10 py-4.5 font-bold text-[15px] rounded-xl border border-white/15 text-white bg-white/5 hover:bg-white/10 hover:border-white/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_circle</span>
                  Request Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
         ════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#e5e7eb]/40 dark:border-white/5 py-12 px-6 bg-[#ede9e4] dark:bg-[#080a0d] relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d074)' }}>
                  <span className="material-symbols-outlined text-[#1a0f00]" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>gavel</span>
                </div>
                <span className="text-[16px] font-bold text-[#111827] dark:text-white tracking-tight">LexIndia</span>
              </div>
              <p className="text-[13px] text-[#9ca3af] dark:text-[#6b7280] leading-relaxed max-w-xs">
                India's most trusted legal research platform for advocates, judges, and law students.
              </p>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['Research Engine', 'Analytics', 'Cloud Notes', 'Case Mapping'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Tutorials'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Privacy Policy'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#111827] dark:text-white mb-4">{col.title}</h4>
                <div className="space-y-2.5">
                  {col.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-[13px] text-[#9ca3af] dark:text-[#6b7280] hover:text-[#c9a84c] dark:hover:text-[#e6c364] transition-colors font-medium"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-[#e5e7eb]/40 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
            <span className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] font-medium">
              © {new Date().getFullYear()} LexIndia Legal Explorer. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              {['Terms of Service', 'Privacy Policy', 'Legal Disclaimer'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] hover:text-[#c9a84c] dark:hover:text-[#e6c364] transition-colors font-semibold"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
