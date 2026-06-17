import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const MetricCard = ({ icon, label, value, color, sub }) => (
  <div className="bg-[#111417] border border-white/[0.07] rounded-2xl p-5 animate-fade-in-up hover:border-white/[0.12] transition-all">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '1a', border: `1px solid ${color}25` }}>
        <span className="material-symbols-outlined text-[18px]" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <span className="text-xs text-[#64748b] font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
    {sub && <p className="text-xs text-[#475569] mt-1">{sub}</p>}
  </div>
);

const BarChart = ({ data, color, maxVal }) => (
  <div className="flex items-end gap-1.5 h-32">
    {data.map((item, i) => {
      const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
      return (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="relative w-full rounded-t-lg transition-all duration-500" style={{ height: `${Math.max(pct, 4)}%`, background: color + '60', border: `1px solid ${color}40` }}>
            <div className="absolute inset-x-0 top-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ height: '100%', background: color + '20' }} />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#1a1d20] px-1.5 py-0.5 rounded">
              {item.value}
            </div>
          </div>
          <span className="text-[9px] text-[#475569] truncate w-full text-center">{item.label}</span>
        </div>
      );
    })}
  </div>
);

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [actDist, setActDist] = useState([]);
  const [topViewed, setTopViewed] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [searchTrends, setSearchTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/overview').catch(() => null),
      api.get('/analytics/acts').catch(() => null),
      api.get('/analytics/top-viewed?limit=8').catch(() => null),
      api.get('/analytics/users').catch(() => null),
      api.get('/analytics/search-trends').catch(() => null),
    ]).then(([ov, ad, tv, ug, st]) => {
      setOverview(ov?.data?.data || null);
      setActDist(ad?.data?.data || []);
      setTopViewed(tv?.data?.data || []);
      setUserGrowth(ug?.data?.data || []);
      setSearchTrends(st?.data?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const actChartData = actDist.slice(0, 8).map(a => ({ label: a.actCode, value: a.sectionCount || a.count || 0 }));
  const maxAct = Math.max(...actChartData.map(d => d.value), 1);

  const growthData = userGrowth.slice(-8).map(d => ({ label: d.month || d.date || '', value: d.count || d.newUsers || 0 }));
  const maxGrowth = Math.max(...growthData.map(d => d.value), 1);

  const trendData = searchTrends.slice(-8).map(d => ({ label: d.date || d.month || '', value: d.count || d.searches || 0 }));
  const maxTrend = Math.max(...trendData.map(d => d.value), 1);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0a0d0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[#c9a84c] text-5xl animate-spin">refresh</span>
          <p className="text-[#64748b] text-sm">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0d0f] text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-[#64748b] text-sm mt-1">Platform performance and usage metrics</p>
        </div>

        {/* Overview metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon="group" label="Total Users" value={overview?.totalUsers?.toLocaleString('en-IN')} color="#7c4dff" sub="Registered accounts" />
          <MetricCard icon="gavel" label="Active Acts" value={overview?.totalActs} color="#c9a84c" sub="Legal codes indexed" />
          <MetricCard icon="receipt_long" label="Sections" value={overview?.totalSections?.toLocaleString('en-IN')} color="#38bdf8" sub="Total sections" />
          <MetricCard icon="search" label="Searches" value={overview?.totalSearches?.toLocaleString('en-IN')} color="#22c55e" sub="All-time searches" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Act Distribution */}
          <div className="animate-fade-in-up delay-200 bg-[#111417] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[#c9a84c] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
              <h2 className="font-semibold text-white text-sm">Sections by Act</h2>
            </div>
            {actChartData.length > 0 ? (
              <BarChart data={actChartData} color="#c9a84c" maxVal={maxAct} />
            ) : (
              <div className="h-32 flex items-center justify-center text-[#475569] text-sm">No data available</div>
            )}
          </div>

          {/* User Growth */}
          <div className="animate-fade-in-up delay-300 bg-[#111417] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[#7c4dff] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              <h2 className="font-semibold text-white text-sm">User Growth</h2>
            </div>
            {growthData.length > 0 ? (
              <BarChart data={growthData} color="#7c4dff" maxVal={maxGrowth} />
            ) : (
              <div className="h-32 flex items-center justify-center text-[#475569] text-sm">No data available</div>
            )}
          </div>

          {/* Search Trends */}
          <div className="animate-fade-in-up delay-400 bg-[#111417] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[#22c55e] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
              <h2 className="font-semibold text-white text-sm">Search Trends</h2>
            </div>
            {trendData.length > 0 ? (
              <BarChart data={trendData} color="#22c55e" maxVal={maxTrend} />
            ) : (
              <div className="h-32 flex items-center justify-center text-[#475569] text-sm">No data available</div>
            )}
          </div>

          {/* Top Viewed Sections */}
          <div className="animate-fade-in-up delay-500 bg-[#111417] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#f97316] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
              <h2 className="font-semibold text-white text-sm">Top Viewed Sections</h2>
            </div>
            {topViewed.length === 0 ? (
              <div className="py-8 text-center text-[#475569] text-sm">No data available</div>
            ) : (
              <div className="space-y-2">
                {topViewed.slice(0, 6).map((s, i) => {
                  const maxViews = topViewed[0]?.viewCount || 1;
                  const pct = ((s.viewCount || 0) / maxViews) * 100;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-[#334155] w-4 flex-shrink-0">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-white truncate">{s.sectionTitle || s.title || 'Untitled'}</span>
                          <span className="text-[10px] text-[#f97316] font-semibold ml-2 flex-shrink-0">{(s.viewCount || 0).toLocaleString()}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                          <div className="h-full rounded-full bg-[#f97316]/60 transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
