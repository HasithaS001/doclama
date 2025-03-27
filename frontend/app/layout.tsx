import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PDF Chat App',
  description: 'Chat with your PDF documents using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script 
          src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" 
          strategy="beforeInteractive"
        />
        <style>{`
          @keyframes pulse-gentle {
            0%, 100% { 
              opacity: 0.4; 
              transform: scale(0.8); 
            }
            50% { 
              opacity: 1; 
              transform: scale(1); 
            }
          }

          .animate-pulse-gentle {
            animation: pulse-gentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </head>
      <body className={`${inter.className} h-full dark:bg-gray-900 dark:text-white transition-colors duration-200`}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
