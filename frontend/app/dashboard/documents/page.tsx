'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import axios from 'axios';
import { 
  FiFile, 
  FiTrash2, 
  FiUpload,
  FiDownload,
  FiSearch,
  FiGrid,
  FiList,
  FiX,
  FiMaximize2,
  FiMinimize2
} from 'react-icons/fi';
import { format } from 'date-fns';
import DocumentPreview from '../../../components/DocumentPreview';
import {supabase} from "@/lib/supabase";


type DocumentType = 'pdf' | 'word' | 'web';

interface Document {
  id: string;
  filename: string;
  type: DocumentType;
  created_at: string;
  user_id?: string;
  size?: number;
}


export default function Documents() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [docs, setDocs] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

  useEffect(() => {
    loadDocs();
    
    // Set up event listener for document updates
    window.addEventListener('documentUploaded', () => {
      loadDocs();
    });
    
    return () => {
      window.removeEventListener('documentUploaded', () => {
        loadDocs();
      });
    };
  }, []);

  // Function to load Documents
  const loadDocs = async () => {
    try {
      // setError(null);
      // setIsLoading(true);

      // Try to load documents from Supabase first
      try {
        const { data: supabaseData, error: supabaseError } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', user?.id)
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

          // setIsLoading(false);
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
      // setError('Could not load your documents');
    } finally {
      // setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage({ type: '', content: '' });
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('document', file);

      const response = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          }
        }
      );

      if (response.data.documents) {
        // Dispatch event for real-time updates
        const event = new Event('documentUploaded');
        window.dispatchEvent(event);
        
        setMessage({ 
          type: 'success', 
          content: 'Document uploaded successfully!' 
        });
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setMessage({ 
        type: 'error', 
        content: error.response?.data?.error || 'Failed to upload document' 
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/documents/${docId}`);
      setDocs(docs.filter(doc => doc.id !== docId));
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
      }
      setMessage({
        type: 'success',
        content: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      setMessage({
        type: 'error',
        content: 'Failed to delete document'
      });
    }
  };

  const handlePreview = (doc: Document) => {
    setSelectedDoc(doc);
  };

  const closePreview = () => {
    setSelectedDoc(null);
    setIsPreviewFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsPreviewFullscreen(!isPreviewFullscreen);
  };

  const filteredDocs = docs.filter(doc =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Documents</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your uploaded documents</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            >
              {viewMode === 'grid' ? <FiList size={20} /> : <FiGrid size={20} />}
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <label 
              htmlFor="fileInput"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer"
            >
              <FiUpload className="mr-2" />
              Upload Document
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.docx,.doc"
            />
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
            {uploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-6">
          <div className={`${selectedDoc ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => handlePreview(doc)}
                        >
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <FiFile className={doc.type === 'pdf' ? 'text-red-500' : 'text-blue-500'} size={24} />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                              {doc.filename}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {format(new Date(doc.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                      {doc.size && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {(doc.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date Added
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredDocs.map((doc) => (
                      <tr 
                        key={doc.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handlePreview(doc)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2">
                              <FiFile className={doc.type === 'pdf' ? 'text-red-500' : 'text-blue-500'} size={20} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.filename}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(doc.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDoc(doc.id);
                            }}
                            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredDocs.length === 0 && (
              <div className="text-center py-12">
                <FiFile className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No documents</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No documents match your search.' : 'Get started by uploading a document.'}
                </p>
                <div className="mt-6">
                  <label
                    htmlFor="emptyStateFileInput"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer"
                  >
                    <FiUpload className="mr-2" />
                    Upload Document
                  </label>
                  <input
                    id="emptyStateFileInput"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.doc"
                  />
                </div>
              </div>
            )}
          </div>

          {selectedDoc && (
            <div 
              className={`${
                isPreviewFullscreen 
                  ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' 
                  : 'w-1/2'
              } transition-all duration-300`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{selectedDoc.filename}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {isPreviewFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
                    </button>
                    <button
                      onClick={closePreview}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </div>
                <div className="h-[calc(100vh-10rem)] overflow-auto">
                  <DocumentPreview
                    documentUrl={`http://localhost:5000/api/documents/${selectedDoc.id}/preview`}
                    documentType={selectedDoc.type}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
