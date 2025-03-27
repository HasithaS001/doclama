'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  url: string;
  filename: string;
}

const PdfViewer = ({ url, filename }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError(true);
    setLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages || 1);
    });
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.5));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 p-2 flex justify-between items-center">
        <span className="text-sm font-medium truncate">{filename}</span>
        <div className="flex items-center space-x-2">
          <button 
            onClick={zoomOut}
            className="text-gray-600 hover:text-gray-800 p-1"
            title="Zoom out"
          >
            -
          </button>
          <span className="text-xs text-gray-600">{Math.round(scale * 100)}%</span>
          <button 
            onClick={zoomIn}
            className="text-gray-600 hover:text-gray-800 p-1"
            title="Zoom in"
          >
            +
          </button>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm ml-2"
          >
            Open in new tab
          </a>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto bg-gray-50 flex flex-col items-center">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="mb-4 text-gray-600">Could not load the PDF file.</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
              >
                Try opening directly
              </a>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              className="my-4"
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-md"
              />
            </Document>
            
            {numPages && numPages > 1 && (
              <div className="flex items-center justify-center space-x-4 p-2 bg-white rounded shadow-sm mb-4">
                <button
                  onClick={previousPage}
                  disabled={pageNumber <= 1}
                  className={`px-3 py-1 rounded ${pageNumber <= 1 ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-50'}`}
                >
                  Previous
                </button>
                <p className="text-sm">
                  Page {pageNumber} of {numPages}
                </p>
                <button
                  onClick={nextPage}
                  disabled={pageNumber >= (numPages || 1)}
                  className={`px-3 py-1 rounded ${pageNumber >= (numPages || 1) ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-50'}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
