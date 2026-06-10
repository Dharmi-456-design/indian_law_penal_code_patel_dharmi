import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser, clearError } from '../../store/slices/authSlice';

/* ─── Animated Scales of Justice SVG ─────────────────────────────── */
const ScalesOfJustice = ({ dark }) => (
  <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Glow under scales */}
    <ellipse cx="100" cy="210" rx="55" ry="8" fill="url(#glowGrad)" opacity="0.5" />
    {/* Central pillar */}
    <rect x="98" y="40" width="4" height="160" rx="2" fill="url(#pillarGrad)" />
    {/* Top sphere */}
    <circle cx="100" cy="36" r="10" fill="url(#sphereGrad)" />
    <circle cx="97" cy="33" r="3" fill="rgba(255,255,255,0.4)" />
    {/* Crossbeam */}
    <rect x="30" y="68" width="140" height="5" rx="2.5" fill="url(#beamGrad)" />
    {/* Left chain */}
    <line x1="42" y1="73" x2="42" y2="130" stroke="url(#chainGrad)" strokeWidth="2" strokeDasharray="4 3" />
    {/* Right chain */}
    <line x1="158" y1="73" x2="158" y2="120" stroke="url(#chainGrad)" strokeWidth="2" strokeDasharray="4 3" />
    {/* Left pan */}
    <path d="M18 130 Q42 145 66 130" stroke="url(#panGold)" strokeWidth="2.5" fill="url(#panFill)" />
    <line x1="18" y1="130" x2="66" y2="130" stroke="url(#panGold)" strokeWidth="1.5" opacity="0.4" />
    {/* Right pan */}
    <path d="M134 120 Q158 135 182 120" stroke="url(#panGold)" strokeWidth="2.5" fill="url(#panFill2)" />
    <line x1="134" y1="120" x2="182" y2="120" stroke="url(#panGold)" strokeWidth="1.5" opacity="0.4" />
    {/* Book on base */}
    <rect x="72" y="196" width="56" height="10" rx="3" fill="url(#bookGrad)" />
    <rect x="76" y="188" width="48" height="10" rx="2" fill="url(#bookGrad2)" />
    {/* Decorative stars */}
    <circle cx="55" cy="58" r="2" fill="#c9a84c" opacity="0.7" />
    <circle cx="145" cy="58" r="2" fill="#c9a84c" opacity="0.7" />
    <circle cx="30" cy="95" r="1.5" fill="#a78bfa" opacity="0.6" />
    <circle cx="170" cy="95" r="1.5" fill="#a78bfa" opacity="0.6" />
    <defs>
      <linearGradient id="pillarGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0d074" />
        <stop offset="100%" stopColor="#c9a84c" />
      </linearGradient>
      <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c9a84c" />
        <stop offset="50%" stopColor="#f0d074" />
        <stop offset="100%" stopColor="#c9a84c" />
      </linearGradient>
      <radialGradient id="sphereGrad" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#f0d074" />
        <stop offset="100%" stopColor="#a07830" />
      </radialGradient>
      <linearGradient id="chainGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c9a84c" />
        <stop offset="100%" stopColor="#8a6820" />
      </linearGradient>
      <linearGradient id="panGold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c9a84c" />
        <stop offset="100%" stopColor="#f0d074" />
      </linearGradient>
      <linearGradient id="panFill" gradientUnits="userSpaceOnUse" x1="18" y1="130" x2="18" y2="148">
        <stop offset="0%" stopColor="#c9a84c" stopOpacity={dark ? "0.25" : "0.35"} />
        <stop offset="100%" stopColor="#c9a84c" stopOpacity={dark ? "0.05" : "0.1"} />
      </linearGradient>
      <linearGradient id="panFill2" gradientUnits="userSpaceOnUse" x1="134" y1="120" x2="134" y2="138">
        <stop offset="0%" stopColor={dark ? "#a78bfa" : "#7c3aed"} stopOpacity="0.25" />
        <stop offset="100%" stopColor={dark ? "#a78bfa" : "#7c3aed"} stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="bookGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#4c3a1a" />
        <stop offset="100%" stopColor="#7a5c28" />
      </linearGradient>
      <linearGradient id="bookGrad2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7a5c28" />
        <stop offset="100%" stopColor="#c9a84c" />
      </linearGradient>
      <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

