'use client';

import Link from 'next/link';
import { FiArrowRight, FiMessageSquare } from 'react-icons/fi';
import Header from '../components/Header';

const teamMembers = [
  {
    name: 'Hasitha S.Bandara',
    role: 'Founder & CEO',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Former AI researcher at Stanford, passionate about making information accessible to everyone.'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of AI',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'PhD in Machine Learning, led development of several groundbreaking NLP models.'
  },
  {
    name: 'Michael Lee',
    role: 'Lead Developer',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'Full-stack developer with 10+ years of experience in building scalable applications.'
  }
];

const roadmapSteps = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    date: 'Q1 2025',
    completed: true,
    features: [
      'Core PDF chat functionality',
      'Basic document analysis',
      'User authentication',
      'Cloud storage integration'
    ]
  },
  {
    phase: 'Phase 2',
    title: 'Enhanced Intelligence',
    date: 'Q2 2025',
    completed: true,
    features: [
      'Advanced AI models',
      'Multi-document analysis',
      'Custom training capabilities',
      'API integration'
    ]
  },
  {
    phase: 'Phase 3',
    title: 'Enterprise Features',
    date: 'Q3 2025',
    completed: false,
    features: [
      'Team collaboration',
      'Advanced security features',
      'Custom workflows',
      'Analytics dashboard'
    ]
  },
  {
    phase: 'Phase 4',
    title: 'Future Innovation',
    date: 'Q4 2025',
    completed: false,
    features: [
      'AI-powered suggestions',
      'Real-time collaboration',
      'Voice interface',
      'Mobile applications'
    ]
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-[#6265fa] text-white pt-24 md:pt-32">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              About <span className="text-[#6265fa]">DOCLAMA</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              DOCLAMA is revolutionizing the way people interact with documents through AI-powered conversations. Our mission is to make document analysis and information extraction effortless and intuitive.
            </p>
          </div>
        </div>
      </div>

      {/* What if Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <p className="text-lg text-gray-700">What if you could talk to your documents?</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <p className="text-lg text-gray-700">What if research, analysis, and summarization were instant?</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <p className="text-lg text-gray-700">What if reading long PDFs became a thing of the past?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-[#6265fa] rounded-xl p-12 shadow-xl text-white">
          <h2 className="text-3xl font-bold mb-6">🚀 Our Mission</h2>
          <p className="text-lg">
            To empower students, professionals, researchers, and businesses by transforming the way they interact with digital documents—making information retrieval seamless, fast, and AI-driven.
          </p>
        </div>
      </div>

      {/* Problems We Solve */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">💡 The Problem We Solve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-[#6265fa]">📑 Endless PDFs, Limited Time</h3>
              <p className="text-gray-600">Searching for key points in long documents is exhausting.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-[#6265fa]">🔍 Inefficient Research</h3>
              <p className="text-gray-600">Traditional tools make finding relevant details difficult.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-[#6265fa]">⏳ Information Overload</h3>
              <p className="text-gray-600">Manually analyzing reports, contracts, and research takes too long.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">🔍 What Makes Us Different?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            'AI-Driven PDF Conversations – Chat, don&apos;t just search.',
            'Instant Summaries & Insights – No more manual note-taking.',
            'Multi-PDF Support – Compare and analyze multiple documents effortlessly.',
            'Enterprise-Grade Security – Your files stay encrypted and private.',
            'Lightning-Fast Processing – Get results in seconds, not hours.'
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <span className="text-[#6265fa] text-xl flex-shrink-0">✅</span>
              <p className="text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-[#6265fa] py-20 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">🛡️ Security & Privacy First</h2>
          <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
            We know your documents are important. That&apos;s why DOCLAMA ensures:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">🔒 End-to-End Encryption</h3>
              <p>Your data stays private.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">🚫 No Data Storage</h3>
              <p>We don&apos;t keep your files after processing.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">✅ Enterprise-Level Security</h3>
              <p>Built with compliance in mind.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Future Vision Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📈 Our Vision for the Future</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We&apos;re not just building a PDF tool—we&apos;re redefining how people interact with knowledge.
          </p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-12">
          <h3 className="text-2xl font-semibold text-[#6265fa] mb-8 text-center">🚀 Upcoming Innovations</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'AI-powered document comparison',
              'Real-time multi-file chat integration',
              'Voice-activated document search',
              'AI-powered research assistant'
            ].map((innovation, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-lg">
                <span className="text-[#6265fa] flex-shrink-0">🔹</span>
                <p className="text-gray-700">{innovation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">🗺️ Our Roadmap</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Follow our journey as we revolutionize document interaction. Here&apos;s our plan for the future.
          </p>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#6265fa]/20"></div>
            
            {/* Roadmap Items */}
            <div className="space-y-20">
              {roadmapSteps.map((step, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#6265fa] z-10">
                    <div className="absolute inset-0 rounded-full bg-[#6265fa] animate-ping opacity-25"></div>
                  </div>
                  
                  {/* Content Card */}
                  <div className={`w-5/12 bg-white rounded-xl shadow-lg p-8 ${
                    index % 2 === 0 ? 'mr-auto' : 'ml-auto'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-[#6265fa]">{step.phase}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        step.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {step.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{step.date}</p>
                    <ul className="space-y-2">
                      {step.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-gray-600">
                          <span className="mr-2 text-[#6265fa]">▸</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">👥 Meet Our Team</h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          We&apos;re a team of passionate individuals dedicated to transforming how people interact with documents.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
              <p className="text-[#6265fa] text-center mb-4">{member.role}</p>
              <p className="text-gray-600 text-center">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#6265fa] py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">🎯 Join the Future of Document Interaction</h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            Whether you&apos;re a student, researcher, business professional, or legal expert—DOCLAMA makes your work smarter, faster, and more intuitive.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center bg-white text-[#6265fa] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
          >
            Try DOCLAMA Now
            <FiArrowRight className="ml-2" />
          </Link>
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
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
