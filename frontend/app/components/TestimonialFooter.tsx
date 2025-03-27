'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const TestimonialFooter = () => {
  const [year, setYear] = useState('2025');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-white py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Description */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#6265fa] rounded-lg flex items-center justify-center text-xl font-bold text-white">
                C
              </div>
              <span className="text-lg font-bold">DocChat</span>
            </div>
            <span className="text-sm text-gray-600 ml-4">
              Making document interactions smarter and more efficient.
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-8">
            <Link href="/chat-with-docs" className="text-gray-600 hover:text-[#6265fa]">
              Chat with Docs
            </Link>
            <Link href="/chat-with-web" className="text-gray-600 hover:text-[#6265fa]">
              Chat with Web
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-[#6265fa]">
              Pricing
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-600">
          &copy; {year} DocChat. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default TestimonialFooter;