/* ─── Floating Particle ───────────────────────────────────────────── */
const Particle = ({ style, char, dark }) => (
  <div
    className="absolute font-bold select-none pointer-events-none opacity-0"
    style={{
      color: dark ? '#c9a84c' : '#b08b25',
      animation: `floatParticle ${style.duration}s ${style.delay}s ease-in-out infinite`,
      fontSize: style.size,
      left: style.left,
      top: style.top,
      ...style.extra
    }}
  >
    {char}
  </div>
);

const PARTICLES = [
  { char: '§', style: { duration: 6,   delay: 0,   size: '22px', left: '8%',  top: '20%', extra: {} } },
  { char: '⚖', style: { duration: 7,   delay: 1,   size: '18px', left: '82%', top: '15%', extra: {} } },
  { char: '¶', style: { duration: 5.5, delay: 2,   size: '16px', left: '15%', top: '65%', extra: {} } },
  { char: '©', style: { duration: 8,   delay: 0.5, size: '14px', left: '78%', top: '70%', extra: {} } },
  { char: '§', style: { duration: 6.5, delay: 3,   size: '12px', left: '88%', top: '45%', extra: {} } },
  { char: '†', style: { duration: 9,   delay: 1.5, size: '20px', left: '5%',  top: '80%', extra: {} } },
  { char: '¤', style: { duration: 7.5, delay: 2.5, size: '13px', left: '60%', top: '8%',  extra: {} } },
  { char: '₹', style: { duration: 6,   delay: 4,   size: '15px', left: '35%', top: '88%', extra: {} } },
];

