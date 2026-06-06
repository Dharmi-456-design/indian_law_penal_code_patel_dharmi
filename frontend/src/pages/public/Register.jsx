import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser, clearError } from '../../store/slices/authSlice';

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
      // Exclude confirmPassword when sending to API
      const { confirmPassword, ...submitData } = values;
      dispatch(registerUser(submitData));
    },
  });

  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all duration-150 ` +
    `${hasError ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-[#d1d5db] dark:border-[#40484a] bg-white dark:bg-[#0c0f10]'} ` +
    `text-[#111827] dark:text-[#e1e3e4] placeholder:text-[#9ca3af] dark:placeholder:text-[#6b7280] ` +
    `${hasError ? 'focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'focus:border-[#c9a84c] dark:focus:border-[#7c3aed] focus:ring-2 focus:ring-[#c9a84c]/20 dark:focus:ring-[#7c3aed]/20'}`;

  return (
    <div className="min-h-screen flex bg-[#f5f3ef] dark:bg-[#111415]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── LEFT BRANDING PANEL ── */}
      <div className="hidden md:flex md:w-[42%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#2c3b2c 0%,#38483a 25%,#4a5040 50%,#353f38 75%,#1d291d 100%)' }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <Link to="/" className="hover:opacity-80 transition-opacity" aria-label="Go to Home">
              <span className="material-symbols-outlined text-[#c9a84c]" style={{ fontSize: '26px', fontVariationSettings: "'FILL' 1, 'wght' 500" }}>gavel</span>
            </Link>
            <button onClick={() => setDark(!dark)} id="theme-toggle-register" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Toggle theme">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
          <h1 className="text-[38px] font-extrabold text-white leading-tight mb-5 tracking-tight">Join LexIndia<br />Today</h1>
          <p className="text-[15px] text-[#9ca3af] leading-relaxed max-w-xs">Start your journey with India's most trusted legal research platform. Thousands of advocates already rely on us.</p>
          <div className="mt-10 space-y-4">
            {[ { icon: 'library_books', label: 'Access millions of legal judgments' }, { icon: 'cloud_sync', label: 'Cloud-synced notes across devices' }, { icon: 'insights', label: 'AI-powered legal analytics' } ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
                  <span className="material-symbols-outlined text-[#c9a84c]" style={{ fontSize: '16px' }}>{icon}</span>
                </div>
                <span className="text-sm text-[#d1d5db]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10 w-fit">
          <span className="material-symbols-outlined text-[#c9a84c]" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>verified</span>
          <span className="text-sm text-[#d1d5db] font-medium">Verified Legal Intelligence Hub</span>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        
        {/* Back Button */}
        <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-1.5 text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          Back
        </Link>

        {/* Mobile theme toggle */}
        <div className="md:hidden w-full max-w-[420px] flex justify-end mb-4 absolute top-6 right-6">
          <button onClick={() => setDark(!dark)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] dark:hover:bg-[#1d2021] transition-colors">
            <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9ca3af]" style={{ fontSize: '20px' }}>{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-[#111827] dark:text-white mb-2 tracking-tight">Create Your Account</h2>
            <p className="text-[14px] text-[#6b7280] dark:text-[#9ca3af]">Start your free trial — no credit card required.</p>
          </div>

          <div className="bg-white dark:bg-[#1d2021] rounded-2xl overflow-hidden" style={{ border: '1px solid', borderColor: dark ? 'rgba(124,58,237,0.5)' : 'rgba(201,168,76,0.6)', boxShadow: dark ? '0 4px 32px rgba(124,58,237,0.12), 0 2px 8px rgba(0,0,0,0.2)' : '0 4px 32px rgba(201,168,76,0.12), 0 2px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex border-b border-[#e5e7eb] dark:border-[#40484a]">
              <Link to="/login" className="flex-1 py-4 text-center text-sm font-semibold text-[#9ca3af] hover:text-[#6b7280] dark:hover:text-[#d1d5db] transition-colors">Log In</Link>
              <button className="flex-1 py-4 text-sm font-semibold border-b-2 text-[#c9a84c] dark:text-[#7c3aed] border-[#c9a84c] dark:border-[#7c3aed] transition-colors">Register</button>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 border border-red-200 dark:border-red-800/30">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  {error}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-5">
                  <label className="block text-[13px] font-medium text-[#374151] dark:text-[#d1d5db] mb-1.5">Full Name</label>
                  <input id="register-name" name="name" type="text" placeholder="Your full name"
                    {...formik.getFieldProps('name')}
                    className={inputClass(formik.touched.name && formik.errors.name)} autoComplete="name" />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.name}</div>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-[13px] font-medium text-[#374151] dark:text-[#d1d5db] mb-1.5">Email Address</label>
                  <input id="register-email" name="email" type="email" placeholder="name@firm.com"
                    {...formik.getFieldProps('email')}
                    className={inputClass(formik.touched.email && formik.errors.email)} autoComplete="email" />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.email}</div>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-[13px] font-medium text-[#374151] dark:text-[#d1d5db] mb-1.5">Password</label>
                  <div className="relative">
                    <input id="register-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password"
                      {...formik.getFieldProps('password')}
                      className={`${inputClass(formik.touched.password && formik.errors.password)} pr-11`} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] dark:hover:text-[#d1d5db] transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.password}</div>
                  )}
                </div>

                <div className="mb-7">
                  <label className="block text-[13px] font-medium text-[#374151] dark:text-[#d1d5db] mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input id="register-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
                      {...formik.getFieldProps('confirmPassword')}
                      className={`${inputClass(formik.touched.confirmPassword && formik.errors.confirmPassword)} pr-11`} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] dark:hover:text-[#d1d5db] transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{showConfirm ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.confirmPassword}</div>
                  )}
                </div>

                <button id="register-submit" type="submit" disabled={loading}
                  className="w-full py-3.5 text-white font-bold text-[15px] rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: dark ? '#7c3aed' : '#c9a84c', boxShadow: dark ? '0 3px 14px rgba(124,58,237,0.35)' : '0 3px 12px rgba(201,168,76,0.3)' }}>
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>progress_activity</span>
                  ) : 'Create Account'}
                </button>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#e5e7eb] dark:bg-[#40484a]" />
                  <span className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] font-medium">Or continue with</span>
                  <div className="flex-1 h-px bg-[#e5e7eb] dark:bg-[#40484a]" />
                </div>

                <button id="google-register" type="button" className="w-full flex items-center justify-center gap-3 py-3 mb-3 border border-[#d1d5db] dark:border-[#40484a] rounded-xl text-sm font-medium text-[#374151] dark:text-[#d1d5db] hover:bg-[#f9fafb] dark:hover:bg-[#282a2b] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Sign up with Google
                </button>

                <button id="sso-register" type="button" className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all" style={{ backgroundColor: dark ? '#c9a84c' : '#2d3a5c', color: dark ? '#1a1a1a' : '#ffffff' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>corporate_fare</span>
                  Enterprise SSO
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-[12px] text-[#9ca3af] dark:text-[#6b7280] mt-6 leading-relaxed">
            By registering, you agree to our <a href="#" className="text-[#c9a84c] dark:text-[#a78bfa] hover:underline font-semibold">Terms of Service</a> and <a href="#" className="text-[#c9a84c] dark:text-[#a78bfa] hover:underline font-semibold">Privacy Policy</a>.
          </p>
          <p className="text-center text-[13px] text-[#6b7280] dark:text-[#9ca3af] mt-3">
            Already have an account? <Link to="/login" className="text-[#c9a84c] dark:text-[#a78bfa] font-semibold hover:underline underline-offset-2">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
