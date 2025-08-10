'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NotificationProvider, useNotification } from '@/contexts/NotificationContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

function ResetPasswordConfirmPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();

  // Check if we have a valid reset link
  useEffect(() => {
    const allParams = Object.fromEntries(searchParams.entries());
    console.log('URL Parameters:', allParams);
    
    // Check for any auth-related parameters
    const hasAnyParams = Object.keys(allParams).length > 0;
    
    if (!hasAnyParams) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }
    
    setIsValidLink(true);
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Try to update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('Password update error:', error);
        setError(error.message);
        showNotification('error', error.message);
      } else {
        setSuccess(true);
        showNotification('success', 'Password updated successfully!');
      }
    } catch (error: any) {
      console.error('Password update error:', error);
      setError(error.message);
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Password updated!</h1>
            <p className="text-muted-foreground text-sm">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>
          
          <Link
            href="/login"
            className="block w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (error && !isValidLink) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Invalid reset link</h1>
            <p className="text-muted-foreground text-sm mb-4">
              {error}
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/reset-password"
              className="block w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Request new reset link
            </Link>
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
          <h1 className="text-2xl font-semibold text-foreground mb-2">Set new password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your new password below.
          </p>
          
          {/* Debug info - remove this in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-300">
              <p>Debug Info:</p>
              <p>URL Params: {JSON.stringify(Object.fromEntries(searchParams.entries()))}</p>
              <p>Valid Link: {isValidLink ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors pr-10"
                placeholder="Enter new password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors pr-10"
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordConfirmWrapper() {
  return (
    <NotificationProvider>
      <ResetPasswordConfirmPage />
    </NotificationProvider>
  );
} 