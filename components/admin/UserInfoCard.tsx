'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNotification } from '@/contexts/NotificationContext';
import { User as SupabaseUser } from '@supabase/supabase-js';

export function UserInfoCard() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
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
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-700 rounded w-32"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!user) {
  return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-white font-medium">Authentication Required</h3>
            <p className="text-gray-400 text-sm">Please sign in to access the dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      {/* User Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Admin User</h3>
          <p className="text-gray-400 text-sm">Portfolio Manager</p>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
          <Mail className="w-4 h-4 text-blue-400" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user.email}</p>
            <p className="text-gray-400 text-xs">Email Address</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
          <Calendar className="w-4 h-4 text-green-400" />
          <div>
            <p className="text-white text-sm font-medium">
              {formatDate(user.created_at)}
            </p>
            <p className="text-gray-400 text-xs">Member Since</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
          <Shield className="w-4 h-4 text-purple-400" />
      <div>
            <p className="text-white text-sm font-medium">
              {user.email_confirmed_at ? 'Verified' : 'Unverified'}
            </p>
            <p className="text-gray-400 text-xs">Account Status</p>
          </div>
        </div>
      </div>
    </div>
  );
} 