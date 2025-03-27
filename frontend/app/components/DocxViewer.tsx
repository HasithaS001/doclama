'use client';

import { useEffect, useState } from 'react';
import mammoth from 'mammoth';

interface DocxViewerProps {
  url: string;
  filename: string;
}

const DocxViewer = ({ url, filename }: DocxViewerProps) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocx = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('DocxViewer: Attempting to fetch document from URL:', url);
        
        // Create a full URL if it's a relative path
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
        console.log('DocxViewer: Full URL:', fullUrl);
        
        // Fetch the DOCX file
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
          console.error('DocxViewer: Failed to fetch DOCX file:', response.status, response.statusText);
          throw new Error(`Failed to fetch DOCX: ${response.status} ${response.statusText}`);
        }
        
        // Get the DOCX as an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();
        console.log('DocxViewer: Successfully fetched document, size:', arrayBuffer.byteLength);
        
        // Convert DOCX to HTML using mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer });
        console.log('DocxViewer: Successfully converted document to HTML');
        setHtmlContent(result.value);
        setLoading(false);
      } catch (err) {
        console.error('DocxViewer: Error loading DOCX:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading document');
        setLoading(false);
      }
    };

    if (url) {
      fetchDocx();
    } else {
      console.error('DocxViewer: No URL provided');
      setError('No document URL provided');
      setLoading(false);
    }
  }, [url]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-4">
          <p className="mb-4 text-gray-600">Could not load the document.</p>
          <p className="mb-4 text-sm text-red-500">{error}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
          >
            Download document
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 p-2 flex justify-between items-center">
        <span className="text-sm font-medium truncate">{filename}</span>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Download
        </a>
      </div>
      <div className="flex-grow bg-white overflow-auto p-4 light-mode-only">
        <div 
          className="docx-content text-black"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default DocxViewer;
