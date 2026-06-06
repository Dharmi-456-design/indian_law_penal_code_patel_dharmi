import React, { useState } from 'react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#f5f3ef] dark:bg-[#111415]">

      {/* ── Left Branding Panel ── */}
      <div
        className="hidden md:flex md:w-[42%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #2e3b2e 0%, #3a4a35 25%, #4a5040 50%, #35403a 75%, #1e2a1e 100%)',
        }}
      >
        {/* Background texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="material-symbols-outlined text-[#c9a84c] text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}
            >
              gavel
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            LexIndia Legal Explorer
          </h1>
          <p className="text-[15px] text-gray-300 leading-relaxed max-w-xs">
            The modern suite for deep legal research and efficient data management. Trusted by
            professionals.
          </p>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#c9a84c] text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="text-sm text-gray-300 font-medium">Verified Legal Intelligence Hub</span>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-[#f5f3ef] dark:bg-[#111415]">

        {/* Form Container */}
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-white mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'login'
                ? 'Sign in to access your professional suite.'
                : 'Join thousands of legal professionals today.'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-[#1d2021] rounded-2xl border border-[#c9a84c] dark:border-[#c9a84c]/50 shadow-lg overflow-hidden">

            {/* Tab Bar */}
            <div className="flex border-b border-gray-200 dark:border-[#40484a]">
              <button
                id="tab-login"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'login'
                    ? 'text-[#c9a84c] border-b-2 border-[#c9a84c]'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                Log In
              </button>
              <button
                id="tab-register"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'register'
                    ? 'text-[#c9a84c] border-b-2 border-[#c9a84c]'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form Body */}
            <div className="p-8">
              <form onSubmit={(e) => e.preventDefault()}>

                {/* Register: Full Name */}
                {activeTab === 'register' && (
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="register-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#40484a] bg-white dark:bg-[#111415] text-[#1a1a1a] dark:text-[#e1e3e4] placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none focus:border-[#c9a84c] dark:focus:border-[#e6c364] focus:ring-2 focus:ring-[#c9a84c]/20 dark:focus:ring-[#e6c364]/10 transition-colors text-sm"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="input-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@firm.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#40484a] bg-white dark:bg-[#111415] text-[#1a1a1a] dark:text-[#e1e3e4] placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none focus:border-[#c9a84c] dark:focus:border-[#e6c364] focus:ring-2 focus:ring-[#c9a84c]/20 dark:focus:ring-[#e6c364]/10 transition-colors text-sm"
                  />
                </div>

                {/* Password */}
                <div className="mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="input-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 dark:border-[#40484a] bg-white dark:bg-[#111415] text-[#1a1a1a] dark:text-[#e1e3e4] placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none focus:border-[#c9a84c] dark:focus:border-[#e6c364] focus:ring-2 focus:ring-[#c9a84c]/20 dark:focus:ring-[#e6c364]/10 transition-colors text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                {activeTab === 'login' && (
                  <div className="flex justify-end mb-6 mt-1">
                    <a
                      href="#"
                      className="text-xs font-medium text-[#c9a84c] dark:text-[#e6c364] hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                )}

                {/* Register: Confirm Password */}
                {activeTab === 'register' && (
                  <div className="mt-5 mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      id="input-confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#40484a] bg-white dark:bg-[#111415] text-[#1a1a1a] dark:text-[#e1e3e4] placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none focus:border-[#c9a84c] dark:focus:border-[#e6c364] focus:ring-2 focus:ring-[#c9a84c]/20 dark:focus:ring-[#e6c364]/10 transition-colors text-sm"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  id="submit-btn"
                  type="submit"
                  className="w-full py-3.5 bg-[#c9a84c] text-white font-bold text-sm rounded-lg hover:bg-[#b8943a] transition-colors shadow-sm mt-2"
                >
                  {activeTab === 'login' ? 'Access Dashboard' : 'Create Account'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-[#40484a]"></div>
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">Or continue with</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-[#40484a]"></div>
                </div>

                {/* Google Login */}
                <button
                  id="google-login"
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 dark:border-[#40484a] rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2b] transition-colors mb-3"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Login with Google
                </button>

                {/* SSO Button */}
                <button
                  id="sso-login"
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 bg-[#2d3a5c] dark:bg-[#1d2a4a] rounded-lg text-sm font-medium text-white hover:bg-[#243050] dark:hover:bg-[#16213a] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
                  Enterprise SSO
                </button>
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-600 mt-6">
            By {activeTab === 'login' ? 'logging in' : 'registering'}, you agree to our{' '}
            <a href="#" className="text-[#c9a84c] dark:text-[#e6c364] hover:underline font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#c9a84c] dark:text-[#e6c364] hover:underline font-medium">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
