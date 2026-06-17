import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

export default function ActsPage() {
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAct, setEditAct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ actCode: '', actName: '', actYear: '', description: '', totalSections: '' });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    api.get('/acts').then(r => setActs(r.data?.data || [])).catch(() => setActs([])).finally(() => setLoading(false));
  }, []);

  const filtered = acts.filter(a => {
    const q = search.toLowerCase();
    return !q || (a.actCode + a.actName + a.actYear + (a.description || '')).toLowerCase().includes(q);
  });

  const openCreate = () => { setForm({ actCode: '', actName: '', actYear: '', description: '', totalSections: '' }); setEditAct(null); setShowModal(true); };
  const openEdit = (act) => { setForm({ actCode: act.actCode || '', actName: act.actName || '', actYear: act.actYear || '', description: act.description || '', totalSections: act.totalSections || '' }); setEditAct(act); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.actCode.trim() || !form.actName.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, actYear: Number(form.actYear), totalSections: Number(form.totalSections) };
      if (editAct) {
        const r = await api.put(`/acts/${editAct._id}`, payload);
        setActs(prev => prev.map(a => a._id === editAct._id ? r.data?.data || { ...a, ...payload } : a));
        showToast('Act updated successfully');
      } else {
        const r = await api.post('/acts', payload);
        setActs(prev => [r.data?.data || { ...payload, _id: Date.now() }, ...prev]);
        showToast('Act created successfully');
      }
      setShowModal(false);
    } catch (err) { showToast(err.response?.data?.message || 'Operation failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (actId) => {
    try {
      await api.delete(`/acts/${actId}`);
      setActs(prev => prev.filter(a => a._id !== actId));
      showToast('Act deleted');
    } catch { showToast('Failed to delete act'); }
    setDeleteConfirm(null);
  };

  const Field = ({ label, id, value, onChange, type = 'text', placeholder = '', required = false }) => (
    <div>
      <label className="text-xs text-[#64748b] font-medium uppercase tracking-wider mb-1.5 block">{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full bg-[#0d1117] border border-white/[0.08] focus:border-[#c9a84c]/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#334155] outline-none transition-colors" />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0d0f] text-white">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-[#111417] border border-[#22c55e]/30 rounded-xl text-sm text-[#22c55e] shadow-2xl animate-fade-in-down">{toast}</div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white">Acts & Codes</h1>
            <p className="text-[#64748b] text-sm mt-1">{acts.length} legal acts in the database</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] hover:bg-[#b8963e] text-black font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-[#c9a84c]/20">
            <span className="material-symbols-outlined text-[18px]">add</span> Add Act
          </button>
        </div>

        <div className="flex items-center gap-2 bg-[#111417] border border-white/[0.07] rounded-xl px-3 py-2 max-w-sm focus-within:border-[#c9a84c]/40 transition-colors animate-fade-in-up delay-100">
          <span className="material-symbols-outlined text-[#475569] text-[16px]">search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search acts…"
            className="bg-transparent outline-none text-sm text-white placeholder-[#475569] w-full" />
        </div>

        <div className="animate-fade-in-up delay-200 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-white/[0.03] animate-shimmer" />)
          ) : filtered.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-[#475569]">No acts found</div>
          ) : filtered.map(act => (
            <div key={act._id} className="bg-[#111417] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.14] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-[#c9a84c]">{act.actCode}</span>
                  <span className="text-xs text-[#475569] ml-2 font-mono">{act.actYear}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(act)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#7c4dff] hover:bg-[#7c4dff]/10 transition-all">
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                  </button>
                  <button onClick={() => setDeleteConfirm(act)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10 transition-all">
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-white text-sm leading-snug mb-2">{act.actName}</h3>
              <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">{act.description || 'No description provided.'}</p>
              <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-xs text-[#475569]">{act.totalSections || 0} Sections</span>
                <span className="text-xs font-semibold text-[#334155] bg-white/[0.04] px-2 py-0.5 rounded">{act.actCode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="w-full max-w-md bg-[#0f1317] border border-white/[0.08] rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
              <span className="material-symbols-outlined text-[#c9a84c] text-[20px]">{editAct ? 'edit' : 'add_circle'}</span>
              <h2 className="font-semibold text-white">{editAct ? 'Edit Act' : 'Create New Act'}</h2>
              <button onClick={() => setShowModal(false)} className="ml-auto text-[#475569] hover:text-white"><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Act Code *" id="actCode" value={form.actCode} onChange={e => setForm(p => ({ ...p, actCode: e.target.value }))} placeholder="IPC" required />
                <Field label="Year *" id="actYear" type="number" value={form.actYear} onChange={e => setForm(p => ({ ...p, actYear: e.target.value }))} placeholder="1860" />
              </div>
              <Field label="Act Name *" id="actName" value={form.actName} onChange={e => setForm(p => ({ ...p, actName: e.target.value }))} placeholder="Indian Penal Code" required />
              <Field label="Total Sections" id="totalSections" type="number" value={form.totalSections} onChange={e => setForm(p => ({ ...p, totalSections: e.target.value }))} placeholder="575" />
              <div>
                <label className="text-xs text-[#64748b] font-medium uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Brief description of this act…"
                  className="w-full bg-[#0d1117] border border-white/[0.08] focus:border-[#c9a84c]/50 rounded-xl px-4 py-3 text-white text-sm placeholder-[#334155] outline-none transition-colors resize-none" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-[#64748b] hover:text-white hover:bg-white/5 rounded-xl transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#c9a84c] hover:bg-[#b8963e] disabled:opacity-50 text-black font-semibold text-sm rounded-xl transition-all active:scale-95">
                  {saving ? <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span> : <span className="material-symbols-outlined text-[16px]">save</span>}
                  {saving ? 'Saving…' : 'Save Act'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <p className="font-semibold text-white">Delete Act?</p>
                <p className="text-xs text-[#64748b] mt-0.5">{deleteConfirm.actCode} — {deleteConfirm.actName}</p>
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
