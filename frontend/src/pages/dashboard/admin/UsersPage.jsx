import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

const ROLE_COLORS = { admin: '#7c4dff', user: '#c9a84c' };
const STATUS_COLORS = { active: '#22c55e', inactive: '#ef4444', suspended: '#f97316' };

const Badge = ({ label, color }) => (
  <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
    style={{ color, background: color + '1a', border: `1px solid ${color}25` }}>
    {label}
  </span>
);

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionUser, setActionUser] = useState(null); // { user, action }
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadUsers = useCallback(() => {
    setLoading(true);
    api.get('/users').then(r => setUsers(Array.isArray(r.data?.data) ? r.data.data : [])).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || (u.name + u.email + u.role).toLowerCase().includes(q);
    const matchR = roleFilter === 'all' || u.role === roleFilter;
    return matchQ && matchR;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      showToast(`Role updated to ${newRole}`);
    } catch { showToast('Failed to update role'); }
    setActionUser(null);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      showToast(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch { showToast('Failed to update status'); }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      showToast('User deleted');
    } catch { showToast('Failed to delete user'); }
    setActionUser(null);
  };

  const initials = (name) => (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const avatarColor = (name) => {
    const colors = ['#c9a84c', '#7c4dff', '#38bdf8', '#22c55e', '#f97316', '#a855f7'];
    let hash = 0; for (const c of (name || '')) hash = c.charCodeAt(0) + hash * 31;
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0d0f] text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-[#111417] border border-[#22c55e]/30 rounded-xl text-sm text-[#22c55e] shadow-2xl animate-fade-in-down">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <p className="text-[#64748b] text-sm mt-1">{users.length} total users on the platform</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-100">
          <div className="flex items-center gap-2 bg-[#111417] border border-white/[0.07] rounded-xl px-3 py-2 flex-1 max-w-sm focus-within:border-[#c9a84c]/40 transition-colors">
            <span className="material-symbols-outlined text-[#475569] text-[16px]">search</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="bg-transparent outline-none text-sm text-white placeholder-[#475569] w-full" />
          </div>
          <div className="flex gap-2">
            {['all', 'user', 'admin'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all capitalize ${roleFilter === r ? 'bg-[#c9a84c] text-black border-[#c9a84c]' : 'border-white/[0.07] text-[#64748b] hover:text-white hover:border-white/[0.14]'}`}>
                {r === 'all' ? 'All' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="animate-fade-in-up delay-200 bg-[#111417] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#64748b] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 rounded bg-white/[0.04] animate-shimmer" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-[#475569] text-sm">No users found</td></tr>
                ) : filtered.map(u => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-black text-sm font-bold flex-shrink-0"
                          style={{ background: avatarColor(u.name) }}>
                          {initials(u.name)}
                        </div>
                        <span className="text-sm font-medium text-white truncate max-w-[140px]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#94a3b8] truncate max-w-[180px]">{u.email}</td>
                    <td className="px-5 py-4"><Badge label={u.role} color={ROLE_COLORS[u.role] || '#94a3b8'} /></td>
                    <td className="px-5 py-4"><Badge label={u.status || 'active'} color={STATUS_COLORS[u.status || 'active']} /></td>
                    <td className="px-5 py-4 text-sm text-[#64748b]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setActionUser({ user: u, action: 'role' })}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7c4dff] hover:bg-[#7c4dff]/10 transition-all" title="Change role">
                          <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                        </button>
                        <button onClick={() => handleToggleStatus(u._id, u.status || 'active')}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${(u.status || 'active') === 'active' ? 'text-[#f97316] hover:bg-[#f97316]/10' : 'text-[#22c55e] hover:bg-[#22c55e]/10'}`}
                          title={(u.status || 'active') === 'active' ? 'Deactivate' : 'Activate'}>
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {(u.status || 'active') === 'active' ? 'pause_circle' : 'play_circle'}
                          </span>
                        </button>
                        <button onClick={() => setActionUser({ user: u, action: 'delete' })}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10 transition-all" title="Delete user">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      {actionUser?.action === 'role' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={e => { if (e.target === e.currentTarget) setActionUser(null); }}>
          <div className="w-full max-w-xs bg-[#0f1317] border border-white/[0.08] rounded-2xl p-6 animate-scale-in">
            <h3 className="font-semibold text-white mb-4">Change Role — <span className="text-[#c9a84c]">{actionUser.user.name}</span></h3>
            <div className="space-y-2">
              {['user', 'admin'].map(r => (
                <button key={r} onClick={() => handleRoleChange(actionUser.user._id, r)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-semibold capitalize ${actionUser.user.role === r ? 'border-[#c9a84c]/50 bg-[#c9a84c]/10 text-[#c9a84c]' : 'border-white/[0.07] text-[#94a3b8] hover:border-white/[0.14] hover:text-white'}`}>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {r === 'admin' ? 'admin_panel_settings' : 'person'}
                  </span>
                  {r} {actionUser.user.role === r && '(current)'}
                </button>
              ))}
            </div>
            <button onClick={() => setActionUser(null)} className="mt-4 w-full py-2 text-sm text-[#64748b] hover:text-white transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {actionUser?.action === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={e => { if (e.target === e.currentTarget) setActionUser(null); }}>
          <div className="w-full max-w-sm bg-[#0f1317] border border-[#ef4444]/20 rounded-2xl p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#ef4444] text-[20px]">warning</span>
              </div>
              <div>
                <p className="font-semibold text-white">Delete User?</p>
                <p className="text-xs text-[#64748b] mt-0.5">{actionUser.user.name} · {actionUser.user.email}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setActionUser(null)} className="px-4 py-2 text-sm text-[#64748b] hover:text-white rounded-xl hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => handleDelete(actionUser.user._id)} className="px-4 py-2 text-sm bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold rounded-xl transition-all active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
