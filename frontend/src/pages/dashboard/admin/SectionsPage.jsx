import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

export default function SectionsPage() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actFilter, setActFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const LIMIT = 20;

  const loadSections = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: LIMIT });
    if (actFilter !== 'all') params.append('actCode', actFilter);
    if (search.trim()) params.append('search', search.trim());

    api.get(`/sections?${params}`).then(r => {
      setSections(r.data?.data || []);
      setTotalPages(r.data?.totalPages || 1);
    }).catch(() => setSections([])).finally(() => setLoading(false));
  }, [page, actFilter, search]);

  useEffect(() => { loadSections(); }, [loadSections]);
  useEffect(() => { api.get('/acts').then(r => setActs(r.data?.data || [])).catch(() => {}); }, []);
  useEffect(() => { setPage(1); }, [search, actFilter]);

  const handleDelete = async (sectionId) => {
    try {
      await api.delete(`/sections/${sectionId}`);
      setSections(prev => prev.filter(s => s._id !== sectionId));
      showToast('Section deleted');
    } catch { showToast('Failed to delete section'); }
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0d0f] text-white">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-[#111417] border border-[#22c55e]/30 rounded-xl text-sm text-[#22c55e] shadow-2xl animate-fade-in-down">{toast}</div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Sections</h1>
            <p className="text-[#64748b] text-sm mt-1">Browse and manage all legal sections</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-100">
          <div className="flex items-center gap-2 bg-[#111417] border border-white/[0.07] rounded-xl px-3 py-2 flex-1 max-w-sm focus-within:border-[#c9a84c]/40 transition-colors">
            <span className="material-symbols-outlined text-[#475569] text-[16px]">search</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sections…"
              className="bg-transparent outline-none text-sm text-white placeholder-[#475569] w-full" />
          </div>
          <select
            value={actFilter}
            onChange={e => setActFilter(e.target.value)}
            className="bg-[#111417] border border-white/[0.07] rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-[#c9a84c]/40 transition-colors"
          >
            <option value="all">All Acts</option>
            {acts.map(a => <option key={a.actCode} value={a.actCode}>{a.actCode} — {a.actName}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="animate-fade-in-up delay-200 bg-[#111417] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Act', 'Section', 'Title', 'Chapter', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#64748b] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}>{[...Array(5)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 rounded bg-white/[0.04] animate-shimmer" /></td>
                    ))}</tr>
                  ))
                ) : sections.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-[#475569] text-sm">No sections found</td></tr>
                ) : sections.map(s => (
                  <tr key={s._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-1 rounded">{s.actCode}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-mono text-[#94a3b8]">§ {s.sectionNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white font-medium truncate max-w-[280px]">{s.sectionTitle}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#64748b] truncate max-w-[140px]">{s.chapterTitle || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/dashboard/section/${s._id}`)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#38bdf8] hover:bg-[#38bdf8]/10 transition-all" title="View">
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                        </button>
                        <button onClick={() => setDeleteConfirm(s)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10 transition-all" title="Delete">
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
              <span className="text-xs text-[#64748b]">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-sm bg-white/[0.04] border border-white/[0.07] rounded-lg disabled:opacity-30 hover:bg-white/[0.08] transition-all">
                  ← Prev
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-sm bg-white/[0.04] border border-white/[0.07] rounded-lg disabled:opacity-30 hover:bg-white/[0.08] transition-all">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="w-full max-w-sm bg-[#0f1317] border border-[#ef4444]/20 rounded-2xl p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#ef4444] text-[20px]">warning</span>
              </div>
              <div>
                <p className="font-semibold text-white">Delete Section?</p>
                <p className="text-xs text-[#64748b] mt-0.5">{deleteConfirm.actCode} § {deleteConfirm.sectionNumber} — {deleteConfirm.sectionTitle?.slice(0, 40)}…</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-[#64748b] hover:text-white rounded-xl hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} className="px-4 py-2 text-sm bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold rounded-xl transition-all active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
