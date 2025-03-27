'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiMessageSquare, FiSearch, FiClock, FiFileText, FiMenu, FiX } from 'react-icons/fi';
import Header from './components/Header';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Hasitha S.Bandara",
      title: "Fullstack Developer",
      content: "Chat Doc has revolutionized how I analyze research papers. The AI understands context and provides accurate insights instantly.",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      name: "Michael Chen",
      title: "Data Scientist",
      content: "The natural conversation flow makes it feel like I'm discussing the document with a knowledgeable colleague. Incredibly helpful!",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      name: "Emily Rodriguez",
      title: "Legal Consultant",
      content: "This tool has cut my document review time in half. The ability to ask specific questions and get precise answers is invaluable.",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ];

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 200) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  window.addEventListener('scroll', handleScroll);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section - Removed curve */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#6265fa] to-[#4547b0] text-white pt-24 md:pt-32">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Turn Static Documents into Smart Conversations
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Transform your documents into interactive AI-powered conversations with DOCLAMA. Get insights, answers, and analysis in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard" 
                  className="bg-white hover:bg-gray-100 text-[#6265fa] px-8 py-4 rounded-lg font-medium text-lg flex items-center justify-center transition-all"
                >
                  Try It Free
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-gray-50 p-4 flex items-center border-b">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <div className="ml-2 text-gray-700 font-medium">Document Chat</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <FiMessageSquare className="text-[#0072df] w-5 h-5" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-gray-700">
                        <p>What are the key findings in this research paper?</p>
                      </div>
                    </div>
                    <div className="flex items-start mb-4 justify-end">
                      <div className="bg-[#0072df] rounded-lg p-3 text-white max-w-md">
                        <p>The key findings in this research paper are:</p>
                        <p>1. 73% increase in productivity when using AI tools</p>
                        <p>2. Cost reduction of 42% for document processing</p>
                        <p>3. Improved accuracy by 68% compared to manual methods</p>
                      </div>
                      <div className="bg-blue-600 rounded-full p-2 ml-3">
                        <FiFileText className="text-white w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <FiMessageSquare className="text-[#0072df] w-5 h-5" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-gray-700">
                        <p>Can you summarize the methodology section?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-600">Trusted by professionals from</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" alt="Google" className="h-8 md:h-10" />
            </div>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" alt="Microsoft" className="h-8 md:h-10" />
            </div>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Deloitte.svg/2560px-Deloitte.svg.png" alt="Deloitte" className="h-8 md:h-10" />
            </div>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png" alt="IBM" className="h-8 md:h-10" />
            </div>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" alt="Amazon" className="h-8 md:h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-[#6265fa]/10">
                <span className="text-[#6265fa] text-2xl font-bold">✨</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6265fa] to-purple-600 text-transparent bg-clip-text">
              Why Choose Our Document Chat?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of document interaction with our advanced AI-powered features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Smart Analysis */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6265fa]/20 to-[#5152d3]/20 rounded-2xl transform transition-transform group-hover:scale-105"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-[#6265fa]/30 transition-all">
                <div className="w-14 h-14 bg-[#6265fa]/10 rounded-xl flex items-center justify-center mb-6">
                  <FiSearch className="w-8 h-8 text-[#6265fa]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Analysis</h3>
                <p className="text-gray-600 mb-6">Advanced AI algorithms analyze your documents in seconds, extracting key insights and understanding context.</p>
                <div className="flex items-center text-[#6265fa] font-medium">
                  <span>Learn more</span>
                  <FiArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 2: Natural Conversations */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6265fa]/20 to-[#5152d3]/20 rounded-2xl transform transition-transform group-hover:scale-105"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-[#6265fa]/30 transition-all">
                <div className="w-14 h-14 bg-[#6265fa]/10 rounded-xl flex items-center justify-center mb-6">
                  <FiMessageSquare className="w-8 h-8 text-[#6265fa]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Natural Conversations</h3>
                <p className="text-gray-600 mb-6">Chat naturally with your documents. Ask questions, get summaries, and explore content through intuitive dialogue.</p>
                <div className="flex items-center text-[#6265fa] font-medium">
                  <span>Learn more</span>
                  <FiArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 3: Instant Results */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6265fa]/20 to-[#5152d3]/20 rounded-2xl transform transition-transform group-hover:scale-105"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-[#6265fa]/30 transition-all">
                <div className="w-14 h-14 bg-[#6265fa]/10 rounded-xl flex items-center justify-center mb-6">
                  <FiClock className="w-8 h-8 text-[#6265fa]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Results</h3>
                <p className="text-gray-600 mb-6">Get immediate answers and insights from your documents. No more endless scrolling or manual searching.</p>
                <div className="flex items-center text-[#6265fa] font-medium">
                  <span>Learn more</span>
                  <FiArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:bg-[#6265fa]/5 transition-colors group">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#6265fa]/10 rounded-lg flex items-center justify-center mr-4">
                  <FiCheckCircle className="text-[#6265fa] w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900">Secure & Private</h4>
              </div>
              <p className="text-gray-600">Your documents are encrypted and securely stored. We prioritize your privacy.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:bg-[#6265fa]/5 transition-colors group">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#6265fa]/10 rounded-lg flex items-center justify-center mr-4">
                  <FiArrowRight className="text-[#6265fa] w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900">Auto-Updates</h4>
              </div>
              <p className="text-gray-600">Always get the latest features and improvements automatically.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:bg-[#6265fa]/5 transition-colors group">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#6265fa]/10 rounded-lg flex items-center justify-center mr-4">
                  <FiFileText className="text-[#6265fa] w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900">Analytics</h4>
              </div>
              <p className="text-gray-600">Track your document interactions and get usage insights.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:bg-[#6265fa]/5 transition-colors group">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#6265fa]/10 rounded-lg flex items-center justify-center mr-4">
                  <FiMessageSquare className="text-[#6265fa] w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900">Mobile Ready</h4>
              </div>
              <p className="text-gray-600">Access your documents on any device, anywhere.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#6265fa]/5 bg-opacity-50 pattern-dots pattern-indigo-500 pattern-bg-white pattern-size-4 pattern-opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-[#6265fa]/10">
                <span className="text-[#6265fa] text-2xl font-bold">🔍</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6265fa] to-purple-600 text-transparent bg-clip-text">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it simple to extract insights from your documents in just a few steps.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#6265fa]/20 via-[#6265fa] to-[#6265fa]/20 transform -translate-y-1/2 hidden md:block"></div>
              
              <div className="grid md:grid-cols-3 gap-12">
                <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 z-10">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#6265fa] rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">1</div>
                  <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Document</h3>
                    <p className="text-gray-600">
                      Drag and drop your PDF or Word document into our secure platform.
                    </p>
                  </div>
                </div>
                
                <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 z-10">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#6265fa] rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">2</div>
                  <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Processing</h3>
                    <p className="text-gray-600">
                      Our AI analyzes and understands the content of your document.
                    </p>
                  </div>
                </div>
                
                <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 z-10">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#6265fa] rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">3</div>
                  <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Chatting</h3>
                    <p className="text-gray-600">
                      Ask questions and get instant, accurate answers about your document.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/dashboard" className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-[#6265fa] rounded-full hover:bg-[#5052e0] transition-colors shadow-lg hover:shadow-xl">
                Try It Now <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlight Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Chat with Your Documents in Seconds
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Thanks to our advanced AI, you can instantly extract information from any document without endless scrolling or searching.
              </p>
              <p className="text-gray-600 mb-8">
                No matter if you need to find specific information in a research paper, extract data from financial reports, or understand complex legal documents - you can do all this and more with Document Chat, the AI assistant that makes document analysis effortless.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#0072df] rounded-full flex items-center justify-center mr-3">
                    <FiCheckCircle className="text-white w-5 h-5" />
                  </div>
                  <span className="text-gray-700">Fast & Accurate</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#0072df] rounded-full flex items-center justify-center mr-3">
                    <FiCheckCircle className="text-white w-5 h-5" />
                  </div>
                  <span className="text-gray-700">Easy to Use</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-yellow-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
                
              {/* Slider UI */}
              <div className="bg-white rounded-full p-4 shadow-lg mb-8 relative">
                <div className="flex justify-between text-sm text-gray-600 mb-2 px-2">
                  <span>Simple Questions</span>
                  <span>Complex Analysis</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full relative">
                  <div className="absolute left-0 top-0 h-2 bg-[#0072df] rounded-full" style={{ width: '60%' }}></div>
                  <div className="absolute h-5 w-5 bg-[#0072df] rounded-full top-1/2 transform -translate-y-1/2" style={{ left: '60%' }}></div>
                </div>
                
                {/* Dots */}
                <div className="flex justify-between mt-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>
                
              {/* Sample Chat */}
              <div className="bg-white p-4 rounded-lg shadow mb-6 relative z-10">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <FiMessageSquare className="text-[#0072df] w-5 h-5" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-gray-700">
                    <p>Besides summarizing the document, what else can I do?</p>
                  </div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="bg-[#0072df] rounded-lg p-3 text-white max-w-md">
                    <p>Besides getting summaries, you can also:</p>
                    <p>- Extract specific data points</p>
                    <p>- Compare information across sections</p>
                    <p>- Generate insights from complex data</p>
                    <p>- Create action items based on content</p>
                  </div>
                  <div className="bg-blue-600 rounded-full p-2 ml-3">
                    <FiFileText className="text-white w-5 h-5" />
                  </div>
                </div>
              </div>
                
              <div className="text-sm text-gray-500 flex items-center relative z-10">
                <span className="mr-2">15 words</span>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="/public/image.svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-[#fffbeb] p-8 rounded-xl relative overflow-hidden">
                {/* Custom Image for Customization Section */}
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-yellow-200 rounded-full opacity-50"></div>
                <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
                
                {/* Slider UI */}
                <div className="bg-white rounded-full p-4 shadow-lg mb-8 relative">
                  <div className="flex justify-between text-sm text-gray-600 mb-2 px-2">
                    <span>Simple Questions</span>
                    <span>Complex Analysis</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full relative">
                    <div className="absolute left-0 top-0 h-2 bg-[#0072df] rounded-full" style={{ width: '60%' }}></div>
                    <div className="absolute h-5 w-5 bg-[#0072df] rounded-full top-1/2 transform -translate-y-1/2" style={{ left: '60%' }}></div>
                  </div>
                  
                  {/* Dots */}
                  <div className="flex justify-between mt-2 px-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                </div>
                
                {/* Sample Chat */}
                <div className="bg-white p-4 rounded-lg shadow mb-6 relative z-10">
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <FiMessageSquare className="text-[#0072df] w-5 h-5" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-gray-700">
                      <p>Besides summarizing the document, what else can I do?</p>
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    <div className="bg-[#0072df] rounded-lg p-3 text-white max-w-md">
                      <p>Besides getting summaries, you can also:</p>
                      <p>- Extract specific data points</p>
                      <p>- Compare information across sections</p>
                      <p>- Generate insights from complex data</p>
                      <p>- Create action items based on content</p>
                    </div>
                    <div className="bg-blue-600 rounded-full p-2 ml-3">
                      <FiFileText className="text-white w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 flex items-center relative z-10">
                  <span className="mr-2">15 words</span>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg xmlns="/public/image.svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Customize Your Document Interactions
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Control how you want to interact with your documents using our customizable chat interface.
              </p>
              <p className="text-gray-600 mb-8">
                Use the interaction slider to adjust the depth of analysis. Moving it to the left will give you quick, straightforward answers. Moving it to the right provides more comprehensive analysis with detailed insights and connections across your document.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#0072df] rounded-full flex items-center justify-center mr-3">
                    <FiCheckCircle className="text-white w-5 h-5" />
                  </div>
                  <span className="text-gray-700">Adjustable Depth</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#0072df] rounded-full flex items-center justify-center mr-3">
                    <FiCheckCircle className="text-white w-5 h-5" />
                  </div>
                  <span className="text-gray-700">Personalized Responses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose the Perfect Plan for You
            </h2>
            <p className="text-xl text-gray-600">
              Get Started for Free – Upgrade Anytime
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-[#6265fa]/10 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6265fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Free Plan</h3>
                  </div>
                  <span className="bg-[#6265fa]/10 text-[#6265fa] text-sm font-medium px-3 py-1 rounded-full">
                    Perfect for casual users
                  </span>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline mb-1">
                    <span className="text-5xl font-bold text-gray-900">$0</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                  <p className="text-gray-500">No credit card required</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Chat with up to 3 PDFs per month</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">10 questions per PDF</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Basic AI responses</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">No sign-up required</span>
                  </li>
                </ul>
                
                <Link 
                  href="/dashboard" 
                  className="block w-full bg-white border-2 border-[#6265fa] text-[#6265fa] hover:bg-[#6265fa]/5 text-center py-3 rounded-lg font-medium transition-colors"
                >
                  Get Started Free →
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-[#6265fa] to-[#5152d3] rounded-2xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
                    <span className="text-blue-100 text-sm">
                      For power users & professionals
                    </span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline mb-1">
                    <span className="text-5xl font-bold text-white">$19</span>
                    <span className="text-blue-100 ml-2">/month</span>
                  </div>
                  <p className="text-blue-100">Billed monthly</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <FiCheckCircle className="text-white w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white">Unlimited PDFs</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-white w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white">Unlimited questions</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-white w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white">Advanced AI responses</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-white w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-white w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-white">Document history & management</span>
                  </li>
                </ul>
                
                <Link 
                  href="/dashboard" 
                  className="block w-full bg-white text-[#6265fa] hover:bg-blue-50 text-center py-3 rounded-lg font-medium transition-colors"
                >
                  Upgrade to Pro →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500">
              Need a custom plan for your team or enterprise? <a href="#" className="text-[#0072df] hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section with Left Slide Animation */}
      <div className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#6265fa] mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Document Chat is transforming the way professionals work with documents.
            </p>
          </div>
          
          {/* Testimonial Slider */}
          <div className="relative max-w-6xl mx-auto">
            {/* Testimonial Cards */}
            <div className="flex flex-nowrap overflow-x-auto pb-8 hide-scrollbar testimonial-slider">
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`min-w-[350px] md:min-w-[400px] p-2 ${activeTestimonial === index ? 'animate-slide-left' : 'animate-slide-left animation-delay-300'}`}>
                  <div className="bg-white p-8 rounded-xl shadow-lg h-full border-l-4 border-[#0072df]">
                    <div className="flex text-yellow-400 mb-4">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      {testimonial.content}
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold text-xl mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
            
          {/* Slider dots */}
          <div className="flex justify-center mt-6">
            {testimonials.map((testimonial, index) => (
              <span key={index} className={`w-3 h-3 mx-1 rounded-full ${activeTestimonial === index ? 'bg-[#0072df]' : 'bg-gray-300'}`}></span>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section with Toggle */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">DOCLAMA is Perfect for Everyone</h2>
            <p className="text-xl text-gray-600">
              Whether you're a student, professional, or business owner, DOCLAMA adapts to your needs
            </p>
          </div>
          
          {/* Toggle Switch */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1 rounded-full shadow-md inline-flex">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'students' ? 'bg-[#0072df] text-white' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('students')}
              >
                Students
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'professionals' ? 'bg-[#0072df] text-white' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('professionals')}
              >
                Professionals
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'lawyers' ? 'bg-[#0072df] text-white' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('lawyers')}
              >
                Lawyers
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'teachers' ? 'bg-[#0072df] text-white' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('teachers')}
              >
                Teachers
              </button>
            </div>
          </div>
          
          {/* Content Panels */}
          <div className="max-w-5xl mx-auto">
            {/* Students Panel */}
            <div className={`transition-all duration-300 ${activeTab === 'students' ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-12">
                    <div className="inline-block text-[#0072df] text-2xl mb-4">📚</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      DOCLAMA for Students & Researchers
                    </h3>
                    <h4 className="text-xl text-gray-700 mb-6">Study Smarter, Not Harder!</h4>
                    <p className="text-gray-600 mb-8">
                      Tired of skimming through endless PDFs? With DOCLAMA, you can ask questions, summarize content, and extract key points instantly. Whether it's textbooks, research papers, or lecture notes—get insights in seconds!
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Summarize lengthy research papers quickly</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Find definitions, key concepts, and citations</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Prepare for exams more efficiently</span>
                      </li>
                    </ul>
                    <Link 
                      href="/dashboard" 
                      className="inline-flex items-center bg-[#0072df] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Start Chatting with Your PDFs Now! <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                  <div className="bg-blue-50 p-8 md:p-12 flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-200 rounded-full opacity-50"></div>
                      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-200 rounded-full opacity-50"></div>
                      
                      <div className="bg-white rounded-xl shadow-lg p-6 relative z-10">
                        <div className="flex items-start mb-4">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <FiMessageSquare className="text-[#0072df] w-5 h-5" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 text-gray-700">
                            <p>Can you summarize the key findings in this research paper?</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-end">
                          <div className="bg-[#0072df] rounded-lg p-3 text-white max-w-xs">
                            <p>The key findings in this research paper are:</p>
                            <p>1. 85% of students reported improved study efficiency</p>
                            <p>2. Time spent searching for information reduced by 67%</p>
                            <p>3. Comprehension scores increased by 42% in test groups</p>
                          </div>
                          <div className="bg-blue-600 rounded-full p-2 ml-3">
                            <FiFileText className="text-white w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Professionals Panel */}
            <div className={`transition-all duration-300 ${activeTab === 'professionals' ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-12">
                    <div className="inline-block text-[#0072df] text-2xl mb-4">💼</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      DOCLAMA for Professionals & Business Owners
                    </h3>
                    <h4 className="text-xl text-gray-700 mb-6">Work Smarter with AI-Powered PDF Assistance</h4>
                    <p className="text-gray-600 mb-8">
                      Cut through the noise and get the information you need—fast. DOCLAMA helps you analyze business reports, contracts, and presentations without wasting time.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Extract key financial figures and insights</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Summarize reports & strategy documents</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Scan contracts for critical terms instantly</span>
                      </li>
                    </ul>
                    <Link 
                      href="/dashboard" 
                      className="inline-flex items-center bg-[#0072df] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Boost Productivity—Try DOCLAMA Today! <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                  <div className="bg-blue-50 p-8 md:p-12 flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-green-200 rounded-full opacity-50"></div>
                      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-200 rounded-full opacity-50"></div>
                      
                      <div className="bg-white rounded-xl shadow-lg p-6 relative z-10">
                        <div className="flex items-start mb-4">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <FiMessageSquare className="text-[#0072df] w-5 h-5" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 text-gray-700">
                            <p>What are the projected revenue figures for Q3?</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-end">
                          <div className="bg-[#0072df] rounded-lg p-3 text-white max-w-xs">
                            <p>Based on the financial report:</p>
                            <p>1. Q3 projected revenue: $4.2M</p>
                            <p>2. 18% increase from previous quarter</p>
                            <p>3. Key growth areas: Enterprise (32%) and SMB (24%)</p>
                          </div>
                          <div className="bg-blue-600 rounded-full p-2 ml-3">
                            <FiFileText className="text-white w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lawyers Panel */}
            <div className={`transition-all duration-300 ${activeTab === 'lawyers' ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-12">
                    <div className="inline-block text-[#0072df] text-2xl mb-4">⚖️</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      DOCLAMA for Lawyers & Legal Assistants
                    </h3>
                    <h4 className="text-xl text-gray-700 mb-6">Your AI Legal Assistant—Anytime, Anywhere</h4>
                    <p className="text-gray-600 mb-8">
                      Reading through legal documents, case files, and contracts has never been easier. Simply upload your PDF and ask questions—get instant summaries and key legal insights!
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Extract clauses and legal references effortlessly</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Find relevant case law without manual searching</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Speed up contract review and analysis</span>
                      </li>
                    </ul>
                    <Link 
                      href="/dashboard" 
                      className="inline-flex items-center bg-[#0072df] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Save Time on Legal Research—Try DOCLAMA Now! <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                  <div className="bg-blue-50 p-8 md:p-12 flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-200 rounded-full opacity-50"></div>
                      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-200 rounded-full opacity-50"></div>
                      
                      <div className="bg-white rounded-xl shadow-lg p-6 relative z-10">
                        <div className="flex items-start mb-4">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <FiMessageSquare className="text-[#0072df] w-5 h-5" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 text-gray-700">
                            <p>What are the termination clauses in this contract?</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-end">
                          <div className="bg-[#0072df] rounded-lg p-3 text-white max-w-xs">
                            <p>The termination clauses in this contract are:</p>
                            <p>1. Section 8.2: 30-day written notice required</p>
                            <p>2. Section 8.3: Immediate termination for material breach</p>
                            <p>3. Section 8.4: Automatic termination after 24 months</p>
                          </div>
                          <div className="bg-blue-600 rounded-full p-2 ml-3">
                            <FiFileText className="text-white w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Teachers Panel */}
            <div className={`transition-all duration-300 ${activeTab === 'teachers' ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-12">
                    <div className="inline-block text-[#0072df] text-2xl mb-4">👩‍🏫</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      DOCLAMA for Teachers & Educators
                    </h3>
                    <h4 className="text-xl text-gray-700 mb-6">Simplify Lesson Planning & Content Review</h4>
                    <p className="text-gray-600 mb-8">
                      Make your teaching workflow more efficient with DOCLAMA! Whether you're preparing lessons, reviewing research, or analyzing student work, our AI assistant helps you get the job done.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Summarize academic articles for easy lesson prep</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Extract key topics for quizzes & assignments</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Make grading and feedback faster</span>
                      </li>
                    </ul>
                    <Link 
                      href="/dashboard" 
                      className="inline-flex items-center bg-[#0072df] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Enhance Your Teaching Experience—Start Chatting! <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                  <div className="bg-blue-50 p-8 md:p-12 flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-purple-200 rounded-full opacity-50"></div>
                      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-200 rounded-full opacity-50"></div>
                      
                      <div className="bg-white rounded-xl shadow-lg p-6 relative z-10">
                        <div className="flex items-start mb-4">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <FiMessageSquare className="text-[#0072df] w-5 h-5" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 text-gray-700">
                            <p>What are the key concepts I should include in my lesson plan?</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-end">
                          <div className="bg-[#0072df] rounded-lg p-3 text-white max-w-xs">
                            <p>Based on this curriculum document, the key concepts to include are:</p>
                            <p>1. Critical thinking frameworks (pages 12-15)</p>
                            <p>2. Collaborative learning techniques (pages 23-28)</p>
                            <p>3. Assessment strategies for diverse learners (pages 42-47)</p>
                          </div>
                          <div className="bg-blue-600 rounded-full p-2 ml-3">
                            <FiFileText className="text-white w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#0072df]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Meet Your AI-Powered PDF Chat Assistant</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            
          </p>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Why waste time skimming through endless pages? DOCLAMA transforms your PDFs into interactive AI conversations, helping you extract insights, summarize content, and find answers instantly.
          </p>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            🎯 No more Scroll down—just ask and get answers!
          </p>
          <Link href="/dashboard" className="bg-[#6265fa] hover:bg-[#5052e0] text-white font-medium py-4 px-8 rounded-lg transition-colors inline-block text-lg shadow-lg">
            🚀 Try It for Free →
          </Link>
          <p className="text-blue-200 mt-4">No installation required. Works in your browser.</p>
        </div>
      </div>

      {/* Modern FAQ Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#6265fa] mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about DOCLAMA
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* FAQ Item 1 */}
            <div className="mb-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 bg-[#6265fa]/5 rounded-xl hover:bg-[#6265fa]/10 transition-all duration-300">
                  <span className="text-lg font-semibold text-gray-800">How does DOCLAMA work?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="#6265fa" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width="24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 group-open:animate-fadeIn p-6 bg-white rounded-b-xl border-x border-b border-[#6265fa]/20">
                  <p>DOCLAMA uses advanced AI to analyze your PDF documents. When you upload a document, our system processes the content and creates an interactive chat interface. You can then ask questions about the document, and our AI provides accurate answers based on the content.</p>
                </div>
              </details>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="mb-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 bg-[#6265fa]/5 rounded-xl hover:bg-[#6265fa]/10 transition-all duration-300">
                  <span className="text-lg font-semibold text-gray-800">What types of documents can I use with DOCLAMA?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="#6265fa" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width="24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 group-open:animate-fadeIn p-6 bg-white rounded-b-xl border-x border-b border-[#6265fa]/20">
                  <p>DOCLAMA currently supports PDF and Word documents. We're working on adding support for more document formats in the future.</p>
                </div>
              </details>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="mb-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 bg-[#6265fa]/5 rounded-xl hover:bg-[#6265fa]/10 transition-all duration-300">
                  <span className="text-lg font-semibold text-gray-800">Is my data secure?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="#6265fa" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width="24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 group-open:animate-fadeIn p-6 bg-white rounded-b-xl border-x border-b border-[#6265fa]/20">
                  <p>Yes, we take data security very seriously. Your documents are encrypted during transmission and storage. We do not share your documents with third parties, and you can delete your documents at any time.</p>
                </div>
              </details>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="mb-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 bg-[#6265fa]/5 rounded-xl hover:bg-[#6265fa]/10 transition-all duration-300">
                  <span className="text-lg font-semibold text-gray-800">How accurate are the answers?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="#6265fa" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width="24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 group-open:animate-fadeIn p-6 bg-white rounded-b-xl border-x border-b border-[#6265fa]/20">
                  <p>Our AI is designed to provide highly accurate answers based on the content of your documents. However, like any AI system, it may occasionally misinterpret complex content. For critical information, we recommend verifying the AI's responses against the original document.</p>
                </div>
              </details>
            </div>
            
            {/* FAQ Item 5 */}
            <div className="mb-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 bg-[#6265fa]/5 rounded-xl hover:bg-[#6265fa]/10 transition-all duration-300">
                  <span className="text-lg font-semibold text-gray-800">Can I use DOCLAMA on my mobile device?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="#6265fa" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width="24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 group-open:animate-fadeIn p-6 bg-white rounded-b-xl border-x border-b border-[#6265fa]/20">
                  <p>Yes, DOCLAMA is fully responsive and works on all devices including smartphones and tablets. You can upload documents and chat with them on the go.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#6265fa] rounded-lg flex items-center justify-center mr-2">
                  <FiMessageSquare className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-gray-900">DOCLAMA</span>
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
            <p className="text-gray-600 mb-6">&copy; {new Date().getFullYear()} DOCLAMA. All rights reserved.</p>
            
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        /* Testimonial Slider Animation */
        @keyframes slideLeft {
          0% {
            transform: translateX(100px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-left {
          animation: slideLeft 0.8s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        
        /* Hide scrollbar for testimonial slider */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
        
        /* FAQ Animation */
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .group-open\:animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
}