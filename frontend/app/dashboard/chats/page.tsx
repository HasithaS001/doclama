'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import axios from 'axios';
import {
  FiMessageSquare,
  FiTrash2,
  FiSearch,
  FiChevronRight,
  FiFile
} from 'react-icons/fi';
import { format } from 'date-fns';
import Link from 'next/link';

interface ChatSession {
  id: string;
  docId: string;
  docName: string;
  docType: string;
  createdAt: string;
  messageCount: number;
  lastMessage: string;
  chatSessionId: number;
}

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export default function Chats() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Load chat sessions
  useEffect(() => {
    if (user?.id) {
      loadChatSessions();
    }
  }, [user]);

  const loadChatSessions = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', content: '' }); // Clear any previous messages

      console.log('Loading chat sessions for user:', user?.id);
      const response = await axios.get(`http://localhost:5000/api/chat-sessions/${user?.id}`);

      if (response.data && response.data.sessions) {
        console.log('Loaded sessions:', response.data.sessions.length);
        setChatSessions(response.data.sessions);
      } else {
        console.log('No sessions found or empty response');
        setChatSessions([]);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setChatSessions([]); // Set empty array to prevent undefined errors
      setMessage({
        type: 'error',
        content: 'Failed to load chat sessions. Please try refreshing the page.'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId: number) => {
    try {
      setLoading(true);
      setMessage({ type: '', content: '' }); // Clear any previous messages

      console.log('Loading messages for session:', sessionId);
      const response = await axios.get(`http://localhost:5000/api/chat-session/${sessionId}/messages`);

      console.log('Response:', response.data);

      if (response.data) {
        console.log('Loaded messages:', response.data);
        setSessionMessages(response.data.messages);
      } else {
        console.log('No messages found or empty response');
        setSessionMessages([]);
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
      setSessionMessages([]); // Set empty array to prevent undefined errors
      setMessage({
        type: 'error',
        content: 'Failed to load chat messages. Please try selecting a different chat.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = async (session: ChatSession) => {
    setSelectedSession(session);
    await loadSessionMessages(session.chatSessionId);
  };

  const handleDeleteSessions = async () => {
    if (!selectedSessions.length) return;

    try {
      setIsDeleting(true);
      setMessage({
        type: 'info',
        content: 'Deleting selected chats...'
      });

      await axios.delete('http://localhost:5000/api/chat-history', {
        data: { chatIds: selectedSessions }
      });

      setChatSessions(chatSessions.filter(session => !selectedSessions.includes(session.id)));
      setSelectedSessions([]);
      setMessage({
        type: 'success',
        content: 'Chats deleted successfully'
      });

      // If the selected session was deleted, clear it
      if (selectedSession && selectedSessions.includes(selectedSession.id)) {
        setSelectedSession(null);
        setSessionMessages([]);
      }
    } catch (error) {
      console.error('Error deleting chats:', error);
      setMessage({
        type: 'error',
        content: 'Failed to delete chats'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions(prev =>
        prev.includes(sessionId)
            ? prev.filter(id => id !== sessionId)
            : [...prev, sessionId]
    );
  };

  const filteredSessions = chatSessions.filter(session =>
      (session.lastMessage && session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) ||
      session.docName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Chat sessions: ", chatSessions);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Chat History</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your previous conversations</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {selectedSessions.length > 0 && (
              <button
                onClick={handleDeleteSessions}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-800"
              >
                <FiTrash2 className="mr-2" />
                Delete Selected ({selectedSessions.length})
              </button>
            )}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Sessions List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Chat Sessions</h2>
              </div>
              
              {loading && !selectedSession && (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {!loading && filteredSessions.length === 0 && (
                <div className="p-6 text-center">
                  <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No chat sessions</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Start chatting with your documents to see your chat history here.
                  </p>
                  <div className="mt-6">
                    <Link href="/dashboard">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        <FiMessageSquare className="-ml-1 mr-2 h-5 w-5" />
                        Start Chatting
                      </button>
                    </Link>
                  </div>
                </div>
              )}
              
              {filteredSessions.length > 0 && (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                  {filteredSessions.map((session) => (

                    <li 
                      key={session.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                        selectedSessions.includes(session.id) ? 'bg-blue-50 dark:bg-blue-900' : ''
                      } ${selectedSession?.id === session.id ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                    >

                      <div className="flex items-center p-4" onClick={() => handleSessionClick(session)}>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center">
                            <div className="p-2 mr-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                              <FiFile className="text-blue-500" size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                                {session.docName || 'Untitled Document'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(session.createdAt), 'MMM d, yyyy h:mm a')}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[200px]">
                                {session.lastMessage || 'New chat'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {session.messageCount} {session.messageCount === 1 ? 'msg' : 'msgs'}
                          </span>
                          <div className="ml-4 flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={selectedSessions.includes(session.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleSessionSelection(session.id);
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                          </div>
                          <FiChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden h-full">
              {selectedSession ? (
                <>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-2 mr-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <FiFile className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {selectedSession.docName || 'Untitled Document'}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(selectedSession.createdAt), 'MMMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 overflow-y-auto max-h-[500px]">
                    {loading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : sessionMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No messages in this chat session.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {sessionMessages.map((msg, index) => (
                          <div key={msg.id} className="space-y-2">
                            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Question:</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{msg.question}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {format(new Date(msg.createdAt), 'h:mm a')}
                              </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Answer:</p>
                              <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">
                                {msg.answer}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href={`/dashboard?docId=${selectedSession.docId}`}>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        <FiMessageSquare className="mr-2 h-4 w-4" />
                        Continue Chat
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <FiMessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Select a chat session</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                    Choose a chat session from the list to view the conversation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
