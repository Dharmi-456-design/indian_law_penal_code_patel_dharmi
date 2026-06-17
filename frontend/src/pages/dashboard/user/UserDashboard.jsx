import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
  const [searchQuery, setSearchQuery] = useState('');

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

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
    <div className="relative min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-[#e2e8f0] font-sans selection:bg-[#c9a84c]/30 pb-20 transition-colors duration-500">
      
      {/* ── PREMIUM SUBTLE BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-[#c9a84c]/[0.05] dark:bg-[#c9a84c]/[0.03] blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-[#7c4dff]/[0.05] dark:bg-[#7c4dff]/[0.03] blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 space-y-10 pt-12">

        {/* ── HEADER ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-200 dark:border-white/10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium text-[#c9a84c] tracking-widest uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse"></span>
              Secure Legal Environment
            </div>
            <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900 dark:text-white">
              Welcome, <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#f0d074]">{user?.name ? user.name : 'Counselor'}</span>
            </h1>
            <p className="text-gray-500 dark:text-[#94a3b8] text-lg font-light max-w-2xl">
              Your comprehensive suite for deep statutory research, annotations, and litigation preparation.
            </p>
            
            <form onSubmit={handleGlobalSearch} className="relative max-w-lg pt-2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none pt-2">
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[22px]">search</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search statutes, acts, or sections..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/30 outline-none transition-all shadow-sm text-base"
              />
              <button type="submit" className="absolute top-3.5 right-1.5 px-5 py-2 bg-[#c9a84c] hover:bg-[#b0903a] text-black font-semibold rounded-lg transition-colors flex items-center shadow-md text-sm">
                Search
              </button>
            </form>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block mr-4">
              <p className="text-sm font-medium text-gray-800 dark:text-[#e2e8f0]">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <p className="text-xs text-gray-500 dark:text-[#64748b]">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            {/* Dark mode badge - always dark */}
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1d2021] border border-white/10 cursor-default"
              title="Dark mode active"
            >
              <span className="material-symbols-outlined text-[#c9a84c]" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>dark_mode</span>
            </div>
          </div>
        </header>

        {/* ── KEY METRICS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Statutes', value: acts.length, suffix: 'Codes', icon: 'gavel', color: 'from-[#c9a84c] to-[#e6c364]', shadow: 'shadow-[#c9a84c]/20' },
            { label: 'Indexed Sections', value: '2,201', suffix: 'Total', icon: 'account_balance', color: 'from-[#7c4dff] to-[#a88aff]', shadow: 'shadow-[#7c4dff]/20' },
            { label: 'Saved Bookmarks', value: bookmarks.length, suffix: 'Items', icon: 'bookmark_added', color: 'from-[#38bdf8] to-[#7dd3fc]', shadow: 'shadow-[#38bdf8]/20' },
            { label: 'Case Notes', value: notes.length, suffix: 'Active', icon: 'edit_document', color: 'from-[#10b981] to-[#34d399]', shadow: 'shadow-[#10b981]/20' }
          ].map((metric, i) => (
            <div key={i} className={`group relative overflow-hidden bg-white/80 dark:bg-[#111116]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-xl ${metric.shadow} dark:hover:shadow-2xl dark:hover:shadow-black/50`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300 text-gray-900 dark:text-white">
                <span className="material-symbols-outlined text-6xl">{metric.icon}</span>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${metric.color} bg-opacity-10 text-white shadow-lg`}>
                    <span className="material-symbols-outlined text-[20px]">{metric.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-[#94a3b8] uppercase tracking-wider">{metric.label}</span>
                </div>
                <div>
                  <h3 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-baseline gap-2">
                    <AnimatedCounter value={metric.value} />
                    <span className="text-base font-medium text-gray-500 dark:text-[#64748b]">{metric.suffix}</span>
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── EXPLORE CODES ── */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c9a84c]">library_books</span>
              Primary Legal Codes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {acts.map((act) => (
              <div
                key={act.actCode}
                onClick={() => navigate(`/dashboard/browse?actCode=${act.actCode}`)}
                className={`group cursor-pointer relative flex flex-col justify-between bg-white/80 dark:bg-[#111116]/80 backdrop-blur-xl border rounded-2xl p-6 min-h-[200px] transition-all duration-300 ${
                  act.isStarred 
                    ? 'border-[#c9a84c]/40 hover:border-[#c9a84c] shadow-[0_0_15px_rgba(201,168,76,0.1)] hover:shadow-[0_0_25px_rgba(201,168,76,0.2)]' 
                    : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-[#c9a84c] transition-colors">{act.actCode}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded text-gray-600 dark:text-[#94a3b8] group-hover:bg-[#c9a84c]/10 group-hover:text-[#c9a84c] group-hover:border-[#c9a84c]/20 transition-colors">
                      {act.actYear}
                    </span>
                  </div>
                  <h3 className="text-gray-800 dark:text-[#e2e8f0] font-medium leading-snug">{act.actName}</h3>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-[#64748b] font-medium">{act.totalSections} Sections</span>
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#c9a84c] group-hover:text-black transition-all duration-300">
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform text-gray-500 dark:text-gray-400 group-hover:text-black">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SPOTLIGHT & ANNOTATIONS GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          
          {/* Spotlight Column */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/80 dark:bg-[#111116]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 lg:p-10 flex-1 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c9a84c] to-transparent opacity-50" />
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#c9a84c]/10 dark:bg-[#c9a84c]/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#c9a84c]">auto_awesome</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-widest uppercase">Statutory Spotlight</h2>
                </div>
                <button
                  onClick={rollSpotlight}
                  className="text-xs font-semibold px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full text-gray-600 dark:text-[#94a3b8] hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[14px]">sync</span>
                  Roll
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex flex-wrap gap-3">
                  <span className="text-xs font-bold px-3 py-1.5 bg-[#c9a84c] text-white dark:text-black rounded uppercase tracking-wider shadow-[0_0_15px_rgba(201,168,76,0.3)]">
                    {spotlight.actCode} § {spotlight.sectionNumber}
                  </span>
                  <span className="text-xs font-medium px-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-[#94a3b8] rounded">
                    {spotlight.citation}
                  </span>
                </div>
                <h3 className="text-3xl font-semibold text-gray-900 dark:text-white leading-tight">
                  {spotlight.sectionTitle}
                </h3>
                <div className="relative pl-6 border-l-2 border-[#c9a84c]/50 dark:border-[#c9a84c]/30">
                  <p className="text-lg text-gray-600 dark:text-[#cbd5e1] leading-relaxed font-light">
                    {spotlight.sectionDesc}
                  </p>
                </div>
                <div className="pt-8">
                  <button
                    onClick={() => setNewNoteRef(`${spotlight.actCode} Section ${spotlight.sectionNumber}`)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-[#c9a84c] dark:hover:bg-[#c9a84c] transition-colors duration-300 shadow-xl"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Draft Note for Section
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Note Column */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white/80 dark:bg-[#111116]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 lg:p-10 flex-1 relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#7c4dff]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#7c4dff]">add_notes</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-widest uppercase">Quick Annotation</h2>
              </div>

              <form onSubmit={handleAddNote} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-[#94a3b8] uppercase tracking-wider">Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. IPC Section 302"
                    value={newNoteRef}
                    onChange={(e) => setNewNoteRef(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-[#94a3b8] uppercase tracking-wider">Remarks / Case Facts</label>
                  <textarea
                    placeholder="Enter your confidential notes..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 outline-none transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#7c4dff] hover:bg-[#6538e6] text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(124,77,255,0.2)] hover:shadow-[0_0_30px_rgba(124,77,255,0.4)]"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  Save to Vault
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ── LISTS: BOOKMARKS & NOTES ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          
          {/* Bookmarks List */}
          <div className="bg-white/80 dark:bg-[#111116]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-white/5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-widest uppercase flex items-center gap-3">
                <span className="material-symbols-outlined text-[#38bdf8]">bookmark</span>
                Saved Bookmarks
              </h2>
              <Link to="/dashboard/bookmarks" className="text-xs font-bold text-[#38bdf8] hover:text-sky-600 dark:hover:text-white uppercase tracking-wider transition-colors">View All</Link>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {bookmarks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-white/20">
                  <span className="material-symbols-outlined text-5xl mb-3">bookmark_border</span>
                  <p className="text-sm font-medium">No bookmarks saved yet.</p>
                </div>
              ) : (
                bookmarks.map((b) => (
                  <div key={b._id} className="group relative p-5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-2xl hover:border-[#38bdf8]/50 dark:hover:border-[#38bdf8]/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#38bdf8]/10 text-[#0284c7] dark:text-[#38bdf8] rounded uppercase tracking-wider border border-[#38bdf8]/20">
                          {b.actCode} § {b.sectionNumber}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{b.sectionTitle}</span>
                      </div>
                      <button
                        onClick={() => setBookmarks(prev => prev.filter(item => item._id !== b._id))}
                        className="text-gray-400 dark:text-white/20 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-[#94a3b8] font-light italic border-l-2 border-gray-300 dark:border-white/10 pl-3 mt-3">&ldquo;{b.note || 'No description provided.'}&rdquo;</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notes List */}
          <div className="bg-white/80 dark:bg-[#111116]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-white/5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-widest uppercase flex items-center gap-3">
                <span className="material-symbols-outlined text-[#10b981]">description</span>
                Recent Notes
              </h2>
              <Link to="/dashboard/notes" className="text-xs font-bold text-[#10b981] hover:text-emerald-700 dark:hover:text-white uppercase tracking-wider transition-colors">View All</Link>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {notes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-white/20">
                  <span className="material-symbols-outlined text-5xl mb-3">speaker_notes_off</span>
                  <p className="text-sm font-medium">No active notes.</p>
                </div>
              ) : (
                notes.map((n) => (
                  <div key={n._id} className="group relative p-5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-2xl hover:border-[#10b981]/50 dark:hover:border-[#10b981]/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#10b981]/10 text-[#047857] dark:text-[#10b981] rounded uppercase tracking-wider border border-[#10b981]/20">
                        {n.sectionRef}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 dark:text-[#64748b]">{n.date}</span>
                        <button
                          onClick={() => handleDeleteNote(n._id)}
                          className="text-gray-400 dark:text-white/20 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-[#cbd5e1] font-light leading-relaxed whitespace-pre-wrap">{n.noteText}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Custom Scrollbar Styles appended directly or assumed in CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.3); border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150,150,150,0.5); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
