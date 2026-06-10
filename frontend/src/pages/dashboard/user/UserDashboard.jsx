import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toggleTheme } from '../../../store/slices/uiSlice';
import { setUser } from '../../../store/slices/authSlice';
import api from '../../../services/api';

const FALLBACK_ACTS = [
  { actCode: 'IPC', actName: 'Indian Penal Code', actYear: 1860, totalSections: 575, description: 'Primary substantive penal code defining offences and punishments.', isStarred: true },
  { actCode: 'CrPC', actName: 'Code of Criminal Procedure', actYear: 1973, totalSections: 525, description: 'Procedural laws for the administration of criminal justice.', isStarred: true },
  { actCode: 'CPC', actName: 'Civil Procedure Code', actYear: 1908, totalSections: 158, description: 'Procedural rules for civil courts and dispute resolution.', isStarred: true },
  { actCode: 'HMA', actName: 'Hindu Marriage Act', actYear: 1955, totalSections: 283, description: 'Governs marriage, ceremonies, and matrimonial rights for Hindus.' },
  { actCode: 'IDA', actName: 'Indian Divorce Act', actYear: 1869, totalSections: 64, description: 'Governs dissolution of marriage and divorce causes for Christians.' },
  { actCode: 'IEA', actName: 'Indian Evidence Act', actYear: 1872, totalSections: 184, description: 'Defines rules for admissibility and relevancy of evidence.' },
  { actCode: 'NIA', actName: 'Negotiable Instruments Act', actYear: 1881, totalSections: 156, description: 'Laws on bills, notes, and cheques, including cheque bounce.' },
  { actCode: 'MVA', actName: 'Motor Vehicles Act', actYear: 1988, totalSections: 256, description: 'Regulates licensing, traffic guidelines, and vehicle insurance.' }
];

const RANDOM_SECTIONS = [
  {
    actCode: 'IPC',
    sectionNumber: '302',
    sectionTitle: 'Punishment for murder',
    sectionDesc: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine. This is the cornerstone of criminal prosecution for homicide offences in India.',
    citation: 'IPC Sec. 302 (1860)'
  },
  {
    actCode: 'NIA',
    sectionNumber: '138',
    sectionTitle: 'Dishonour of cheque for insufficiency of funds',
    sectionDesc: 'Imposes criminal liability on the drawer of a cheque that bounces due to insufficient funds. Punishable with imprisonment up to 2 years, or a fine up to twice the cheque amount, or both.',
    citation: 'NIA Sec. 138 (1881)'
  },
  {
    actCode: 'CrPC',
    sectionNumber: '125',
    sectionTitle: 'Order for maintenance of wives, children and parents',
    sectionDesc: 'Provides a swift and summary remedy to wives, children, and parents seeking maintenance to prevent vagrancy and destitution. Essential for family welfare and social justice.',
    citation: 'CrPC Sec. 125 (1973)'
  },
  {
    actCode: 'IPC',
    sectionNumber: '378',
    sectionTitle: 'Theft',
    sectionDesc: "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
    citation: 'IPC Sec. 378 (1860)'
  },
  {
    actCode: 'IEA',
    sectionNumber: '27',
    sectionTitle: 'How much of information received from accused may be proved',
    sectionDesc: 'When any fact is deposed to as discovered in consequence of information received from a person accused of any offence, in the custody of a police-officer, so much of such information as relates distinctly to the fact thereby discovered, may be proved.',
    citation: 'IEA Sec. 27 (1872)'
  },
  {
    actCode: 'HMA',
    sectionNumber: '13',
    sectionTitle: 'Divorce',
    sectionDesc: 'Provides the legal grounds upon which a marriage solemnized under the Act may be dissolved by a decree of divorce, such as adultery, cruelty, desertion, conversion, or mental disorder.',
    citation: 'HMA Sec. 13 (1955)'
  }
];

const DEFAULT_BOOKMARKS = [
  { _id: 'b1', actCode: 'IPC', sectionNumber: '302', sectionTitle: 'Punishment for murder', note: 'Primary reference for homicide briefs.' },
  { _id: 'b2', actCode: 'NIA', sectionNumber: '138', sectionTitle: 'Dishonour of cheque', note: 'Standard guideline for cheque bounce defense.' },
  { _id: 'b3', actCode: 'CrPC', sectionNumber: '438', sectionTitle: 'Direction for grant of bail to person apprehending arrest', note: 'Anticipatory bail petition guidelines.' }
];

const DEFAULT_NOTES = [
  { _id: 'n1', sectionRef: 'IPC Section 302', noteText: 'Supreme Court guidelines on Rarest of Rare cases: examine mitigating circumstances first.', date: 'Jun 7, 2026' },
  { _id: 'n2', sectionRef: 'NIA Section 138', noteText: 'Check notice dispatch dates - strict 30-day window from receipt of memo is mandatory.', date: 'Jun 6, 2026' }
];

