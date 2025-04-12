'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCheckCircle, FiMessageSquare, FiX, FiCheck } from 'react-icons/fi';
import Header from '../components/Header';
import {getCheckoutURL} from "@/app/actions";
import {useAuth} from "@/context/AuthContext";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const {session} = useAuth();

  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };


  const subscribeBasicPlan = async () => {
    try {
      const checkoutUrl = await getCheckoutURL(758320, session?.user, true);
      checkoutUrl && window.open(checkoutUrl);
    }catch (error) {
      console.log(error);
    }
  }

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Features comparison
  const features = [
    { name: "Number of PDFs", free: "3 per month", pro: "Unlimited" },
    { name: "File size limit", free: "10MB", pro: "10MB" },
    { name: "Chat history", free: "7 days", pro: "Unlimited" },
    { name: "Advanced chat features", free: "Basic only", pro: "Full access" },
    { name: "API access", free: "No", pro: "Yes" },
    { name: "Priority support", free: "No", pro: "Yes" },
    { name: "Dark mode", free: "Yes", pro: "Yes" },
    { name: "Mobile access", free: "Yes", pro: "Yes" },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Graduate Student",
      image: "/testimonials/avatar1.jpg",
      content: "This app has completely transformed how I study research papers. I can chat with my PDFs and get insights instantly!",
    },
    {
      name: "Michael Chen",
      role: "Business Analyst",
      image: "/testimonials/avatar2.jpg",
      content: "The Pro plan is worth every penny. I use it daily to analyze complex reports and extract key information quickly.",
    },
    {
      name: "Emily Rodriguez",
      role: "Legal Professional",
      image: "/testimonials/avatar3.jpg",
      content: "As a lawyer, I deal with hundreds of documents. This tool helps me find relevant information in seconds instead of hours.",
    },
  ];

  const faqs = [
    {
      question: "What happens when I reach my monthly PDF limit?",
      answer: "On the Free plan, you can chat with up to 3 PDFs per month. Once you reach this limit, you'll need to upgrade to the Pro plan to continue uploading new PDFs or wait until the next month when your limit resets."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to Pro features until the end of your current billing period."
    },
    {
      question: "Is there a limit on PDF file size?",
      answer: "Yes, there is a 10MB file size limit per PDF for all plans. This helps ensure optimal performance and processing speed."
    },
    {
      question: "Do you offer a student discount?",
      answer: "Yes! We offer a 50% discount for students with a valid .edu email address. Contact our support team to verify your student status and receive your discount code."
    },
    {
      question: "Can I try the Pro plan before purchasing?",
      answer: "While we don't offer a free trial of the Pro plan, you can use our Free plan to test the core functionality. If you're not satisfied with the Pro plan, we offer a 7-day money-back guarantee."
    }
  ];

  return (
    <div className="bg-white">
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 md:pt-32">
          <div className="container mx-auto px-4">
            {/* Pricing header */}
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                Simple, Transparent <span className="text-[#6265fa]">DOCLAMA</span> Pricing
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
                Choose the perfect DOCLAMA plan for your needs. All plans include our core features with flexible usage options.
              </p>
            </div>

            {/* Pricing toggle */}
            <div className="flex justify-center items-center mb-12">
              <span className={`text-lg ${!isYearly ? 'text-[#6265fa] font-medium' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="mx-4 relative inline-flex h-6 w-11 items-center rounded-full bg-[#6265fa]"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg ${isYearly ? 'text-[#6265fa] font-medium' : 'text-gray-500'}`}>
                Yearly <span className="text-green-500 text-sm">(Save 20%)</span>
              </span>
            </div>

            {/* Pricing cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {/* Free Plan */}
              <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                  <p className="text-gray-600">Perfect for getting started</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-gray-800">
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>3 PDFs per month</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Basic chat features</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Up to 10MB per file</span>
                  </li>
                </ul>
                <Link
                  href="/auth"
                  className="block w-full bg-gray-50 hover:bg-gray-100 text-[#6265fa] py-3 rounded-lg text-center font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="relative bg-[#6265fa] rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform">
                <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-medium px-3 py-1 rounded-tr-2xl rounded-bl-2xl">
                  Popular
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <p className="text-blue-100">For power users</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${isYearly ? '16' : '20'}</span>
                  <span className="text-blue-100">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-white">
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-400 mr-2" />
                    <span>Unlimited PDFs</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-400 mr-2" />
                    <span>Advanced chat features</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-400 mr-2" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-400 mr-2" />
                    <span>API access</span>
                  </li>
                </ul>
                <button
                    onClick={subscribeBasicPlan}
                  className="block w-full bg-white hover:bg-gray-50 text-[#6265fa] py-3 rounded-lg text-center font-medium transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="max-w-4xl mx-auto mb-20">
              <h2 className="text-3xl font-bold text-center mb-10">Feature Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-4 px-4 text-left text-gray-600 font-medium">Feature</th>
                      <th className="py-4 px-4 text-center text-gray-600 font-medium">Free</th>
                      <th className="py-4 px-4 text-center text-gray-600 font-medium">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-4 px-4 text-gray-800 font-medium">{feature.name}</td>
                        <td className="py-4 px-4 text-center text-gray-600">
                          {feature.free === "Yes" ? (
                            <FiCheck className="mx-auto text-green-500" />
                          ) : feature.free === "No" ? (
                            <FiX className="mx-auto text-red-400" />
                          ) : (
                            feature.free
                          )}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600">
                          {feature.pro === "Yes" ? (
                            <FiCheck className="mx-auto text-green-500" />
                          ) : feature.pro === "No" ? (
                            <FiX className="mx-auto text-red-400" />
                          ) : (
                            feature.pro
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Testimonials */}
            <div className="max-w-5xl mx-auto mb-20">
              <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
              <div className="relative overflow-hidden" ref={testimonialRef}>
                <div 
                  className="flex transition-transform duration-500 ease-in-out" 
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <div className="flex items-center mb-6">
                          <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4">
                            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                              <span className="text-gray-500 text-xl font-medium">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                            <p className="text-gray-600 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 italic">"{testimonial.content}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentTestimonial === index ? 'bg-[#6265fa]' : 'bg-gray-300'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="max-w-3xl mx-auto mb-0 bg-white">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg bg-white">
                    <button
                      className="w-full px-6 py-4 text-left flex justify-between items-center"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <FiX
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          activeFaq === index ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                    {activeFaq === index && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#6265fa] rounded-lg flex items-center justify-center mr-2">
                  <FiMessageSquare className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-gray-900">DocChat</span>
              </Link>
              <p className="text-gray-600">Making document interactions smarter and more efficient.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-gray-600 hover:text-[#6265fa]">Chat with Docs</Link></li>
                <li><Link href="/dashboard" className="text-gray-600 hover:text-[#6265fa]">Chat with Web</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-[#6265fa]">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-[#6265fa]">About</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-[#6265fa]">Blog</Link></li>
                <li><Link href="/testimonial" className="text-gray-600 hover:text-[#6265fa]">Testimonials</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-600 hover:text-[#6265fa]">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-[#6265fa]">Privacy Policy</Link></li>
                <li><Link href="/refund" className="text-gray-600 hover:text-[#6265fa]">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-gray-600 mb-6">&copy; {new Date().getFullYear()} DocChat. All rights reserved.</p>
            
            <div className="flex justify-center space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6265fa] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
              
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6265fa] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </a>
              
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6265fa] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
