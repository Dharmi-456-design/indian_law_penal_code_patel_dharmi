import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../../services/api';

/* ─── Constants ─────────────────────────────────────────────────────── */
const TAG_OPTIONS = [
  { label: 'IPC', color: '#ef4444' },
  { label: 'CrPC', color: '#f97316' },
  { label: 'CPC', color: '#eab308' },
  { label: 'Evidence', color: '#22c55e' },
  { label: 'Constitution', color: '#3b82f6' },
  { label: 'Family Law', color: '#a855f7' },
  { label: 'Contract', color: '#06b6d4' },
  { label: 'General', color: '#94a3b8' },
];

const SAMPLE_NOTES = [
  {
    _id: 'demo-1',
    title: 'IPC § 302 — Punishment for Murder',
    sectionRef: 'IPC Section 302',
    noteText: `Supreme Court guidelines on "Rarest of Rare" doctrine:\n\n1. Examine mitigating circumstances first — age, mental state, background of accused\n2. Consider if the crime was pre-meditated or impulsive\n3. Bachan Singh v. State of Punjab (1980) — death penalty reserved for exceptional cases\n4. Machhi Singh v. State of Punjab (1983) — five categories where death is appropriate\n\nKey Points:\n- Burden of proof lies with prosecution\n- Session court must record reasons in writing\n- Confirmation by High Court mandatory for death penalty`,
    tag: 'IPC',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    pinned: true,
  },
  {
    _id: 'demo-2',
    title: 'NIA § 138 — Cheque Bounce Notice Timeline',
    sectionRef: 'NIA Section 138',
    noteText: `Strict 30-day notice window from receipt of bank memo:\n\n• Send notice within 30 days of cheque return memo\n• Drawer has 15 days after notice to make payment\n• If not paid → file complaint within 1 month\n\nCritical Checklist:\n☑ Verify date of memo from bank\n☑ Mode of dispatch — registered post preferred\n☑ Track postal acknowledgement\n☑ Keep original cheque safe as exhibit`,
    tag: 'General',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    pinned: false,
  },
  {
    _id: 'demo-3',
    title: 'CrPC § 438 — Anticipatory Bail Guidelines',
    sectionRef: 'CrPC Section 438',
    noteText: `Anticipatory Bail — Pre-arrest bail petition:\n\nFactors Courts Consider:\n1. Nature and gravity of accusation\n2. Antecedents of the accused\n3. Possibility of accused fleeing\n4. Where accusations appear motivated by revenge\n\nGurgaon Sessions Court Practice:\n- File with complete FIR copy, annexures\n- Personal surety + cash deposit often required\n- Conditions: not leave country, surrender passport`,
    tag: 'CrPC',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    pinned: false,
  },
];

/* ─── Helper: format date ────────────────────────────────────────────── */
const formatDate = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ─── Tag Badge ──────────────────────────────────────────────────────── */
const TagBadge = ({ tag, size = 'sm' }) => {
  const found = TAG_OPTIONS.find((t) => t.label === tag) || TAG_OPTIONS[TAG_OPTIONS.length - 1];
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full tracking-wide ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'}`}
      style={{ color: found.color, background: found.color + '1a', border: `1px solid ${found.color}30` }}
    >
      {tag}
    </span>
  );
};

