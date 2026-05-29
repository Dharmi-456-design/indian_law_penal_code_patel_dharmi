import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
      <p className="text-xl text-slate-300 mb-6">Page Not Found</p>
      <Link to="/" className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-600">
        Go Back Home
      </Link>
    </div>
  );
}
