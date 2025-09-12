'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { NotificationProvider, useNotification } from '@/contexts/NotificationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!supabase) {
      showNotification('error', 'Authentication is not configured.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm?type=recovery`,
      });

      if (error) throw error;

      setSent(true);
      showNotification('success', 'Password reset email sent! Check your inbox.');
    } catch (error: any) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Check your email</h1>
            <p className="text-muted-foreground text-sm">
              We have sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setSent(false)}
              className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Try again
            </button>
            <Link
              href="/login"
              className="block w-full px-4 py-2 border border-[#333] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors text-sm font-medium"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] mx-auto">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Reset your password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
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
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordWrapper() {
  return (
    <NotificationProvider>
      <ResetPasswordPage />
    </NotificationProvider>
  );
} 