'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Link from 'next/link';
import ChatHistory from '../../components/ChatHistory';
import mammoth from 'mammoth';
import VoiceInput from '../components/VoiceInput';
import { 
  FiFile, 
  FiMessageSquare, 
  FiUpload, 
  FiSearch, 
  FiTable, 
  FiClock, 
  FiX, 
  FiMenu, 
  FiLogOut, 
  FiMinimize, 
  FiMaximize, 
  FiZoomIn, 
  FiZoomOut, 
  FiCheck,
  FiDownload,
  FiExternalLink,
  FiHome,
  FiUser,
  FiSend,
  FiTrash2,
  FiFileText,
  FiGrid,
  FiSun,
  FiMoon,
  FiSettings,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
  FiFilePlus,
  FiGlobe,
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import DocxViewer from '../components/DocxViewer';
import { supabase } from '../../lib/supabase';

// Declare global type for Document store
declare global {
  interface Window {
    docStore: Document[];
  }
}

// Initialize global docStore if it doesn't exist
if (typeof window !== 'undefined') {
  window.docStore = window.docStore || [];
}

// Define types
type DocumentType = 'pdf' | 'word' | 'web';
type ViewMode = 'pdf' | 'word' | 'web';
type TabType = 'chat' | 'search' | 'document';

interface Document {
  id: string;
  filename: string;
  type: DocumentType;
  url?: string;
  content?: string;
  created_at?: string;
  metadata?: {
    title?: string;
    url?: string;
    summary?: string;
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatMessage {
  question: string;
  answer: string;
}

interface SearchResult {
  line: number;
  content: string;
  context: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// Update the document preview component
const DocumentPreview = ({ document }: { document: Document | null }) => {
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    // Reset iframe error state when document changes
    setIframeError(false);
  }, [document]);

  if (!document) {
    return (
      <div className="flex h-full">
        {/* Left side - No document selected */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-64 h-64 mb-6">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect width="200" height="200" rx="100" fill="#F9FAFB" className="dark:fill-gray-800" />
                <rect x="60" y="55" width="80" height="100" rx="4" fill="white" className="dark:fill-gray-700" stroke="#6366F1" strokeWidth="3" />
                <path d="M75 85H125M75 105H125M75 125H105" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
                <path d="M100 55V45M80 55V45M120 55V45" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
                <circle cx="150" cy="70" r="10" fill="#EEF2FF" className="dark:fill-indigo-900/30" stroke="#6366F1" strokeWidth="2" />
                <circle cx="45" cy="100" r="8" fill="#EEF2FF" className="dark:fill-indigo-900/30" stroke="#6366F1" strokeWidth="2" />
                <circle cx="140" cy="140" r="6" fill="#EEF2FF" className="dark:fill-indigo-900/30" stroke="#6366F1" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-center mb-2">No document selected</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              Upload a document or select one from the sidebar to start chatting
            </p>
          </div>
        </div>
        
        {/* Right side - Empty chat state */}
        <div className="w-1/2">
          <EmptyChatState />
        </div>
      </div>
    );
  }

  if (document.type === 'pdf') {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-gray-100 p-2 flex justify-between items-center">
          <span className="text-sm font-medium truncate">{document.filename}</span>
          <a 
            href={document.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Open in new tab
          </a>
        </div>
        <div className="flex-grow bg-white">
          <iframe
            src={document.url}
            className="w-full h-full border-0"
            title={document.filename}
          />
        </div>
      </div>
    );
  }

  if (document.type === 'word') {
    if (!document.url) {
      return <div>Error: Document URL not found</div>;
    }
    return (
      <DocxViewer url={document.url || ''} filename={document.filename} />
    );
  }

  if (document.type === 'web') {
    if (iframeError) {
      // Fallback view for web articles when iframe fails to load
      return (
        <div className="h-full overflow-auto p-4">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold">{document.filename}</h2>
            <a 
              href={document.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              {document.url}
            </a>
          </div>
          
          {document.content ? (
            <div className="whitespace-pre-line">
              {document.content}
            </div>
          ) : (
            <div className="text-gray-500 italic">
              No content available for this web article.
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="h-full relative">
        <div className="absolute top-0 right-0 z-10 p-2">
          <button
            onClick={() => setIframeError(true)}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 p-1 rounded text-xs"
            title="View as text"
          >
            <FiFileText className="text-sm" />
          </button>
        </div>
        <iframe
          src={document.url || ''}
          className="w-full h-full border-0"
          title={document.filename}
          onError={() => setIframeError(true)}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    );
  }

  return null;
};

// Empty chat state component with modern illustration
const EmptyChatState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-4">
    <div className="w-48 h-48 relative">
      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Modern chat bubble illustration */}
        <circle cx="100" cy="100" r="96" fill="#EEF2FF" className="dark:fill-gray-800" />
        <path d="M65 80C65 71.7157 71.7157 65 80 65H120C128.284 65 135 71.7157 135 80V110C135 118.284 128.284 125 120 125H80C71.7157 125 65 118.284 65 110V80Z" fill="#6366F1" className="dark:fill-indigo-600" />
        <path d="M75 135L85 125H120C128.284 125 135 118.284 135 110V80C135 71.7157 128.284 65 120 65H80" stroke="#4F46E5" strokeWidth="3" className="dark:stroke-indigo-500" />
        <circle cx="88" cy="95" r="4" fill="white" />
        <circle cx="108" cy="95" r="4" fill="white" />
        <path d="M98 105C100.761 105 103 102.761 103 100" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Start a Conversation</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Select a document and ask questions about its content
      </p>
    </div>
  </div>
);

// Thinking animation component with modern style
const ThinkingAnimation = () => {
  const [message, setMessage] = useState('Reading your document...');
  
  useEffect(() => {
    const messages = [
      'Reading your document...',
      'Analyzing content...',
      'Preparing response...'
    ];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setMessage(messages[currentIndex]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-2">{message}</p>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

// Add typing animation component for chat responses
const TypingAnimation = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);
    
    // Typing speed (milliseconds per character) - faster now
    const typingSpeed = 10;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, typingSpeed);
    
    return () => clearInterval(timer);
  }, [text]);
  
  return (
    <pre className="whitespace-pre-line text-lg leading-relaxed font-sans">
      {displayedText}
      {!isComplete && <span className="inline-block w-2 h-5 bg-current animate-pulse ml-1"></span>}
    </pre>
  );
};

// Update the ChatMessage component to use the typing animation
const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  const [showTyping, setShowTyping] = useState(!isUser);
  
  useEffect(() => {
    // Only show typing animation for assistant messages
    if (!isUser) {
      // After 5 seconds, disable the typing animation to ensure it completes for longer messages
      const timer = setTimeout(() => {
        setShowTyping(false);
      }, Math.min(5000, message.content.length * 10));
      
      return () => clearTimeout(timer);
    }
  }, [isUser, message.content]);
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 8.1 19.33 6.66 18.12C6.23 17.78 5.95 17.28 5.95 16.73C5.95 14.68 7.6 13 9.65 13H14.35C16.4 13 18.05 14.68 18.05 16.73C18.05 17.28 17.77 17.78 17.34 18.12C15.9 19.33 14.03 20 12 20Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      )}
      
      <div className={`
        max-w-[80%] p-4 rounded-2xl shadow-sm
        ${isUser ? 
          'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' : 
          'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
        }
      `}>
        {isUser || !showTyping ? (
          <pre className="whitespace-pre-line text-lg leading-relaxed font-sans">
            {message.content}
          </pre>
        ) : (
          <TypingAnimation text={message.content} />
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// Update message formatting function
const formatMessage = (content: string): string => {
  // Remove markdown symbols and format in point-wise manner
  return content
    .replace(/\*\*/g, '')  // Remove bold
    .replace(/`/g, '')     // Remove code blocks
    .replace(/\*/g, '')    // Remove italics
    .split('\n')           // Split into lines
    .map(line => line.trim())  // Trim each line
    .filter(line => line)      // Remove empty lines
    .map(line => {
      // Only add bullet if line doesn't already have one
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return line;
      }
      return `• ${line}`;
    })
    .join('\n');           // Join back with newlines
};

// Update User interface
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// Update the user avatar section
const UserAvatar = ({ user }: { user: User | null }) => {
  if (!user) return null;
  
  return (
    <div className="flex items-center">
      <img
        src={user.image || '/default-avatar.png'}
        alt={user.name || 'User'}
        className="w-8 h-8 rounded-full"
      />
      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
    </div>
  );
};

// Add Web Chat tool component
function WebChatTool({ onWebArticleProcessed }: { onWebArticleProcessed: (doc: Document) => void }) {
  const [webUrl, setWebUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessWebArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webUrl.trim()) {
      setError('Please enter a web article URL');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Processing web article URL:', webUrl);
      
      // Validate URL format on the client side first
      try {
        const url = new URL(webUrl.trim());
        if (!url.protocol.startsWith('http')) {
          throw new Error('Invalid URL protocol. Please use http:// or https://');
        }
      } catch (urlError) {
        setError('Please enter a valid URL (e.g., https://example.com/article)');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/process-web', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webUrl: webUrl.trim() }),
      });
      
      // Get the response data whether it's ok or not
      const data = await response.json().catch(() => ({ error: 'Failed to parse server response' }));
      
      if (!response.ok) {
        // Use the error message from the server if available
        const errorMessage = data.error || `Server error: ${response.status}`;
        
        // Provide more user-friendly error messages
        if (errorMessage.includes('Forbidden') || errorMessage.includes('Access denied')) {
          throw new Error('This website blocks access to its content. Try a different article URL.');
        } else if (errorMessage.includes('not found') || response.status === 404) {
          throw new Error('The article could not be found. Please check the URL and try again.');
        } else {
          throw new Error(errorMessage);
        }
      }
      
      console.log('Web article processed:', data);
      
      // Check for warnings in the response
      if (data.warning) {
        console.warn('Warning from server:', data.warning);
        // We'll still proceed with the document, but we could show the warning to the user
      }
      
      if (data && data.document) {
        // Call the callback with the processed article
        onWebArticleProcessed(data.document);
        
        // Clear the input
        setWebUrl('');
        setError(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error processing web article:', error);
      setError(error instanceof Error ? error.message : 'Failed to process web article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-lg font-medium mb-2 flex items-center justify-center">
        <FiGlobe className="mr-2 text-blue-500" />
        Web Article Chat
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
        Enter a web article URL to chat with its content
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 w-full">
          <div className="flex items-start">
            <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              {error.includes('blocks access') && (
                <p className="mt-1 text-sm">
                  Some websites prevent their content from being accessed directly. Try using a public news site or blog.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleProcessWebArticle} className="space-y-4 w-full">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 text-sm text-white rounded-full transition-colors
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              'Process Article'
            )}
          </button>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Suggested sites: news articles, blogs, and public content sites.</p>
          <p>Note: Some websites may block access to their content.</p>
        </div>
      </form>
    </div>
  );
}

// Add drag and drop functionality for document upload
const DragDropUpload = ({ 
  showWebInputArea, 
  showWebInput, 
  handleWebArticleProcessed, 
  uploading, 
  handleFileUpload,
  setShowWebInput
}: { 
  showWebInputArea: () => void;
  showWebInput: boolean;
  handleWebArticleProcessed: (article: Document) => void;
  uploading: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement> | File) => Promise<void>;
  setShowWebInput: (show: boolean) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local function to handle going back to document selection
  const handleBack = () => {
    setShowWebInput(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };
  
  if (showWebInput) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <WebChatTool onWebArticleProcessed={handleWebArticleProcessed} />
          <div className="mt-4 text-center">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="flex items-center justify-center">
                <FiArrowLeft className="mr-2" />
                Back to document selection
              </span>
            </button>
          </div>
        </div>
    </div>
  );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h3 className="text-xl font-medium text-center mb-2">No document selected</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
        Upload a document or select one from the sidebar to start chatting
      </p>
      
      <div 
        className={`
          w-full max-w-md p-6 border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center
          ${isDragging ? 
            'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 
            'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium">
              {uploading ? (
                <span className="text-indigo-500">Uploading document...</span>
              ) : (
                <>
                  <span className="text-indigo-500">Drag and drop</span> your document here, or
                  <label 
                    htmlFor="file-upload" 
                    className="ml-1 cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    browse
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                      disabled={uploading}
                    />
                  </label>
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PDF, DOCX, TXT up to 10MB
            </p>
          </div>
        </div>
        {uploading && (
          <div className="w-full mt-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <button
          onClick={showWebInputArea}
          className="flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
        >
          <FiGlobe className="mr-2" />
          Add Web Article
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { user, signOut, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [docs, setDocs] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('pdf');
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [docContent, setDocContent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [wordContent, setWordContent] = useState<string | null>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [showWebInput, setShowWebInput] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [showDocPreview, setShowDocPreview] = useState(true);
  const [tables, setTables] = useState<string>('');
  const [docxFile, setDocxFile] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'reader' | 'chat'>('reader');

  // Function to load Documents
  const loadDocs = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Try to load documents from Supabase first
      try {
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!supabaseError && supabaseData && supabaseData.length > 0) {
          console.log('Documents loaded from Supabase:', supabaseData.length);
          
          // Transform Supabase data to match Document interface
          const transformedDocs = supabaseData.map(doc => ({
            id: doc.id,
            filename: doc.filename,
            type: doc.type as DocumentType,
            url: doc.url,
            content: doc.content,
            created_at: doc.created_at
          }));
          
          setDocs(transformedDocs);
          
          // Update global store
          if (typeof window !== 'undefined') {
            window.docStore = transformedDocs;
          }
          
          setIsLoading(false);
          return;
        } else if (supabaseError) {
          console.error('Error loading documents from Supabase:', supabaseError);
        }
      } catch (supabaseError) {
        console.error('Error loading documents from Supabase:', supabaseError);
      }
      
      // Fallback to API if Supabase fails
      const response = await fetch('http://localhost:5000/api/documents');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data && data.documents) {
        setDocs(data.documents);
        // Update global store
        if (typeof window !== 'undefined') {
          window.docStore = data.documents;
        }
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('Could not load your documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to convert Word document to HTML
  const fetchWordDocumentHtml = async (docId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/document-html/${docId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Word document HTML');
      }
      
      const html = await response.text();
      return html;
    } catch (error) {
      console.error('Error fetching Word document HTML:', error);
      return null;
    }
  };

  // Function to load document content
  const loadDocContent = async (doc: Document) => {
    if (!doc) return;
    
    setIsLoading(true);
    setError(null);
    setPdfFile(null); // Reset PDF file
    setWordContent(''); // Reset Word content
    
    try {
      console.log('Loading document content for:', doc.filename);
      
      // Set the selected document first
      setSelectedDoc(doc);
      
      // Get document info with direct file URL
      const infoResponse = await fetch(`http://localhost:5000/api/document-info/${doc.id}`);
      
      if (!infoResponse.ok) {
        throw new Error(`Failed to get document info: ${infoResponse.statusText}`);
      }
      
      const docInfo = await infoResponse.json();
      console.log('Document info received:', docInfo);
      
      // Determine document type based on file extension
      const fileExt = doc.filename.split('.').pop()?.toLowerCase();
      const isWordDoc = fileExt === 'docx' || fileExt === 'doc';
      const isPdfDoc = fileExt === 'pdf';
      
      // Update document type
      const docType = isWordDoc ? 'word' : isPdfDoc ? 'pdf' : doc.type;
      setSelectedDoc({...doc, type: docType as DocumentType});
      
      if (isWordDoc) {
        // For Word documents, fetch the HTML content
        try {
          console.log('Fetching Word document content as HTML');
          const textResponse = await fetch(`http://localhost:5000/api/document/${doc.id}/text`);
          
          if (!textResponse.ok) {
            throw new Error(`Failed to fetch Word document: ${textResponse.statusText}`);
          }
          
          const data = await textResponse.json();
          if (data && data.html) {
            setWordContent(data.html);
            console.log('Word document HTML loaded successfully');
          } else {
            throw new Error('Failed to convert Word document to HTML');
          }
        } catch (error) {
          console.error('Error converting Word document:', error);
          setError('Failed to preview Word document. You can still chat with it.');
        }
      } else if (isPdfDoc) {
        // For PDFs, use the direct file URL
        try {
          console.log('Using direct PDF URL:', docInfo.file_url);
          setPdfFile(docInfo.file_url);
        } catch (error) {
          console.error('Error loading PDF document:', error);
          setError('Failed to load PDF content. You can still chat with it.');
        }
      } else if (doc.type === 'web') {
        // For web articles, use the URL
        try {
          console.log('Using web article URL:', doc.url);
          setDocUrl(doc.url || null);
        } catch (error) {
          console.error('Error loading web article:', error);
          setError('Failed to load web article content. You can still chat with it.');
        }
      } else {
        setError('Unsupported document type. Only PDF, Word documents, and web articles are supported for preview.');
      }
    } catch (error) {
      console.error('Error loading document content:', error);
      setError('Failed to load document content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the handleDocumentSelect function
  const handleDocumentSelect = (doc: Document) => {
    console.log('Selected document:', doc);
    
    // Use the new viewDocument function to properly handle document viewing
    viewDocument(doc);
    
    // Reset chat
    setMessages([]);
    setChatSessionId(null);
    
    // Set view mode based on document type
    if (doc.type === 'pdf') {
      setViewMode('pdf');
    } else if (doc.type === 'word') {
      setViewMode('word');
    } else if (doc.type === 'web') {
      setViewMode('web');
    }
  };

  // Function to handle document selection
  const handleDocSelect = async (doc: Document) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Selected document:', doc);
      
      // Set the selected document
      setSelectedDoc(doc);
      
      // Clear existing messages when selecting a new document
      setMessages([]);
      
      // Get document content
      console.log('Fetching document content for:', doc.id);
      const contentResponse = await fetch(`http://localhost:5000/api/documents/${doc.id}/content`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!contentResponse.ok) {
        const errorData = await contentResponse.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Content loading error:', errorData);
        throw new Error(errorData.error || `Failed to load document content: ${contentResponse.status}`);
      }
      
      const contentData = await contentResponse.json();
      console.log('Document content loaded successfully, length:', contentData.content?.length || 0);
      
      // Store document content in backend
      console.log('Storing document content in backend');
      const storeResponse = await fetch('http://localhost:5000/api/store-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId: doc.id,
          content: contentData.content,
        }),
      });
      
      if (!storeResponse.ok) {
        console.warn('Warning: Failed to store document content in backend');
      } else {
        console.log('Document content stored successfully');
      }
      
      // Set chat mode to active
      setActiveTab('chat');
      setIsLoading(false);
    } catch (error) {
      console.error('Error selecting document:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  };

  // Function to handle successful PDF load
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  };

  // Function to handle PDF load error
  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error.message);
    setError(`Could not display the PDF: ${error.message}`);
    setPdfFile(null);
  };

  // Function to change PDF page
  const changePage = (offset: number) => {
    if (!numPages) return;
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  // Test upload function
  const testFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccessMessage('Testing upload...');

    console.log('Testing file upload with:', file.name);

    try {
      // Create a new FormData instance
      const formData = new FormData();
      formData.append('file', file);

      // Try the test endpoint first
      const testResponse = await fetch('http://localhost:5000/api/test-upload', {
        method: 'POST',
        body: formData
      });

      const testResult = await testResponse.json();
      console.log('Test upload result:', testResult);

      if (testResponse.ok) {
        setSuccessMessage('Test upload successful! Now trying real upload...');
        
        // If test was successful, try the real upload
        setTimeout(() => {
          handleFileUpload(file);
        }, 1000);
      } else {
        throw new Error(testResult.error || 'Test upload failed');
      }
    } catch (error) {
      console.error('Test upload error:', error);
      setError(`Test upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploading(false);
    }
  };

  // Simple file upload function - direct approach
  const simpleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | File) => {
    let file: File;
    let inputElement: HTMLInputElement | null = null;
    
    // Check if the argument is a File or an event
    if (e instanceof File) {
      file = e;
    } else {
      // It's an event
      inputElement = e.target;
      if (inputElement.files && inputElement.files[0]) {
        file = inputElement.files[0];
      } else {
        console.error('No file provided');
        setError('No file selected. Please try again.');
        return;
      }
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Uploading file:', file.name);
      
      // Use the simple upload endpoint
      const response = await fetch('http://localhost:5000/api/simple-upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log('Upload response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      if (data && data.document) {
        // Add the document to the list
        const uniqueDoc = {
          ...data.document,
          content: data.document.content || ''
        };
        
        // Add to local state
        setDocs(prev => [uniqueDoc, ...prev]);
        
        // Update global store
        if (typeof window !== 'undefined') {
          window.docStore = [uniqueDoc, ...(window.docStore || [])];
        }
        
        // Also save to Supabase for persistence
        try {
          const { error: supabaseError } = await supabase
            .from('documents')
            .upsert([{
              id: uniqueDoc.id,
              filename: uniqueDoc.filename,
              type: uniqueDoc.type,
              url: uniqueDoc.url,
              content: uniqueDoc.content || '',
              created_at: uniqueDoc.uploadTime
            }]);
            
          if (supabaseError) {
            console.warn('Failed to save document to Supabase:', supabaseError);
          } else {
            console.log('Document saved to Supabase successfully');
          }
        } catch (supabaseError) {
          console.error('Error saving to Supabase:', supabaseError);
        }
        
        // Set the selected document and preview it
        setSelectedDoc(uniqueDoc);
        
        // Set the view mode based on document type
        setViewMode(uniqueDoc.type as ViewMode);
        
        // For PDF files, load the PDF for preview
        if (uniqueDoc.type === 'pdf') {
          console.log('Loading PDF for preview:', uniqueDoc.url);
          
          // Load the PDF from the server
          const pdfUrl = `http://localhost:5000${uniqueDoc.url}`;
          setPdfFile(pdfUrl);
          
          // Switch to the document tab to show the preview
          setActiveTab('document');
        } else if (uniqueDoc.type === 'word') {
          console.log('Loading Word document for preview:', uniqueDoc.url);
          
          // Load the Word document from the server
          const docxUrl = `http://localhost:5000${uniqueDoc.url}`;
          setDocxFile(docxUrl); // Fix: Use the docxFile state variable
          
          // Switch to the document tab to show the preview
          setActiveTab('document');
        }
        
        setSuccessMessage('Document uploaded successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (inputElement) inputElement.value = '';
    } finally {
      setUploading(false);
    }
  };

  // Function to handle file change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      e.target.value = '';
      return;
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('word')) {
      setError('Only PDF and Word documents are supported');
      e.target.value = '';
      return;
    }

    // Preview the file
    previewFile(file);

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Test server connection before attempting upload
    try {
      const statusResponse = await fetch('http://localhost:5000/api/status');
      if (!statusResponse.ok) {
        throw new Error('Server connection failed');
      }
      
      setUploading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
      }
      
      // Parse the response
      const data = await response.json();
      console.log('Upload response:', data);
      
      if (data && data.document) {
        const uploadedDoc = data.document;
        
        // Add to Documents list if not already there
        if (!docs.some(d => d.id === uploadedDoc.id)) {
          const updatedDocs = [...docs, uploadedDoc];
          setDocs(updatedDocs);
          
          // Update global store
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('pdfChatDocs', JSON.stringify(updatedDocs));
          }
        }
        
        setSelectedDoc(uploadedDoc);
        setViewMode(uploadedDoc.type as ViewMode);
        setActiveTab('chat');
        setSuccessMessage('File uploaded successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Invalid server response: Missing document data');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file');
      e.target.value = '';
    }
  };

  // Function to handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }
      
      // Test server connection before attempting upload
      fetch('http://localhost:5000/api/status')
        .then(response => {
          if (!response.ok) {
            throw new Error('Server connection failed');
          }
          console.log('Server connection test successful');
          previewFile(file);
          simpleFileUpload(file);
        })
        .catch(error => {
          console.error('Server connection test failed:', error);
          setError('Cannot connect to server. Please make sure the backend is running.');
        });
      
      e.dataTransfer.clearData();
    }
  }, []);

  // Function to format chat messages without markdown
  const formatAssistantMessage = (content: string) => {
    // Process markdown-like syntax
    let formattedContent = content;
    
    // Remove markdown symbols like ** for bold text as per user preference
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Remove markdown symbols like * for italic text as per user preference
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '$1');
    
    // Convert URLs to clickable links
    formattedContent = formattedContent.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" class="text-[#0064bf] underline hover:text-[#0056a6]">$1</a>'
    );
    
    // Format bullet points in a user-friendly way
    formattedContent = formattedContent.replace(
      /^- (.*?)$/gm, 
      '• $1\n'
    );
    
    // Add line breaks for better readability
    formattedContent = formattedContent.replace(/\n/g, '<br />');
    
    // Preserve whitespace for better formatting
    return <div style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: formattedContent }} />;
  };

  // Update chat functionality
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!selectedDoc) {
      setError('Please select a document first');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate a new session ID if one doesn't exist
      // This ensures each new conversation gets its own unique ID
      const currentSessionId = chatSessionId || uuidv4();
      if (!chatSessionId) {
        setChatSessionId(currentSessionId);
      }
      
      // Add user message to messages
      const userMessage: Message = {
        id: uuidv4(),
        content: input,
        role: 'user',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput(''); // Clear input
      
      // Get document content first
      console.log('Getting document content for chat');
      let documentContent = '';
      
      try {
        const contentResponse = await fetch(`http://localhost:5000/api/documents/${selectedDoc.id}/content`);
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          documentContent = contentData.content;
          console.log('Document content retrieved, length:', documentContent?.length || 0);
        } else {
          console.warn('Could not get document content, proceeding with empty content');
        }
      } catch (contentError) {
        console.error('Error getting document content:', contentError);
      }
      
      // Send message to backend
      console.log('Sending chat request with document ID:', selectedDoc.id);
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          docId: selectedDoc.id,
          sessionId: currentSessionId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add AI response to messages
      const aiMessage: Message = {
        id: uuidv4(),
        content: data.response || data.answer || "No response received",
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Scroll to bottom of chat
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
      
      // Save chat history to Supabase
      try {
        const { error: supabaseError } = await supabase
          .from('chat_history')
          .insert([{
            id: userMessage.id,
            chat_session_id: currentSessionId,
            role: 'user',
            content: userMessage.content,
            created_at: userMessage.timestamp,
            document_id: selectedDoc.id
          }, {
            id: aiMessage.id,
            chat_session_id: currentSessionId,
            role: 'assistant',
            content: aiMessage.content,
            created_at: aiMessage.timestamp,
            document_id: selectedDoc.id
          }]);
          
        if (supabaseError) {
          console.warn('Failed to save chat history to Supabase:', supabaseError);
        } else {
          console.log('Chat history saved to Supabase successfully');
        }
      } catch (supabaseError) {
        console.error('Error saving chat history to Supabase:', supabaseError);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      setIsLoading(false);
    }
  };

  // Load existing chat session if URL has docId and sessionId
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('docId');
    const sessionId = params.get('sessionId');

    if (docId && sessionId) {
      const doc = docs.find(d => d.id === docId);
      if (doc) {
        setSelectedDoc(doc);
        setActiveTab('chat');
        setChatSessionId(sessionId);

        // Load chat history
        setIsLoading(true);
        setError(null);
        
        fetch(`http://localhost:5000/api/chat-history/${sessionId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            return response.json();
          })
          .then(data => {
            if (data && data.chatHistory) {
              const formattedMessages: Message[] = data.chatHistory
                .map((chat: ChatMessage): [Message, Message] => ([
                  { id: uuidv4(), role: 'user' as const, content: formatMessage(chat.question), timestamp: new Date().toISOString() },
                  { id: uuidv4(), role: 'assistant' as const, content: formatMessage(chat.answer), timestamp: new Date().toISOString() }
                ]))
                .flat();
              setMessages(formattedMessages);
            }
          })
          .catch(error => {
            console.error('Error loading chat history:', error);
            setError('I could not load your previous messages. Please refresh the page or start a new chat.');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [docs]);

  // Function to handle search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !selectedDoc) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
          docId: selectedDoc.id
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data && data.results) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching document:', error);
      setError('Failed to search document. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle extract tables
  const handleExtractTables = async () => {
    if (!selectedDoc) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/extract-tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId: selectedDoc.id
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data && data.tables) {
        setTables(data.tables);
      } else {
        setTables('No tables found in the document.');
      }
    } catch (error) {
      console.error('Error extracting tables:', error);
      setError('Failed to extract tables. Please try again.');
      setTables('Error extracting tables from the document.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle delete doc
  const handleDeleteDoc = (id: string) => {
    // In a real app, this would be a call to your backend API to delete the Document
    setDocs(docs.filter(doc => doc.id !== id));
    if (selectedDoc && selectedDoc.id === id) {
      setSelectedDoc(null);
      setMessages([]);
      setSearchResults([]);
      setTables('');
    }
  };

  // Function to toggle doc preview
  const toggleDocPreview = () => {
    setShowDocPreview(!showDocPreview);
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Function to add search result to chat as a question
  const handleAddToChat = (content: string) => {
    setInput(content);
    setActiveTab('chat');
  };

  // Function to select chat history
  const handleSelectChatHistory = (docId: string, chatMessages: Message[]) => {
    console.log('Selected chat history for document:', docId);
    console.log('Chat messages:', chatMessages);
    
    // Find the Document in the list
    const doc = docs.find(d => d.id === docId);
    
    if (doc) {
      console.log('Document found in current list:', doc);
      setSelectedDoc(doc);
      setMessages(chatMessages);
      setActiveTab('chat');
    } else {
      // If Document not found in the current list, we need to fetch it
      console.log('Document not found in current list, fetching details...');
      fetchDocDetails(docId, chatMessages);
    }
  };

  // Function to fetch doc details
  const fetchDocDetails = async (docId: string, chatMessages: Message[]) => {
    try {
      console.log('Fetching document details for:', docId);
      
      // Try to fetch the document details from the server
      const response = await fetch(`http://localhost:5000/api/documents/${docId}`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data && data.document) {
        console.log('Document details received:', data.document);
        const fetchedDoc: Document = data.document;
        
        // Add to Documents list if not already there
        if (!docs.some(d => d.id === docId)) {
          const updatedDocs = [...docs, fetchedDoc];
          setDocs(updatedDocs);
          
          // Update global store
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('pdfChatDocs', JSON.stringify(updatedDocs));
          }
        }
        
        setSelectedDoc(fetchedDoc);
        setMessages(chatMessages);
        setActiveTab('chat');
      } else {
        // If document details not available, create a placeholder
        console.log('Document details not available, creating placeholder');
        const placeholderDoc: Document = {
          id: docId,
          filename: "Previously uploaded document",
          type: 'pdf',
          created_at: new Date().toISOString()
        };
        
        // Add to Documents list if not already there
        if (!docs.some(d => d.id === docId)) {
          const updatedDocs = [...docs, placeholderDoc];
          setDocs(updatedDocs);
          
          // Update global store
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('pdfChatDocs', JSON.stringify(updatedDocs));
          }
        }
        
        setSelectedDoc(placeholderDoc);
        setMessages(chatMessages);
        setActiveTab('chat');
      }
    } catch (error) {
      console.error('Error fetching document details:', error);
      
      // Create a placeholder document on error
      const placeholderDoc: Document = {
        id: docId,
        filename: "Previously uploaded document",
        type: 'pdf',
        created_at: new Date().toISOString()
      };
      
      // Add to Documents list if not already there
      if (!docs.some(d => d.id === docId)) {
        const updatedDocs = [...docs, placeholderDoc];
        setDocs(updatedDocs);
        
        // Update global store
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('pdfChatDocs', JSON.stringify(updatedDocs));
        }
      }
      
      setSelectedDoc(placeholderDoc);
      setMessages(chatMessages);
      setActiveTab('chat');
    }
  };

  // Function to get file icon based on file type
  const getDocumentIcon = (type: DocumentType, filename: string) => {
    if (type === 'pdf' || filename.toLowerCase().endsWith('.pdf')) {
      return <FiFile className="text-red-600" />;
    }
    if (type === 'word' || filename.toLowerCase().endsWith('.doc') || filename.toLowerCase().endsWith('.docx')) {
      return <FiFileText className="text-blue-600" />;
    }
    if (type === 'web') {
      return <FiGlobe className="text-green-600" />;
    }
    return <FiFile className="text-gray-600" />;
  };

  // Function to load chat history
  const loadChatHistory = async (docId: string) => {
    if (!docId) return;
    
    try {
      setIsLoading(true);
      
      // Try to load chat history from Supabase first
      try {
        const { data: chatSessions, error: sessionsError } = await supabase
          .from('chat_history')
          .select('chat_session_id')
          .eq('document_id', docId)
          .order('created_at', { ascending: false });
        
        if (!sessionsError && chatSessions && chatSessions.length > 0) {
          // Get the most recent chat session
          const mostRecentSessionId = chatSessions[0].chat_session_id;
          setChatSessionId(mostRecentSessionId);
          
          // Load messages for this session
          const { data: chatMessages, error: messagesError } = await supabase
            .from('chat_history')
            .select('*')
            .eq('chat_session_id', mostRecentSessionId)
            .order('created_at', { ascending: true });
          
          if (!messagesError && chatMessages && chatMessages.length > 0) {
            // Transform to match our Message interface
            const transformedMessages = chatMessages.map(msg => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: msg.created_at
            }));
            
            setMessages(transformedMessages);
            console.log('Chat history loaded from Supabase:', transformedMessages.length);
            setIsLoading(false);
            return;
          }
        }
      } catch (supabaseError) {
        console.error('Error loading chat history from Supabase:', supabaseError);
        // Continue to fallback
      }
      
      // Fallback to API if Supabase fails
      const response = await fetch(`http://localhost:5000/api/document/${docId}/chat-history`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.chatHistory && data.chatHistory.length > 0) {
        setMessages(data.chatHistory);
        setChatSessionId(data.sessionId);
      } else {
        // No chat history, start a new chat
        setMessages([]);
        setChatSessionId(null);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Could not load chat history');
      setMessages([]);
      setChatSessionId(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save current chat
  const saveCurrentChat = async () => {
    if (!selectedDoc || !user?.id || messages.length === 0) return;
    
    try {
      // We don't need to make an API call as the chat is already saved in the database
      // when each message is sent. This is just to provide feedback to the user.
      setSuccessMessage('Chat saved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving chat:', error);
      setError('Failed to save chat');
    }
  };

  // Function to start a new chat
  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setError(null);
    setIsLoading(false);
    setChatSessionId(null);
  };

  // Clean up function for blob URLs
  useEffect(() => {
    return () => {
      if (pdfFile) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [pdfFile]);

  // Function to check server status
  const checkServerStatus = async () => {
    try {
      console.log('Checking server status...');
      const response = await fetch('http://localhost:5000/api/status');
      const data = await response.json();
      console.log('Server status:', data);
      return data.status === 'ok';
    } catch (error) {
      console.error('Server connection error:', error);
      setError('Cannot connect to server. Please make sure the backend is running.');
      return false;
    }
  };

  // Load documents and check server status when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadDocs();
      checkServerStatus();
      
      // Set user display info
      if (user) {
        // Get display name from user metadata
        const userData = user.user_metadata as { display_name?: string };
        setUserDisplayName(userData?.display_name || user.email?.split('@')[0] || 'Guest User');
        setUserEmail(user.email || 'Not signed in');
      }
    }
  }, [isAuthenticated]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const previewFile = (file: File) => {
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.includes('word')) {
      // For Word documents, show a preview icon
      setPreviewUrl('word');
    }
  };

  const handleWebArticleProcessed = (doc: Document) => {
    console.log('Web article processed:', doc);
    
    // Add to documents list if not already there
    if (!docs.some(d => d.id === doc.id)) {
      setDocs(prev => [...prev, doc]);
    }
    
    // Select the document
    setSelectedDoc(doc);
    
    // Set view mode to web
    setViewMode('web');
    
    // Set active tab to chat
    setActiveTab('chat');
    
    // Hide the web input
    setShowWebInput(false);
    
    // Clear any errors
    setError(null);
    
    // Show success message
    setSuccessMessage('Web article processed successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showWebInputArea = () => {
    setShowWebInput(true);
    // If we have a document selected, we need to temporarily hide it to show the web input
    if (selectedDoc) {
      setSelectedDoc(null);
    }
  };

  const handleBackToDocumentSelection = () => {
    // Hide the web input area
    setShowWebInput(false);
  };

  // Function to get document URL based on type
  const getDocumentUrl = (doc: Document) => {
    if (!doc) return '';
    
    if (doc.type === 'pdf') {
      // For PDFs, use the dedicated PDF endpoint
      return `/api/pdf/${doc.id}`;
    } else if (doc.type === 'word') {
      // For Word documents, use the dedicated DOCX endpoint
      return `/api/docx/${doc.id}`;
    }
    
    // Fallback to the original URL
    return doc.url;
  };

  // Function to view a document
  const viewDocument = async (doc: Document) => {
    try {
      console.log('Viewing document:', doc);
      
      // Update the document URL based on type
      const updatedDoc = {
        ...doc,
        url: getDocumentUrl(doc)
      };
      
      console.log('Updated document with correct URL:', updatedDoc);
      
      // Set the selected document with the updated URL
      setSelectedDoc(updatedDoc);
      
      if (doc.type === 'word') {
        // For Word documents, we'll use the dedicated DOCX endpoint
        console.log('Using DOCX endpoint for Word document:', updatedDoc.url);
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      setError('Failed to load document. Please try again.');
    }
  };

  // Function to refresh dashboard data
  const refreshDashboard = useCallback(() => {
    console.log('Refreshing dashboard data...');
    
    // Reset states
    setSelectedDoc(null);
    setMessages([]);
    setInput('');
    setError(null);
    
    // Fetch documents again
    loadDocs();
    
    // Show success message
    setSuccessMessage('Dashboard refreshed');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [loadDocs]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'document') {
      setMobileView('reader');
    }
  };

  const handleMobileViewChange = (view: 'reader' | 'chat') => {
    setMobileView(view);
  };

  // Function to handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      setError(null);
      setUploading(true);
      setUploadProgress(0);

      let file: File;
      if (e instanceof File) {
        file = e;
      } else {
        if (!e.target.files || e.target.files.length === 0) {
          throw new Error('No file selected');
        }
        file = e.target.files[0];
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user?.id || '');

      // Upload to Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${user?.id}/${file.name}`, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(`${user?.id}/${file.name}`);

      // Save document metadata to Supabase
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert([
          {
            filename: file.name,
            type: file.type,
            size: file.size,
            url: publicUrl,
            user_id: user?.id
          }
        ])
        .select()
        .single();

      if (docError) {
        throw new Error(`Failed to save document metadata: ${docError.message}`);
      }

      // Transform the document data
      const newDoc: Document = {
        id: docData.id,
        filename: docData.filename,
        type: docData.type as DocumentType,
        url: docData.url,
        created_at: docData.created_at
      };

      // Update state
      setDocs(prevDocs => [newDoc, ...prevDocs]);
      setSelectedDoc(newDoc);
      setSuccessMessage('File uploaded successfully!');
      
      // Load the document content
      await loadDocContent(newDoc);

    } catch (error) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-gray-900">
      {/* Mobile Header - Only visible on mobile */}
      <div className="md:hidden border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiFileText className="h-5 w-5 text-gray-800 dark:text-gray-200 mr-2" />
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">PDF Chat</h1>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FiMenu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Toggle Switch - Only visible on mobile when a document is selected */}
      {selectedDoc && (
        <div className="md:hidden border-b border-gray-200 dark:border-gray-700">
          <div className="flex rounded-md bg-gray-100 dark:bg-gray-800 p-1 mx-2 my-1">
            <button
              onClick={() => setMobileView('reader')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md ${
                mobileView === 'reader'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Reader
            </button>
            <button
              onClick={() => setMobileView('chat')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md ${
                mobileView === 'chat'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Chat
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Full height on desktop, conditional on mobile */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block md:w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen md:h-auto overflow-hidden`}>
        {/* Logo - Hidden on mobile as it's in the header */}
        <div className="hidden md:block p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiFileText className="h-6 w-6 text-gray-800 dark:text-gray-200 mr-2" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">PDF Chat</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="py-3 px-2">
          <h2 className="px-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Navigation
          </h2>
          <nav className="space-y-0.5">
            <div 
              onClick={() => {
                refreshDashboard();
                setMobileMenuOpen(false);
              }}
              className="flex items-center px-3 py-1.5 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer"
            >
              <FiGrid className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Dashboard
            </div>
            <Link href="/dashboard/documents" className="flex items-center px-3 py-1.5 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              <FiFile className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Documents
            </Link>
            <Link href="/dashboard/chats" className="flex items-center px-3 py-1.5 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              <FiMessageSquare className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Chats
            </Link>
            <Link href="/dashboard/settings" className="flex items-center px-3 py-1.5 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              <FiSettings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Settings
            </Link>
          </nav>
        </div>

        {/* Tools */}
        <div className="py-3 px-2">
          <h2 className="px-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Tools
          </h2>
          <nav className="space-y-0.5">
            <div 
              className="flex items-center px-3 py-1.5 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            >
              <label htmlFor="sidebarFileInput" className="flex items-center cursor-pointer w-full">
                <FiUpload className="mr-2 h-4 w-4" />
                Upload Document
              </label>
              <input
                id="sidebarFileInput"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.docx,.doc"
              />
            </div>
          </nav>
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto">
          {docs.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {docs.map((doc) => (
                <li key={doc.id}>
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setActiveTab('chat');
                      setMessages([]);
                      setInput('');
                      setError(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedDoc?.id === doc.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : ''
                    }`}
                  >
                    {getDocumentIcon(doc.type, doc.filename)}
                    <div className="ml-2 overflow-hidden">
                      <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {doc.type === 'web' && doc.metadata?.title 
                          ? doc.metadata.title 
                          : doc.filename}
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate">
                        {doc.type === 'web' 
                          ? new URL(doc.url || '').hostname 
                          : `${doc.type.toUpperCase()} Document`}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              <p className="text-xs md:text-sm">No documents yet</p>
              <p className="text-[10px] md:text-xs mt-1">Upload a document or add a web article to get started</p>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <div className="flex-shrink-0 mr-3">
                {user ? (
                  <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden">
                    {(user as any).photoURL || (user as any).photoUrl || (user as any).photo_url || (user as any).avatar ? (
                      <img 
                        src={(user as any).photoURL || (user as any).photoUrl || (user as any).photo_url || (user as any).avatar} 
                        alt={userDisplayName || 'User'} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">{(userDisplayName || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                  {userDisplayName || 'Guest User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userEmail || 'Not signed in'}
                </p>
              </div>
            </div>
            <button 
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Sign out"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Only visible on desktop */}
        <header className="hidden md:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 flex items-center">
            <h2 className="text-base md:text-lg font-medium">
              {selectedDoc ? selectedDoc.filename : 'Select a Document'}
            </h2>
          </div>
        </header>

        {/* Document and Chat Area - Stacked on mobile, side by side on desktop */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Document viewer - Full width on mobile, half width on desktop */}
          <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-1/2 border-r border-gray-200 dark:border-gray-700 flex-col h-[calc(100vh-100px)] md:h-auto`}>
            {selectedDoc ? (
              selectedDoc.type === 'pdf' ? (
                <div className="h-full flex flex-col">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 flex justify-between items-center">
                    <span className="text-xs md:text-sm font-medium truncate">{selectedDoc.filename}</span>
                    <a 
                      href={selectedDoc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      Open in new tab
                    </a>
                  </div>
                  <div className="flex-grow bg-white dark:bg-gray-800 relative">
                    <iframe
                      src={selectedDoc.url}
                      className="w-full h-full absolute inset-0 border-0"
                      title={selectedDoc.filename}
                      style={{ minHeight: '100%' }}
                    />
                  </div>
                </div>
              ) : selectedDoc.type === 'word' ? (
                <DocxViewer url={selectedDoc.url || ''} filename={selectedDoc.filename} />
              ) : selectedDoc.type === 'web' ? (
                <div className="h-full relative">
                  <iframe
                    src={selectedDoc.url || ''}
                    className="w-full h-full absolute inset-0 border-0"
                    title={selectedDoc.filename}
                    style={{ minHeight: '100%' }}
                  />
                </div>
              ) : null
            ) : (
              <div className="h-full">
                <DragDropUpload 
                  showWebInputArea={showWebInputArea} 
                  showWebInput={showWebInput} 
                  handleWebArticleProcessed={handleWebArticleProcessed} 
                  uploading={uploading} 
                  handleFileUpload={handleFileUpload} 
                  setShowWebInput={setShowWebInput}
                />
              </div>
            )}
          </div>

          {/* Chat section - Full width on mobile, half width on desktop */}
          <div className={`${mobileView === 'reader' ? 'hidden' : 'flex'} md:flex w-full md:w-1/2 flex-col bg-white dark:bg-gray-900 h-[calc(100vh-100px)] md:h-auto`}>
            {/* Chat header */}
            <div className="p-2 md:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-sm md:text-lg font-semibold truncate">
                {selectedDoc ? `Chat about ${selectedDoc.filename}` : 'Select a document to start chatting'}
              </h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-500"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
                </button>
                {selectedDoc && (
                  <button
                    onClick={handleNewChat}
                    className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    New Chat
                  </button>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.length === 0 ? (
                <EmptyChatState />
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'assistant' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[75%] rounded-lg px-3 py-2 ${
                        message.role === 'assistant'
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      <p className="text-sm md:text-base whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <span className="text-[10px] md:text-xs opacity-70 mt-1 block">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {thinking && <ThinkingAnimation />}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <div className="p-2 md:p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={selectedDoc ? "Ask a question..." : "Select a document to start chatting"}
                  className="flex-1 min-h-[40px] max-h-[120px] p-2 md:p-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                  disabled={!selectedDoc || isLoading}
                />
                <div className="flex items-center space-x-2">
                  <VoiceInput
                    onTranscript={(transcript) => setInput(input + ' ' + transcript)}
                    isListening={isListening}
                    setIsListening={setIsListening}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!selectedDoc || !input.trim() || isLoading}
                    className="p-2 md:p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
              </div>
              {error && (
                <p className="mt-2 text-xs md:text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="fixed bottom-4 right-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="mb-2">Uploading document...</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full animate-pulse" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {uploadProgress}% complete
          </div>
        </div>
      )}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
