'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#6265fa] mb-8">DOCLAMA Refund Policy</h1>
          
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-8">
              We want you to be completely satisfied with DOCLAMA. Here's our refund policy to ensure your peace of mind.
            </p>

            <h2 className="text-2xl font-semibold text-[#6265fa] mt-8 mb-4">Refund Eligibility</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Request within 14 days of purchase</li>
              <li>Account in good standing</li>
              <li>Valid reason for refund request</li>
              <li>Subscription plan not fully utilized</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6265fa] mt-8 mb-4">How to Request a Refund</h2>
            <ol className="list-decimal pl-6 text-gray-600 space-y-2">
              <li>Log into your DOCLAMA account</li>
              <li>Go to Account Settings  Billing</li>
              <li>Click "Request Refund"</li>
              <li>Fill out the refund request form</li>
              <li>Submit your request</li>
            </ol>

            <h2 className="text-2xl font-semibold text-[#6265fa] mt-8 mb-4">Processing Time</h2>
            <p className="text-gray-600 mb-4">
              Once approved:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Credit card refunds: 5-10 business days</li>
              <li>Bank transfers: 7-14 business days</li>
              <li>Other payment methods: varies by provider</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6265fa] mt-8 mb-4">Non-Refundable Items</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Usage fees for processed documents</li>
              <li>Add-on services already delivered</li>
              <li>Custom enterprise solutions</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6265fa] mt-8 mb-4">Contact Support</h2>
            <p className="text-gray-600">
              Need help with a refund? Contact our support team at{' '}
              <a href="mailto:support@doclama.com" className="text-[#6265fa] hover:underline">
                support@doclama.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
