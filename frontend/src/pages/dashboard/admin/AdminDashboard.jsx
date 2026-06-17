import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const StatCard = ({ icon, label, value, sub, color, trend }) => (
  <div className="bg-[#111417] border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-4 hover:border-white/[0.12] transition-all animate-fade-in-up">
    <div className="flex items-start justify-between">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color + '1a', border: `1px solid ${color}25` }}>
        <span className="material-symbols-outlined text-[22px]" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-3xl font-bold text-white tracking-tight">{value ?? '—'}</p>
      <p className="text-sm font-medium text-[#64748b] mt-0.5">{label}</p>
      {sub && <p className="text-xs text-[#334155] mt-1">{sub}</p>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [topViewed, setTopViewed] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/overview').catch(() => ({ data: { data: null } })),
      api.get('/analytics/top-viewed?limit=5').catch(() => ({ data: { data: [] } })),
      api.get('/users?limit=5').catch(() => ({ data: { data: [] } })),
    ]).then(([ov, tv, us]) => {
      setOverview(ov.data?.data || { totalUsers: 0, totalActs: 0, totalSections: 0, totalSearches: 0, totalBookmarks: 0, totalNotes: 0 });
      setTopViewed(tv.data?.data || []);
      setRecentUsers(Array.isArray(us.data?.data) ? us.data.data.slice(0, 5) : []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: 'group', label: 'Total Users', value: overview?.totalUsers, color: '#7c4dff', trend: 12 },
    { icon: 'gavel', label: 'Active Acts', value: overview?.totalActs, color: '#c9a84c', trend: 0 },
    { icon: 'receipt_long', label: 'Total Sections', value: overview?.totalSections?.toLocaleString('en-IN'), color: '#38bdf8', trend: 5 },
    { icon: 'search', label: 'Total Searches', value: overview?.totalSearches?.toLocaleString('en-IN'), color: '#22c55e', trend: 23 },
    { icon: 'bookmark_added', label: 'Bookmarks', value: overview?.totalBookmarks, color: '#f97316', trend: 8 },
    { icon: 'edit_document', label: 'Notes Created', value: overview?.totalNotes, color: '#a855f7', trend: 15 },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0d0f] text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-[#c9a84c]/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7c4dff]/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs font-semibold text-[#22c55e] uppercase tracking-widest">Live Admin Console</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-[#64748b] text-sm mt-1">Platform overview and management hub</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 px-4 py-2 bg-[#7c4dff]/10 border border-[#7c4dff]/30 text-[#7c4dff] text-sm font-semibold rounded-xl hover:bg-[#7c4dff]/20 transition-all">
              <span className="material-symbols-outlined text-[16px]">manage_accounts</span> Manage Users
            </button>
            <button onClick={() => navigate('/admin/acts')} className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-black text-sm font-semibold rounded-xl hover:bg-[#b8963e] transition-all shadow-lg shadow-[#c9a84c]/20">
              <span className="material-symbols-outlined text-[16px]">add</span> Add Act
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-36 rounded-2xl bg-white/[0.03] animate-shimmer" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((s, i) => <StatCard key={i} {...s} />)}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Viewed Sections */}
          <div className="animate-fade-in-up delay-200 bg-[#111417] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c9a84c] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                <h2 className="font-semibold text-white text-sm">Top Viewed Sections</h2>
              </div>
              <button onClick={() => navigate('/admin/sections')} className="text-xs text-[#64748b] hover:text-[#c9a84c] transition-colors">View all →</button>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {topViewed.length === 0 ? (
                <div className="px-6 py-8 text-center text-[#475569] text-sm">No data available</div>
              ) : topViewed.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-[#334155] w-5 flex-shrink-0">#{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{s.sectionTitle || s.title}</p>
                      <p className="text-xs text-[#64748b]">{s.actCode} § {s.sectionNumber}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#c9a84c] flex-shrink-0 ml-4">{s.viewCount?.toLocaleString() || 0} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="animate-fade-in-up delay-300 bg-[#111417] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
              <span className="material-symbols-outlined text-[#7c4dff] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <h2 className="font-semibold text-white text-sm">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Manage Users', icon: 'group', path: '/admin/users', color: '#7c4dff' },
                { label: 'Acts & Codes', icon: 'gavel', path: '/admin/acts', color: '#c9a84c' },
                { label: 'Sections', icon: 'receipt_long', path: '/admin/sections', color: '#38bdf8' },
                { label: 'Analytics', icon: 'monitoring', path: '/admin/analytics', color: '#22c55e' },
                { label: 'Search Logs', icon: 'manage_search', path: '/admin/search-logs', color: '#f97316' },
                { label: 'User Stats', icon: 'bar_chart', path: '/admin/analytics', color: '#a855f7' },
              ].map(({ label, icon, path, color }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.03] transition-all text-left group"
                >
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <span className="text-sm font-medium text-[#94a3b8] group-hover:text-white transition-colors">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
