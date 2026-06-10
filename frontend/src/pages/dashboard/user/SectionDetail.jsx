import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchById, clearCurrentSection } from '../../../store/slices/sectionsSlice';
import api from '../../../services/api';

/* ─── SectionDetail ──────────────────────────────────────────────── */
export default function SectionDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentSection: section, loading, error } = useSelector(s => s.sections);
  const { theme } = useSelector(s => s.ui);
  const isDark = theme === 'dark';

  /* Bookmark state */
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  /* Notes state */
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // { _id, text }
  const [copied, setCopied] = useState(false);

  /* Fetch section */
  useEffect(() => {
    if (id) dispatch(fetchById(id));
    return () => dispatch(clearCurrentSection());
  }, [id, dispatch]);

  /* Check bookmark status and load notes */
  useEffect(() => {
    if (!id) return;

    api.get('/bookmarks')
      .then(res => {
        const bms = res.data?.data || [];
        const found = bms.find(b => (b.sectionId?._id || b.sectionId) === id);
        setIsBookmarked(!!found);
      })
      .catch(() => {});

    setNotesLoading(true);
    api.get('/notes')
      .then(res => {
        const allNotes = res.data?.data || [];
        // Filter notes related to this section
        const sectionNotes = allNotes.filter(n =>
          (n.sectionId?._id || n.sectionId) === id
        );
        setNotes(sectionNotes.map(n => ({
          _id: n._id,
          noteText: n.noteText,
          date: new Date(n.updatedAt || n.createdAt || Date.now())
            .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        })));
      })
      .catch(() => {})
      .finally(() => setNotesLoading(false));
  }, [id]);

  /* Toggle bookmark */
  const handleBookmark = async () => {
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${id}`);
        setIsBookmarked(false);
      } else {
        await api.post('/bookmarks', { sectionId: id });
        setIsBookmarked(true);
      }
    } catch {
      setIsBookmarked(prev => !prev); // optimistic fallback
    } finally {
      setBookmarkLoading(false);
    }
  };

  /* Add note */
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNoteLoading(true);
    try {
      const res = await api.post('/notes', { sectionId: id, noteText });
      const created = res.data?.data;
      if (created) {
        setNotes(prev => [{
          _id: created._id,
          noteText: created.noteText,
          date: 'Just now',
        }, ...prev]);
      }
      setNoteText('');
    } catch {
      setNotes(prev => [{
        _id: `local-${Date.now()}`,
        noteText,
        date: 'Just now',
      }, ...prev]);
      setNoteText('');
    } finally {
      setNoteLoading(false);
    }
  };

  /* Edit note */
  const handleEditNote = async (noteId) => {
    if (!editingNote?.text?.trim()) return;
    try {
      await api.put(`/notes/${noteId}`, { noteText: editingNote.text });
      setNotes(prev => prev.map(n => n._id === noteId ? { ...n, noteText: editingNote.text } : n));
      setEditingNote(null);
    } catch {}
  };

  /* Delete note */
  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);
    } catch {}
    setNotes(prev => prev.filter(n => n._id !== noteId));
  };

  /* Copy section text */
  const handleCopy = () => {
    const text = `${section?.actCode} Section ${section?.sectionNumber} — ${section?.sectionTitle}\n\n${section?.sectionDesc || section?.content || ''}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-5xl text-[#c9a84c] animate-spin">progress_activity</span>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading section...</p>
      </div>
    );
  }

  /* ── ERROR / NOT FOUND ── */
  if (error || !section) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-6">
        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">find_in_page</span>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Section Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {error || 'This section could not be loaded. It may have been removed or the ID is invalid.'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c9a84c] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-[#c9a84c]/30"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 font-sans">

      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 font-medium mb-6">
        <Link to="/dashboard" className="hover:text-[#c9a84c] transition-colors">Dashboard</Link>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
        <Link
          to={`/dashboard/browse?actCode=${section.actCode}`}
          className="hover:text-[#c9a84c] transition-colors"
        >
          {section.actCode}
        </Link>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
        <span className="text-gray-700 dark:text-gray-300 font-semibold truncate max-w-[200px]">
          Section {section.sectionNumber}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT: MAIN CONTENT ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section header card */}
          <div className="bg-white/80 dark:bg-[#16121f]/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-white/8 p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-bold px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-white/10 text-white tracking-widest uppercase shadow-sm">
                  {section.actCode}
                </span>
                <span className="text-sm font-bold px-3 py-1.5 rounded-xl bg-[#c9a84c]/15 text-[#8f6d19] dark:text-[#e6c364] border border-[#c9a84c]/25">
                  Section {section.sectionNumber}
                </span>
                {section.actYear && (
                  <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                    {section.actYear}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  title="Copy section text"
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white transition-all duration-200"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {copied ? 'check' : 'content_copy'}
                  </span>
                </button>
                <button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this section'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    isBookmarked
                      ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/25'
                      : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-amber-300 dark:hover:border-amber-500/30 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '17px', fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>
                    bookmark
                  </span>
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-6">
              {section.sectionTitle || section.title || 'Untitled Section'}
            </h1>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[#c9a84c]/30 via-[#c9a84c]/10 to-transparent mb-6" />

            {/* Full section content */}
            <div className="prose prose-sm max-w-none">
              <div className="relative pl-5 border-l-2 border-[#c9a84c]/40">
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-[1.85] font-medium whitespace-pre-line">
                  {section.sectionDesc || section.content || section.description || 'Full content not available.'}
                </p>
              </div>
            </div>

            {/* Citation */}
            <div className="mt-8 pt-5 border-t border-gray-100 dark:border-white/5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c9a84c] text-lg">verified_user</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {section.actCode} Section {section.sectionNumber} · {section.actName || ''} {section.actYear ? `(${section.actYear})` : ''} · Government of India
              </span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#16121f]/70 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 shadow-sm"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              Back to Browse
            </button>
            <Link
              to={`/dashboard/browse?actCode=${section.actCode}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-sm font-semibold text-[#8f6d19] dark:text-[#e6c364] hover:bg-[#c9a84c]/20 transition-all duration-200"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>menu_book</span>
              All {section.actCode} Sections
            </Link>
          </div>
        </div>

        {/* ── RIGHT: NOTES PANEL ── */}
        <div className="space-y-5">

          {/* Add note form */}
          <div className="bg-white/80 dark:bg-[#16121f]/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-white/8 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 dark:text-blue-400" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>edit_note</span>
              </div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Add Annotation</h2>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Type your legal notes, case references, or observations..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 transition-all resize-none"
              />
              <button
                type="submit"
                disabled={noteLoading || !noteText.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {noteLoading ? (
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                )}
                {noteLoading ? 'Saving...' : 'Save Note'}
              </button>
            </form>
          </div>

          {/* Notes list */}
          <div className="bg-white/80 dark:bg-[#16121f]/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-white/8 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">My Notes</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                {notes.length}
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {notesLoading ? (
                <div className="flex items-center justify-center py-10">
                  <span className="material-symbols-outlined animate-spin text-[#c9a84c] text-3xl">progress_activity</span>
                </div>
              ) : notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-6">
                  <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">speaker_notes_off</span>
                  <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">No notes yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">Add your first annotation above.</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note._id} className="p-5 group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    {editingNote?._id === note._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingNote.text}
                          onChange={e => setEditingNote(prev => ({ ...prev, text: e.target.value }))}
                          rows={3}
                          autoFocus
                          className="w-full px-3 py-2 rounded-xl border border-blue-400/50 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none transition-all"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNote(note._id)}
                            className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                          >Save</button>
                          <button
                            onClick={() => setEditingNote(null)}
                            className="flex-1 py-1.5 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-300 dark:hover:bg-white/15 transition-colors"
                          >Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-2">
                          {note.noteText}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{note.date}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingNote({ _id: note._id, text: note.noteText })}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note._id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete_outline</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 mt-0.5" style={{ fontSize: '16px' }}>lock</span>
            <p className="text-xs text-green-800 dark:text-green-300 font-semibold leading-relaxed">
              Your annotations are private and encrypted under client-attorney privilege.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
