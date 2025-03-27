'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Column - Illustration */}
        <div className="hidden lg:flex items-center justify-center bg-[#6265fa]/5 p-12">
          <div className="relative w-full max-w-lg">
            {/* Animated shapes */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-0 -left-4 w-72 h-72 bg-[#6265fa]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-8 right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            />
            <div className="relative">
              <svg 
                viewBox="0 0 500 500" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M256.5,25.5c-23,0-45.3,3.6-66.2,10.3c-20.9,6.7-40.2,16.5-57.4,29.2c-17.2,12.7-32.1,27.9-44.3,45.3 c-12.2,17.4-21.6,36.6-27.9,57.4c-6.3,20.8-9.5,42.7-9.5,65.7s3.2,44.9,9.5,65.7c6.3,20.8,15.7,40,27.9,57.4 c12.2,17.4,27.1,32.6,44.3,45.3c17.2,12.7,36.5,22.5,57.4,29.2c20.9,6.7,43.2,10.3,66.2,10.3s45.3-3.6,66.2-10.3 c20.9-6.7,40.2-16.5,57.4-29.2c17.2-12.7,32.1-27.9,44.3-45.3c12.2-17.4,21.6-36.6,27.9-57.4c6.3-20.8,9.5-42.7,9.5-65.7 s-3.2-44.9-9.5-65.7c-6.3-20.8-15.7-40-27.9-57.4c-12.2-17.4-27.1-32.6-44.3-45.3c-17.2-12.7-36.5-22.5-57.4-29.2 C301.8,29.1,279.5,25.5,256.5,25.5z"
                  fill="#6265fa"
                  opacity="0.1"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-64 h-64 text-[#6265fa]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={0.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
              <p className="text-gray-600">We'd love to hear from you. Send us a message!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6265fa] focus:border-transparent transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6265fa] focus:border-transparent transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6265fa] focus:border-transparent transition-colors"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6265fa] focus:border-transparent transition-colors"
                  placeholder="Your message..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#6265fa] text-white py-2 px-4 rounded-lg hover:bg-[#6265fa]/90 transition-colors"
              >
                Send Message
              </button>
            </form>

            {/* Contact Information */}
            <div className="mt-12 space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@chatdoc.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Innovation Street, Silicon Valley, CA 94025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
