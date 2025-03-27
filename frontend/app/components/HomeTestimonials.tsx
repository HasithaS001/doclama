'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    text: "As a PhD student, DOCLAMA helps me extract key insights instantly. It's revolutionized my research workflow!",
    author: "Emma L.",
    role: "Researcher"
  },
  {
    id: 2,
    text: "DOCLAMA makes legal document analysis effortless. It's a game-changer for contract reviews!",
    author: "Michael D.",
    role: "Business Consultant"
  },
  {
    id: 3,
    text: "Perfect for analyzing educational PDFs and creating quizzes. DOCLAMA is an incredible tool for educators!",
    author: "Sarah T.",
    role: "Educator"
  }
];

export default function HomeTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = testimonials.length - 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      return newIndex;
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#6265fa] mb-4">
            What Our Users Say About DOCLAMA
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of satisfied professionals using DOCLAMA
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
