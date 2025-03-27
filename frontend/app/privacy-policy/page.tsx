'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#6265fa] mb-8">DOCLAMA Privacy Policy</h1>
          
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-8">
              At DOCLAMA, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Account information (email, name)</li>
              <li>Document uploads and chat history</li>
              <li>Usage data and analytics</li>
              <li>Payment information (processed securely by our payment provider)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>To provide and improve our services</li>
              <li>To process your transactions</li>
              <li>To communicate with you about your account</li>
              <li>To send important updates and announcements</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Encryption of sensitive data</li>
              <li>Regular security audits</li>
              <li>Secure data storage and transmission</li>
              <li>Access controls and authentication</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about our privacy policy, please contact us at{' '}
              <a href="mailto:privacy@doclama.com" className="text-[#6265fa] hover:underline">
                privacy@doclama.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