const FEATURES = [
  { icon: 'gavel',         label: 'IPC, CrPC, CPC & 8+ Acts',       sub: 'Full-text search across 2,200+ sections' },
  { icon: 'bookmark',      label: 'Smart Bookmarking',               sub: 'Save & annotate any legal provision' },
  { icon: 'manage_search', label: 'Case Law Analytics',              sub: 'Cross-reference judgments instantly' },
  { icon: 'verified',      label: 'Verified Legal Intelligence',     sub: 'Standardized, structured statutes' },
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('lex-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add('dark'); localStorage.setItem('lex-theme', 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('lex-theme', 'light'); }
  }, [dark]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Full name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: (values) => {
      const { confirmPassword, ...submitData } = values;
      dispatch(registerUser(submitData));
    },
  });

  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ` +
    `${hasError
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
      : 'border-[#d1d5db] dark:border-white/10 bg-white dark:bg-white/5'} ` +
    `text-[#111827] dark:text-[#e1e3e4] placeholder:text-[#9ca3af] dark:placeholder:text-gray-500 ` +
    `${hasError
      ? 'focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'focus:border-[#c9a84c] dark:focus:border-[#7c3aed] focus:ring-2 focus:ring-[#c9a84c]/20 dark:focus:ring-[#7c3aed]/25'}`;

  return (
    <>
      {/* Inject particle animation keyframes */}
      <style>{`
        @keyframes floatParticle {
          0%   { opacity: 0;    transform: translateY(0px) rotate(0deg); }
          20%  { opacity: 0.35; }
          50%  { opacity: 0.2;  transform: translateY(-22px) rotate(8deg); }
          80%  { opacity: 0.35; }
          100% { opacity: 0;    transform: translateY(0px) rotate(0deg); }
        }
        @keyframes scalesSwing {
          0%,100% { transform: rotate(-4deg) translateY(0px); }
          50%      { transform: rotate(4deg) translateY(-6px); }
        }
        @keyframes scalePanLeft {
          0%,100% { transform: translateY(0px) rotate(-3deg); }
          50%      { transform: translateY(8px) rotate(3deg); }
        }
        @keyframes scalePanRight {
          0%,100% { transform: translateY(8px) rotate(2deg); }
          50%      { transform: translateY(0px) rotate(-2deg); }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); opacity: 0.18; }
          33%      { transform: translate(25px,-18px) scale(1.08); opacity: 0.24; }
          66%      { transform: translate(-15px,12px) scale(0.94); opacity: 0.16; }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1); opacity: 0.12; }
          40%      { transform: translate(-20px,16px) scale(1.06); opacity: 0.2; }
          70%      { transform: translate(18px,-10px) scale(0.96); opacity: 0.14; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 12px rgba(201,168,76,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(201,168,76,0); }
        }
        @keyframes shimmerBar {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .anim-fade-up   { animation: fadeSlideUp   0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-fade-right{ animation: fadeSlideRight 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-fade-left { animation: fadeSlideLeft  0.65s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div className="min-h-screen flex bg-[#f0ede8] dark:bg-[#080b0d]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* ══════════════════════════════════════════════════
            LEFT BRANDING PANEL
        ══════════════════════════════════════════════════ */}
        <div className="hidden md:flex md:w-[46%] flex-col relative overflow-hidden transition-all duration-300"
          style={{
            background: dark
              ? 'linear-gradient(160deg, #0a0e1a 0%, #111827 30%, #0f172a 60%, #1a0f2e 100%)'
              : 'linear-gradient(160deg, #f8f6f2 0%, #eeeae0 35%, #e1dcd0 70%, #d8d2c2 100%)',
          }}>

          {/* Animated Background Orbs */}
          <div className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] rounded-full pointer-events-none transition-all duration-300"
            style={{ 
              background: dark 
                ? 'radial-gradient(circle, rgba(201,168,76,0.22) 0%, transparent 70%)' 
                : 'radial-gradient(circle, rgba(201,168,76,0.28) 0%, transparent 70%)', 
              animation: 'orb1 12s ease-in-out infinite' 
            }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[380px] h-[380px] rounded-full pointer-events-none transition-all duration-300"
            style={{ 
              background: dark 
                ? 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' 
                : 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', 
              animation: 'orb2 14s ease-in-out infinite' 
            }} />
          <div className="absolute top-[40%] right-[5%] w-[200px] h-[200px] rounded-full pointer-events-none transition-all duration-300"
            style={{ 
              background: dark 
                ? 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)' 
                : 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', 
              animation: 'orb1 9s 2s ease-in-out infinite' 
            }} />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{ 
              backgroundImage: dark 
                ? 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)' 
                : 'linear-gradient(rgba(201,168,76,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.08) 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }} />

          {/* Floating Legal Particles */}
          {PARTICLES.map((p, i) => <Particle key={i} {...p} dark={dark} />)}

          {/* ── Content ── */}
          <div className="relative z-10 flex flex-col h-full p-10 lg:p-14">

            {/* Logo + Theme toggle */}
            <div className={`flex justify-between items-center mb-10 ${mounted ? 'anim-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.1s' }}>
              <Link to="/" className="flex items-center gap-2.5 group" aria-label="Home">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d074)', boxShadow: '0 4px 16px rgba(201,168,76,0.35)', animation: 'pulseRing 2.8s ease-in-out infinite' }}>
                  <span className="material-symbols-outlined text-[#1a0f00]" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>gavel</span>
                </div>
                <div>
                  <span className={`font-bold text-lg leading-none tracking-tight transition-colors duration-300 ${dark ? 'text-white' : 'text-stone-900'}`}>LexIndia</span>
                  <div className="text-[11px] text-[#c9a84c] font-semibold tracking-widest uppercase leading-none mt-0.5">Legal Explorer</div>
                </div>
              </Link>
              <button onClick={() => setDark(!dark)} id="theme-toggle-register"
                className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 backdrop-blur-sm ${
                  dark 
                    ? 'border-white/10 bg-white/5 hover:bg-white/15 text-white' 
                    : 'border-stone-800/15 bg-stone-800/5 hover:bg-stone-800/10 text-stone-800'
                }`}
                aria-label="Toggle theme">
                <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
                  {dark ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>

            {/* Headline */}
            <div className={`mb-6 ${mounted ? 'anim-fade-right' : 'opacity-0'}`} style={{ animationDelay: '0.25s' }}>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-300 mb-4 ${
                dark 
                  ? 'bg-[#c9a84c]/10 border-[#c9a84c]/20' 
                  : 'bg-[#c9a84c]/15 border-[#c9a84c]/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] inline-block" style={{ animation: 'pulseRing 2s infinite' }} />
                <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 ${dark ? 'text-[#c9a84c]' : 'text-[#8f6d19]'}`}>Trusted by Legal Professionals</span>
              </div>
              <h1 className={`text-[34px] lg:text-[42px] font-black leading-[1.1] tracking-tight mb-3 transition-colors duration-300 ${dark ? 'text-white' : 'text-stone-900'}`}>
                Join LexIndia<br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                  dark 
                    ? 'from-[#c9a84c] via-[#f0d074] to-[#e8b84b]' 
                    : 'from-[#a37f22] via-[#d5ae3c] to-[#b58d24]'
                }`}>
                  Legal Intelligence
                </span><br />
                Platform
              </h1>
              <p className={`text-[14px] leading-relaxed max-w-[300px] transition-colors duration-300 ${dark ? 'text-gray-400' : 'text-stone-600'}`}>
                Start your journey with India's most trusted legal research platform. Thousands of advocates already rely on us.
              </p>
            </div>

            {/* Animated Scales of Justice */}
            <div className={`flex-1 flex items-center justify-center px-6 max-h-[220px] ${mounted ? 'anim-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.4s' }}>
              <div className="relative w-full max-w-[220px]" 
                style={{ 
                  filter: dark 
                    ? 'drop-shadow(0 8px 32px rgba(201,168,76,0.3))' 
                    : 'drop-shadow(0 8px 32px rgba(201,168,76,0.18))' 
                }}>
                {/* Animated beam */}
                <div className="absolute top-[31%] left-[12%] right-[12%] h-[5px] rounded-full z-10"
                  style={{ background: 'linear-gradient(90deg, #c9a84c, #f0d074, #c9a84c)', animation: 'scalesSwing 4s ease-in-out infinite', transformOrigin: 'center center', boxShadow: '0 2px 12px rgba(201,168,76,0.4)' }} />
                {/* Left pan */}
                <div className="absolute z-10"
                  style={{ left: '8%', top: '42%', animation: 'scalePanLeft 4s ease-in-out infinite' }}>
                  <div className="w-16 h-1.5 rounded-full" style={{ background: 'linear-gradient(90deg, #c9a84c, #f0d074)', boxShadow: '0 2px 8px rgba(201,168,76,0.5)' }} />
                  <div className={`text-center text-[10px] font-bold mt-1 tracking-wider transition-colors duration-300 ${dark ? 'text-[#c9a84c]' : 'text-[#a37f22]'}`}>LAW</div>
                </div>
                {/* Right pan */}
                <div className="absolute z-10"
                  style={{ right: '8%', top: '37%', animation: 'scalePanRight 4s ease-in-out infinite' }}>
                  <div className="w-16 h-1.5 rounded-full" style={{ background: 'linear-gradient(90deg, #a78bfa, #c4b5fd)', boxShadow: '0 2px 8px rgba(167,139,250,0.5)' }} />
                  <div className={`text-center text-[10px] font-bold mt-1 tracking-wider transition-colors duration-300 ${dark ? 'text-[#a78bfa]' : 'text-[#6d28d9]'}`}>JUSTICE</div>
                </div>
                <ScalesOfJustice dark={dark} />
              </div>
            </div>

            {/* Feature list */}
            <div className={`space-y-3 mt-2 ${mounted ? 'anim-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.55s' }}>
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-3 group"
                  style={{ opacity: 0, animation: `fadeSlideUp 0.5s ${0.6 + i * 0.1}s cubic-bezier(0.22,1,0.36,1) forwards` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-110"
                    style={{ 
                      background: dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.08)', 
                      border: dark ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(201,168,76,0.25)' 
                    }}>
                    <span className={`material-symbols-outlined ${dark ? 'text-[#c9a84c]' : 'text-[#a37f22]'}`} style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                  </div>
                  <div>
                    <div className={`text-[13px] font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-stone-900'}`}>{f.label}</div>
                    <div className={`text-[11px] transition-colors duration-300 ${dark ? 'text-gray-500' : 'text-stone-500'}`}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats bar */}
            <div className={`mt-6 pt-5 border-t grid grid-cols-3 gap-4 transition-colors duration-300 ${mounted ? 'anim-fade-up' : 'opacity-0'} ${
              dark ? 'border-white/8' : 'border-stone-900/10'
            }`}
              style={{ animationDelay: '0.9s' }}>
              {[
                { val: '8+', label: 'Major Acts' },
                { val: '2,200+', label: 'Sections' },
                { val: '100%', label: 'Verified' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className={`text-[20px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-r ${
                    dark 
                      ? 'from-[#c9a84c] to-[#f0d074]' 
                      : 'from-[#a37f22] to-[#d5ae3c]'
                  }`}>{s.val}</div>
                  <div className={`text-[10px] font-semibold tracking-wider uppercase mt-1 transition-colors duration-300 ${
                    dark ? 'text-gray-500' : 'text-stone-500'
                  }`}>{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT FORM PANEL
        ══════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative bg-white dark:bg-[#0d1117]">

          {/* Subtle background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #c9a84c22 1px, transparent 0)', backgroundSize: '32px 32px' }} />

          {/* Back Button */}
          <Link to="/" className={`absolute top-6 left-6 flex items-center gap-1.5 text-sm font-medium text-[#6b7280] dark:text-gray-500 hover:text-[#111827] dark:hover:text-white transition-colors ${mounted ? 'anim-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.15s' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
            Back
          </Link>

          {/* Mobile theme toggle */}
          <div className="md:hidden absolute top-6 right-6">
            <button onClick={() => setDark(!dark)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/8 transition-colors">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400" style={{ fontSize: '20px' }}>
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>

          {/* Form card */}
          <div className={`w-full max-w-[420px] relative z-10 ${mounted ? 'anim-fade-left' : 'opacity-0'}`}
            style={{ animationDelay: '0.3s' }}>

            {/* Heading */}
            <div className="text-center mb-7">
              <div className="md:hidden w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d074)', boxShadow: '0 4px 20px rgba(201,168,76,0.35)' }}>
                <span className="material-symbols-outlined text-[#1a0f00]" style={{ fontSize: '26px', fontVariationSettings: "'FILL' 1" }}>gavel</span>
              </div>
              <h2 className="text-[28px] font-extrabold text-[#111827] dark:text-white mb-1.5 tracking-tight">Create Your Account</h2>
              <p className="text-[14px] text-gray-500 dark:text-gray-400">Start your free trial — no credit card required.</p>
            </div>

            {/* Card */}
            <div className="rounded-2xl overflow-hidden animate-scale-in"
              style={{
                background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
                border: `1px solid ${dark ? 'rgba(124,58,237,0.35)' : 'rgba(201,168,76,0.4)'}`,
                boxShadow: dark
                  ? '0 8px 40px rgba(124,58,237,0.15), 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : '0 8px 40px rgba(201,168,76,0.12), 0 2px 12px rgba(0,0,0,0.06)',
                backdropFilter: 'blur(20px)',
              }}>

              {/* Tabs */}
              <div className="flex border-b border-[#e5e7eb] dark:border-white/8">
                <Link to="/login" className="flex-1 py-4 text-center text-sm font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  Log In
                </Link>
                <button id="tab-register" className="flex-1 py-4 text-sm font-bold transition-all"
                  style={{ color: dark ? '#a78bfa' : '#c9a84c', borderBottom: `2px solid ${dark ? '#7c3aed' : '#c9a84c'}` }}>
                  Register
                </button>
              </div>

              <div className="p-7">
                {/* Error */}
                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2.5 border border-red-200 dark:border-red-800/30">
                    <span className="material-symbols-outlined shrink-0" style={{ fontSize: '18px' }}>error</span>
                    {error}
                  </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#374151] dark:text-gray-300 mb-2">Full Name</label>
                    <input id="register-name" name="name" type="text" placeholder="Your full name"
                      {...formik.getFieldProps('name')}
                      className={inputClass(formik.touched.name && formik.errors.name)} autoComplete="name" />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#374151] dark:text-gray-300 mb-2">Email Address</label>
                    <input id="register-email" name="email" type="email" placeholder="name@firm.com"
                      {...formik.getFieldProps('email')}
                      className={inputClass(formik.touched.email && formik.errors.email)} autoComplete="email" />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#374151] dark:text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input id="register-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password"
                        {...formik.getFieldProps('password')}
                        className={`${inputClass(formik.touched.password && formik.errors.password)} pr-11`}
                        autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#374151] dark:text-gray-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input id="register-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
                        {...formik.getFieldProps('confirmPassword')}
                        className={`${inputClass(formik.touched.confirmPassword && formik.errors.confirmPassword)} pr-11`}
                        autoComplete="new-password" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                          {showConfirm ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button id="register-submit" type="submit" disabled={loading}
                    className="w-full py-3.5 text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: dark
                        ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                        : 'linear-gradient(135deg, #c9a84c, #e8b84b)',
                      boxShadow: dark
                        ? '0 4px 20px rgba(124,58,237,0.4)'
                        : '0 4px 20px rgba(201,168,76,0.35)',
                    }}>
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>person_add</span>
                        Create Account
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#e5e7eb] dark:bg-white/8" />
                    <span className="text-[12px] text-gray-400 font-medium">Or continue with</span>
                    <div className="flex-1 h-px bg-[#e5e7eb] dark:bg-white/8" />
                  </div>

                  {/* Google + SSO side by side */}
                  <div className="flex gap-3">
                    {/* Google */}
                    <button id="google-register" type="button"
                      className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-[#d1d5db] dark:border-white/10 rounded-xl text-sm font-medium text-[#374151] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200">
                      <svg width="17" height="17" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>

                    {/* Apple */}
                    <button id="apple-register" type="button"
                      className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                      style={{
                        background: dark ? 'rgba(255,255,255,0.08)' : '#000',
                        color: dark ? '#fff' : '#fff',
                        border: dark ? '1px solid rgba(255,255,255,0.12)' : 'none',
                      }}>
                      <svg width="16" height="16" viewBox="0 0 814 1000" fill="currentColor" style={{ flexShrink: 0 }}>
                        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 71 0 130.1 46.4 174.4 46.4 42.7 0 109.2-49.5 188.5-49.5 30.7 0 108.2 2.6 168.1 75.8zM533 85.5c-27.4 34.1-73.5 60.5-119.5 60.5-6.4 0-12.9-.6-18.7-1.3-1.3-5.8-1.9-11.6-1.9-17.4 0-33.5 17.4-68.7 44.8-100.5 27.4-32.5 76.5-58.3 118.6-60.5 1.3 6.4 1.9 12.8 1.9 18.7 0 33.5-14.1 67.4-25.2 100.5z"/>
                      </svg>
                      Apple
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-[12px] text-gray-400 dark:text-gray-600 mt-5 leading-relaxed">
              By registering, you agree to our{' '}
              <a href="#" className="font-semibold hover:underline" style={{ color: dark ? '#a78bfa' : '#c9a84c' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="font-semibold hover:underline" style={{ color: dark ? '#a78bfa' : '#c9a84c' }}>Privacy Policy</a>.
            </p>
            <p className="text-center text-[13px] text-gray-500 dark:text-gray-500 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="font-bold hover:underline underline-offset-2 transition-colors"
                style={{ color: dark ? '#a78bfa' : '#c9a84c' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
