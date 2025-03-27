'use client';

import { FiArrowLeft, FiLock } from 'react-icons/fi';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
              <FiArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="bg-white shadow-sm rounded-xl p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <FiLock className="text-indigo-600 text-xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            
            <div className="text-sm text-gray-500 mb-8">
              Effective Date: {currentDate}
            </div>
            
            <div className="prose prose-indigo max-w-none">
              <p className="text-lg">
                Welcome to DOCLAMA! Your privacy is important to us, and we are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
              </p>
              
              <p>
                By accessing or using DOCLAMA, you agree to this Privacy Policy. If you do not agree, please do not use our services.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
              <p>When you use DOClama, we may collect the following types of information:</p>
              
              <h3 className="font-medium mt-6 mb-2">A. Information You Provide Directly</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="text-green-600">✅</span> <strong>Account Information</strong> – When you sign up, we may collect your name, email, and password.</li>
                <li><span className="text-green-600">✅</span> <strong>Uploaded Files</strong> – If you upload PDFs to interact with, we process them temporarily for AI-powered analysis.</li>
                <li><span className="text-green-600">✅</span> <strong>Communication Data</strong> – If you contact us for support, we may store your messages.</li>
              </ul>
              
              <h3 className="font-medium mt-6 mb-2">B. Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="text-green-600">✅</span> <strong>Usage Data</strong> – We track how you use our platform (e.g., features accessed, time spent).</li>
                <li><span className="text-green-600">✅</span> <strong>Device & Log Data</strong> – We collect IP addresses, browser types, and system logs to improve security and performance.</li>
                <li><span className="text-green-600">✅</span> <strong>Cookies & Tracking Technologies</strong> – We use cookies to enhance your experience and improve functionality.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="text-indigo-600">🔹</span> Provide and improve Chat Doc services.</li>
                <li><span className="text-indigo-600">🔹</span> Process and analyze uploaded PDFs for AI-powered interaction.</li>
                <li><span className="text-indigo-600">🔹</span> Enhance user experience through personalized features.</li>
                <li><span className="text-indigo-600">🔹</span> Monitor platform security and prevent fraud.</li>
                <li><span className="text-indigo-600">🔹</span> Send important updates, support messages, and promotional offers (you can opt-out anytime).</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Protect Your Data</h2>
              <p>At DOCLAMA, security is our top priority. We implement:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="text-green-600">✅</span> <strong>End-to-End Encryption</strong> – Your PDFs and chat interactions remain private.</li>
                <li><span className="text-green-600">✅</span> <strong>No File Storage</strong> – We do not store your uploaded documents permanently. Once processed, they are deleted.</li>
                <li><span className="text-green-600">✅</span> <strong>Access Controls</strong> – Only authorized personnel can manage system operations.</li>
                <li><span className="text-green-600">✅</span> <strong>Secure Servers</strong> – Your data is hosted on industry-standard encrypted servers.</li>
              </ul>
              
              <p className="font-medium text-indigo-600 my-4">
                🚀 Your files, your control—always.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Sharing & Disclosure of Information</h2>
              <p>We never sell or rent your personal information. However, we may share data in these cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="text-indigo-600">🔹</span> <strong>Legal Compliance</strong> – If required by law, we may disclose your information to authorities.</li>
                <li><span className="text-indigo-600">🔹</span> <strong>Service Providers</strong> – We work with trusted third-party partners to enhance our services (e.g., cloud hosting).</li>
                <li><span className="text-indigo-600">🔹</span> <strong>Business Transfers</strong> – In case of mergers or acquisitions, user data may be transferred under privacy safeguards.</li>
              </ul>
              
              <p className="font-medium my-4">
                <span className="text-indigo-600">📢</span> We are committed to transparency—your data remains secure and confidential.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Choices & Rights</h2>
              <p>You have full control over your data. You can:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="text-green-600">✅</span> <strong>Access & Download</strong> your data upon request.</li>
                <li><span className="text-green-600">✅</span> <strong>Update or Delete</strong> your account information at any time.</li>
                <li><span className="text-green-600">✅</span> <strong>Opt-Out</strong> of marketing emails with a simple unsubscribe option.</li>
                <li><span className="text-green-600">✅</span> <strong>Disable Cookies</strong> through your browser settings.</li>
              </ul>
              
              <p className="font-medium text-indigo-600 my-4">
                🛡️ Your privacy, your rules.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Third-Party Services</h2>
              <p>
                While using DOCLAMA, you may encounter links or integrations with third-party services 
                (e.g., payment processors, analytics tools). We are not responsible for their privacy policies, 
                so please review their terms separately.
              </p>
              
              <p className="my-4">
                <span className="text-indigo-600">🔹</span> We only work with trusted partners that prioritize user security.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
              <p>
                DOCLAMA is not intended for individuals under 13 years old. We do not knowingly collect personal data from children. 
                If you believe a child has provided us with information, please contact us for removal.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect improvements or legal requirements. 
                If changes occur, we will notify users through email or platform updates.
              </p>
              
              <p className="my-4">
                <span className="text-indigo-600">📅</span> Last Updated: {currentDate}
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
              <p>Have questions or concerns? We're here to help!</p>
              <ul className="list-none space-y-2 my-4">
                <li><span className="text-indigo-600">📩</span> <strong>Email:</strong> support@doclama.com</li>
                <li><span className="text-indigo-600">🌍</span> <strong>Website:</strong> www.doclama.com</li>
                <li><span className="text-indigo-600">📍</span> <strong>Address:</strong> Welangathuduwawaththa, Ambalanwaththa,Galle, Sri Lanka</li>
              </ul>
              
              <p className="font-medium text-indigo-600 my-6">
                💡 At DOCLAMA, your trust is our priority.
              </p>
              
              <div className="mt-12 mb-6">
                <Link 
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  🚀 Back to DOCLAMA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
