'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiSave,
  FiSun,
  FiMoon,
  FiToggleLeft,
  FiToggleRight,
  FiSettings,
  FiLayout,
  FiKey
} from 'react-icons/fi';

export default function Settings() {
  const supabase = createClientComponentClient();
  const { user, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  // Initialize state with user data when component mounts
  useEffect(() => {
    if (user) {
      // Get display name from user metadata
      const userData = user.user_metadata as { display_name?: string };
      setDisplayName(userData?.display_name || user.email?.split('@')[0] || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Update the UI when user data changes
  useEffect(() => {
    const handleAuthStateChange = (event: string, session: any) => {
      if (event === 'USER_UPDATED' && session) {
        // Refresh user data when auth state changes
        if (user) {
          const userData = user.user_metadata as { display_name?: string };
          setDisplayName(userData?.display_name || user.email?.split('@')[0] || '');
          setEmail(user.email || '');
        }
      }
    };

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      await updateUserProfile(displayName);
      setMessage({ type: 'success', content: 'Profile updated successfully!' });
      
      // Refresh the page after a short delay to show updated profile info
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        content: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', content: 'Please enter a valid email address.' });
      setLoading(false);
      return;
    }

    try {
      await updateUserEmail(email);
      
      // Clear any previous error
      setMessage({ 
        type: 'success', 
        content: 'Email update initiated! Please check your inbox to confirm the change.' 
      });
      
      // Note: We don't update the UI immediately for email changes since they require confirmation
      // The user will need to confirm via email before the change takes effect
    } catch (error: any) {
      // Handle specific Supabase errors
      if (error.message?.includes('Email already registered')) {
        setMessage({ 
          type: 'error', 
          content: 'This email is already registered. Please use a different email address.' 
        });
      } else if (error.message?.includes('Invalid email')) {
        setMessage({ 
          type: 'error', 
          content: 'The email address format is invalid. Please check and try again.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          content: error.message || 'Failed to update email. Please try again.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    // Password validation
    if (newPassword.length < 6) {
      setMessage({ type: 'error', content: 'New password must be at least 6 characters long.' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', content: 'New passwords do not match.' });
      setLoading(false);
      return;
    }

    try {
      await updateUserPassword(currentPassword, newPassword);
      setMessage({ type: 'success', content: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        content: error.message || 'Failed to update password. Please check your current password.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <FiLayout /> },
    { id: 'profile', label: 'Profile Information', icon: <FiUser /> },
    { id: 'email', label: 'Email Address', icon: <FiMail /> },
    { id: 'password', label: 'Change Password', icon: <FiKey /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings</p>
          </div>
        </div>

        {message.content && (
          <div 
            className={`p-4 mb-6 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
              message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
              'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Modern Tab Switcher */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Appearance</h3>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    {theme === 'light' ? <FiSun className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" /> : <FiMoon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"
                  >
                    <span className="sr-only">Toggle theme</span>
                    <span
                      className={`${
                        theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-block h-6 w-11 rounded-full transition-colors ease-in-out duration-200`}
                    >
                      <span
                        className={`${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
                      />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Profile Information</h3>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Display Name
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 text-base sm:text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <FiSave className="mr-2 -ml-1 h-5 w-5" />
                      {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Email Address Tab */}
        {activeTab === 'email' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Email Address</h3>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleUpdateEmail}>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 text-base sm:text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <FiSave className="mr-2 -ml-1 h-5 w-5" />
                      {loading ? 'Saving...' : 'Update Email'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Change Password</h3>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleUpdatePassword}>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 text-base sm:text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                          placeholder="Current password"
                        />
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 text-base sm:text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                          placeholder="New password"
                        />
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 text-base sm:text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <FiSave className="mr-2 -ml-1 h-5 w-5" />
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
