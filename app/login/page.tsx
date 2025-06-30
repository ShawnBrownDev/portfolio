'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { NotificationProvider, useNotification } from '@/contexts/NotificationContext';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!supabase) {
      setError('Authentication is not configured.');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session) {
      showNotification('success', 'Successfully logged in!');
        router.push('/dashboard');
      } else {
        throw new Error('No session created after login');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message);
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Login now!</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back! Please login to access your admin dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-input bg-muted text-primary focus:ring-1 focus:ring-ring"
                disabled={loading}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            <a 
              href="#" 
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          {error && (
            <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginWrapper() {
  return (
    <NotificationProvider>
      <LoginPage />
    </NotificationProvider>
  );
} 