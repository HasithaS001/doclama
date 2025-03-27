'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiFile, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = pathname === '/pricing' || pathname === '/testimonials' || pathname === '/contact'
    ? 'text-[#6265fa]' 
    : scrolled ? 'text-gray-700' : 'text-white';

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || pathname === '/testimonials' || pathname === '/contact' ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Mobile Menu Button - Moved further left */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-[#6265fa] transition-colors mr-6"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#6265fa] text-white rounded-lg flex items-center justify-center text-2xl font-bold">
                D
              </div>
              <span className={`text-xl font-bold ${textColor}`}>
                DOCLAMA
              </span>
            </Link>
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:block">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#6265fa] text-white rounded-lg flex items-center justify-center text-2xl font-bold">
                D
              </div>
              <span className={`text-xl font-bold ${textColor}`}>
                DOCLAMA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/testimonials" 
              className={`${textColor} hover:text-[#6265fa] transition-colors font-medium`}
            >
              Testimonials
            </Link>
            <div className="relative group">
              <div
                className={`flex items-center ${textColor} hover:text-[#6265fa] transition-colors font-medium cursor-pointer`}
              >
                Tools
                <svg
                  className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1" role="menu">
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6265fa]"
                    role="menuitem"
                  >
                    <FiFile className="mr-2" />
                    Chat with Docs
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6265fa]"
                    role="menuitem"
                  >
                    <FiGlobe className="mr-2" />
                    Chat with Web
                  </Link>
                </div>
              </div>
            </div>

            {[
              { name: 'Pricing', href: '/pricing' },
              { name: 'About', href: '/about' },
              { name: 'Contact', href: '/contact' },
              { name: 'Blog', href: '/blog' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${textColor} hover:text-[#6265fa] transition-colors font-medium`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth"
              className={`${
                scrolled ? 'text-gray-700' : 'text-white'
              } hover:text-[#6265fa] transition-colors font-medium`}
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="bg-[#6265fa] hover:bg-[#4b4ec7] text-white px-6 py-2.5 rounded-lg transition-colors shadow-lg hover:shadow-xl font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}>
          <div className="bg-white shadow-lg border-t border-gray-100">
            <div className="max-w-md mx-auto px-4 py-3">
              {/* Search Bar */}
              <div className="relative mb-4 mt-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-gray-50 rounded-xl py-3 px-4 pl-10 text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#6265fa]/20 focus:bg-white transition-all"
                />
                <svg
                  className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/testimonials"
                  className="flex items-center space-x-3 w-full p-3 rounded-xl text-[#6265fa] hover:bg-[#6265fa]/5 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Testimonials</span>
                </Link>

                {/* Tools Dropdown */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                    className="flex items-center justify-between w-full p-3 text-[#6265fa] hover:bg-[#6265fa]/5 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      <span>Tools</span>
                    </div>
                    <svg
                      className={`h-5 w-5 transform transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className={`overflow-hidden transition-all duration-200 ${toolsDropdownOpen ? 'max-h-40' : 'max-h-0'}`}>
                    <div className="bg-[#6265fa]/5 px-3 py-2 space-y-2">
                      <Link
                        href="/chat-with-docs"
                        className="flex items-center space-x-3 p-2 rounded-lg text-[#6265fa] hover:bg-white transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FiFile className="h-4 w-4" />
                        <span>Chat with Docs</span>
                      </Link>
                      <Link
                        href="/chat-with-web"
                        className="flex items-center space-x-3 p-2 rounded-lg text-[#6265fa] hover:bg-white transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FiGlobe className="h-4 w-4" />
                        <span>Chat with Web</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className="flex items-center space-x-3 w-full p-3 rounded-xl text-[#6265fa] hover:bg-[#6265fa]/5 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Pricing</span>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center space-x-3 w-full p-3 rounded-xl text-[#6265fa] hover:bg-[#6265fa]/5 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact</span>
                </Link>
              </div>

              {/* Auth Section */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href="/auth"
                  className="flex items-center justify-center space-x-2 w-full p-3 rounded-xl bg-[#6265fa] text-white hover:bg-[#6265fa]/90 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
