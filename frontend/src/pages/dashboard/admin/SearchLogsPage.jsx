import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-[#111417] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3 hover:border-white/[0.12] transition-all animate-fade-in-up">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '1a', border: `1px solid ${color}25` }}>
        <span className="material-symbols-outlined text-[20px]" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <span className="text-sm font-medium text-[#64748b]">{label}</span>
    </div>
    <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
  </div>
);

export default function SearchLogsPage() {
  const [logs, setLogs] = useState([]);
  const [topQueries, setTopQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [limit] = useState(10);

  // Stats
  const [stats, setStats] = useState({
    totalSearches: 0,
    zeroResultSearches: 0,
    uniqueQueries: 0
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 400);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // Fetch search logs & top queries
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/analytics/search-logs?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`),
      api.get('/analytics/top-queries?limit=5').catch(() => ({ data: { data: [] } })),
      api.get('/analytics/search-trends?days=7').catch(() => ({ data: { data: [] } }))
    ])
      .then(([logsRes, topQueriesRes, trendsRes]) => {
        const logsData = logsRes.data?.data || [];
        const meta = logsRes.data?.meta || {};
        setLogs(logsData);
        setTotalPages(meta.totalPages || 1);
        setTotalLogs(meta.total || 0);

        setTopQueries(topQueriesRes.data?.data || []);

        // Calculate basic local metrics
        const total = meta.total || logsData.length;
        const zeroResults = logsData.filter(log => log.resultsCount === 0).length;
        
        setStats({
          totalSearches: total,
          zeroResultSearches: zeroResults,
          uniqueQueries: topQueriesRes.data?.data?.length || 0
        });
      })
      .catch((err) => {
        console.error('Failed to load search logs data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, debouncedSearch]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0d0f] text-white">
      {/* Ambient background decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-[#c9a84c]/[0.02] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7c4dff]/[0.02] blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Search Logs & Queries</h1>
            <p className="text-[#64748b] text-sm mt-1">Audit and analyze search intelligence across the platform</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search query, act, or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111417] border border-white/[0.07] focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 rounded-xl text-sm text-white placeholder-[#475569] outline-none transition-all"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon="search" label="Total Audited Searches" value={totalLogs} color="#c9a84c" />
          <StatCard icon="search_off" label="Queries with Zero Results" value={stats.zeroResultSearches} color="#ef4444" />
          <StatCard icon="trending_up" label="Top Performing Keywords" value={stats.uniqueQueries} color="#7c4dff" />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Logs Table */}
          <div className="lg:col-span-8 bg-[#111417] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col h-[580px] animate-fade-in-up delay-150">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">Recent Queries Log</h2>
              <span className="text-xs text-[#64748b] bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.05]">
                Page {page} of {totalPages}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="w-full h-full flex flex-col justify-center items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-t-[#c9a84c] border-white/10 animate-spin" />
                  <p className="text-xs text-[#64748b]">Loading search history...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="w-full h-full flex flex-col justify-center items-center text-[#475569] py-12">
                  <span className="material-symbols-outlined text-[48px] mb-2">find_in_page</span>
                  <p className="text-sm font-medium">No matching search logs found.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04] text-[11px] text-[#475569] uppercase tracking-wider bg-white/[0.01]">
                      <th className="px-6 py-3.5 font-semibold">User</th>
                      <th className="px-6 py-3.5 font-semibold">Query</th>
                      <th className="px-6 py-3.5 font-semibold">Act</th>
                      <th className="px-6 py-3.5 font-semibold">Results</th>
                      <th className="px-6 py-3.5 font-semibold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {logs.map((log) => {
                      const userInitials = log.userId?.name 
                        ? log.userId.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                        : 'GS';
                      
                      return (
                        <tr key={log._id} className="hover:bg-white/[0.01] transition-colors text-sm">
                          {/* User Column */}
                          <td className="px-6 py-3.5 max-w-[180px]">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.05] text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                                {userInitials}
                              </div>
                              <div className="truncate min-w-0">
                                <p className="font-medium text-white truncate leading-tight">{log.userId?.name || 'Guest User'}</p>
                                <p className="text-xs text-[#64748b] truncate mt-0.5">{log.userId?.email || 'Anonymous'}</p>
                              </div>
                            </div>
                          </td>

                          {/* Query Column */}
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#64748b] text-[16px]">manage_search</span>
                              <span className="font-mono text-xs text-white max-w-[200px] truncate">{log.query}</span>
                            </div>
                          </td>

                          {/* Act Badge Column */}
                          <td className="px-6 py-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              log.actCode === 'GLOBAL'
                                ? 'bg-white/5 text-white border-white/10'
                                : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20'
                            }`}>
                              {log.actCode || 'GLOBAL'}
                            </span>
                          </td>

                          {/* Results Count Column */}
                          <td className="px-6 py-3.5">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              log.resultsCount > 0 
                                ? 'bg-[#22c55e]/10 text-[#22c55e]' 
                                : 'bg-[#ef4444]/10 text-[#ef4444]'
                            }`}>
                              {log.resultsCount ?? 0} matches
                            </span>
                          </td>

                          {/* Timestamp Column */}
                          <td className="px-6 py-3.5 text-xs text-[#64748b] font-mono">
                            {log.createdAt ? new Date(log.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination footer */}
            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
              <p className="text-xs text-[#475569]">
                Showing {logs.length} of {totalLogs} search actions
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1 || loading}
                  className="px-3 py-1.5 border border-white/[0.07] hover:border-white/[0.15] bg-[#111417] text-xs font-semibold text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages || loading}
                  className="px-3 py-1.5 border border-white/[0.07] hover:border-white/[0.15] bg-[#111417] text-xs font-semibold text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Top Queries */}
          <div className="lg:col-span-4 bg-[#111417] border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-6 h-[580px] animate-fade-in-up delay-250">
            <div>
              <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7c4dff] text-[18px]">trending_up</span>
                Popular Keywords
              </h2>
              <p className="text-xs text-[#64748b] mt-1">Most frequently searched keywords on LexIndia</p>
            </div>

            <div className="flex-1 divide-y divide-white/[0.04] overflow-y-auto">
              {topQueries.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-[#475569] text-xs">
                  No query data recorded yet
                </div>
              ) : (
                topQueries.map((q, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-[#334155] w-5 flex-shrink-0">#{idx + 1}</span>
                      <span className="font-mono text-xs text-white truncate">{q.query}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#7c4dff] bg-[#7c4dff]/10 border border-[#7c4dff]/20 px-2.5 py-0.5 rounded-full">
                      {q.count} searches
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-[#c9a84c] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                Admin Insights
              </h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Zero-result logs indicate legal terms users expect that didn't match sections. Use this data to add synonyms or expand your indexed Acts database.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
