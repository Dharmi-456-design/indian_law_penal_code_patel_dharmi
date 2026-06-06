import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('lex-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add('dark'); localStorage.setItem('lex-theme', 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('lex-theme', 'light'); }
  }, [dark]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputClass =
    'w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all duration-150 ' +
    'border-[#d1d5db] dark:border-[#40484a] bg-white dark:bg-[#0c0f10] ' +
    'text-[#111827] dark:text-[#e1e3e4] placeholder:text-[#9ca3af] dark:placeholder:text-[#6b7280] ' +
    'focus:border-[#c9a84c] dark:focus:border-[#7c3aed] focus:ring-2 focus:ring-[#c9a84c]/20 dark:focus:ring-[#7c3aed]/20';

  return (
    <div className="min-h-screen flex bg-[#f5f3ef] dark:bg-[#111415]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── LEFT BRANDING PANEL ── */}
      <div className="hidden md:flex md:w-[42%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#2c3b2c 0%,#38483a 25%,#4a5040 50%,#353f38 75%,#1d291d 100%)' }}>

        {/* Dot grid overlay */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        {/* Glow orb */}
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

        {/* Brand content */}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <span className="material-symbols-outlined text-[#c9a84c]"
              style={{ fontSize: '26px', fontVariationSettings: "'FILL' 1, 'wght' 500" }}>
              gavel
            </span>
            {/* Theme toggle */}
            <button onClick={() => setDark(!dark)} id="theme-toggle-login"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle theme">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
          <h1 className="text-[38px] font-extrabold text-white leading-tight mb-5 tracking-tight">
            LexIndia<br />Legal Explorer
          </h1>
          <p className="text-[15px] text-[#9ca3af] leading-relaxed max-w-xs">
            The modern suite for deep legal research and efficient data management. Trusted by professionals.
          </p>
        </div>

        {/* Verified badge */}
        <div className="relative z-10 flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10 w-fit">
          <span className="material-symbols-outlined text-[#c9a84c]"
            style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>verified</span>
          <span className="text-sm text-[#d1d5db] font-medium">Verified Legal Intelligence Hub</span>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile theme toggle */}
        <div className="md:hidden w-full max-w-[420px] flex justify-end mb-4">
          <button onClick={() => setDark(!dark)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] dark:hover:bg-[#1d2021] transition-colors">
            <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9ca3af]" style={{ fontSize: '20px' }}>
              {dark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        <div className="w-full max-w-[420px]">

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-[#111827] dark:text-white mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-[14px] text-[#6b7280] dark:text-[#9ca3af]">
              Sign in to access your professional suite.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-[#1d2021] rounded-2xl overflow-hidden"
            style={{ border: '1px solid', borderColor: dark ? 'rgba(124,58,237,0.5)' : 'rgba(201,168,76,0.6)',
              boxShadow: dark
                ? '0 4px 32px rgba(124,58,237,0.12), 0 2px 8px rgba(0,0,0,0.2)'
                : '0 4px 32px rgba(201,168,76,0.12), 0 2px 8px rgba(0,0,0,0.08)' }}>

            {/* Tabs */}
            <div className="flex border-b border-[#e5e7eb] dark:border-[#40484a]">
              <button id="tab-login"
                className="flex-1 py-4 text-sm font-semibold border-b-2 text-[#c9a84c] dark:text-[#7c3aed] border-[#c9a84c] dark:border-[#7c3aed] transition-colors">
                Log In
              </button>
              <Link to="/register"
                className="flex-1 py-4 text-center text-sm font-semibold text-[#9ca3af] hover:text-[#6b7280] dark:hover:text-[#d1d5db] transition-colors">
                Register
              </Link>
            </div>

            {/* Form Body */}
            <div className="p-8">
              <form onSubmit={e => e.preventDefault()}>

                {/* Email */}
                <div className="mb-5">
                  <label className="block text-[13px] font-medium text-[#374151] dark:text-[#d1d5db] mb-1.5">
                    Email Address
                  </label>
                  <input id="input-email" name="email" type="email" value={formData.email}
                    onChange={handleChange} placeholder="name@firm.com"
                    className={inputClass} autoComplete="email" />
                </div>

                {/* Password */}
                <div className="mb-1">
                  <label className="block text-[13px] font-medium text-[#374151] dark:text-[#d1d5db] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input id="input-password" name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password} onChange={handleChange}
                      placeholder="••••••••"
                      className={`${inputClass} pr-11`} autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] dark:hover:text-[#d1d5db] transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                <div className="flex justify-end mb-6 mt-1.5">
                  <a href="#" className="text-[12px] font-semibold text-[#c9a84c] dark:text-[#a78bfa] hover:underline underline-offset-2">
                    Forgot Password?
                  </a>
                </div>

                {/* Submit */}
                <button id="submit-btn" type="submit"
                  className="w-full py-3.5 text-white font-bold text-[15px] rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150"
                  style={{
                    backgroundColor: dark ? '#7c3aed' : '#c9a84c',
                    boxShadow: dark
                      ? '0 3px 14px rgba(124,58,237,0.35)'
                      : '0 3px 12px rgba(201,168,76,0.3)'
                  }}>
                  Access Dashboard
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#e5e7eb] dark:bg-[#40484a]" />
                  <span className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] font-medium">Or continue with</span>
                  <div className="flex-1 h-px bg-[#e5e7eb] dark:bg-[#40484a]" />
                </div>

                {/* Google */}
                <button id="google-login" type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 mb-3 border border-[#d1d5db] dark:border-[#40484a] rounded-xl text-sm font-medium text-[#374151] dark:text-[#d1d5db] hover:bg-[#f9fafb] dark:hover:bg-[#282a2b] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Login with Google
                </button>

                {/* SSO */}
                <button id="sso-login" type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: dark ? '#c9a84c' : '#2d3a5c',
                    color: dark ? '#1a1a1a' : '#ffffff',
                  }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>corporate_fare</span>
                  Enterprise SSO
                </button>
              </form>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-[12px] text-[#9ca3af] dark:text-[#6b7280] mt-6 leading-relaxed">
            By logging in, you agree to our{' '}
            <a href="#" className="text-[#c9a84c] dark:text-[#a78bfa] hover:underline font-semibold">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#c9a84c] dark:text-[#a78bfa] hover:underline font-semibold">Privacy Policy</a>.
          </p>

          {/* Link to register */}
          <p className="text-center text-[13px] text-[#6b7280] dark:text-[#9ca3af] mt-3">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#c9a84c] dark:text-[#a78bfa] font-semibold hover:underline underline-offset-2">
              Create one
            </Link>
          </p>

          {/* Back to home */}
          <p className="text-center mt-3">
            <Link to="/" className="text-[12px] text-[#9ca3af] hover:text-[#6b7280] dark:hover:text-[#d1d5db] hover:underline underline-offset-2 transition-colors">
              ← Back to LexIndia Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
