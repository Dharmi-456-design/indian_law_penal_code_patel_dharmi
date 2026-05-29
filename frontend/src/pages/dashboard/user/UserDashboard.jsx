import React from 'react';

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-4xl font-bold text-amber-500">LexIndia Legal Explorer</h1>
        <p className="text-slate-400">Welcome to your legal discovery dashboard.</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg bg-slate-800 p-6 shadow-md border border-slate-700">
          <h2 className="text-xl font-semibold mb-2">Browse Acts</h2>
          <p className="text-slate-400">Search through the Indian Penal Code, Civil Procedure Code, and more.</p>
        </div>
        <div className="rounded-lg bg-slate-800 p-6 shadow-md border border-slate-700">
          <h2 className="text-xl font-semibold mb-2">My Bookmarks</h2>
          <p className="text-slate-400">Access your saved legal sections and cases.</p>
        </div>
        <div className="rounded-lg bg-slate-800 p-6 shadow-md border border-slate-700">
          <h2 className="text-xl font-semibold mb-2">My Notes</h2>
          <p className="text-slate-400">View and edit personal annotations on sections.</p>
        </div>
      </main>
    </div>
  );
}