/* ─── Animated Metric Counter Component ─────────────────────────────── */
const AnimatedCounter = ({ value, duration = 1200 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const match = String(value).match(/\d+/g);
    if (!match) { setCount(value); return; }
    const target = parseInt(match.join(''), 10);
    if (target === 0) { setCount(value); return; }

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * target);

      if (String(value).includes(',')) {
        setCount(current.toLocaleString('en-IN') + String(value).replace(/[\d,]/g, ''));
      } else {
        setCount(current + String(value).replace(/\d/g, ''));
      }

      if (progress < 1) window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className="animate-counter-up">{count}</span>;
};

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  const [acts, setActs] = useState(FALLBACK_ACTS);
  const [bookmarks, setBookmarks] = useState(DEFAULT_BOOKMARKS);
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [spotlight, setSpotlight] = useState(RANDOM_SECTIONS[0]);
  const [newNoteRef, setNewNoteRef] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  // Fetch current user on refresh
  useEffect(() => {
    const token = localStorage.getItem('lex_token');
    if (token && !user) {
      api.get('/auth/me')
        .then((res) => { if (res.data?.data) dispatch(setUser(res.data.data)); })
        .catch((err) => console.error('Failed to load user profile:', err));
    }
  }, [user, dispatch]);

  // Load dashboard data
  useEffect(() => {
    api.get('/acts')
      .then((res) => {
        if (res.data?.data?.length > 0) {
          setActs(res.data.data.map(a => ({ ...a, isStarred: ['IPC', 'CrPC', 'CPC'].includes(a.actCode) })));
        }
      })
      .catch(() => { });

    api.get('/bookmarks')
      .then((res) => { if (res.data?.data) setBookmarks(res.data.data); })
      .catch(() => { });

    api.get('/notes')
      .then((res) => {
        if (res.data?.data) {
          setNotes(res.data.data.map(n => ({
            _id: n._id,
            sectionRef: n.sectionId?.sectionNumber
              ? `${n.sectionId.actCode} Section ${n.sectionId.sectionNumber}`
              : n.sectionRef || 'Legal Note',
            noteText: n.noteText,
            date: new Date(n.updatedAt || n.createdAt || Date.now())
              .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          })));
        }
      })
      .catch(() => { });
  }, []);

  // Initial random spotlight
  useEffect(() => { rollSpotlight(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const rollSpotlight = () => {
    setSpotlight(prev => {
      const currentIndex = RANDOM_SECTIONS.indexOf(prev);
      let nextIndex = Math.floor(Math.random() * RANDOM_SECTIONS.length);
      if (nextIndex === currentIndex) nextIndex = (nextIndex + 1) % RANDOM_SECTIONS.length;
      return RANDOM_SECTIONS[nextIndex];
    });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteRef.trim() || !newNoteText.trim()) return;

    api.post('/notes', { sectionRef: newNoteRef, noteText: newNoteText })
      .then((res) => {
        const created = res.data?.data;
        if (created) {
          setNotes(prev => [{ _id: created._id, sectionRef: newNoteRef, noteText: created.noteText, date: 'Just now' }, ...prev]);
        }
      })
      .catch(() => {
        setNotes(prev => [{
          _id: `note-${Date.now()}`,
          sectionRef: newNoteRef,
          noteText: newNoteText,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }, ...prev]);
      })
      .finally(() => { setNewNoteRef(''); setNewNoteText(''); });
  };

  const handleDeleteNote = (noteId) => {
    api.delete(`/notes/${noteId}`)
      .catch(() => { })
      .finally(() => setNotes(prev => prev.filter(n => n._id !== noteId)));
  };

  const actDelays = ['delay-200', 'delay-250', 'delay-300', 'delay-350', 'delay-400', 'delay-450', 'delay-500', 'delay-600'];

  return (
    <div className="relative min-h-screen space-y-12 pb-20 font-sans selection:bg-[#c9a84c]/30">

      {/* ── PREMIUM BACKGROUND EFFECTS ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-screen opacity-20 dark:opacity-30 animate-orb"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full mix-blend-screen opacity-20 dark:opacity-20 animate-orb delay-300"
          style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full mix-blend-screen opacity-15 dark:opacity-20 animate-orb delay-700"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f8f9fa]/50 to-[#f3f4f6] dark:from-transparent dark:via-[#0c0f10]/80 dark:to-[#050505] -z-10" />
      </div>

      <div className="relative z-10 space-y-12">

        {/* ── TOP HEADER / GREETING ROW ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 dark:bg-[#130f1c]/80 backdrop-blur-2xl p-10 rounded-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 animate-fade-in-down overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#c9a84c]/5 to-transparent dark:from-[#7c4dff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Welcome Back, <span className="gradient-text-gold">{user?.name ? `Advocate ${user.name}` : 'Counselor'}</span>
              </h1>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span>Verified Legal Hub</span>
              </div>
            </div>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
              The modern suite for deep legal research and efficient data management. Trusted by professionals.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-semibold mt-2">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Theme Toggle Button */}
          <div className="relative z-10 shrink-0">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="group/btn flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#1a1528]/50 backdrop-blur-xl text-sm font-semibold shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-[#251b45] transition-all duration-300 text-gray-800 dark:text-white"
            >
              <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364] group-hover/btn:rotate-12 transition-transform duration-300" style={{ fontSize: '22px' }}>
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
              <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </div>

        {/* ── KEY METRICS / STATS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-8">
          {[
            { label: 'Covered Statutes', value: acts.length, suffix: 'Acts', desc: 'Standardized codes of India', icon: 'gavel', color: 'text-[#c9a84c]', bg: 'bg-[#c9a84c]', glow: 'shadow-[#c9a84c]/20' },
            { label: 'Unified Library', value: '2,201', suffix: 'Sections', desc: 'Full text indices loaded', icon: 'menu_book', color: 'text-purple-500', bg: 'bg-purple-500', glow: 'shadow-purple-500/20' },
            { label: 'Saved Bookmarks', value: bookmarks.length, suffix: 'Bookmarks', desc: 'Saved for active litigation', icon: 'bookmark', color: 'text-amber-500', bg: 'bg-amber-500', glow: 'shadow-amber-500/20' },
            { label: 'Case Annotations', value: notes.length, suffix: 'Active Notes', desc: 'Personal statutory remarks', icon: 'edit_note', color: 'text-blue-500', bg: 'bg-blue-500', glow: 'shadow-blue-500/20' }
          ].map((metric, i) => (
            <div key={i} className={`bg-white/60 dark:bg-[#16121f]/60 backdrop-blur-xl p-10 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-sm relative overflow-hidden transition-all duration-500 animate-slide-card delay-${(i + 1) * 100} card-hover group/metric`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${metric.bg} opacity-[0.03] dark:opacity-[0.05] rounded-bl-full pointer-events-none group-hover/metric:scale-110 transition-transform duration-500`} />
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{metric.label}</span>
                <div className={`w-14 h-14 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-lg ${metric.glow} group-hover/metric:-translate-y-1 transition-transform duration-300`}>
                  <span className={`material-symbols-outlined ${metric.color}`} style={{ fontSize: '28px' }}>{metric.icon}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  <AnimatedCounter value={metric.value} /> <span className="text-xl font-semibold text-gray-400">{metric.suffix}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{metric.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── ACT SELECTOR SECTION ── */}
        <div className="space-y-8 animate-fade-in-up delay-150 pt-8 mt-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c9a84c] text-3xl">local_library</span>
              Browse Legal Codes
            </h2>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-full">Select to explore</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {acts.map((act, idx) => {
              const delayClass = actDelays[idx % actDelays.length];
              return (
                <div
                  key={act.actCode}
                  onClick={() => navigate(`/dashboard/browse?actCode=${act.actCode}`)}
                  className={`group/act cursor-pointer relative bg-white/60 dark:bg-[#16121f]/60 backdrop-blur-xl p-8 rounded-2xl border shadow-sm flex flex-col justify-between overflow-hidden animate-fade-in-up card-hover ${delayClass} ${act.isStarred
                      ? 'border-[#c9a84c]/50 dark:border-[#c9a84c]/30 animate-border-pulse'
                      : 'border-gray-200/50 dark:border-white/10 hover:border-[#c9a84c]/50 dark:hover:border-[#7c4dff]/50'
                    }`}
                  style={{ minHeight: '220px' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover/act:opacity-100 transition-opacity duration-500"></div>
                  {act.isStarred && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#c9a84c] to-[#f0d074]" />
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className="text-sm font-semibold px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg tracking-widest shadow-md">
                        {act.actCode}
                      </span>
                      <span className="text-sm font-semibold text-gray-500 dark:text-[#e6c364] bg-gray-100 dark:bg-[#c9a84c]/10 px-3 py-1.5 rounded-md">
                        {act.actYear}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover/act:text-[#c9a84c] dark:group-hover/act:text-[#cdbdff] transition-colors leading-tight mb-3">
                      {act.actName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                      {act.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 pt-5 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-md">
                      {act.totalSections} sections
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover/act:bg-[#c9a84c] group-hover/act:text-white dark:group-hover/act:bg-[#7c4dff] transition-all duration-300 transform group-hover/act:translate-x-1">
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SPOTLIGHT & NOTES SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in-up delay-300 pt-8 mt-8">

          <div className="lg:col-span-8 bg-white/60 dark:bg-[#16121f]/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-lg relative overflow-hidden transition-all duration-500 flex flex-col justify-between group/spotlight">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 dark:bg-[#7c4dff]/10 rounded-full blur-3xl pointer-events-none group-hover/spotlight:bg-purple-500/20 transition-colors duration-700" />

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364] animate-pulse text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white uppercase tracking-widest">Statutory Spotlight</span>
                </div>
                <button
                  onClick={rollSpotlight}
                  className="group/roll flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 text-sm font-semibold transition-all text-gray-900 dark:text-white shadow-sm hover:shadow"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover/roll:rotate-180 transition-transform duration-500">autorenew</span>
                  <span>Roll Another</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md uppercase tracking-wider">
                    {spotlight.actCode} Sec {spotlight.sectionNumber}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/5">{spotlight.citation}</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white leading-tight tracking-tight">
                  {spotlight.sectionTitle}
                </h3>
                <div className="relative mt-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#c9a84c] to-purple-500 rounded-full"></div>
                  <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent pl-8 pr-6 py-6 rounded-r-2xl">
                    {spotlight.sectionDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10 pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between gap-6">
              <span className="text-base font-semibold text-[#c9a84c] flex items-center gap-3 bg-[#c9a84c]/10 px-4 py-2 rounded-lg">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                Decoded Legal Text
              </span>
              <button
                onClick={() => setNewNoteRef(`${spotlight.actCode} Section ${spotlight.sectionNumber}`)}
                className="text-base font-semibold px-8 py-4 rounded-xl bg-gray-900 dark:bg-[#7c4dff] text-white hover:bg-gray-800 dark:hover:bg-[#6538e6] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                Annotate Section
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/60 dark:bg-[#16121f]/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-lg transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-6 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>edit_document</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white uppercase tracking-widest">Quick Annotations</span>
              </div>

              <form onSubmit={handleAddNote} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Section Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. IPC Section 302"
                    value={newNoteRef}
                    onChange={(e) => setNewNoteRef(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Personal Remarks</label>
                  <textarea
                    placeholder="Annotate facts, case files, or deadlines..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    rows="4"
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 mt-4"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  Save Annotation
                </button>
              </form>
            </div>

            <div className="mt-8 p-5 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex items-start gap-4">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 mt-1">lock</span>
              <p className="text-sm text-green-800 dark:text-green-300 font-semibold leading-relaxed">
                Annotations are secured with end-to-end encryption under client-attorney privilege.
              </p>
            </div>
          </div>
        </div>

        {/* ── NOTES & BOOKMARKS VISUAL LISTS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in-up delay-350 pt-8 mt-8">

          <div className="bg-white/60 dark:bg-[#16121f]/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-lg transition-all duration-500">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white uppercase tracking-widest">Saved Bookmarks</h3>
              </div>
              <Link to="/dashboard/bookmarks" className="text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 bg-amber-50 dark:bg-amber-500/10 px-4 py-2 rounded-lg transition-colors">View All</Link>
            </div>

            <div className="space-y-6">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  className="group/bm p-6 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/5 flex items-start justify-between gap-5 transition-all hover:shadow-md hover:border-amber-500/30 dark:hover:border-amber-500/30"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-md uppercase tracking-wider">
                        {bookmark.actCode} Sec {bookmark.sectionNumber}
                      </span>
                      <span className="text-base font-semibold text-gray-900 dark:text-white">{bookmark.sectionTitle}</span>
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2 italic font-medium bg-gray-50 dark:bg-white/5 px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5">
                      &ldquo;{bookmark.note || 'No notes added.'}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={() => setBookmarks(prev => prev.filter(b => b._id !== bookmark._id))}
                    className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover/bm:opacity-100 transition-all hover:bg-red-500 hover:text-white shrink-0"
                    aria-label="Remove bookmark"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete_outline</span>
                  </button>
                </div>
              ))}
              {bookmarks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3">bookmark_border</span>
                  <p className="text-base font-semibold text-gray-500 dark:text-gray-400">No saved bookmarks yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/60 dark:bg-[#16121f]/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-lg transition-all duration-500">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white uppercase tracking-widest">Recent Annotations</h3>
              </div>
              <Link to="/dashboard/notes" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-lg transition-colors">View All</Link>
            </div>

            <div className="space-y-6">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="group/note p-6 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/5 flex items-start justify-between gap-5 transition-all hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold px-3 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-md uppercase tracking-wider">
                        {note.sectionRef}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-black/30 px-3 py-1.5 rounded-md">{note.date}</span>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {note.noteText}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover/note:opacity-100 transition-all hover:bg-red-500 hover:text-white shrink-0 mt-1"
                    aria-label="Delete annotation"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete_outline</span>
                  </button>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3">speaker_notes_off</span>
                  <p className="text-base font-semibold text-gray-500 dark:text-gray-400">No annotations recorded yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
