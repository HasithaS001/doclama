'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import axios from 'axios';
import { format } from 'date-fns';
import { FiMessageSquare, FiFile, FiCalendar } from 'react-icons/fi';

interface ChatSession {
  id: string;
  doc_name: string;
  doc_type: string;
  created_at: string;
  last_message?: string;
  user_id: string;
}

export default function ChatSessions() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChatSessions();
    
    // Set up event listener for chat updates
    window.addEventListener('chatUpdated', () => {
      loadChatSessions();
    });
    
    return () => {
      window.removeEventListener('chatUpdated', () => {
        loadChatSessions();
      });
    };
  }, []);

  const loadChatSessions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5000/api/chat-sessions');
      if (response.data && response.data.sessions) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setError('Failed to load chat sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Chat Sessions</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No chat sessions yet</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start a conversation with a document to create your first chat session.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-6 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105 ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => window.location.href = `/dashboard?docId=${session.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FiFile className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-medium truncate">{session.doc_name}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {session.doc_type}
                  </span>
                </div>
                
                {session.last_message && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {session.last_message}
                  </p>
                )}
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiCalendar className="h-4 w-4 mr-1" />
                  {formatDate(session.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
