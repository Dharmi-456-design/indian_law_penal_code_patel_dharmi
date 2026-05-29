import React from 'react';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-amber-500">LexIndia Login</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-slate-300">Email Address</label>
          <input className="w-full rounded bg-slate-700 p-2 text-white outline-none focus:ring-2 focus:ring-amber-500" type="email" placeholder="email@example.com" />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-slate-300">Password</label>
          <input className="w-full rounded bg-slate-700 p-2 text-white outline-none focus:ring-2 focus:ring-amber-500" type="password" placeholder="••••••••" />
        </div>
        <button className="w-full rounded bg-amber-500 py-2 font-semibold text-slate-950 transition hover:bg-amber-600">
          Sign In
        </button>
      </div>
    </div>
  );
}
