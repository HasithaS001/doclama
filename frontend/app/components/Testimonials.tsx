'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "As a PhD student, I deal with countless PDFs daily. DOCLAMA helps me summarize, extract key insights, and even generate citations instantly. It has completely changed my workflow!",
    author: "Emma L.",
    role: "Researcher"
  },
  {
    id: 2,
    text: "I run a consulting business, and reviewing contracts used to be a nightmare. DOCLAMA makes legal document analysis effortless, highlighting key clauses in seconds!",
    author: "Michael D.",
    role: "Business Consultant"
  },
  {
    id: 3,
    text: "I use DOCLAMA to analyze educational PDFs and generate quizzes for my students. It's an incredible tool for teachers!",
    author: "Sarah T.",
    role: "Educator"
  },
  {
    id: 4,
    text: "As a legal assistant, I need to review case files quickly. DOCLAMA helps me extract relevant legal points instantly, making my job so much easier!",
    author: "John P.",
    role: "Legal Assistant"
  },
  {
    id: 5,
    text: "I used to manually go through hundreds of reports. Now, DOCLAMA helps me extract summaries and key data in minutes. It's an essential tool for professionals!",
    author: "David W.",
    role: "Financial Analyst"
  }
];

const stats = [
  { id: 1, value: '50K+', label: 'Active Users' },
  { id: 2, value: '95%', label: 'Satisfaction Rate' },
  { id: 3, value: '500K+', label: 'Documents Processed' },
  { id: 4, value: '4.9/5', label: 'Average Rating' },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#6265fa] sm:text-4xl">
            🌟 What Our Users Say About DOCLAMA
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Trusted by thousands of professionals, students, and businesses worldwide
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-4xl font-bold text-[#6265fa]">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Slider */}
        <div className="mt-16 relative h-64">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="bg-white border-2 border-[#6265fa] rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                <div className="text-lg text-gray-600 italic">
                  "{testimonials[currentIndex].text}"
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-[#6265fa]">
                    {testimonials[currentIndex].author}
                  </p>
                  <p className="text-gray-500">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Feature List */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-[#6265fa] mb-8">
            ✨ Why People Love DOCLAMA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              "AI-Powered PDF Chat – Get instant answers from your documents",
              "Time-Saving Summaries – No more scrolling through pages",
              "Accurate & Fast – Extracts key insights in seconds",
              "Boosts Productivity – Focus on what matters most"
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-[#6265fa]/10 hover:border-[#6265fa] transition-colors">
                <span className="text-[#6265fa]">✅</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-[#6265fa] mb-4">
            🎤 Join Thousands of Satisfied Users!
          </h3>
          <p className="text-gray-600 mb-8">
            Ready to experience the power of DOCLAMA?
          </p>
          <div className="space-x-4">
            <a
              href="/signup"
              className="inline-block bg-[#6265fa] text-white px-6 py-3 rounded-lg hover:bg-[#6265fa]/90 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="/reviews"
              className="inline-block bg-white text-[#6265fa] border-2 border-[#6265fa] px-6 py-3 rounded-lg hover:bg-[#6265fa]/5 transition-colors"
            >
              See More Reviews
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
