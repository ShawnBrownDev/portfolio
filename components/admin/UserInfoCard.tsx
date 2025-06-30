'use client';

import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNotification } from '@/contexts/NotificationContext';
import { User } from '@supabase/supabase-js';

export function UserInfoCard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        console.error('Error fetching user:', err);
        showNotification('error', 'Failed to fetch user data');
      } finally {
        setLoading(false);
}
    }

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [showNotification]);

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 animate-pulse">
        <div className="h-8 bg-[#333] rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-[#333] rounded w-2/3"></div>
      </div>
    );
  }

  if (!user) {
  return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <p className="text-gray-400">Please sign in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Mail className="w-6 h-6 text-blue-500" />
      </div>
      <div>
          <h3 className="text-white font-medium">User Email</h3>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>
    </div>
  );
} 