'use client';

import { Layout, LogOut, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';

interface NavbarProps {
  supabase: SupabaseClient;
}

export function Navbar({ supabase }: NavbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (error) {
    }
  };

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#333] px-6 py-4">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layout className="w-6 h-6 text-white" />
          <h1 className="text-xl font-semibold text-white">Portfolio Admin</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span>View Site</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 