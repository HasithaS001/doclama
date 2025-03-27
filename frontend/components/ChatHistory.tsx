'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiChevronRight, FiClock, FiFile } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface ChatHistoryProps {
  onSelectChat: (pdfId: string, messages: any[]) => void;
}

interface ChatSession {
  pdfId: string;
  pdfName: string;
  lastChatTime: string;
  chats: {
    id: string;
    question: string;
    answer: string;
    createdAt: string;
  }[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onSelectChat }) => {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`http://localhost:5000/api/chat-history/${user.id}`);
        console.log('Chat history response:', response.data);
        setChatHistory(response.data.chatHistory || []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setError('Failed to load chat history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatHistory();
  }, [user]);

  const handleSelectChat = async (pdfId: string) => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log(`Fetching chat details for document: ${pdfId}`);
      const response = await axios.get(`http://localhost:5000/api/chat-history/${user.id}/${pdfId}`);
      console.log('Chat details response:', response.data);
      const chats = response.data.chats || [];
      
      // Convert to the format expected by the chat component
      const messages = chats.map((chat: { question: string; answer: string }) => [
        { role: 'user', content: chat.question },
        { role: 'assistant', content: chat.answer }
      ]).flat();
      
      onSelectChat(pdfId, messages);
    } catch (error) {
      console.error('Error fetching chat details:', error);
      setError('Failed to load chat details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Chat History</h2>
      
      {loading && <p className="text-gray-500">Loading chat history...</p>}
      
      {error && (
        <div className="mb-4">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      )}
      
      {!loading && !error && chatHistory.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No chat history found</p>
          <p className="text-gray-400 text-sm">Start chatting with a PDF to see your history here</p>
        </div>
      )}
      
      {!loading && !error && chatHistory.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          {chatHistory.map((item: any) => (
            <div 
              key={item.pdfId}
              className="border rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectChat(item.pdfId)}
            >
              <h3 className="font-medium">{item.pdfName}</h3>
              <p className="text-sm text-gray-500">
                Last chat: {formatDate(item.lastChatTime)}
              </p>
              <p className="text-sm text-gray-600 mt-2 truncate">
                {item.chats.length > 0 ? item.chats[0].question : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
