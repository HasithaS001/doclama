import { useState, useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';

interface DocumentPreviewProps {
  documentUrl: string;
  documentType: string;
}

export default function DocumentPreview({ documentUrl, documentType }: DocumentPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        setError('');

        if (documentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // Fetch the Word document
          const response = await fetch(documentUrl);
          const blob = await response.blob();
          
          if (containerRef.current) {
            // Clear previous content
            containerRef.current.innerHTML = '';
            
            // Render the Word document
            await renderAsync(blob, containerRef.current, containerRef.current, {
              className: 'docx-preview'
            });
          }
        }
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Failed to load document preview');
      } finally {
        setLoading(false);
      }
    };

    if (documentUrl) {
      loadDocument();
    }
  }, [documentUrl, documentType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-600">
        {error}
      </div>
    );
  }

  if (documentType === 'application/pdf') {
    return (
      <iframe
        src={documentUrl}
        className="w-full h-screen"
        title="PDF Preview"
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className="docx-preview-container bg-white p-8 min-h-screen"
    />
  );
}
