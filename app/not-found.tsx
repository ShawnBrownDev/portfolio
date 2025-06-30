'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 