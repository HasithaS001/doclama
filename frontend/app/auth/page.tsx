'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';
import AuthIllustration from '../components/AuthIllustration';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp, signInWithGoogle, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        const { error } = await signUp(email, password);
        if (error) throw error;
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google sign in');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Section - Hidden on mobile, visible on md and up */}
      <div className="hidden md:flex md:w-1/2 bg-[#f7f9fc] p-4 md:p-8 flex-col">
        <div className="flex-grow flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#4263eb] mb-2">PDF Chat</h1>
          <p className="text-gray-600 text-center mb-4 md:mb-8">Chat with your documents intelligently</p>
          <div className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] mb-4 md:mb-8">
            <AuthIllustration />
          </div>
          <p className="text-gray-500 text-center text-xs md:text-sm max-w-md">
            Upload your PDFs and start chatting with them. Get insights, summaries, and answers from your documents instantly.
          </p>
        </div>
      </div>

      {/* Right Section - Full width on mobile */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center">
        {/* Mobile logo - Only visible on small screens */}
        <div className="flex flex-col items-center mb-6 md:hidden">
          <h1 className="text-3xl font-bold text-[#4263eb] mb-2">PDF Chat</h1>
          <p className="text-gray-600 text-sm text-center">Chat with your documents intelligently</p>
        </div>
        
        <div className="max-w-md mx-auto w-full">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-[#4263eb] hover:text-[#2f4bc7] text-sm font-medium"
            >
              {mode === 'signin' ? 'Create account' : 'Sign in'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs md:text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4263eb] focus:border-transparent placeholder-gray-400"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs md:text-sm font-medium text-gray-700">Password</label>
                {mode === 'signin' && (
                  <Link href="/auth/reset-password" className="text-xs md:text-sm text-[#4263eb] hover:text-[#2f4bc7]">Forgot password?</Link>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4263eb] focus:border-transparent placeholder-gray-400"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4263eb] focus:border-transparent placeholder-gray-400"
                />
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#4263eb] focus:ring-[#4263eb] border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-xs md:text-sm text-gray-700">Remember me</label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#4263eb] text-white py-2.5 px-4 rounded-md hover:bg-[#2f4bc7] focus:outline-none focus:ring-2 focus:ring-[#4263eb] focus:ring-offset-2 text-sm font-medium"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs md:text-sm">
                <span className="px-2 bg-white text-gray-500">OR CONTINUE WITH</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              className="mt-4 w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" alt="Google" />
              Google
            </button>
          </div>

          <p className="mt-4 text-center text-xs md:text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <a href="#" className="text-[#4263eb] hover:text-[#2f4bc7]">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#4263eb] hover:text-[#2f4bc7]">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
