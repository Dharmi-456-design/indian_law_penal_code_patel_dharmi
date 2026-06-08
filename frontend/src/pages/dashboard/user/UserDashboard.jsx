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
    sectionDesc: 'Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.',
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

/* ─── Animated Metric Counter Component ───────────────────────────── */
const AnimatedCounter = ({ value, duration = 1200 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Parse numeric parts (handles string structures like "2,201" or "8+")
    const match = String(value).match(/\d+/g);
    if (!match) {
      setCount(value);
      return;
    }
    const target = parseInt(match.join(''), 10);
    const start = 0;
    const end = target;
    if (start === end) {
      setCount(value);
      return;
    }

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing: easeOutQuad
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * (end - start) + start);
      
      if (String(value).includes(',')) {
        setCount(current.toLocaleString('en-IN') + (String(value).replace(/[\d,]/g, '')));
      } else {
        setCount(current + (String(value).replace(/[\d]/g, '')));
      }

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };

    window.requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className="animate-counter-up">{count}</span>;
};

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  // State variables
  const [acts, setActs] = useState(FALLBACK_ACTS);
  const [bookmarks, setBookmarks] = useState(DEFAULT_BOOKMARKS);
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [spotlight, setSpotlight] = useState(RANDOM_SECTIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [newNoteRef, setNewNoteRef] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [loading, setLoading] = useState({ acts: false, bookmarks: false, notes: false });

  // Fetch current user if token exists but user is null (on refresh)
  useEffect(() => {
    const token = localStorage.getItem('lex_token');
    if (token && !user) {
      api.get('/auth/me')
        .then((res) => {
          if (res.data && res.data.data) {
            dispatch(setUser(res.data.data));
          }
        })
        .catch((err) => console.error('Failed to load user profile:', err));
    }
  }, [user, dispatch]);

  // Load dashboard data from APIs
  useEffect(() => {
    // 1. Acts
    setLoading(prev => ({ ...prev, acts: true }));
    api.get('/acts')
      .then((res) => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          // Merge custom starred field
          const merged = res.data.data.map(a => ({
            ...a,
            isStarred: ['IPC', 'CrPC', 'CPC'].includes(a.actCode)
          }));
          setActs(merged);
        }
      })
      .catch((err) => {
        console.warn('Backend /acts endpoint failed, using local mock data:', err);
      })
      .finally(() => setLoading(prev => ({ ...prev, acts: false })));

    // 2. Bookmarks
    setLoading(prev => ({ ...prev, bookmarks: true }));
    api.get('/bookmarks')
      .then((res) => {
        if (res.data && res.data.data) {
          setBookmarks(res.data.data);
        }
      })
      .catch((err) => {
        console.warn('Backend /bookmarks endpoint failed, using local mock data:', err);
      })
      .finally(() => setLoading(prev => ({ ...prev, bookmarks: false })));

    // 3. Notes
    setLoading(prev => ({ ...prev, notes: true }));
    api.get('/notes')
      .then((res) => {
        if (res.data && res.data.data) {
          // Normalize API notes if they look different
          const normalized = res.data.data.map(n => ({
            _id: n._id,
            sectionRef: n.sectionId?.sectionNumber ? `${n.sectionId.actCode} Section ${n.sectionId.sectionNumber}` : n.sectionRef || 'Legal Note',
            noteText: n.noteText,
            date: new Date(n.updatedAt || n.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }));
          setNotes(normalized);
        }
      })
      .catch((err) => {
        console.warn('Backend /notes endpoint failed, using local mock data:', err);
      })
      .finally(() => setLoading(prev => ({ ...prev, notes: false })));
  }, []);

  // Set initial random spotlight
  useEffect(() => {
    rollSpotlight();
  }, []);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 1) {
      // Perform client-side filter first for responsiveness
      const searchTerms = query.toLowerCase().split(' ');
      const matched = [];

      // Search within fallback/mock acts and sections
      RANDOM_SECTIONS.forEach(sec => {
        const matchesQuery = searchTerms.every(term => 
          sec.sectionNumber.toLowerCase().includes(term) ||
          sec.sectionTitle.toLowerCase().includes(term) ||
          sec.sectionDesc.toLowerCase().includes(term) ||
          sec.actCode.toLowerCase().includes(term)
        );
        if (matchesQuery) matched.push({ ...sec, type: 'section' });
      });

      acts.forEach(act => {
        const matchesQuery = searchTerms.every(term => 
          act.actName.toLowerCase().includes(term) ||
          act.actCode.toLowerCase().includes(term)
        );
        if (matchesQuery) matched.push({ ...act, type: 'act' });
      });

      setSearchResults(matched);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  // Roll a new spotlight section
  const rollSpotlight = () => {
    const currentIndex = RANDOM_SECTIONS.indexOf(spotlight);
    let nextIndex = Math.floor(Math.random() * RANDOM_SECTIONS.length);
    if (nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % RANDOM_SECTIONS.length;
    }
    setSpotlight(RANDOM_SECTIONS[nextIndex]);
  };

  // Add a new note (either backend-linked or client-only fallback)
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteRef.trim() || !newNoteText.trim()) return;

    api.post('/notes', { sectionRef: newNoteRef, noteText: newNoteText })
      .then((res) => {
        const createdNote = res.data?.data;
        if (createdNote) {
          setNotes(prev => [
            {
              _id: createdNote._id,
              sectionRef: newNoteRef,
              noteText: createdNote.noteText,
              date: 'Just now'
            },
            ...prev
          ]);
        }
      })
      .catch((err) => {
        // Fallback to local state update
        console.warn('Failed to save note to backend, updating locally:', err);
        const newNote = {
          _id: `note-${Date.now()}`,
          sectionRef: newNoteRef,
          noteText: newNoteText,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setNotes(prev => [newNote, ...prev]);
      })
      .finally(() => {
        setNewNoteRef('');
        setNewNoteText('');
      });
  };

  // Delete a note
  const handleDeleteNote = (noteId) => {
    api.delete(`/notes/${noteId}`)
      .then(() => {
        setNotes(prev => prev.filter(n => n._id !== noteId));
      })
      .catch((err) => {
        console.warn('Failed to delete note from backend, updating locally:', err);
        setNotes(prev => prev.filter(n => n._id !== noteId));
      });
  };

  const actDelays = ['delay-200', 'delay-250', 'delay-300', 'delay-350', 'delay-400', 'delay-450', 'delay-500', 'delay-600'];

  return (
    <div className="relative min-h-screen space-y-6">
      
      {/* ── BACKGROUND DRIFTING ORBS ── */}
      <div className="absolute top-[10%] left-[-8%] w-[380px] h-[380px] rounded-full pointer-events-none mix-blend-screen opacity-15 dark:opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 75%)', animation: 'orb 20s ease-in-out infinite' }} />
      <div className="absolute top-[40%] right-[-8%] w-[450px] h-[450px] rounded-full pointer-events-none mix-blend-screen opacity-15 dark:opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.1) 0%, transparent 75%)', animation: 'orb 25s ease-in-out infinite', animationDelay: '2s' }} />
      <div className="absolute bottom-[5%] left-[20%] w-[300px] h-[300px] rounded-full pointer-events-none mix-blend-screen opacity-8 dark:opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 75%)', animation: 'orb 18s ease-in-out infinite', animationDelay: '4s' }} />

      <div className="relative z-10 space-y-6">

        {/* ── TOP HEADER / GREETING ROW ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#16121f] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm relative overflow-hidden transition-all duration-300 animate-fade-in-down">
          
          {/* Subtle decorative background gradients for dark mode (Luminous Purple theme) */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.03] dark:opacity-[0.06] bg-[#c9a84c] dark:bg-[#7c4dff] blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div className="relative z-10 space-y-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#111827] dark:text-[#e1e3e4] tracking-tight">
                Welcome Back, <span className="gradient-text-gold">{user?.name ? `Advocate ${user.name}` : 'Counselor'}</span>
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span>Verified Legal Intelligence Hub</span>
              </div>
            </div>
            <p className="text-sm lg:text-base text-[#6b7280] dark:text-[#cac3d8] leading-relaxed">
              The modern suite for deep legal research and efficient data management. Trusted by professionals.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Current Session Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Theme Toggle Button within the Dashboard */}
          <div className="relative z-10 shrink-0">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-full flex items-center justify-center gap-2.5 px-4.5 py-2.5 rounded-lg border border-[#d1d5db] dark:border-white/10 bg-white dark:bg-[#1e1633] text-sm font-semibold transition-all hover:bg-gray-50 dark:hover:bg-[#251b45] shadow-sm text-[#111827] dark:text-white"
            >
              <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]" style={{ fontSize: '20px' }}>
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
              <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </div>

        {/* ── SEARCH BAR WIDGET ── */}
        <div className="relative bg-white dark:bg-[#16121f] p-4.5 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm transition-all duration-300 animate-fade-in-down delay-75">
          <div className="flex items-center w-full bg-[#f9fafb] dark:bg-[#0c0f10] border border-[#d1d5db] dark:border-white/10 rounded-lg px-4 py-3 focus-within:border-[#c9a84c] dark:focus-within:border-[#7c4dff] transition-all">
            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-3" style={{ fontSize: '22px' }}>search</span>
            <input
              type="text"
              placeholder="Search Acts, Sections, or citations (e.g. IPC 302, Cheque bounce...)"
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              onFocus={() => searchQuery.trim().length > 1 && setShowSearchDropdown(true)}
              className="bg-transparent border-none outline-none w-full text-base text-[#111827] dark:text-[#e1e3e4] placeholder-gray-400 dark:placeholder-gray-600"
            />
          </div>

          {/* Search Results Dropdown Overlay */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1e1633] border border-[#e5e7eb] dark:border-white/15 rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto animate-scale-in">
              <div className="px-4 py-2 bg-gray-50 dark:bg-[#16121f] border-b border-[#e5e7eb] dark:border-white/10 text-xs font-bold text-gray-400 dark:text-[#cac3d8] uppercase tracking-wider">
                Matching Legal References ({searchResults.length})
              </div>
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (result.type === 'act') {
                      navigate('/dashboard/browse');
                    } else {
                      setSpotlight(result);
                    }
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#251b45] cursor-pointer flex items-start gap-3 border-b border-[#e5e7eb]/60 dark:border-white/5 last:border-b-0"
                >
                  <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364] mt-0.5 shrink-0" style={{ fontSize: '18px' }}>
                    {result.type === 'act' ? 'gavel' : 'article'}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2">
                      {result.type === 'act' ? (
                        <>
                          <span>{result.actName} ({result.actYear})</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#d7e0f4] dark:bg-[#785d00] text-[#5a6374] dark:text-[#fdd977] rounded">ACT</span>
                        </>
                      ) : (
                        <>
                          <span>{result.actCode} Section {result.sectionNumber}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">SEC</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {result.type === 'act' ? result.description : `${result.sectionTitle} — ${result.sectionDesc}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── KEY METRICS / STATS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1 */}
          <div className="bg-white dark:bg-[#16121f] p-5 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm relative overflow-hidden transition-all duration-300 animate-slide-card delay-100 card-hover">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#c9a84c]/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Covered Statutes</span>
              <div className="w-9 h-9 rounded-lg bg-[#fcfaf7] dark:bg-[#251b45] border border-[#e5e7eb] dark:border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]" style={{ fontSize: '20px' }}>gavel</span>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              <AnimatedCounter value={acts.length} /> Acts
            </p>
            <p className="text-xs text-[#6b7280] dark:text-[#cac3d8] mt-1.5 font-medium">Standardized codes of India</p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white dark:bg-[#16121f] p-5 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm relative overflow-hidden transition-all duration-300 animate-slide-card delay-150 card-hover">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Unified Library</span>
              <div className="w-9 h-9 rounded-lg bg-[#fcfaf7] dark:bg-[#251b45] border border-[#e5e7eb] dark:border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600 dark:text-[#cdbdff]" style={{ fontSize: '20px' }}>menu_book</span>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              <AnimatedCounter value="2,201" /> Sections
            </p>
            <p className="text-xs text-[#6b7280] dark:text-[#cac3d8] mt-1.5 font-medium">Full text indices loaded</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white dark:bg-[#16121f] p-5 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm relative overflow-hidden transition-all duration-300 animate-slide-card delay-200 card-hover">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Saved Bookmarks</span>
              <div className="w-9 h-9 rounded-lg bg-[#fcfaf7] dark:bg-[#251b45] border border-[#e5e7eb] dark:border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>bookmark</span>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              <AnimatedCounter value={bookmarks.length} /> Bookmarks
            </p>
            <p className="text-xs text-[#6b7280] dark:text-[#cac3d8] mt-1.5 font-medium">Saved for active litigation</p>
          </div>

          {/* Metric 4 */}
          <div className="bg-white dark:bg-[#16121f] p-5 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm relative overflow-hidden transition-all duration-300 animate-slide-card delay-250 card-hover">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Case Annotations</span>
              <div className="w-9 h-9 rounded-lg bg-[#fcfaf7] dark:bg-[#251b45] border border-[#e5e7eb] dark:border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400" style={{ fontSize: '20px' }}>edit_note</span>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              <AnimatedCounter value={notes.length} /> Active Notes
            </p>
            <p className="text-xs text-[#6b7280] dark:text-[#cac3d8] mt-1.5 font-medium">Personal statutory remarks</p>
          </div>
        </div>

        {/* ── ACT SELECTOR SECTION ── */}
        <div className="space-y-4 animate-fade-in-up delay-150">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#111827] dark:text-[#e1e3e4] tracking-tight">Browse Legal Codes</h2>
            <span className="text-xs font-mono font-bold text-[#c9a84c] dark:text-[#e6c364] tracking-wider uppercase">Click to browse acts</span>
          </div>

          {/* Grid of 8 acts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {acts.map((act, idx) => {
              const delayClass = actDelays[idx % actDelays.length];
              return (
                <div
                  key={act.actCode}
                  onClick={() => navigate(`/dashboard/browse?actCode=${act.actCode}`)}
                  className={`group cursor-pointer relative bg-white dark:bg-[#16121f] p-6 rounded-xl border shadow-sm transition-all duration-200 flex flex-col justify-between overflow-hidden animate-fade-in-up card-hover ${delayClass} ${
                    act.isStarred 
                      ? 'border-[#c9a84c]/50 dark:border-[#e6c364]/40 animate-border-pulse' 
                      : 'border-[#e5e7eb] dark:border-white/10 hover:border-[#c9a84c] dark:hover:border-[#7c4dff]'
                  }`}
                  style={{ minHeight: '185px' }}
                >
                  {/* Starred Gold top border accent */}
                  {act.isStarred && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c9a84c] dark:bg-[#e6c364]" />
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-gray-100 dark:bg-[#1e1633] text-gray-600 dark:text-[#cdbdff] rounded border border-gray-200/50 dark:border-white/5 tracking-wider">
                        {act.actCode}
                      </span>
                      <span className="text-xs font-semibold text-[#c9a84c] dark:text-[#e6c364]">
                        {act.actYear}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-bold text-[#111827] dark:text-white group-hover:text-[#c9a84c] dark:group-hover:text-[#cdbdff] transition-colors leading-tight mb-2">
                      {act.actName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                      {act.totalSections} sections
                    </span>
                    <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364] text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SPOTLIGHT & notes COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up delay-300">
          
          {/* Spotlight Card */}
          <div className="lg:col-span-8 bg-white dark:bg-[#16121f] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm relative overflow-hidden transition-all duration-300 flex flex-col justify-between card-hover" style={{ minHeight: '340px' }}>
            {/* Accent Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 dark:bg-[#7c4dff]/5 rounded-bl-full pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3.5 mb-5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                  <span className="text-sm font-bold text-[#111827] dark:text-white uppercase tracking-wider">Statutory Spotlight</span>
                </div>
                <button
                  onClick={rollSpotlight}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#251b45] text-xs font-bold transition-all text-[#111827] dark:text-white"
                >
                  <span className="material-symbols-outlined text-[14px]">autorenew</span>
                  <span>Roll Another</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded border border-purple-200/50 dark:border-purple-800/10">
                    {spotlight.actCode} Section {spotlight.sectionNumber}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">{spotlight.citation}</span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-[#111827] dark:text-white leading-tight">
                  {spotlight.sectionTitle}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal bg-[#fcfaf7] dark:bg-[#0c0f10] p-4.5 rounded-lg border border-gray-200/50 dark:border-white/5 animate-shimmer">
                  {spotlight.sectionDesc}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-[#c9a84c] dark:text-[#e6c364] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">menu_book</span>
                Decoded & standardized legal text
              </span>
              <button
                onClick={() => {
                  setNewNoteRef(`${spotlight.actCode} Section ${spotlight.sectionNumber}`);
                }}
                className="text-xs font-bold px-4 py-2 rounded-lg bg-[#1a2332] dark:bg-[#7c4dff] text-white hover:opacity-90 transition-opacity"
              >
                Annotate This Section
              </button>
            </div>
          </div>

          {/* Note Taking Widget */}
          <div className="lg:col-span-4 bg-white dark:bg-[#16121f] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm transition-all duration-300 flex flex-col justify-between card-hover">
            <div>
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-3.5 mb-5">
                <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                <span className="text-sm font-bold text-[#111827] dark:text-white uppercase tracking-wider">Quick Annotations</span>
              </div>

              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Section Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. IPC Section 302"
                    value={newNoteRef}
                    onChange={(e) => setNewNoteRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#d1d5db] dark:border-white/10 bg-[#fdfcfb] dark:bg-[#0c0f10] text-sm text-[#111827] dark:text-[#e1e3e4] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#c9a84c] dark:focus:ring-[#7c4dff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Personal Remarks</label>
                  <textarea
                    placeholder="Annotate facts, case files, or research deadlines..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    rows="3"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#d1d5db] dark:border-white/10 bg-[#fdfcfb] dark:bg-[#0c0f10] text-sm text-[#111827] dark:text-[#e1e3e4] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#c9a84c] dark:focus:ring-[#7c4dff] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#c9a84c] dark:bg-[#7c4dff] text-white dark:text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
                  style={{ boxShadow: isDark ? '0 2px 10px rgba(124,77,255,0.2)' : '0 2px 8px rgba(201,168,76,0.2)' }}
                >
                  Save Annotation
                </button>
              </form>
            </div>

            <div className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-4 font-medium leading-tight">
              Annotations remain private and secured under client-attorney confidentiality.
            </div>
          </div>
        </div>

        {/* ── NOTES & BOOKMARKS VISUAL LISTS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-350">
          
          {/* Bookmarks Section */}
          <div className="bg-white dark:bg-[#16121f] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm transition-all duration-300 card-hover">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                <h3 className="text-[15px] font-bold text-[#111827] dark:text-white uppercase tracking-wider">Bookmarked Sections</h3>
              </div>
              <Link to="/dashboard/bookmarks" className="text-xs font-bold text-[#c9a84c] dark:text-[#cdbdff] hover:underline">View All</Link>
            </div>

            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  className="p-4 rounded-lg bg-[#fcfaf7] dark:bg-[#0c0f10] border border-gray-200/50 dark:border-white/5 flex items-start justify-between gap-3 transition-colors hover:border-[#c9a84c]/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 bg-gray-200 dark:bg-[#1e1633] text-gray-700 dark:text-[#cdbdff] rounded">
                        {bookmark.actCode} Section {bookmark.sectionNumber}
                      </span>
                      <span className="text-xs font-semibold text-[#111827] dark:text-white">{bookmark.sectionTitle}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 italic font-medium">
                      "{bookmark.note || 'No notes added.'}"
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setBookmarks(prev => prev.filter(b => b._id !== bookmark._id));
                    }}
                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors shrink-0"
                    aria-label="Remove bookmark"
                  >
                    <span className="material-symbols-outlined text-[18px]">bookmark_remove</span>
                  </button>
                </div>
              ))}
              {bookmarks.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">No saved bookmarks yet.</p>
              )}
            </div>
          </div>

          {/* Annotations/Notes Section */}
          <div className="bg-white dark:bg-[#16121f] p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 shadow-sm transition-all duration-300 card-hover">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c9a84c] dark:text-[#e6c364]" style={{ fontVariationSettings: "'FILL' 1" }}>edit_document</span>
                <h3 className="text-[15px] font-bold text-[#111827] dark:text-white uppercase tracking-wider">Recent Annotations</h3>
              </div>
              <Link to="/dashboard/notes" className="text-xs font-bold text-[#c9a84c] dark:text-[#cdbdff] hover:underline">View All</Link>
            </div>

            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="p-4 rounded-lg bg-[#fcfaf7] dark:bg-[#0c0f10] border border-gray-200/50 dark:border-white/5 flex items-start justify-between gap-3 transition-colors hover:border-[#7c4dff]/20"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] dark:text-[#e1e3e4]">{note.sectionRef}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">{note.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-normal line-clamp-2">
                      {note.noteText}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors shrink-0"
                    aria-label="Delete annotation"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">No annotations recorded yet.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
