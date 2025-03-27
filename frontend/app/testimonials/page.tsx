'use client';

import Header from '../components/Header';
import Testimonials from '../components/Testimonials';
import TestimonialFooter from '../components/TestimonialFooter';

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <Testimonials />
      </main>
      <TestimonialFooter />
    </div>
  );
}
