'use client';

import Header from '../components/Header';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#6265fa] mb-4">
              7-Day Refund Guarantee
            </h1>
            <p className="text-xl text-[#6265fa]">
              Your satisfaction is our top priority. We offer a hassle-free refund policy.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Overview */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                We stand behind our product with a 7-day money-back guarantee. If you're not completely satisfied with Chat Doc, 
                we'll refund your purchase, no questions asked.
              </p>
            </section>

            {/* Eligibility */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Eligibility Criteria</h2>
              <ul className="space-y-4">
                {[
                  "Request must be made within 7 days of purchase",
                  "Account must be in good standing",
                  "Valid for all subscription plans",
                  "One refund per customer"
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3 text-gray-600">
                    <svg className="h-6 w-6 text-[#6265fa] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* How to Request */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Request a Refund</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: "Contact Support",
                    description: "Email our support team or use the contact form",
                    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  },
                  {
                    title: "Provide Details",
                    description: "Include your order number and reason for refund",
                    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-[#6265fa]/10 flex items-center justify-center">
                        <svg className="h-6 w-6 text-[#6265fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Processing Time */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Processing Time</h2>
              <p className="text-gray-600 leading-relaxed">
                Refunds are typically processed within 3-5 business days. Once approved, please allow 5-10 business days for 
                the refund to appear in your account, depending on your payment method and financial institution.
              </p>
            </section>

            {/* CTA Section */}
            <section className="text-center bg-[#6265fa]/5 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-6">
                Our support team is here to assist you with any questions about our refund policy.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-[#6265fa] hover:bg-[#6265fa]/90 transition-colors"
              >
                Contact Support
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
