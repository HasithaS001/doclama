'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#6265fa] rounded-lg flex items-center justify-center text-2xl font-bold">
                D
              </div>
              <span className="text-xl font-bold">DOCLAMA</span>
            </Link>
            <p className="text-gray-400">
              Transform the way you interact with documents using AI-powered conversations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#6265fa] transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6265fa] transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6265fa] transition-colors">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6265fa] transition-colors">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {[
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Contact', href: '/contact' },
                { name: 'Testimonials', href: '/testimonials' },
                { name: 'API', href: '/api' },
                { name: 'Documentation', href: '/docs' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-[#6265fa] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                { name: 'About', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Careers', href: '/careers' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-[#6265fa] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Refund Policy', href: '/refund' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-[#6265fa] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#6265fa] transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-[#6265fa] hover:bg-[#4b4ec7] text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              {new Date().getFullYear()} DOCLAMA. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-[#6265fa] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-[#6265fa] transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-[#6265fa] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
