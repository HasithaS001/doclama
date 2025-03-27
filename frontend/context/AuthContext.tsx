'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updateEmail: (email: string) => Promise<{ error: any | null }>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<{ success: boolean, message: string }>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  };

  const updateEmail = async (email: string) => {
    const { error } = await supabase.auth.updateUser({ email });
    return { error };
  };

  const updateUserProfile = async (displayName: string) => {
    try {
      // Update user metadata in Supabase Auth
      const { data, error: authError } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });
      
      if (authError) throw authError;
      
      // Update local user state to reflect changes immediately
      if (data && data.user) {
        setUser(data.user);
      }
      
      // If user exists, also update the profile in the database
      if (user) {
        const { error: dbError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            display_name: displayName,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        
        if (dbError) {
          console.error('Error updating profile in database:', dbError);
          // Don't throw here as auth update was successful
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateUserEmail = async (email: string) => {
    try {
      // Update email in Supabase Auth
      const { data, error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      // Note: Email updates require confirmation, so we don't update the local state immediately
      // Instead, we show a message to the user to check their email
      
      // Log the update request
      console.log('Email update requested:', email);
      console.log('Confirmation email sent to user');
      
      // We don't update the profiles table here since the email isn't confirmed yet
      // The email will be updated in Auth and profiles after confirmation
      
      return { success: true, message: 'Confirmation email sent' };
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword
      });
      
      if (signInError) {
        console.error('Current password verification failed:', signInError);
        throw new Error('Current password is incorrect');
      }
      
      // If verification successful, update the password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    signInWithGoogle,
    resetPassword,
    updateEmail,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