/* ─── Note Card ──────────────────────────────────────────────────────── */
const NoteCard = ({ note, isActive, onClick }) => {
  const preview = note.noteText?.replace(/\n/g, ' ').slice(0, 90) + '…';
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative ${
        isActive
          ? 'bg-[#c9a84c]/10 border-[#c9a84c]/40 shadow-[0_0_20px_rgba(201,168,76,0.1)]'
          : 'bg-[#111417]/60 border-white/5 hover:bg-[#1a1d20]/80 hover:border-white/10'
      }`}
    >
      {note.pinned && (
        <span className="absolute top-3 right-3 material-symbols-outlined text-[#c9a84c] text-[14px]"
          style={{ fontVariationSettings: "'FILL' 1" }}>
          push_pin
        </span>
      )}
      <div className="flex items-start gap-2 mb-2 pr-4">
        <TagBadge tag={note.tag || 'General'} />
      </div>
      <h3 className={`font-semibold text-sm leading-snug mb-1.5 ${isActive ? 'text-[#c9a84c]' : 'text-white'}`}>
        {note.title || note.sectionRef || 'Untitled Note'}
      </h3>
      <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed">{preview}</p>
      <p className="text-[10px] text-[#475569] mt-2">{formatDate(note.updatedAt || note.createdAt || new Date())}</p>
    </button>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function NotesPage() {
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [activeId, setActiveId] = useState(SAMPLE_NOTES[0]._id);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Editor state
  const [editorTitle, setEditorTitle] = useState('');
  const [editorRef, setEditorRef] = useState('');
  const [editorBody, setEditorBody] = useState('');
  const [editorTag, setEditorTag] = useState('General');

  // New note form state
  const [newTitle, setNewTitle] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTag, setNewTag] = useState('General');

  const saveTimerRef = useRef(null);
  const textareaRef = useRef(null);

  /* Load notes from backend */
  useEffect(() => {
    setLoading(true);
    api.get('/notes')
      .then((res) => {
        if (res.data?.data?.length > 0) {
          const fetched = res.data.data.map((n) => ({
            _id: n._id,
            title: n.title || (n.sectionRef ? `Note on ${n.sectionRef}` : 'Untitled Note'),
            sectionRef: n.sectionId?.sectionNumber
              ? `${n.sectionId.actCode} Section ${n.sectionId.sectionNumber}`
              : n.sectionRef || '',
            noteText: n.noteText || '',
            tag: n.tag || 'General',
            updatedAt: n.updatedAt || n.createdAt || new Date().toISOString(),
            pinned: n.pinned || false,
          }));
          setNotes(fetched);
          setActiveId(fetched[0]._id);
        }
      })
      .catch(() => { /* keep sample data */ })
      .finally(() => setLoading(false));
  }, []);

  /* Sync editor when active note changes */
  const activeNote = notes.find((n) => n._id === activeId);
  useEffect(() => {
    if (activeNote) {
      setEditorTitle(activeNote.title || '');
      setEditorRef(activeNote.sectionRef || '');
      setEditorBody(activeNote.noteText || '');
      setEditorTag(activeNote.tag || 'General');
      setIsEditing(false);
    }
  }, [activeId]);

  /* Auto-save after 1.5s of inactivity */
  const triggerAutoSave = useCallback((updatedTitle, updatedRef, updatedBody, updatedTag) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (!activeNote) return;
      setSaving(true);
      const payload = {
        title: updatedTitle,
        sectionRef: updatedRef,
        noteText: updatedBody,
        tag: updatedTag,
      };
      api.put(`/notes/${activeNote._id}`, payload)
        .catch(() => { })
        .finally(() => {
          setSaving(false);
          setNotes((prev) =>
            prev.map((n) =>
              n._id === activeNote._id
                ? { ...n, title: updatedTitle, sectionRef: updatedRef, noteText: updatedBody, tag: updatedTag, updatedAt: new Date().toISOString() }
                : n
            )
          );
        });
    }, 1500);
  }, [activeNote]);

  const handleBodyChange = (e) => {
    const val = e.target.value;
    setEditorBody(val);
    setIsEditing(true);
    triggerAutoSave(editorTitle, editorRef, val, editorTag);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setEditorTitle(val);
    setIsEditing(true);
    triggerAutoSave(val, editorRef, editorBody, editorTag);
  };

  const handleTagChange = (tag) => {
    setEditorTag(tag);
    setIsEditing(true);
    triggerAutoSave(editorTitle, editorRef, editorBody, tag);
  };

  /* Create new note */
  const handleCreateNote = () => {
    if (!newBody.trim()) return;
    const tempId = `temp-${Date.now()}`;
    const created = {
      _id: tempId,
      title: newTitle || 'Untitled Note',
      sectionRef: newRef,
      noteText: newBody,
      tag: newTag,
      updatedAt: new Date().toISOString(),
      pinned: false,
    };
    setNotes((prev) => [created, ...prev]);
    setActiveId(tempId);
    setShowNewNoteModal(false);
    setNewTitle(''); setNewRef(''); setNewBody(''); setNewTag('General');

    api.post('/notes', { title: newTitle, sectionRef: newRef, noteText: newBody, tag: newTag })
      .then((res) => {
        if (res.data?.data?._id) {
          setNotes((prev) => prev.map((n) => n._id === tempId ? { ...created, _id: res.data.data._id } : n));
          setActiveId(res.data.data._id);
        }
      })
      .catch(() => { });
  };

  /* Delete note */
  const handleDelete = (noteId) => {
    api.delete(`/notes/${noteId}`).catch(() => { });
    const remaining = notes.filter((n) => n._id !== noteId);
    setNotes(remaining);
    setDeleteConfirm(null);
    if (activeId === noteId) {
      setActiveId(remaining[0]?._id || null);
    }
  };

  /* Toggle pin */
  const handleTogglePin = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => n._id === noteId ? { ...n, pinned: !n.pinned } : n)
    );
  };

  /* Filter notes */
  const filteredNotes = notes
    .filter((n) => {
      const q = searchQuery.toLowerCase();
      return !q || (n.title + n.sectionRef + n.noteText + n.tag).toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  /* ── Render ── */
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0d0f] text-white flex flex-col">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] bg-[#c9a84c]/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-[#7c4dff]/[0.04] blur-[100px] rounded-full" />
      </div>

      {/* ── Page Header ── */}
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-8 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#c9a84c] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              edit_document
            </span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Legal Notes</h1>
            <p className="text-xs text-[#475569]">{notes.length} notes · Personal legal annotations</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewNoteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] hover:bg-[#b8963e] text-black font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-[#c9a84c]/20"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Note
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="relative z-10 flex flex-1 overflow-hidden h-[calc(100vh-10rem)]">

        {/* ── LEFT PANEL: Notes List ── */}
        <div className="w-80 flex-shrink-0 border-r border-white/[0.06] flex flex-col bg-[#0d1014]/80 backdrop-blur-xl">

          {/* Search */}
          <div className="p-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 bg-[#111417] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-[#c9a84c]/40 transition-colors">
              <span className="material-symbols-outlined text-[#475569] text-[16px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes…"
                className="bg-transparent outline-none border-none text-sm text-white placeholder-[#475569] w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#475569] hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading && (
              <div className="flex flex-col gap-2 mt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-xl bg-white/[0.03] animate-shimmer" />
                ))}
              </div>
            )}

            {!loading && filteredNotes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="material-symbols-outlined text-[#2d3748] text-5xl mb-3">note_alt</span>
                <p className="text-[#475569] text-sm">
                  {searchQuery ? 'No notes match your search' : 'No notes yet'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowNewNoteModal(true)}
                    className="mt-4 text-[#c9a84c] text-sm font-medium hover:underline"
                  >
                    Create your first note →
                  </button>
                )}
              </div>
            )}

            {!loading && filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                isActive={note._id === activeId}
                onClick={() => setActiveId(note._id)}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL: Note Editor ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0d0f]">
          {activeNote ? (
            <>
              {/* Editor Toolbar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#0d1014]/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  {/* Tag selector */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {TAG_OPTIONS.map((t) => (
                      <button
                        key={t.label}
                        onClick={() => handleTagChange(t.label)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${editorTag === t.label ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'}`}
                        style={{
                          color: t.color,
                          borderColor: editorTag === t.label ? t.color + '80' : 'transparent',
                          background: editorTag === t.label ? t.color + '1a' : 'transparent',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Save indicator */}
                  {saving ? (
                    <span className="text-[11px] text-[#475569] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                      Saving…
                    </span>
                  ) : isEditing ? (
                    <span className="text-[11px] text-[#22c55e] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Saved
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#334155]">
                      {formatDate(activeNote.updatedAt)}
                    </span>
                  )}

                  {/* Pin button */}
                  <button
                    onClick={() => handleTogglePin(activeNote._id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${activeNote.pinned ? 'bg-[#c9a84c]/10 text-[#c9a84c]' : 'text-[#475569] hover:text-white hover:bg-white/5'}`}
                    title={activeNote.pinned ? 'Unpin' : 'Pin note'}
                  >
                    <span className="material-symbols-outlined text-[17px]" style={{ fontVariationSettings: activeNote.pinned ? "'FILL' 1" : "'FILL' 0" }}>
                      push_pin
                    </span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => setDeleteConfirm(activeNote._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#475569] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
                    title="Delete note"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Note Editor Body */}
              <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-4">
                {/* Title */}
                <input
                  type="text"
                  value={editorTitle}
                  onChange={handleTitleChange}
                  placeholder="Note title…"
                  className="w-full bg-transparent text-2xl lg:text-3xl font-bold text-white placeholder-[#2d3748] outline-none border-none resize-none leading-tight"
                />

                {/* Section reference */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c9a84c] text-[15px]">link</span>
                  <input
                    type="text"
                    value={editorRef}
                    onChange={(e) => { setEditorRef(e.target.value); setIsEditing(true); triggerAutoSave(editorTitle, e.target.value, editorBody, editorTag); }}
                    placeholder="Section reference (e.g. IPC Section 302)…"
                    className="bg-transparent text-sm text-[#c9a84c] placeholder-[#1e2933] outline-none border-none w-full font-medium"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-white/[0.06]" />

                {/* Body / Main text area */}
                <textarea
                  ref={textareaRef}
                  value={editorBody}
                  onChange={handleBodyChange}
                  placeholder={`Start writing your legal annotation…\n\nTip: Use numbered lists, checkboxes (☑), and section citations for quick reference.`}
                  className="w-full min-h-[420px] bg-transparent text-[15px] text-[#cbd5e1] placeholder-[#1e293b] outline-none border-none resize-none leading-relaxed font-mono"
                  spellCheck={false}
                />
              </div>

              {/* Word count footer */}
              <div className="px-6 lg:px-10 py-3 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[11px] text-[#334155]">
                  {editorBody.split(/\s+/).filter(Boolean).length} words · {editorBody.length} chars
                </span>
                <div className="flex items-center gap-1">
                  <TagBadge tag={editorTag} size="md" />
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mb-6 animate-float">
                <span className="material-symbols-outlined text-[#c9a84c] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  edit_note
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Your Legal Notepad</h2>
              <p className="text-[#475569] text-sm max-w-xs leading-relaxed mb-6">
                Select a note from the left panel to start editing, or create a new one.
              </p>
              <button
                onClick={() => setShowNewNoteModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] hover:bg-[#b8963e] text-black font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-[#c9a84c]/20"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Create First Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── NEW NOTE MODAL ── */}
      {showNewNoteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setShowNewNoteModal(false); }}
        >
          <div className="w-full max-w-lg bg-[#0f1317] border border-white/[0.08] rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c9a84c] text-[20px]">note_add</span>
                <h2 className="font-semibold text-white text-base">New Legal Note</h2>
              </div>
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="text-[#475569] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs text-[#64748b] font-medium uppercase tracking-wider mb-1 block">Title</label>
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. IPC § 302 — Murder Analysis"
                  className="w-full bg-[#111417] border border-white/[0.08] focus:border-[#c9a84c]/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#334155] outline-none transition-colors"
                />
              </div>

              {/* Section ref */}
              <div>
                <label className="text-xs text-[#64748b] font-medium uppercase tracking-wider mb-1 block">Section Reference</label>
                <input
                  type="text"
                  value={newRef}
                  onChange={(e) => setNewRef(e.target.value)}
                  placeholder="e.g. IPC Section 302"
                  className="w-full bg-[#111417] border border-white/[0.08] focus:border-[#c9a84c]/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#334155] outline-none transition-colors"
                />
              </div>

              {/* Tag */}
              <div>
                <label className="text-xs text-[#64748b] font-medium uppercase tracking-wider mb-2 block">Tag</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setNewTag(t.label)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all ${newTag === t.label ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'}`}
                      style={{
                        color: t.color,
                        borderColor: newTag === t.label ? t.color + '80' : t.color + '30',
                        background: newTag === t.label ? t.color + '1a' : 'transparent',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div>
                <label className="text-xs text-[#64748b] font-medium uppercase tracking-wider mb-1 block">Note Content</label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Write your legal annotations, case notes, or research here…"
                  rows={6}
                  className="w-full bg-[#111417] border border-white/[0.08] focus:border-[#c9a84c]/50 rounded-xl px-4 py-3 text-white text-sm placeholder-[#334155] outline-none transition-colors resize-none font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="px-4 py-2 text-sm text-[#64748b] hover:text-white transition-colors rounded-xl hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                disabled={!newBody.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-[#c9a84c] hover:bg-[#b8963e] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-[#c9a84c]/20"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                Create Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
        >
          <div className="w-full max-w-sm bg-[#0f1317] border border-[#ef4444]/20 rounded-2xl shadow-2xl animate-scale-in p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#ef4444]/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#ef4444] text-[20px]">warning</span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Delete Note?</h3>
                <p className="text-xs text-[#64748b] mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm text-[#64748b] hover:text-white transition-colors rounded-xl hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold rounded-xl transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
