'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const { signUp, signInWithGoogle } = useAuth();

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
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
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSocialLoading('google');
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign in');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create account</h2>
        <p className="text-gray-500">Sign up to get started with PDF Chat</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={!!socialLoading}
        className="w-full bg-white border border-gray-200 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center mb-6 shadow-sm"
      >
        {socialLoading === 'google' ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-gray-400 border-r-transparent"></div>
        ) : (
          <>
            <FaGoogle className="h-5 w-5 mr-3 text-red-500" />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </>
        )}
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-400">or</span>
        </div>
      </div>

      <form onSubmit={handleSignUp} className="space-y-5">
        <div>
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            placeholder="••••••••"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
        </div>

        <div>
          <div className="mb-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
          </div>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md mt-2"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mx-auto"></div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
}
