'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AccountHeader({ uri }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://linkmatrix.vercel.app/${uri}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="md:sticky md:top-0 md:z-50 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Your Portfolio</h1>
        <div className="flex gap-2">
          <a
            href="/analytics"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </a>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-blue-100 text-sm">Your page is live at:</span>
        <div className="flex flex-1 items-center gap-2">
          <a
            href={`/${uri}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-lg text-white font-mono text-sm hover:bg-white/30 transition-all duration-200 break-all"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            linkmatrix.vercel.app/{uri}
          </a>
          <button
            onClick={copyToClipboard}
            className="flex-shrink-0 bg-white/20 backdrop-blur-sm p-2.5 rounded-lg text-white hover:bg-white/30 transition-all duration-200 relative group"
            title="Copy link"
          >
            {copied ? (
              <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {copied ? 'Copied!' : 'Copy link'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
