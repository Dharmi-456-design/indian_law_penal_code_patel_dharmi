import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../store/slices/authSlice';
import api from '../../../services/api';

/* ─── Toggle Switch ─────────────────────────────────────────────────── */
const Toggle = ({ checked, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${checked ? 'bg-[#7c4dff]' : 'bg-[#2d3748]'}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

/* ─── Input Field ────────────────────────────────────────────────────── */
const Field = ({ label, id, type = 'text', value, onChange, readOnly = false, placeholder = '' }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-medium text-[#94a3b8] tracking-wide">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
        readOnly
          ? 'bg-[#0d1117] border-[#1e2733] text-[#475569] cursor-not-allowed'
          : 'bg-[#0d1117] border-[#1e2733] text-white placeholder-[#334155] focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20'
      }`}
    />
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loadingUser, setLoadingUser] = useState(!user);

  /* Auto-fetch user from /auth/me if not in Redux (e.g. after page refresh) */
  useEffect(() => {
    if (!user) {
      setLoadingUser(true);
      api.get('/auth/me')
        .then((res) => {
          if (res.data?.data) dispatch(setUser(res.data.data));
        })
        .catch(() => {})
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, [user, dispatch]);

  /* Profile form */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [barCouncil, setBarCouncil] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');

  /* Avatar upload */
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  /* Security form */
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  /* Preferences */
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefAlerts, setPrefAlerts] = useState(true);
  const [prefMarketing, setPrefMarketing] = useState(false);

  /* Stats */
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);

  /* Sync user data */
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setBarCouncil(user.barCouncil || '');
    }
  }, [user]);

  /* Load stats */
  useEffect(() => {
    api.get('/bookmarks').then(r => setBookmarkCount(r.data?.data?.length || 0)).catch(() => {});
    api.get('/notes').then(r => setNoteCount(r.data?.data?.length || 0)).catch(() => {});
  }, []);

  /* Save profile */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) { setSaveErr('First name is required.'); return; }
    setSaving(true); setSaveErr(''); setSaveMsg('');
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await api.put('/auth/profile', { name: fullName, barCouncil });
      if (res.data?.data) dispatch(setUser(res.data.data));
      setSaveMsg('Profile updated successfully.');
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      setSaveErr(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  /* Change password */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwErr(''); setPwMsg('');
    if (!currentPw || !newPw || !confirmPw) { setPwErr('All fields are required.'); return; }
    if (newPw.length < 6) { setPwErr('New password must be at least 6 characters.'); return; }
    if (newPw !== confirmPw) { setPwErr('Passwords do not match.'); return; }
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: currentPw, newPassword: newPw });
      setPwMsg('Password updated successfully.');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwMsg(''), 4000);
    } catch (err) {
      setPwErr(err.response?.data?.message || 'Incorrect current password.');
    } finally {
      setPwLoading(false);
    }
  };

  /* Avatar initials fallback */
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  /* Subscription active until */
  const activeUntil = 'Dec 31, 2026';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0d0f] text-white">

      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[#c9a84c]/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7c4dff]/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 py-8">

        {/* ── Page Title ── */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Profile Settings</h1>
          <p className="text-[#64748b] text-sm mt-1.5">Manage your account details and preferences.</p>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Personal Information Card */}
            <div className="animate-fade-in-up delay-100 bg-[#111417] border border-white/[0.07] rounded-2xl overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center border border-[#c9a84c]/20">
                  <span className="material-symbols-outlined text-[#c9a84c] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
                </div>
                <h2 className="font-semibold text-white text-base">Personal Information</h2>
              </div>

              <form onSubmit={handleSaveProfile} className="px-6 py-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#1e2733] group-hover:border-[#c9a84c]/40 transition-colors shadow-xl">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#c9a84c] to-[#7c4dff] flex items-center justify-center text-black text-2xl font-bold select-none">
                            {initials}
                          </div>
                        )}
                      </div>
                      {/* Overlay */}
                      <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
                      </div>
                      {/* Online dot */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#22c55e] rounded-full border-2 border-[#111417]" />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setAvatarPreview(ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-[#64748b] hover:text-[#c9a84c] transition-colors font-medium"
                    >
                      Change Photo
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="First Name"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Arjun"
                      />
                      <Field
                        label="Last Name"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Mehta"
                      />
                    </div>
                    <Field
                      label="Email Address"
                      id="email"
                      type="email"
                      value={email}
                      readOnly
                      placeholder="your@email.com"
                    />
                    <Field
                      label="Bar Council Number (Optional)"
                      id="barCouncil"
                      value={barCouncil}
                      onChange={(e) => setBarCouncil(e.target.value)}
                      placeholder="DEL/1234/2015"
                    />
                  </div>
                </div>

                {/* Alerts */}
                {saveErr && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl text-[#ef4444] text-sm">
                    <span className="material-symbols-outlined text-[17px]">error</span>{saveErr}
                  </div>
                )}
                {saveMsg && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl text-[#22c55e] text-sm">
                    <span className="material-symbols-outlined text-[17px]">check_circle</span>{saveMsg}
                  </div>
                )}

                {/* Save button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#7c4dff] hover:bg-[#6c3fe8] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-[#7c4dff]/25"
                  >
                    {saving ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">save</span>
                    )}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Card */}
            <div className="animate-fade-in-up delay-200 bg-[#111417] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#ef4444]/10 flex items-center justify-center border border-[#ef4444]/20">
                  <span className="material-symbols-outlined text-[#ef4444] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <h2 className="font-semibold text-white text-base">Security</h2>
              </div>

              <form onSubmit={handleChangePassword} className="px-6 py-6 space-y-4 max-w-md">
                <Field
                  label="Current Password"
                  id="currentPw"
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Enter current password"
                />
                <Field
                  label="New Password"
                  id="newPw"
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Min. 6 characters"
                />
                <Field
                  label="Confirm New Password"
                  id="confirmPw"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat new password"
                />

                {pwErr && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl text-[#ef4444] text-sm">
                    <span className="material-symbols-outlined text-[17px]">error</span>{pwErr}
                  </div>
                )}
                {pwMsg && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl text-[#22c55e] text-sm">
                    <span className="material-symbols-outlined text-[17px]">check_circle</span>{pwMsg}
                  </div>
                )}

                <div className="pt-2 flex justify-center">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-transparent hover:bg-[#c9a84c]/10 border border-[#c9a84c] text-[#c9a84c] font-semibold text-sm rounded-xl transition-all active:scale-95"
                  >
                    {pwLoading ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    )}
                    {pwLoading ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">

            {/* Subscription Card */}
            <div className="animate-fade-in-up delay-150 bg-[#111417] border border-white/[0.07] rounded-2xl overflow-hidden relative">
              {/* Top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />
              {/* Decorative bg orb */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#c9a84c]/[0.06] blur-[40px] rounded-full pointer-events-none" />

              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] relative z-10">
                <div className="w-7 h-7 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#c9a84c] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </div>
                <h3 className="font-semibold text-white text-sm">Subscription</h3>
              </div>

              <div className="px-5 py-5 relative z-10">
                <p className="text-3xl font-bold text-[#c9a84c] leading-tight mb-0.5">Professional</p>
                <p className="text-2xl font-bold text-[#c9a84c] leading-tight mb-3">Suite</p>
                <p className="text-xs text-[#64748b] font-mono mb-5">Active until {activeUntil}</p>

                <div className="space-y-2.5 mb-6">
                  {[
                    'Unlimited Act Searches',
                    'Advanced Analytics',
                    'Priority Support',
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border border-[#c9a84c]/40 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[#c9a84c] text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                      <span className="text-sm text-[#94a3b8]">{feat}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-2.5 bg-[#c9a84c] hover:bg-[#b8963e] text-black font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-[#c9a84c]/20">
                  Manage Billing
                </button>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="animate-fade-in-up delay-250 bg-[#111417] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <div className="w-7 h-7 rounded-lg bg-[#7c4dff]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#7c4dff] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
                </div>
                <h3 className="font-semibold text-white text-sm">Preferences</h3>
              </div>

              <div className="px-5 py-5 space-y-5">
                {[
                  {
                    id: 'pref-email',
                    label: 'Email Updates',
                    desc: 'Receive daily case summaries',
                    value: prefEmail,
                    setter: setPrefEmail,
                  },
                  {
                    id: 'pref-alerts',
                    label: 'New Act Alerts',
                    desc: 'Notify when bookmarked acts change',
                    value: prefAlerts,
                    setter: setPrefAlerts,
                  },
                  {
                    id: 'pref-marketing',
                    label: 'Marketing',
                    desc: 'Promotional offers and news',
                    value: prefMarketing,
                    setter: setPrefMarketing,
                  },
                ].map(({ id, label, desc, value, setter }) => (
                  <div key={id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white leading-tight">{label}</p>
                      <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                    <Toggle id={id} checked={value} onChange={setter} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="animate-fade-in-up delay-300 bg-[#111417] border border-white/[0.07] rounded-2xl px-5 py-5">
              <h3 className="text-xs text-[#64748b] font-medium uppercase tracking-wider mb-4">Your Activity</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Bookmarks', value: bookmarkCount, icon: 'bookmark_added', color: '#c9a84c' },
                  { label: 'Notes', value: noteCount, icon: 'edit_document', color: '#7c4dff' },
                  { label: 'Role', value: user?.role === 'admin' ? 'Admin' : 'Pro', icon: 'shield_person', color: '#22c55e' },
                  { label: 'Status', value: 'Active', icon: 'radio_button_checked', color: '#38bdf8' },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} className="bg-[#0d1117] border border-white/[0.05] rounded-xl p-3">
                    <span className="material-symbols-outlined text-[16px] mb-1.5 block" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    <p className="text-base font-bold text-white">{value}</p>
                    <p className="text-[10px] text-[#475569] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
