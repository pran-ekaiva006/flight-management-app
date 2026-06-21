'use client';

import React, { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {status === 'success' ? (
        <div className="w-full text-center py-4 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium text-sm animate-fade-in backdrop-blur-md">
          <p className="text-base mb-1">🎉 Subscription Active!</p>
          <p className="text-xs text-emerald-400/80 font-light">Check your inbox soon for exclusive premium flight deals.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email for price drops"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            required
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md text-sm transition-all outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            {status === 'loading' ? 'Joining...' : 'Get Deals'}
          </button>
        </form>
      )}
    </div>
  );
}
