'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const supabase = createClientComponentClient();

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Clear form
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  // Check if we have a valid session when the component mounts
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      // If no session and no code in URL, redirect to login
      if (!data.session && !searchParams.get('code')) {
        router.push('/auth');
      }
    };
    
    checkSession();
  }, [router, searchParams, supabase.auth]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto border border-gray-100">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <FiCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Password updated</h3>
              <p className="text-gray-500 mb-4">
                Your password has been reset successfully. You will be redirected to the login page.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset password</h2>
                <p className="text-gray-500">Create a new password for your account</p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div>
                  <div className="mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                </div>

                <div>
                  <div className="mb-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md mt-4"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mx-auto"></div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
