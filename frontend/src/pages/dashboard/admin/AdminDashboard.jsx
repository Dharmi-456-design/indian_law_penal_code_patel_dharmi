import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-4xl font-bold text-amber-500">LexIndia Admin Console</h1>
        <p className="text-slate-400">Manage acts, sections, users, and view platform statistics.</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-lg bg-slate-800 p-6 shadow-md border border-slate-700">
          <h2 className="text-sm font-semibold text-slate-400 uppercase">Total Sections</h2>
          <p className="text-3xl font-bold mt-2">2,043+</p>
        </div>
        <div className="rounded-lg bg-slate-800 p-6 shadow-md border border-slate-700">
          <h2 className="text-sm font-semibold text-slate-400 uppercase">Total Users</h2>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="rounded-lg bg-slate-800 p-6 shadow-md border border-slate-700">
          <h2 className="text-sm font-semibold text-slate-400 uppercase">Total Bookmarks</h2>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="rounded-lg bg-slate-800 p-6 shadow-md border border-slate-700">
          <h2 className="text-sm font-semibold text-slate-400 uppercase">Audit Logs</h2>
          <p className="text-3xl font-bold mt-2">View Logs</p>
        </div>
      </main>
    </div>
  );
}
